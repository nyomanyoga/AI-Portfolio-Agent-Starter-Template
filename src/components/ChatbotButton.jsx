import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import { CHATBOT_TEMPLATE } from '../data';
import { useStreamChat } from '../hooks/useStreamChat';

const CHAT_ENDPOINT = '/api/chat/output-stream';

const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

const formatDateLabel = (date) => {
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return 'Today';
  return date.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' });
};

const markdownComponents = {
  a: ({ href, children, ...props }) => {
    if (!href) {
      return <>{children}</>;
    }

    return (
      <a
        {...props}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="chat-link"
      >
        {children}
      </a>
    );
  }
};

const MarkdownMessage = ({ content }) => {
  const value = typeof content === 'string' ? content : '';

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={markdownComponents}
    >
      {value}
    </ReactMarkdown>
  );
};

const createSessionId = () => `session_${Math.random().toString(36).slice(2, 11)}`;

function ChatbotButton() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const sessionIdRef = useRef(null);

  if (!sessionIdRef.current) {
    sessionIdRef.current = createSessionId();
  }

  // Use the streaming chat hook
  const {
    messages,
    isLoading,
    sendMessage
  } = useStreamChat(CHAT_ENDPOINT);

  // Tidak perlu greeting ke API, greeting hanya di UI

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    sendMessage(userMsg, {
      query: userMsg,
      'sys.conversation_id': sessionIdRef.current
    });
  };

  // Selalu render greeting default di paling atas, hanya sekali
  const renderMessages = () => {
    // Always show greeting at the top
    const result = [
      <div key="greeting" className="msg-wrap bot">
        <div
          className="msg"
          dangerouslySetInnerHTML={{ __html: t('chatbot.greeting', { name: CHATBOT_TEMPLATE.name }) }}
        />
      </div>
    ];
    if (!messages.length) return result;
    let lastDateStr = null;
    messages.forEach((msg, i) => {
      // Date separator if needed
      const dateStr = msg.timestamp?.toDateString();
      if (dateStr && dateStr !== lastDateStr) {
        lastDateStr = dateStr;
        result.push(
          <div key={`sep-${i}`} className="date-separator">
            <span>{formatDateLabel(msg.timestamp)}</span>
          </div>
        );
      }
      // Render user and bot messages
      result.push(
        <div
          key={msg.id || i}
          className={`msg-wrap ${msg.role}${msg.isError ? ' error' : ''}`.trim()}
        >
          <div className="msg">
            {msg.isRaw ? (
              <MarkdownMessage content={msg.rawText || ''} />
            ) : (
              <span dangerouslySetInnerHTML={{ __html: t(msg.contentKey || '') }} />
            )}
          </div>
          {msg.timestamp && (
            <span className="msg-time">{formatTime(msg.timestamp)}</span>
          )}
        </div>
      );
    });
    return result;
  };

  return (
    <div className="chatbot-wrapper">
      {isOpen && (
        <div className="chatbot-popup">
          <div className="chatbot-header">
            <div className="agent-info">
              <div className="status-indicator"><span className="status-dot"></span></div>
              <img
                src={CHATBOT_TEMPLATE.icon}
                alt={CHATBOT_TEMPLATE.name}
                className="agent-avatar"
              />
              <div className="agent-text">
                <span className="agent-name">{CHATBOT_TEMPLATE.name}</span>
                <span className="agent-status">{t('chatbot.status')}</span>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="chatbot-body" ref={scrollRef}>
            {renderMessages()}
            {isLoading && (
              <div className="typing">
                {t('chatbot.typing', { name: CHATBOT_TEMPLATE.name })}
                <span className="typing-dots">
                  <span>.</span><span>.</span><span>.</span>
                </span>
              </div>
            )}
          </div>

          <form className="chatbot-input-area" onSubmit={handleSend}>
            <textarea
              ref={textareaRef}
              id="chatbot-input"
              name="chatbot-input"
              rows={1}
              placeholder={t('chatbot.input_placeholder')}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button type="submit" className="send-btn" disabled={!input.trim() || isLoading}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}

      <button
        className={`chatbot-fab ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <img src={CHATBOT_TEMPLATE.icon} alt={CHATBOT_TEMPLATE.name} className="fab-icon-img" />
        )}
        {!isOpen && <span className="fab-label">{CHATBOT_TEMPLATE.name}</span>}
      </button>
    </div>
  );
}

export default ChatbotButton;
