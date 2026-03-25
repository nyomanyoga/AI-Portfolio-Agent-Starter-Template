const DEMO_NOTICE = {
  id: '**Mode demo aktif.** Chatbot template ini belum tersambung ke kredensial Flownym Anda, jadi saya memberi jawaban contoh yang tetap berguna untuk preview.',
  en: '**Demo mode is active.** This template chatbot is not connected to your Flownym credentials yet, so I am returning a helpful sample reply for preview.'
};

const DEFAULT_REPLY = {
  id: `${DEMO_NOTICE.id}

Saya bisa membantu menjawab contoh pertanyaan seperti:
- "Project production apa saja yang ada?"
- "Bagaimana cara mengganti kontak?"
- "Di mana saya mengubah nama dan ikon chatbot?"
- "Bagaimana menghubungkan chatbot ke Flownym?"

Template ini akan otomatis berpindah ke jawaban live setelah Anda mengisi \`.env\` dari aplikasi Flownym dan me-restart server.`,
  en: `${DEMO_NOTICE.en}

I can answer sample questions like:
- "What production projects are available?"
- "How do I change the contact link?"
- "Where do I rename the chatbot and replace its icon?"
- "How do I connect the chatbot to Flownym?"

This template will automatically switch to live responses after you fill the \`.env\` file from your Flownym app and restart the server.`
};

const KEYWORD_RULES = [
  {
    keywords: ['project', 'portfolio', 'case study', 'proyek', 'portofolio'],
    replies: {
      id: `${DEMO_NOTICE.id}

Template ini sudah menyiapkan 3 kategori konten:
- \`src/data/production.js\`
- \`src/data/personal.js\`
- \`src/data/speaker.js\`

Setiap item sudah memakai format bilingual, tag, tanggal, gambar, dan link publik atau privat. Anda tinggal mengganti object dummy yang ada di file-file tersebut.`,
      en: `${DEMO_NOTICE.en}

This template already ships with 3 prepared content categories:
- \`src/data/production.js\`
- \`src/data/personal.js\`
- \`src/data/speaker.js\`

Each item already supports bilingual fields, tags, dates, images, and public/private links. You only need to replace the dummy objects in those files.`
    }
  },
  {
    keywords: ['contact', 'email', 'whatsapp', 'kontak', 'hubungi', 'linkedin'],
    replies: {
      id: `${DEMO_NOTICE.id}

Untuk mengganti tombol LinkedIn, GitHub, dan CV di sidebar, edit \`PROFILE.quickLinks\` di \`src/data/site.js\`.

Isi yang tersedia:
- \`quickLinks.linkedin\`
- \`quickLinks.github\`
- \`quickLinks.cv\`

Untuk mengganti tombol kontak project private, edit \`PROFILE.contactHref\` di file yang sama.

Contoh:
- \`mailto:hello@domainanda.com\`
- \`https://linkedin.com/in/username-anda\`

Setelah itu sidebar dan modal project private akan langsung memakai link tersebut.`,
      en: `${DEMO_NOTICE.en}

To change the LinkedIn, GitHub, and CV buttons in the sidebar, edit \`PROFILE.quickLinks\` in \`src/data/site.js\`.

Available entries:
- \`quickLinks.linkedin\`
- \`quickLinks.github\`
- \`quickLinks.cv\`

To change the private-project contact button, edit \`PROFILE.contactHref\` in the same file.

Examples:
- \`mailto:hello@yourdomain.com\`
- \`https://linkedin.com/in/your-profile\`

The sidebar and private-project modal will automatically use those links.`
    }
  },
  {
    keywords: ['chatbot', 'flownym', '.env', 'api', 'secret', 'env', 'robot', 'ikon', 'icon', 'bot'],
    replies: {
      id: `${DEMO_NOTICE.id}

Area chatbot template ini sudah siap pakai:
- nama bot di \`CHATBOT_TEMPLATE.name\`
- ikon bot di \`CHATBOT_TEMPLATE.icon\`
- mode tampil bot di \`CHATBOT_TEMPLATE.enabled\`
- kredensial live di file \`.env\`

Isi \`.env\` dengan:
- \`API_UPSTREAM_URL\`
- \`CHAT_RUN_ID\`
- \`CHAT_API_KEY\`

Semua nilai tersebut harus berasal dari aplikasi Flownym Anda.`,
      en: `${DEMO_NOTICE.en}

This chatbot template area is already prepared:
- bot name in \`CHATBOT_TEMPLATE.name\`
- bot icon in \`CHATBOT_TEMPLATE.icon\`
- bot visibility in \`CHATBOT_TEMPLATE.enabled\`
- live credentials in the \`.env\` file

Fill \`.env\` with:
- \`API_UPSTREAM_URL\`
- \`CHAT_RUN_ID\`
- \`CHAT_API_KEY\`

All of those values should come from your Flownym app.`
    }
  },
  {
    keywords: ['skill', 'stack', 'tech', 'teknologi', 'tag'],
    replies: {
      id: `${DEMO_NOTICE.id}

Filter skill di halaman ini membaca data langsung dari field \`tags\` milik setiap project.

Artinya Anda cukup mengganti tag di data project, lalu:
- filter skill akan ikut berubah otomatis
- pencarian global juga ikut membaca tag tersebut`,
      en: `${DEMO_NOTICE.en}

The skill filter on this page reads directly from the \`tags\` field on each project.

That means you only need to update the project tags, then:
- the skill filter updates automatically
- the global search will also pick up those tags`
    }
  }
];

const normalizeLanguage = (language) => (language || '').startsWith('id') ? 'id' : 'en';

const normalizeMessage = (message) => (message || '').toLowerCase();

export const createTemplateReply = (messageText, language = 'en') => {
  const locale = normalizeLanguage(language);
  const normalizedMessage = normalizeMessage(messageText);

  const matchedRule = KEYWORD_RULES.find((rule) =>
    rule.keywords.some((keyword) => normalizedMessage.includes(keyword))
  );

  return matchedRule ? matchedRule.replies[locale] : DEFAULT_REPLY[locale];
};
