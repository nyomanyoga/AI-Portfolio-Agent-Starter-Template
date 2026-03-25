import { useCallback, useEffect, useRef, useState } from 'react';
import { createTemplateReply } from '../utils/chatbotTemplateReplies';

const createMessageId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const createMessage = (role, rawText, extra = {}) => ({
  id: createMessageId(),
  role,
  rawText,
  isRaw: true,
  timestamp: new Date(),
  ...extra
});

const getStoredLanguage = () => {
  try {
    return (
      (typeof window !== 'undefined' &&
        window.localStorage &&
        window.localStorage.getItem('i18nextLng')) ||
      'en'
    );
  } catch {
    return 'en';
  }
};

const getSsePayload = (eventBlock) => {
  const payload = eventBlock
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trimStart())
    .join('\n')
    .trim();

  return payload === '[DONE]' ? '' : payload;
};

const buildNodeKey = (payload) => {
  if (payload.node_id) return payload.node_id;
  if (typeof payload.sequence !== 'undefined') return `sequence_${payload.sequence}`;
  return `anonymous_${createMessageId()}`;
};

export const useStreamChat = (endpoint) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const abortRef = useRef(null);
  const activeNodeMapRef = useRef(new Map());
  const currentRunMessageIdsRef = useRef([]);
  const hasContentRef = useRef(false);

  const resetStreamState = useCallback(() => {
    activeNodeMapRef.current = new Map();
    currentRunMessageIdsRef.current = [];
    hasContentRef.current = false;
  }, []);

  const finishRunMessages = useCallback(() => {
    const messageIds = new Set(currentRunMessageIdsRef.current);
    if (!messageIds.size) return;

    setMessages((prev) =>
      prev.map((message) =>
        messageIds.has(message.id) ? { ...message, isStreaming: false } : message
      )
    );
  }, []);

  const appendTemplateReply = useCallback((messageText) => {
    const language = getStoredLanguage();

    setMessages((prev) => [
      ...prev,
      createMessage('bot', createTemplateReply(messageText, language), {
        isStreaming: false,
        isFallback: true
      })
    ]);
  }, []);

  const upsertAssistantMessage = useCallback((payload, updater) => {
    const nodeKey = buildNodeKey(payload);
    let messageId = activeNodeMapRef.current.get(nodeKey);

    if (!messageId) {
      messageId = createMessageId();
      activeNodeMapRef.current.set(nodeKey, messageId);
      currentRunMessageIdsRef.current.push(messageId);
    }

    setMessages((prev) => {
      if (prev.some((message) => message.id === messageId)) {
        return prev.map((message) =>
          message.id === messageId ? updater(message) : message
        );
      }

      const newMessage = updater({
        id: messageId,
        role: 'bot',
        rawText: '',
        isRaw: true,
        isStreaming: true,
        timestamp: new Date()
      });

      return [...prev, newMessage];
    });

    hasContentRef.current = true;
    setIsLoading(false);
  }, []);

  const appendNodeDelta = useCallback(
    (payload) => {
      const chunk = payload.delta || '';
      if (!chunk) return;

      upsertAssistantMessage(payload, (message) => ({
        ...message,
        rawText: `${message.rawText}${chunk}`,
        isStreaming: true
      }));
    },
    [upsertAssistantMessage]
  );

  const finishNodeOutput = useCallback(
    (payload) => {
      const output = payload.output || '';
      if (!output) return;

      upsertAssistantMessage(payload, (message) => ({
        ...message,
        rawText: message.rawText || output,
        isStreaming: false
      }));
    },
    [upsertAssistantMessage]
  );

  const rebuildFromFinalOutputs = useCallback((result) => {
    const outputs = Array.isArray(result?.outputs) ? result.outputs : [];
    if (!outputs.length) return false;

    const rebuiltMessages = outputs
      .filter((item) => item?.content)
      .map((item) => ({
        id: createMessageId(),
        role: 'bot',
        rawText: item.content,
        isRaw: true,
        isStreaming: false,
        timestamp: new Date()
      }));

    if (!rebuiltMessages.length) return false;

    currentRunMessageIdsRef.current = rebuiltMessages.map((message) => message.id);
    setMessages((prev) => [...prev, ...rebuiltMessages]);
    hasContentRef.current = true;
    setIsLoading(false);
    return true;
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const processEvent = useCallback(
    (payload) => {
      if (!payload?.event) return;

      if (payload.event === 'output_delta') {
        appendNodeDelta(payload);
        return;
      }

      if (payload.event === 'output_node_finished') {
        finishNodeOutput(payload);
        return;
      }

      if (payload.event === 'output_finished' && !hasContentRef.current) {
        if (rebuildFromFinalOutputs(payload.result)) {
          return;
        }

        if (payload.result?.final_output) {
          setMessages((prev) => [
            ...prev,
            createMessage('bot', payload.result.final_output, { isStreaming: false })
          ]);
          hasContentRef.current = true;
          setIsLoading(false);
        }
      }
    },
    [appendNodeDelta, finishNodeOutput, rebuildFromFinalOutputs]
  );

  const sendMessage = useCallback(
    async (messageText, requestBody) => {
      if (!endpoint) {
        setMessages((prev) => [
          ...prev,
          createMessage('user', messageText)
        ]);
        appendTemplateReply(messageText);
        return;
      }

      abortRef.current?.abort();
      finishRunMessages();
      resetStreamState();

      setMessages((prev) => [...prev, createMessage('user', messageText)]);
      setIsLoading(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const headers = {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          'Cache-Control': 'no-cache'
        };

        const res = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        if (!res.body) {
          throw new Error('Streaming response body unavailable');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        const processEventBlock = (eventBlock) => {
          const payload = getSsePayload(eventBlock);
          if (!payload) return;

          try {
            processEvent(JSON.parse(payload));
          } catch (error) {
            console.warn('Failed to parse SSE payload:', error);
          }
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          buffer = buffer.replace(/\r\n/g, '\n');

          let separatorIndex = buffer.indexOf('\n\n');

          while (separatorIndex !== -1) {
            processEventBlock(buffer.slice(0, separatorIndex));
            buffer = buffer.slice(separatorIndex + 2);
            separatorIndex = buffer.indexOf('\n\n');
          }
        }

        const trailing = decoder.decode();
        if (trailing) {
          buffer += trailing;
        }

        buffer = buffer.replace(/\r\n/g, '\n').trim();
        if (buffer) {
          processEventBlock(buffer);
        }

        if (!hasContentRef.current) {
          throw new Error('Empty response from streaming');
        }

        finishRunMessages();
      } catch (error) {
        if (error?.name === 'AbortError') {
          finishRunMessages();
          return;
        }

        console.error('Stream error:', error);

        if (hasContentRef.current) {
          finishRunMessages();
          return;
        }

        appendTemplateReply(messageText);
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
        }

        setIsLoading(false);
      }
    },
    [appendTemplateReply, endpoint, finishRunMessages, processEvent, resetStreamState]
  );

  return { messages, isLoading, sendMessage };
};
