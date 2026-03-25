import { createProjects } from './projectFactory';

export default createProjects('personal', [
  {
    id: 'portfolio-ai-assistant',
    title: {
      id: 'Asisten Portfolio AI',
      en: 'Portfolio AI Assistant'
    },
    description: {
      id: 'Contoh project dummy untuk menunjukkan bagaimana Anda bisa menulis ringkasan singkat, target pengguna, dan nilai utama dari sebuah eksperimen personal.',
      en: 'Dummy sample project showing how to write a short summary, target users, and the main value of a personal experiment.'
    },
    tags: ['AI', 'React', 'Prompt Design', 'Template'],
    date: '2026-01-15',
    link: 'https://example.com/portfolio-ai-assistant'
  },
  {
    id: 'reusable-rag-starter',
    title: {
      id: 'Starter Kit RAG Reusable',
      en: 'Reusable RAG Starter'
    },
    description: {
      id: 'Contoh placeholder untuk proyek toolkit internal, proof of concept, atau eksperimen teknis yang ingin Anda tampilkan sebagai project publik.',
      en: 'Placeholder example for an internal toolkit, proof of concept, or technical experiment that you want to present as a public project.'
    },
    tags: ['RAG', 'Vector Search', 'Node.js', 'Open Source'],
    date: '2025-11-10'
  },
  {
    id: 'analytics-lab-dashboard',
    title: {
      id: 'Dashboard Analytics Lab',
      en: 'Analytics Lab Dashboard'
    },
    description: {
      id: 'Project dummy ketiga untuk memperlihatkan format data, struktur bilingual, dan penggunaan tag yang bisa Anda ganti sesuka hati.',
      en: 'Third dummy project used to demonstrate the data format, bilingual structure, and tag usage that you can freely replace.'
    },
    tags: ['Analytics', 'Dashboard', 'Data Visualization', 'Template'],
    date: '2025-08-05'
  }
]);
