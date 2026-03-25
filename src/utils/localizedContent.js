const INDONESIAN_LANGUAGE = 'id';
const ENGLISH_LANGUAGE = 'en';

export const normalizeLanguage = (language = ENGLISH_LANGUAGE) => (
  language.startsWith(INDONESIAN_LANGUAGE) ? INDONESIAN_LANGUAGE : ENGLISH_LANGUAGE
);

export const getLocalizedText = (localizedValue, language = ENGLISH_LANGUAGE) => {
  if (typeof localizedValue === 'string') {
    return localizedValue;
  }

  const normalizedLanguage = normalizeLanguage(language);

  return localizedValue?.[normalizedLanguage]
    ?? localizedValue?.[ENGLISH_LANGUAGE]
    ?? localizedValue?.[INDONESIAN_LANGUAGE]
    ?? '';
};
