import { LeadFormData, Chapter } from '@/types/app';
import { supabase } from './supabase';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature: number;
  max_tokens: number;
}

async function callOpenAI(messages: OpenAIMessage[], maxTokens: number = 2000): Promise<string> {
  const requestBody: OpenAIRequest = {
    model: 'gpt-4o-mini',
    messages,
    temperature: 0.7,
    max_tokens: maxTokens,
  };

  const { data, error } = await supabase.functions.invoke('supabase-functions-openai-proxy', {
    body: requestBody,
  });

  if (error) {
    throw new Error(error.message || 'Gagal menghubungi server AI');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data.choices[0]?.message?.content || '';
}

export async function generateTitleIdeas(data: LeadFormData): Promise<Array<{ id: string; title: string }>> {
  const systemPrompt = `Anda adalah asisten akademik yang membantu mahasiswa Indonesia menghasilkan judul skripsi berkualitas tinggi.`;
  
  const userPrompt = `Buatlah 10 judul skripsi yang menarik dan relevan untuk mahasiswa dengan data berikut:

Fakultas: ${data.fakultas}
Jurusan: ${data.jurusan}
${data.peminatan ? `Peminatan: ${data.peminatan}` : ''}

Kriteria judul:
1. Spesifik dan fokus pada satu topik utama
2. Menggunakan metodologi penelitian yang jelas (analisis, implementasi, perancangan, evaluasi, studi komparatif)
3. Relevan dengan tren teknologi dan industri terkini
4. Sesuai dengan bidang studi yang dipilih
5. Dapat diselesaikan dalam waktu 4-6 bulan
6. Menggunakan bahasa Indonesia yang formal dan akademis

Format output: Berikan 10 judul dalam bentuk list, satu judul per baris, tanpa numbering.`;

  const messages: OpenAIMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const response = await callOpenAI(messages, 800);
  
  const titles = response
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.match(/^\d+\./))
    .slice(0, 10);

  return titles.map((title, index) => ({
    id: `title-${index}`,
    title,
  }));
}

export async function generateChapterContent(
  chapter: Chapter,
  title: string,
  fakultas: string,
  jurusan: string,
  peminatan?: string,
  previousChapters?: string
): Promise<string> {
  const chapterNames: Record<Chapter, string> = {
    'bab-1': 'BAB I - PENDAHULUAN',
    'bab-2': 'BAB II - TINJAUAN PUSTAKA',
    'bab-3': 'BAB III - METODOLOGI PENELITIAN',
    'bab-4': 'BAB IV - HASIL DAN PEMBAHASAN',
    'bab-5': 'BAB V - KESIMPULAN DAN SARAN',
    'daftar-pustaka': 'DAFTAR PUSTAKA',
  };

  const chapterGuidelines: Record<Chapter, string> = {
    'bab-1': `
Sub-bab yang harus ada:
1.1 Latar Belakang (min 800 kata)
1.2 Rumusan Masalah (3-5 poin)
1.3 Tujuan Penelitian
1.4 Manfaat Penelitian
1.5 Batasan Masalah
1.6 Sistematika Penulisan

Gunakan referensi ilmiah minimal 5-7 sumber (jurnal/buku) dalam latar belakang.`,
    
    'bab-2': `
Sub-bab yang harus ada:
2.1 Landasan Teori (konsep-konsep utama)
2.2 Penelitian Terdahulu (min 5 penelitian relevan)
2.3 Kerangka Pemikiran

Gunakan minimal 15-20 referensi ilmiah (jurnal internasional/nasional terakreditasi).
Setiap konsep harus didukung dengan kutipan (Author, Year).`,
    
    'bab-3': `
Sub-bab yang harus ada:
3.1 Desain Penelitian
3.2 Lokasi dan Waktu Penelitian
3.3 Populasi dan Sampel (jika relevan)
3.4 Metode Pengumpulan Data
3.5 Instrumen Penelitian
3.6 Teknik Analisis Data
3.7 Tahapan Penelitian (flowchart/diagram)

Jelaskan dengan detail dan presisi teknis.`,
    
    'bab-4': `
Sub-bab yang harus ada:
4.1 Hasil Penelitian (data, grafik, tabel)
4.2 Pembahasan (interpretasi hasil)
4.3 Analisis Temuan

Sertakan contoh data/hasil konkret dan analisis mendalam.
Gunakan referensi untuk mendukung interpretasi.`,
    
    'bab-5': `
Sub-bab yang harus ada:
5.1 Kesimpulan (ringkas, menjawab tujuan penelitian)
5.2 Saran (untuk pengembangan lebih lanjut)

Kesimpulan harus sesuai dengan rumusan masalah dan tujuan penelitian di Bab 1.`,
    
    'daftar-pustaka': `
Format: APA 7th Edition
Minimal 20-30 referensi dari:
- Jurnal internasional (70%)
- Jurnal nasional terakreditasi (20%)
- Buku/textbook (10%)

Urutkan alfabetis berdasarkan nama penulis.
Contoh format:
Surname, A. B. (Year). Title of article. Journal Name, Volume(Issue), pages. https://doi.org/xxx`,
  };

  const systemPrompt = `Anda adalah asisten penulisan skripsi akademik tingkat sarjana di Indonesia. 
Tugas Anda adalah menghasilkan konten skripsi berkualitas tinggi yang sesuai dengan standar akademik universitas.

Prinsip penulisan:
- Gunakan bahasa Indonesia formal dan akademis
- Sertakan referensi ilmiah yang relevan dalam format (Penulis, Tahun)
- Hindari plagiarisme, buat konten original
- Minimal 2000 kata per bab (kecuali Bab 5 dan Daftar Pustaka)
- Gunakan struktur paragraf yang baik (topik kalimat, isi, kesimpulan)`;

  const userPrompt = `
Buatlah konten untuk ${chapterNames[chapter]} dengan detail berikut:

Judul Skripsi: ${title}
Fakultas: ${fakultas}
Jurusan: ${jurusan}
${peminatan ? `Peminatan: ${peminatan}` : ''}

PEDOMAN BAB:
${chapterGuidelines[chapter]}

${previousChapters ? `\nKONTEKS BAB SEBELUMNYA:\n${previousChapters}\n\nPastikan bab ini konsisten dan melanjutkan pembahasan dari bab sebelumnya.` : ''}

PENTING:
- Buat konten yang spesifik dan detail, bukan template umum
- Gunakan contoh konkret dan data realistis
- Sertakan referensi ilmiah yang relevan
- Hindari kalimat klise atau terlalu umum
- Minimal 2000 kata (kecuali bab 5 dan daftar pustaka)

Tulis konten bab lengkap sekarang:`;

  const messages: OpenAIMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const maxTokens = chapter === 'daftar-pustaka' ? 2000 : 4000;
  
  return await callOpenAI(messages, maxTokens);
}

export async function reviseChapterContent(
  chapter: Chapter,
  currentContent: string,
  userFeedback: string,
  existingReferences?: string[]
): Promise<string> {
  const systemPrompt = `Anda adalah asisten revisi skripsi akademik. 
Tugas Anda adalah merevisi konten berdasarkan feedback pengguna sambil mempertahankan kualitas akademis.

Prinsip revisi:
- JANGAN menghapus referensi yang sudah ada
- Pertahankan struktur dan format akademis
- Perbaiki sesuai feedback spesifik pengguna
- Pastikan konsistensi dengan bagian lain
- Tetap gunakan bahasa formal dan akademis`;

  const userPrompt = `
Revisi konten ${chapter.toUpperCase()} berikut berdasarkan feedback pengguna.

KONTEN SAAT INI:
${currentContent}

${existingReferences && existingReferences.length > 0 ? `\nREFERENSI YANG HARUS DIPERTAHANKAN:\n${existingReferences.join('\n')}\n` : ''}

FEEDBACK PENGGUNA:
${userFeedback}

INSTRUKSI:
- Fokus pada perbaikan yang diminta pengguna
- Jangan ubah bagian yang tidak terkait feedback
- Pertahankan semua referensi ilmiah
- Pastikan hasil revisi tetap koheren dan berkualitas
- Minimal 2000 kata (kecuali bab 5 dan daftar pustaka)

Tulis konten yang sudah direvisi:`;

  const messages: OpenAIMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  return await callOpenAI(messages, 4000);
}

export function hasApiKey(): boolean {
  return true;
}
