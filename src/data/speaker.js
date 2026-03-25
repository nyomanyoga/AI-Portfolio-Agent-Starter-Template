import { createProjects } from './projectFactory';

export default createProjects('speaker', [
  {
    id: 'ai-for-business-workshop',
    companyKey: 'companies.template_event_host',
    title: {
      id: 'Workshop AI untuk Bisnis',
      en: 'AI for Business Workshop'
    },
    description: {
      id: 'Contoh sesi dummy untuk kategori pembicara. Cocok diganti dengan workshop, webinar, kelas tamu, atau conference talk Anda.',
      en: 'Dummy speaking session for the speaker category. Replace it with your own workshop, webinar, guest lecture, or conference talk.'
    },
    tags: ['Workshop', 'AI Literacy', 'Public Speaking', 'Template'],
    date: '2026-02-14'
  },
  {
    id: 'data-storytelling-session',
    companyKey: 'companies.template_bootcamp',
    title: {
      id: 'Sesi Data Storytelling',
      en: 'Data Storytelling Session'
    },
    description: {
      id: 'Placeholder kedua untuk menampilkan format event edukasi atau training. Anda bisa menambahkan link rekaman jika sesi ini bersifat publik.',
      en: 'Second placeholder for educational events or training sessions. You can add a recording link if the session is public.'
    },
    tags: ['Data Storytelling', 'Training', 'Mentoring', 'Presentation'],
    date: '2025-09-02'
  },
  {
    id: 'prompt-engineering-webinar',
    companyKey: 'companies.template_event_host',
    title: {
      id: 'Webinar Prompt Engineering',
      en: 'Prompt Engineering Webinar'
    },
    description: {
      id: 'Contoh placeholder publik untuk kategori speaker. Gunakan field link bila Anda ingin mengarahkan pengunjung ke video, poster, atau landing page event.',
      en: 'Public placeholder for the speaker category. Use the link field if you want to direct visitors to a video, poster, or event landing page.'
    },
    tags: ['Prompt Engineering', 'Webinar', 'Generative AI', 'Community'],
    date: '2025-05-18',
    link: 'https://example.com/prompt-engineering-webinar'
  }
]);
