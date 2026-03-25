import { createProjects } from './projectFactory';

export default createProjects('production', [
  {
    id: 'customer-support-copilot',
    companyKey: 'companies.template_enterprise',
    title: {
      id: 'Customer Support Copilot',
      en: 'Customer Support Copilot'
    },
    description: {
      id: 'Dummy case study untuk mencontohkan format portofolio production. Ganti judul, deskripsi, industri, tag, dan tanggal sesuai pengalaman Anda sendiri.',
      en: 'Dummy case study showing the production portfolio format. Replace the title, description, industry, tags, and date with your own experience.'
    },
    image: '/banner/production-template.svg',
    tags: ['Customer Experience', 'Automation', 'AI Assistant', 'Template'],
    date: '2026-03-01'
  },
  {
    id: 'document-automation-suite',
    companyKey: 'companies.template_finance',
    title: {
      id: 'Document Automation Suite',
      en: 'Document Automation Suite'
    },
    description: {
      id: 'Contoh project dummy kedua untuk kategori production. Sangat cocok sebagai placeholder sebelum pengguna mengganti konten dengan studi kasus nyata miliknya.',
      en: 'Second dummy project for the production category. Useful as a placeholder before the user replaces it with a real case study.'
    },
    image: '/banner/production-template.svg',
    tags: ['OCR', 'Workflow', 'Document AI', 'Operations'],
    date: '2025-10-12'
  },
  {
    id: 'ops-monitoring-workbench',
    companyKey: 'companies.template_public_sector',
    title: {
      id: 'Ops Monitoring Workbench',
      en: 'Ops Monitoring Workbench'
    },
    description: {
      id: 'Placeholder ketiga untuk menunjukkan bahwa kategori ini bisa berisi project private maupun public, tergantung apakah field link diisi atau tidak.',
      en: 'Third placeholder showing that this category can contain either private or public projects depending on whether the link field is filled.'
    },
    image: '/banner/production-template.svg',
    tags: ['Monitoring', 'Alerting', 'Dashboard', 'Enterprise'],
    date: '2025-06-20',
    link: 'https://example.com/ops-monitoring-workbench'
  }
]);
