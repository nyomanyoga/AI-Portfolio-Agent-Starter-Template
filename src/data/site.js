export const SITE_TEMPLATE = Object.freeze({
  siteTitle: 'Portfolio Template',
  footerLabel: 'Portfolio Template'
});

export const CHATBOT_TEMPLATE = Object.freeze({
  enabled: true,
  name: 'Flownym Assistant',
  icon: '/chatbot-robot-template.svg'
});

export const PROFILE = Object.freeze({
  name: 'Your Name',
  avatar: '/avatar-template.svg',
  contactHref: '',
  quickLinks: Object.freeze({
    linkedin: 'https://www.linkedin.com/in/your-linkedin-handle',
    github: 'https://github.com/your-github-username',
    cv: 'https://example.com/your-cv.pdf'
  })
});

export const PROJECT_TABS = Object.freeze([
  {
    id: 'production',
    icon: '🚀',
    titleKey: 'sidebar.production',
    countLabelKey: 'sidebar.projects_count'
  },
  {
    id: 'personal',
    icon: '📁',
    titleKey: 'sidebar.personal',
    countLabelKey: 'sidebar.concepts_count'
  },
  {
    id: 'speaker',
    icon: '🎤',
    titleKey: 'sidebar.speaker',
    countLabelKey: 'sidebar.events_count'
  }
]);

export const PROJECT_CATEGORY_DEFAULTS = Object.freeze({
  personal: {
    companyKey: 'companies.template_lab',
    image: '/banner/personal-template.svg'
  },
  speaker: {
    image: '/banner/speaker-template.svg'
  }
});
