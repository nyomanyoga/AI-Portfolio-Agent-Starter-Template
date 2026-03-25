# Portfolio Template

Template portfolio berbasis React + Vite yang sengaja dibuat **kosong, aman, dan siap diganti** untuk publikasi GitHub.

Semua isi personal, data privat, nomor kontak, kredensial lama, dan konten spesifik pemilik sebelumnya sudah dibersihkan. Repo ini sekarang hanya berisi:

- dummy content
- struktur data yang mudah diganti
- konfigurasi chatbot template yang sudah siap dipakai
- dokumentasi penggunaan yang jelas

## Tujuan Template

Gunakan repo ini jika Anda ingin:

- membuat portfolio pribadi dengan cepat
- mengganti seluruh isi dengan data milik Anda sendiri
- mempublikasikan source code ke GitHub tanpa membawa data privat
- menambahkan chatbot yang terhubung ke aplikasi Flownym

## Teknologi

- React 18
- Vite 5
- i18next
- react-markdown
- Docker + Docker Compose
- Nginx

## Struktur Penting

```text
src/
  components/   komponen UI
  data/         data dummy yang harus Anda ganti
  locales/      teks UI dua bahasa
  hooks/        logic reusable
  styles/       styling global
  utils/        helper kecil
public/
  banner/       gambar placeholder template
```

## Kondisi Template Saat Ini

Template ini sengaja memakai:

- nama profil: placeholder
- social links: kosong
- resume link: kosong
- contact link: kosong
- data project: dummy
- chatbot: aktif secara default dalam demo mode
- `.env`: placeholder aman
- title browser: otomatis mengikuti `SITE_TEMPLATE.siteTitle`

## Langkah Penggunaan

### 1. Ganti identitas template

Edit file:

- `src/data/site.js`

Bagian yang biasanya ingin Anda ganti:

- `SITE_TEMPLATE.siteTitle`
- `SITE_TEMPLATE.footerLabel`
- `PROFILE.name`
- `PROFILE.avatar`
- `PROFILE.resumeHref`
- `PROFILE.contactHref`
- `PROFILE.socialLinks`
- `CHATBOT_TEMPLATE.name`
- `CHATBOT_TEMPLATE.icon`
- `CHATBOT_TEMPLATE.enabled`

Jika Anda ingin menampilkan tombol kontak pada modal project private, isi:

- `PROFILE.contactHref`

Contoh:

```js
contactHref: 'mailto:hello@yourdomain.com'
```

### 2. Ganti dummy project

Edit file:

- `src/data/production.js`
- `src/data/personal.js`
- `src/data/speaker.js`

Setiap item project memiliki struktur:

```js
{
  id: 'your-project-id',
  companyKey: 'companies.your_company_key',
  title: {
    id: 'Judul Bahasa Indonesia',
    en: 'English Title'
  },
  description: {
    id: 'Deskripsi Bahasa Indonesia',
    en: 'English description'
  },
  tags: ['React', 'AI', 'API'],
  date: '2026-01-01',
  link: 'https://example.com'
}
```

Catatan:

- jika `link` diisi, tombol project akan menjadi public link
- jika `link` dikosongkan, project dianggap private

### 3. Ganti label industri / perusahaan

Edit file:

- `src/locales/id.js`
- `src/locales/en.js`

Lalu ganti isi object `companies`.

Contoh:

```js
companies: {
  fintech: 'Fintech Company'
}
```

Lalu gunakan key itu di data project:

```js
companyKey: 'companies.fintech'
```

### 4. Ganti aset visual

Aset default template ada di:

- `public/avatar-template.svg`
- `public/banner/production-template.svg`
- `public/banner/personal-template.svg`
- `public/banner/speaker-template.svg`
- `public/favicon.svg`
- `public/chatbot-robot-template.svg`

Silakan replace dengan aset Anda sendiri.

## Konfigurasi .env

Template ini memakai file `.env` di root project, dan file itu sengaja dibiarkan berupa placeholder kosong agar aman saat repo dipublikasikan.

### Isi `.env` harus berasal dari aplikasi Flownym Anda

Jika Anda ingin menghubungkan chatbot demo ini ke jawaban live:

1. Buka aplikasi **Flownym** milik Anda.
2. Buka chatbot / flow yang ingin dipakai.
3. Ambil kredensial deploy atau API dari aplikasi Flownym Anda.
4. Isi file `.env` dengan nilai tersebut.

Variabel yang dipakai:

```env
API_UPSTREAM_URL=
CHAT_RUN_ID=
CHAT_API_KEY=
```

Arti masing-masing:

- `API_UPSTREAM_URL`: base URL API dari aplikasi Flownym Anda
- `CHAT_RUN_ID`: ID flow / run yang dipakai chatbot
- `CHAT_API_KEY`: API key server-side dari aplikasi Flownym Anda

Setelah mengubah `.env`, restart server development atau container Anda agar konfigurasi baru terbaca.

Untuk build image production, file `.env` memang tidak dibundel ke image. Jika Anda men-deploy container production, kirim tiga variabel yang sama sebagai environment variables dari platform deploy Anda.

### Penting

- jangan isi `.env` dengan data dummy produksi
- jangan commit `.env` yang berisi kredensial real
- file `.env` bawaan template ini hanya placeholder aman

## Cara Kerja Chatbot Template

Secara default chatbot **sudah tampil di kanan bawah** dan siap dipakai sebagai demo.

Yang sudah tersedia:

- tombol chatbot dan popup UI
- ikon robot template
- nama chatbot template
- jawaban demo saat koneksi live belum tersedia
- koneksi otomatis ke endpoint live jika `.env` sudah diisi benar

Lokasi jawaban demo chatbot ada di:

- `src/utils/chatbotTemplateReplies.js`

Untuk menyesuaikan tampilannya, edit file `src/data/site.js`:

```js
CHATBOT_TEMPLATE.name
CHATBOT_TEMPLATE.icon
CHATBOT_TEMPLATE.enabled
```

Untuk mengaktifkan jawaban live:

1. Isi `.env` dengan kredensial dari aplikasi Flownym Anda
2. Restart server atau container

Jika koneksi live gagal, chatbot akan tetap menjawab memakai template reply agar UI tetap siap dipakai.

## Menjalankan Project

### Tanpa Docker

```bash
npm install
npm run dev
```

### Dengan Docker

```bash
docker compose up -d --build
```

Atau:

```bash
make up
```

Mode Docker development template ini menyimpan dependency di volume internal container, jadi `node_modules` tidak perlu ada di project host Anda.

## Build

```bash
npm run build
```

## Checklist Sebelum Publish Portfolio Anda

Pastikan Anda sudah mengganti:

- nama profil
- avatar
- social links
- contact link
- semua dummy project
- semua company labels
- favicon
- banner placeholder
- nama chatbot
- ikon chatbot
- `SITE_TEMPLATE.siteTitle`
- `.env` dengan kredensial dari aplikasi Flownym Anda untuk jawaban chatbot live

## Catatan Keamanan

Repo ini sudah dibersihkan dari:

- nama pemilik lama
- nomor WhatsApp lama
- link personal lama
- kredensial API lama
- data project lama

Tetap pastikan Anda:

- tidak meng-commit `.env` berisi secret real
- tidak menaruh API key di file `src/`
- hanya mengambil kredensial chatbot dari aplikasi Flownym Anda sendiri

## Ringkasan Penggantian File

- identitas dan fitur template: `src/data/site.js`
- isi project: `src/data/*.js`
- label UI: `src/locales/*.js`
- aset visual: `public/*`
- konfigurasi chatbot: `.env`

Template ini memang sengaja dibuat untuk **diganti total**. Jika Anda melihat teks contoh, anggap itu hanya placeholder yang aman untuk publik.
