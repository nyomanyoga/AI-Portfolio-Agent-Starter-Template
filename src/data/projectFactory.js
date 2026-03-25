import { PROJECT_CATEGORY_DEFAULTS } from './site';

const REQUIRED_LANGUAGES = ['id', 'en'];

const assertNonEmptyString = (value, fieldName, itemId) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Project "${itemId}" is missing a valid "${fieldName}" value.`);
  }

  return value.trim();
};

const assertLocalizedField = (value, fieldName, itemId) => {
  if (!value || typeof value !== 'object') {
    throw new Error(`Project "${itemId}" is missing a valid "${fieldName}" object.`);
  }

  return REQUIRED_LANGUAGES.reduce((accumulator, language) => {
    accumulator[language] = assertNonEmptyString(value[language], `${fieldName}.${language}`, itemId);
    return accumulator;
  }, {});
};

export const createProjects = (category, items) => {
  const defaults = PROJECT_CATEGORY_DEFAULTS[category] || {};

  return items.map((item) => {
    const id = assertNonEmptyString(item.id, 'id', `${category}-item`);
    const companyKey = item.companyKey ?? defaults.companyKey;
    const image = item.image ?? defaults.image;

    if (!companyKey) {
      throw new Error(`Project "${id}" is missing a "companyKey".`);
    }

    if (!image) {
      throw new Error(`Project "${id}" is missing an "image".`);
    }

    return {
      id,
      category,
      companyKey,
      title: assertLocalizedField(item.title, 'title', id),
      description: assertLocalizedField(item.description, 'description', id),
      image,
      tags: Array.isArray(item.tags) ? item.tags.filter(Boolean) : [],
      date: assertNonEmptyString(item.date, 'date', id),
      link: typeof item.link === 'string' && item.link.trim() ? item.link.trim() : null
    };
  });
};
