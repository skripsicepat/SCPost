import { useState, useEffect } from 'react';
import { LandingPage } from './landing-page';
import { LeadCaptureForm } from './lead-capture-form';
import { TitleSelection } from './title-selection';
import { ChapterWorkspace } from './chapter-workspace';
import { AccountSetupModal } from './account-setup-modal';
import { LoginModal } from './login-modal';

import { AppState, LeadFormData, Chapter, ChapterContent } from '@/types/app';
import { toast } from 'sonner';
import * as openai from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { midtransService, subscriptionService, thesisService } from '@/lib/services';

const generateChapterContent = async (chapter: Chapter, title: string, prevContent?: string) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  
  const chapterContents: Record<Chapter, string> = {
    'bab-1': `BAB I
PENDAHULUAN

1.1 Latar Belakang

Perkembangan teknologi informasi yang pesat telah membawa perubahan signifikan dalam berbagai aspek kehidupan. ${title} menjadi topik yang semakin relevan dalam konteks perkembangan ini. Penelitian ini dilatarbelakangi oleh kebutuhan untuk memahami dan mengoptimalkan implementasi teknologi dalam konteks yang spesifik.

Berdasarkan observasi awal, terdapat beberapa tantangan yang dihadapi dalam penerapan teknologi ini, termasuk keterbatasan infrastruktur, kurangnya pemahaman stakeholder, dan kompleksitas teknis yang tinggi. Oleh karena itu, penelitian ini penting untuk dilakukan guna memberikan solusi yang komprehensif.

1.2 Rumusan Masalah

Berdasarkan latar belakang yang telah diuraikan, rumusan masalah dalam penelitian ini adalah:
1. Bagaimana kondisi existing dari sistem yang ada?
2. Apa saja tantangan dalam implementasi?
3. Bagaimana merancang solusi yang optimal?
4. Bagaimana hasil evaluasi dari solusi yang diusulkan?

1.3 Tujuan Penelitian

Penelitian ini bertujuan untuk:
1. Menganalisis kondisi sistem yang ada
2. Mengidentifikasi tantangan dan hambatan
3. Merancang solusi yang sesuai dengan kebutuhan
4. Mengevaluasi efektivitas solusi yang diimplementasikan

1.4 Manfaat Penelitian

Penelitian ini diharapkan dapat memberikan manfaat:
1. Manfaat Teoritis: Memberikan kontribusi pada pengembangan ilmu pengetahuan
2. Manfaat Praktis: Memberikan solusi nyata untuk permasalahan yang ada
3. Manfaat Metodologis: Menyediakan framework penelitian yang dapat direplikasi

1.5 Batasan Masalah

Untuk memfokuskan penelitian, batasan yang ditetapkan meliputi:
1. Ruang lingkup penelitian dibatasi pada area spesifik
2. Periode penelitian selama 6 bulan
3. Sampel penelitian mencakup populasi tertentu
4. Variabel yang diteliti terbatas pada aspek-aspek kunci

1.6 Sistematika Penulisan

Bab I: Pendahuluan - Berisi latar belakang, rumusan masalah, tujuan, dan manfaat penelitian
Bab II: Tinjauan Pustaka - Membahas teori dan penelitian terdahulu yang relevan
Bab III: Metodologi - Menjelaskan metode penelitian yang digunakan
Bab IV: Hasil dan Pembahasan - Menyajikan hasil penelitian dan analisis
Bab V: Kesimpulan - Merangkum temuan dan memberikan rekomendasi`,

    'bab-2': `BAB II
TINJAUAN PUSTAKA

2.1 Landasan Teori

2.1.1 Konsep Dasar
Konsep fundamental yang menjadi dasar penelitian ini mencakup pemahaman tentang teknologi informasi, sistem, dan metodologi pengembangan. Menurut Davis (2020), teknologi informasi adalah aplikasi komputer dan peralatan telekomunikasi untuk menyimpan, mengambil, mentransmisi, dan memanipulasi data.

2.1.2 Teori Pendukung
Beberapa teori yang mendukung penelitian ini antara lain:
- Technology Acceptance Model (TAM)
- Unified Theory of Acceptance and Use of Technology (UTAUT)
- Information Systems Success Model

2.2 Penelitian Terdahulu

Beberapa penelitian terdahulu yang relevan dengan topik ini:

1. Smith et al. (2021) melakukan penelitian tentang implementasi teknologi dengan hasil menunjukkan peningkatan efisiensi sebesar 35%.

2. Johnson (2020) menganalisis faktor-faktor yang mempengaruhi adopsi teknologi dan menemukan bahwa perceived usefulness adalah faktor paling dominan.

3. Chen & Wang (2019) mengembangkan framework untuk evaluasi sistem dengan fokus pada user experience dan satisfaction.

2.3 State of the Art

Perkembangan terkini dalam bidang ini menunjukkan tren penggunaan artificial intelligence dan machine learning untuk meningkatkan capabilities sistem. Cloud computing dan edge computing juga menjadi teknologi yang semakin populer untuk deployment.

2.4 Gap Analysis

Dari tinjauan pustaka yang dilakukan, teridentifikasi beberapa gap:
1. Kurangnya penelitian di konteks lokal Indonesia
2. Belum ada framework yang comprehensif untuk kasus spesifik
3. Minimnya studi longitudinal untuk evaluasi jangka panjang

2.5 Kerangka Pemikiran

Berdasarkan tinjauan pustaka, penelitian ini mengembangkan kerangka pemikiran yang menghubungkan variabel-variabel kunci. Framework yang diusulkan mengintegrasikan teori-teori yang ada dengan konteks penelitian yang spesifik.`,

    'bab-3': `BAB III
METODOLOGI PENELITIAN

3.1 Jenis Penelitian

Penelitian ini menggunakan pendekatan mixed method yang menggabungkan metode kualitatif dan kuantitatif. Desain penelitian bersifat explanatory sequential, dimana data kuantitatif dikumpulkan terlebih dahulu kemudian diikuti dengan pengumpulan data kualitatif untuk menjelaskan hasil kuantitatif.

3.2 Lokasi dan Waktu Penelitian

Penelitian dilaksanakan di lokasi yang relevan dengan topik penelitian, dengan periode pelaksanaan selama 6 bulan dari bulan Januari hingga Juni 2024.

3.3 Populasi dan Sampel

3.3.1 Populasi
Populasi dalam penelitian ini adalah seluruh stakeholder yang terlibat dalam sistem, dengan jumlah total sekitar 500 individu.

3.3.2 Sampel
Teknik sampling yang digunakan adalah purposive sampling dengan kriteria tertentu. Jumlah sampel yang diambil adalah 200 responden, yang dihitung menggunakan rumus Slovin dengan margin of error 5%.

3.4 Metode Pengumpulan Data

3.4.1 Data Primer
- Kuesioner: Menggunakan skala Likert 1-5 untuk mengukur variabel penelitian
- Wawancara: Semi-structured interview dengan key informants
- Observasi: Pengamatan langsung terhadap implementasi sistem

3.4.2 Data Sekunder
- Dokumentasi: Analisis dokumen, laporan, dan data historis
- Studi literatur: Review jurnal, buku, dan publikasi ilmiah

3.5 Instrumen Penelitian

Instrumen yang digunakan:
1. Kuesioner terstruktur dengan validitas dan reliabilitas yang telah diuji
2. Pedoman wawancara yang telah dikembangkan berdasarkan framework penelitian
3. Checklist observasi untuk pengamatan sistematis

3.6 Metode Analisis Data

3.6.1 Analisis Kuantitatif
- Statistik deskriptif untuk gambaran umum data
- Uji validitas dan reliabilitas instrumen
- Analisis regresi untuk menguji hubungan antar variabel
- Software SPSS 25 untuk pengolahan data

3.6.2 Analisis Kualitatif
- Content analysis untuk data wawancara
- Thematic analysis untuk identifikasi pola
- Triangulasi data untuk validasi temuan

3.7 Tahapan Penelitian

Tahap 1: Persiapan (Bulan 1)
- Studi literatur dan observasi awal
- Penyusunan instrumen penelitian

Tahap 2: Pengumpulan Data (Bulan 2-4)
- Penyebaran kuesioner
- Pelaksanaan wawancara dan observasi

Tahap 3: Analisis Data (Bulan 5)
- Pengolahan dan analisis data kuantitatif
- Analisis data kualitatif

Tahap 4: Pelaporan (Bulan 6)
- Penyusunan laporan penelitian
- Finalisasi dan review`,

    'bab-4': `BAB IV
HASIL DAN PEMBAHASAN

4.1 Gambaran Umum

Penelitian ini melibatkan 200 responden yang terdiri dari berbagai stakeholder. Data yang terkumpul menunjukkan tingkat partisipasi yang baik dengan response rate mencapai 85%.

4.2 Karakteristik Responden

Berdasarkan data yang terkumpul, karakteristik responden adalah:
- Jenis Kelamin: Laki-laki 55%, Perempuan 45%
- Usia: Mayoritas 21-30 tahun (60%)
- Pendidikan: S1 (70%), S2 (25%), S3 (5%)
- Pengalaman: 1-3 tahun (40%), 3-5 tahun (35%), >5 tahun (25%)

4.3 Hasil Analisis Kuantitatif

4.3.1 Uji Validitas dan Reliabilitas
Hasil uji validitas menunjukkan bahwa semua item pernyataan valid dengan nilai r hitung > r tabel (0,138). Uji reliabilitas menghasilkan nilai Cronbach's Alpha 0,892 yang mengindikasikan reliabilitas tinggi.

4.3.2 Analisis Deskriptif
Analisis deskriptif menunjukkan:
- Variabel X1: Mean = 3.85, Std Dev = 0.67 (Kategori: Baik)
- Variabel X2: Mean = 3.92, Std Dev = 0.58 (Kategori: Baik)
- Variabel Y: Mean = 4.05, Std Dev = 0.62 (Kategori: Sangat Baik)

4.3.3 Analisis Regresi
Hasil analisis regresi linear berganda:
Y = 1.234 + 0.456X1 + 0.678X2
R Square = 0.752 (75.2% variance dijelaskan oleh model)
Sig. F = 0.000 < 0.05 (Model signifikan)

4.4 Hasil Analisis Kualitatif

Dari wawancara dengan 15 key informants, teridentifikasi beberapa tema utama:

4.4.1 Kemudahan Penggunaan
Mayoritas responden menyatakan bahwa sistem mudah digunakan dan user-friendly. "Interface yang intuitif memudahkan kami dalam beradaptasi" (Informan 1).

4.4.2 Manfaat Implementasi
Implementasi memberikan manfaat signifikan dalam efisiensi operasional. Terjadi peningkatan produktivitas sebesar 35% setelah implementasi.

4.4.3 Tantangan yang Dihadapi
Beberapa tantangan yang muncul:
- Resistensi terhadap perubahan dari sebagian stakeholder
- Keterbatasan infrastruktur teknologi
- Kebutuhan pelatihan yang intensif

4.5 Pembahasan

4.5.1 Interpretasi Hasil
Hasil penelitian menunjukkan bahwa implementasi teknologi memiliki dampak positif yang signifikan. Hal ini sejalan dengan penelitian Smith et al. (2021) yang menemukan hasil serupa.

4.5.2 Implikasi Teoritis
Temuan ini memperkuat Technology Acceptance Model yang menyatakan bahwa perceived usefulness dan perceived ease of use adalah determinan utama adoption.

4.5.3 Implikasi Praktis
Untuk praktisi, hasil ini menunjukkan pentingnya:
- Change management yang efektif
- Training dan support yang adequate
- Infrastructure readiness sebelum deployment

4.6 Keterbatasan Penelitian

Penelitian ini memiliki beberapa keterbatasan:
1. Sampel terbatas pada satu lokasi
2. Periode observasi relatif singkat
3. Belum mencakup semua variabel yang mungkin berpengaruh`,

    'bab-5': `BAB V
KESIMPULAN DAN SARAN

5.1 Kesimpulan

Berdasarkan hasil penelitian dan pembahasan yang telah diuraikan, dapat disimpulkan:

1. Kondisi Existing Sistem
Analisis kondisi awal menunjukkan bahwa sistem yang ada memiliki berbagai keterbatasan yang menghambat efisiensi operasional. Tingkat kepuasan pengguna berada pada level moderat dengan skor rata-rata 3.2 dari 5.0.

2. Tantangan Implementasi
Penelitian mengidentifikasi beberapa tantangan utama:
- Resistensi organisasi terhadap perubahan mencapai 40%
- Keterbatasan infrastruktur teknologi di 35% lokasi
- Gap kompetensi SDM yang signifikan
- Budget constraint yang membatasi scope implementasi

3. Solusi yang Dikembangkan
Solusi yang dirancang berhasil mengintegrasikan teknologi modern dengan kebutuhan spesifik organisasi. Framework yang dikembangkan mencakup:
- Arsitektur sistem yang scalable dan maintainable
- User interface yang intuitive dan accessible
- Security features yang robust
- Integration capabilities dengan sistem existing

4. Hasil Evaluasi Implementasi
Evaluasi menunjukkan hasil yang positif:
- Peningkatan efisiensi operasional sebesar 35%
- Improvement user satisfaction score menjadi 4.05/5.0
- Reduction waktu proses hingga 45%
- Cost saving mencapai 28% dibandingkan sistem sebelumnya

5. Validasi Framework
Framework yang diusulkan telah divalidasi melalui:
- Expert judgment dari praktisi dan akademisi
- Pilot implementation dengan hasil memuaskan
- User acceptance testing dengan acceptance rate 87%

5.2 Saran

Berdasarkan kesimpulan di atas, saran yang dapat diberikan:

5.2.1 Untuk Organisasi
1. Implementasi Bertahap
   Disarankan melakukan implementasi secara bertahap (phased approach) untuk meminimalkan disruption operasional dan memberikan waktu adaptasi yang cukup bagi users.

2. Investasi pada Change Management
   Alokasikan resources yang adequate untuk program change management, termasuk:
   - Communication campaign yang comprehensive
   - Training program yang terstruktur dan berkelanjutan
   - Support mechanism yang responsive

3. Infrastructure Readiness
   Pastikan infrastruktur teknologi memadai sebelum deployment, meliputi:
   - Network bandwidth yang sufficient
   - Hardware specifications yang memenuhi requirements
   - Backup dan disaster recovery mechanism

4. Continuous Improvement
   Lakukan monitoring dan evaluasi berkelanjutan untuk:
   - Mengidentifikasi areas for improvement
   - Mengadaptasi sistem sesuai evolving needs
   - Maintain system performance dan reliability

5.2.2 Untuk Penelitian Selanjutnya
1. Perluasan Scope
   Penelitian future dapat mempertimbangkan:
   - Multi-location implementation untuk generalizability
   - Longitudinal study untuk impact jangka panjang
   - Comparative study dengan alternatif solusi lain

2. Variabel Tambahan
   Eksplorasi variabel-variabel lain yang mungkin berpengaruh:
   - Organizational culture impact
   - Leadership role dalam adoption success
   - External factors seperti regulatory compliance

3. Metodologi Lanjutan
   Gunakan advanced analytical techniques:
   - Structural Equation Modeling (SEM)
   - Machine Learning untuk predictive analytics
   - Big data analysis untuk comprehensive insights

4. Industry-Specific Adaptation
   Kembangkan variants dari framework untuk:
   - Different industry sectors
   - Various organizational sizes
   - Diverse geographical contexts

5.3 Penutup

Penelitian ini telah berhasil mencapai tujuan yang ditetapkan dengan mengembangkan dan memvalidasi framework implementasi yang comprehensive. Hasil penelitian memberikan kontribusi baik secara teoritis maupun praktis untuk advancement knowledge dalam bidang ini.

Implementasi solusi yang diusulkan terbukti memberikan improvement signifikan dalam efficiency, effectiveness, dan user satisfaction. Namun demikian, kesuksesan implementasi memerlukan commitment dari semua stakeholders dan attention pada critical success factors yang telah diidentifikasi.

Diharapkan hasil penelitian ini dapat menjadi reference bagi organisasi lain yang menghadapi challenges serupa dan bagi researchers yang ingin melakukan studi lanjutan dalam topik ini. Continuous innovation dan adaptation akan menjadi key untuk sustainable success di era digital yang terus berkembang.`,

    'daftar-pustaka': `DAFTAR PUSTAKA

Abdullah, M., & Rahman, F. (2021). Digital Transformation in Higher Education: A Systematic Review. Journal of Educational Technology, 45(3), 234-251.

Agarwal, R., & Prasad, J. (2020). A Conceptual and Operational Definition of Personal Innovativeness in the Domain of Information Technology. Information Systems Research, 9(2), 204-215.

Brown, S. A., & Venkatesh, V. (2019). Model of Adoption of Technology in Households: A Baseline Model Test and Extension. MIS Quarterly, 29(3), 399-426.

Chen, L., & Wang, Y. (2019). Framework for System Evaluation: User Experience and Satisfaction Metrics. International Journal of Information Management, 38(1), 142-158.

Davis, F. D. (2020). Perceived Usefulness, Perceived Ease of Use, and User Acceptance of Information Technology. MIS Quarterly, 13(3), 319-340.

Goodhue, D. L., & Thompson, R. L. (2021). Task-Technology Fit and Individual Performance. MIS Quarterly, 19(2), 213-236.

Johnson, R. B. (2020). Factors Influencing Technology Adoption: An Empirical Study. Technology in Society, 42, 156-167.

Kim, H. W., Chan, H. C., & Gupta, S. (2021). Value-based Adoption of Mobile Internet: An Empirical Investigation. Decision Support Systems, 43(1), 111-126.

Lee, Y., Kozar, K. A., & Larsen, K. R. (2019). The Technology Acceptance Model: Past, Present, and Future. Communications of the Association for Information Systems, 12(1), 752-780.

Moore, G. C., & Benbasat, I. (2020). Development of an Instrument to Measure the Perceptions of Adopting an Information Technology Innovation. Information Systems Research, 2(3), 192-222.

Parasuraman, A., & Colby, C. L. (2021). An Updated and Streamlined Technology Readiness Index. Journal of Service Research, 18(1), 59-74.

Rogers, E. M. (2019). Diffusion of Innovations (5th ed.). New York: Free Press.

Smith, J., Anderson, K., & Williams, P. (2021). Technology Implementation and Efficiency Gains: An Empirical Study. Journal of Management Information Systems, 28(2), 287-314.

Taylor, S., & Todd, P. A. (2020). Understanding Information Technology Usage: A Test of Competing Models. Information Systems Research, 6(2), 144-176.

Venkatesh, V., Morris, M. G., Davis, G. B., & Davis, F. D. (2019). User Acceptance of Information Technology: Toward a Unified View. MIS Quarterly, 27(3), 425-478.

Wang, W., & Benbasat, I. (2021). Trust in and Adoption of Online Recommendation Agents. Journal of the Association for Information Systems, 6(3), 72-101.

Zhang, P., & Li, N. (2020). The Importance of Affective Quality. Communications of the ACM, 48(9), 105-108.`,
  };

  return chapterContents[chapter];
};

const INITIAL_CHAPTER_STATE: ChapterContent = {
  chapter: 'bab-1',
  content: '',
  revisionsRemaining: 5,
  isComplete: false,
};

function Home() {
  // Load initial state from sessionStorage to persist across re-renders
  const loadInitialState = (): AppState => {
    try {
      const saved = sessionStorage.getItem('skripsi-app-state');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load saved state:', error);
    }
    
    return {
      step: 'landing',
      leadData: null,
      titleIdeas: [],
      selectedTitle: null,
      paymentStatus: 'pending',
      chapters: {
        'bab-1': { ...INITIAL_CHAPTER_STATE, chapter: 'bab-1' },
        'bab-2': { ...INITIAL_CHAPTER_STATE, chapter: 'bab-2' },
        'bab-3': { ...INITIAL_CHAPTER_STATE, chapter: 'bab-3' },
        'bab-4': { ...INITIAL_CHAPTER_STATE, chapter: 'bab-4' },
        'bab-5': { ...INITIAL_CHAPTER_STATE, chapter: 'bab-5' },
        'daftar-pustaka': { ...INITIAL_CHAPTER_STATE, chapter: 'daftar-pustaka' },
      },
      currentChapter: 'bab-1',
      isGenerating: false,
    };
  };

  const [appState, setAppState] = useState<AppState>(loadInitialState);

  const [userId, setUserId] = useState<string | null>(null);
  const [thesisId, setThesisId] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showAccountSetupModal, setShowAccountSetupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hasSetPassword, setHasSetPassword] = useState(false);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    try {
      sessionStorage.setItem('skripsi-app-state', JSON.stringify(appState));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }, [appState]);

  // Check for existing session (but stay on landing page)
  useEffect(() => {
    const checkExistingSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUserId(session.user.id);
        // User session exists but we stay on landing page
        // They can click "Login" to proceed to their thesis
      }
    };

    checkExistingSession();
  }, []);

  const handleLeadFormSubmit = async (data: LeadFormData) => {
    setAppState((prev) => ({ ...prev, isGenerating: true, leadData: data }));
    
    try {
      // Generate title ideas without creating user yet
      // User will be created during payment
      const titles = await openai.generateTitleIdeas(data);
      setAppState((prev) => ({
        ...prev,
        titleIdeas: titles,
        step: 'title-selection',
        isGenerating: false,
      }));
      toast.success('10 ide judul berhasil dihasilkan!');
    } catch (error: any) {
      toast.error('Terjadi kesalahan', {
        description: error.message || 'Silakan coba lagi.',
      });
      setAppState((prev) => ({ ...prev, isGenerating: false }));
    }
  };

  const handleTitleSelect = (title: string) => {
    setAppState((prev) => ({
      ...prev,
      selectedTitle: title,
    }));
  };

  const handleDirectPayment = async (title: string) => {
    // Set the title first
    setAppState((prev) => ({
      ...prev,
      selectedTitle: title,
    }));

    if (!appState.leadData) {
      toast.error('Data tidak lengkap');
      return;
    }

    // Create user account with email before payment
    let currentUserId = userId;
    if (!currentUserId) {
      try {
        // Generate a random password
        const randomPassword = `${Math.random().toString(36).slice(-8)}${Date.now()}`;
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: appState.leadData.email,
          password: randomPassword,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              fakultas: appState.leadData.fakultas,
              jurusan: appState.leadData.jurusan,
              peminatan: appState.leadData.peminatan,
            }
          }
        });
        
        if (signUpError) {
          // If user exists, try to sign in
          console.log('Signup error:', signUpError);
          toast.error('Gagal membuat akun', {
            description: 'Email mungkin sudah terdaftar. Hubungi support jika ada masalah.'
          });
          return;
        }
        
        if (signUpData?.user) {
          currentUserId = signUpData.user.id;
          setUserId(currentUserId);
        } else {
          toast.error('Gagal membuat akun');
          return;
        }
      } catch (error: any) {
        toast.error('Terjadi kesalahan', {
          description: error.message
        });
        return;
      }
    }

    setIsProcessingPayment(true);

    try {
      // Generate unique order ID
      const orderId = `SKRIPSI-${Date.now()}-${currentUserId.substring(0, 8)}`;
      const email = appState.leadData.email;
      const amount = 399000;

      // Create transaction with Midtrans
      let snapToken: string | null = null;
      let useDemoMode = false;
      
      try {
        snapToken = await midtransService.createTransaction(
          orderId,
          amount,
          email,
          email.split('@')[0]
        );
      } catch (midtransError: any) {
        console.error('Midtrans error:', midtransError);

        const midtransErrorMessage =
          midtransError instanceof Error
            ? midtransError.message
            : typeof midtransError === 'string'
              ? midtransError
              : String((midtransError as any)?.message ?? midtransError ?? '');

        // Check if it's a configuration error - offer demo mode
        if (midtransErrorMessage.includes('Konfigurasi') ||
            midtransErrorMessage.includes('MISSING_SERVER_KEY') ||
            midtransErrorMessage.includes('non-2xx') ||
            midtransErrorMessage.includes('Unauthorized') ||
            midtransErrorMessage.includes('unauthorized')) {
          useDemoMode = true;
          toast.warning('Mode Demo: Midtrans belum dikonfigurasi dengan benar', {
            description: 'Pastikan Client Key dan Server Key dari environment yang sama (sandbox/production). Pembayaran akan disimulasikan.',
            duration: 7000,
          });
        } else {
          setIsProcessingPayment(false);
          toast.error('Gagal menghubungi payment gateway', {
            description: midtransErrorMessage || 'Silakan coba lagi nanti atau hubungi support.',
          });
          return;
        }
      }

      // Demo mode - skip Midtrans and simulate payment
      if (useDemoMode || !snapToken) {
        setIsProcessingPayment(false);
        
        // Show confirmation dialog for demo mode
        const confirmDemo = window.confirm(
          'Mode Demo Aktif\n\n' +
          'Midtrans Server Key belum dikonfigurasi.\n' +
          'Klik OK untuk simulasi pembayaran berhasil (untuk testing).\n' +
          'Klik Cancel untuk membatalkan.'
        );
        
        if (confirmDemo) {
          try {
            // Create subscription with demo transaction ID
            const demoTransactionId = `DEMO-${orderId}`;
            const subscription = await subscriptionService.createSubscription(
              currentUserId,
              demoTransactionId,
              amount
            );

            // Create thesis draft
            const newThesisId = await thesisService.createThesis(
              currentUserId,
              subscription.id,
              title,
              appState.leadData!.fakultas,
              appState.leadData!.jurusan,
              appState.leadData?.peminatan
            );

            setThesisId(newThesisId);

            setAppState((prev) => ({
              ...prev,
              selectedTitle: title,
              paymentStatus: 'paid',
              step: 'chapter-writing',
            }));

            // Show account setup modal after demo payment
            setShowAccountSetupModal(true);
            toast.success('🎉 Demo: Pembayaran berhasil!');
          } catch (error: any) {
            console.error('Error creating subscription:', error);
            toast.error('Terjadi kesalahan saat membuat subscription.', {
              description: error.message,
            });
          }
        }
        return;
      }

      // Hide processing state and open Midtrans popup directly
      setIsProcessingPayment(false);

      // Create a container for embedded payment
      let snapContainer = document.getElementById('snap-container');
      if (!snapContainer) {
        snapContainer = document.createElement('div');
        snapContainer.id = 'snap-container';
        snapContainer.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 99999;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        document.body.appendChild(snapContainer);
      }
      snapContainer.innerHTML = `
        <div style="background: white; border-radius: 12px; width: fit-content; max-width: 400px; max-height: 90vh; overflow: auto; position: relative;">
          <button id="snap-close-btn" style="position: absolute; top: 10px; right: 10px; background: #f0f0f0; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 18px; z-index: 10;">×</button>
          <div id="snap-embed" style="min-height: 400px; width: 100%;"></div>
        </div>
      `;
      snapContainer.style.display = 'flex';

      // Close button handler
      document.getElementById('snap-close-btn')?.addEventListener('click', () => {
        snapContainer!.style.display = 'none';
        toast.warning('Pembayaran dibatalkan', {
          description: 'Anda dapat melanjutkan pembayaran kapan saja.',
        });
      });

      // Load Midtrans Snap script
      const loadSnapScript = (): Promise<void> => {
        return new Promise((resolve, reject) => {
          if ((window as any).snap) {
            resolve();
            return;
          }
          
          const existingScript = document.querySelector('script[src*="midtrans.com/snap"]');
          if (existingScript) {
            existingScript.remove();
            delete (window as any).snap;
          }

          const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
          if (!clientKey) {
            reject(new Error('VITE_MIDTRANS_CLIENT_KEY is not set'));
            return;
          }

          const script = document.createElement('script');
          // Use sandbox URL for sandbox client key (Mid-client-xxx)
          // Use production URL for production client key (Mid-server-xxx format in prod)
          const isSandbox = clientKey.startsWith('Mid-client-') || clientKey.includes('sandbox');
          script.src = isSandbox 
            ? 'https://app.sandbox.midtrans.com/snap/snap.js'
            : 'https://app.midtrans.com/snap/snap.js';
          script.async = true;
          script.setAttribute('data-client-key', clientKey);
          script.onload = () => {
            // Wait for snap to initialize
            const start = Date.now();
            const tick = () => {
              if ((window as any).snap) {
                resolve();
                return;
              }
              if (Date.now() - start > 5000) {
                reject(new Error('Midtrans Snap loaded but window.snap is still undefined'));
                return;
              }
              setTimeout(tick, 50);
            };
            tick();
          };
          script.onerror = () => reject(new Error('Failed to load Midtrans script'));
          document.head.appendChild(script);
        });
      };

      try {
        await loadSnapScript();
      } catch (scriptError) {
        console.error('Failed to load Midtrans script:', scriptError);
        snapContainer.style.display = 'none';
        toast.error('Gagal memuat payment gateway', {
          description: 'Silakan refresh halaman dan coba lagi.',
        });
        return;
      }

      if (!(window as any).snap) {
        snapContainer.style.display = 'none';
        toast.error('Payment gateway tidak tersedia', {
          description: 'Silakan refresh halaman dan coba lagi.',
        });
        return;
      }

      // Use embed mode
      (window as any).snap.embed(snapToken, {
        embedId: 'snap-embed',
        onSuccess: async (result: any) => {
          console.log('Payment success:', result);
          
          // Hide container immediately on success
          const container = document.getElementById('snap-container');
          if (container) container.style.display = 'none';
          
          try {
            // Create subscription
            const subscription = await subscriptionService.createSubscription(
              currentUserId,
              result.transaction_id || orderId,
              amount
            );

            // Create thesis draft
            const newThesisId = await thesisService.createThesis(
              currentUserId,
              subscription.id,
              title,
              appState.leadData!.fakultas,
              appState.leadData!.jurusan,
              appState.leadData?.peminatan
            );

            setThesisId(newThesisId);

            setAppState((prev) => ({
              ...prev,
              selectedTitle: title,
              paymentStatus: 'paid',
              step: 'chapter-writing',
            }));

            // Show account setup modal after successful payment
            setShowAccountSetupModal(true);
            toast.success('🎉 Pembayaran berhasil!');
          } catch (error: any) {
            console.error('Error creating subscription/thesis:', error);
            
            // Still transition to chapter-writing even if there's an error
            // This ensures the user doesn't get stuck after successful payment
            setAppState((prev) => ({
              ...prev,
              selectedTitle: title,
              paymentStatus: 'paid',
              step: 'chapter-writing',
            }));
            
            toast.error('Pembayaran berhasil tetapi terjadi kesalahan menyimpan data.', {
              description: `Error: ${error.message}. Silakan hubungi support dengan Transaction ID: ${result.transaction_id || orderId}`,
              duration: 10000,
            });
          }
        },
        onPending: (result: any) => {
          console.log('Payment pending:', result);
          const container = document.getElementById('snap-container');
          if (container) container.style.display = 'none';
          toast.info('Pembayaran tertunda. Selesaikan pembayaran Anda.', {
            description: `Transaction ID: ${result.transaction_id}`,
          });
        },
        onError: (result: any) => {
          console.error('Payment error:', result);
          const container = document.getElementById('snap-container');
          if (container) container.style.display = 'none';
          toast.error('Pembayaran gagal', {
            description: 'Silakan coba lagi atau gunakan metode pembayaran lain.',
          });
        },
        onClose: () => {
          const container = document.getElementById('snap-container');
          if (container) container.style.display = 'none';
          toast.warning('Pembayaran dibatalkan', {
            description: 'Anda dapat melanjutkan pembayaran kapan saja.',
          });
        },
      });
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      setIsProcessingPayment(false);
      const container = document.getElementById('snap-container');
      if (container) container.style.display = 'none';
      toast.error('Gagal membuka pembayaran', {
        description: error.message || 'Silakan coba lagi.',
      });
    }
  };

  const handleProceedToPayment = async () => {
    if (!appState.selectedTitle || !appState.leadData) {
      toast.error('Data tidak lengkap');
      return;
    }

    await handleDirectPayment(appState.selectedTitle);
  };

  const handleStartChapter = async (chapter: Chapter) => {
    // Check if user has paid subscription
    if (!userId || appState.paymentStatus !== 'paid') {
      toast.error('Akses ditolak', {
        description: 'Selesaikan pembayaran untuk mengakses fitur ini.',
      });
      setAppState(prev => ({ ...prev, step: 'payment' }));
      return;
    }

    const chapterData = appState.chapters[chapter];
    
    // If chapter already has content, just switch to it
    if (chapterData.content) {
      setAppState((prev) => ({ ...prev, currentChapter: chapter }));
      return;
    }

    // Generate new content
    setAppState((prev) => ({
      ...prev,
      currentChapter: chapter,
      isGenerating: true,
    }));

    try {
      // Collect previous chapters for context
      const chapterOrder: Chapter[] = ['bab-1', 'bab-2', 'bab-3', 'bab-4', 'bab-5', 'daftar-pustaka'];
      const currentIndex = chapterOrder.indexOf(chapter);
      let previousContext = '';
      
      if (currentIndex > 0) {
        previousContext = chapterOrder
          .slice(0, currentIndex)
          .map(ch => {
            const content = appState.chapters[ch].content;
            return content ? `${ch.toUpperCase()}:\n${content.substring(0, 500)}...` : '';
          })
          .filter(c => c)
          .join('\n\n');
      }

      const content = await openai.generateChapterContent(
        chapter,
        appState.selectedTitle!,
        appState.leadData?.fakultas || '',
        appState.leadData?.jurusan || '',
        appState.leadData?.peminatan,
        previousContext
      );
      
      // Save to database if thesisId exists
      if (thesisId) {
        const { data: chapterRecord } = await supabase
          .from('chapters')
          .select('id')
          .eq('thesis_id', thesisId)
          .eq('chapter_type', chapter)
          .single();

        if (chapterRecord) {
          await thesisService.updateChapterContent(chapterRecord.id, content);
        }
      }

      setAppState((prev) => ({
        ...prev,
        chapters: {
          ...prev.chapters,
          [chapter]: {
            ...prev.chapters[chapter],
            content,
          },
        },
        isGenerating: false,
      }));

      // Save chapters data to thesis_drafts for persistence
      if (thesisId) {
        const updatedChapters = {
          ...appState.chapters,
          [chapter]: {
            ...appState.chapters[chapter],
            content,
          },
        };
        try {
          await thesisService.saveChaptersData(thesisId, updatedChapters);
        } catch (saveError) {
          console.error('Failed to save chapters data:', saveError);
        }
      }

      toast.success('Konten bab berhasil dihasilkan!');
    } catch (error: any) {
      toast.error('Terjadi kesalahan', {
        description: error.message || 'Gagal menghasilkan konten.',
      });
      setAppState((prev) => ({ ...prev, isGenerating: false }));
    }
  };

  const handleCompleteChapter = async (chapter: Chapter) => {
    const chapterOrder: Chapter[] = ['bab-1', 'bab-2', 'bab-3', 'bab-4', 'bab-5', 'daftar-pustaka'];
    const currentIndex = chapterOrder.indexOf(chapter);
    const nextChapter = chapterOrder[currentIndex + 1];

    // Save completion to database
    if (thesisId) {
      const { data: chapterRecord } = await supabase
        .from('chapters')
        .select('id')
        .eq('thesis_id', thesisId)
        .eq('chapter_type', chapter)
        .single();

      if (chapterRecord) {
        await thesisService.completeChapter(chapterRecord.id);
      }
    }

    setAppState((prev) => ({
      ...prev,
      chapters: {
        ...prev.chapters,
        [chapter]: {
          ...prev.chapters[chapter],
          isComplete: true,
        },
      },
      currentChapter: nextChapter || chapter,
    }));

    // Save chapters data to thesis_drafts for persistence
    if (thesisId) {
      const updatedChapters = {
        ...appState.chapters,
        [chapter]: {
          ...appState.chapters[chapter],
          isComplete: true,
        },
      };
      try {
        await thesisService.saveChaptersData(thesisId, updatedChapters);
      } catch (saveError) {
        console.error('Failed to save chapters data:', saveError);
      }
    }

    if (nextChapter) {
      toast.success(`Bab selesai! Lanjut ke ${nextChapter.toUpperCase()}`);
    } else {
      toast.success('🎉 Semua bab selesai! Anda dapat mengunduh skripsi Anda.');
    }
  };

  const handleReviseChapter = async (chapter: Chapter, feedback: string) => {
    if (!userId || appState.paymentStatus !== 'paid') {
      toast.error('Akses ditolak', {
        description: 'Selesaikan pembayaran untuk mengakses fitur revisi.',
      });
      return;
    }

    setAppState((prev) => ({ ...prev, isGenerating: true }));

    try {
      // Extract references from current content (simple regex for citations)
      const currentContent = appState.chapters[chapter].content;
      const citationMatches = currentContent.match(/\(([^)]+,\s*\d{4})\)/g) || [];
      const existingReferences = [...new Set(citationMatches)];

      const content = await openai.reviseChapterContent(
        chapter,
        currentContent,
        feedback,
        existingReferences
      );

      // Save revision to database
      if (thesisId) {
        const { data: chapterRecord } = await supabase
          .from('chapters')
          .select('id')
          .eq('thesis_id', thesisId)
          .eq('chapter_type', chapter)
          .single();

        if (chapterRecord) {
          await thesisService.updateChapterContent(chapterRecord.id, content);
          // Note: revision count is managed separately via revisionService
        }
      }
      
      setAppState((prev) => ({
        ...prev,
        chapters: {
          ...prev.chapters,
          [chapter]: {
            ...prev.chapters[chapter],
            content,
            revisionsRemaining: prev.chapters[chapter].revisionsRemaining - 1,
          },
        },
        isGenerating: false,
      }));

      // Save chapters data to thesis_drafts for persistence
      if (thesisId) {
        const updatedChapters = {
          ...appState.chapters,
          [chapter]: {
            ...appState.chapters[chapter],
            content,
            revisionsRemaining: appState.chapters[chapter].revisionsRemaining - 1,
          },
        };
        try {
          await thesisService.saveChaptersData(thesisId, updatedChapters);
        } catch (saveError) {
          console.error('Failed to save chapters data:', saveError);
        }
      }
      
      toast.success('Revisi berhasil! Konten telah diperbarui.');
    } catch (error: any) {
      toast.error('Terjadi kesalahan', {
        description: error.message || 'Gagal merevisi konten.',
      });
      setAppState((prev) => ({ ...prev, isGenerating: false }));
    }
  };

  const handleDownload = () => {
    // In real app, this would generate and download a .docx file
    toast.success('Demo: File skripsi.docx akan diunduh...');
    
    // Simulate download
    const fullContent = Object.entries(appState.chapters)
      .map(([key, chapter]) => chapter.content)
      .join('\n\n');
    
    const blob = new Blob([fullContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skripsi-lengkap.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGetStarted = () => {
    setAppState((prev) => ({ ...prev, step: 'lead-form' }));
  };

  const handleOpenLogin = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = async (loggedInUserId: string) => {
    setUserId(loggedInUserId);
    setShowLoginModal(false);
    setHasSetPassword(true);

    // Check if user has active subscription and thesis
    const subscription = await subscriptionService.checkSubscriptionStatus(loggedInUserId);
    
    if (subscription && subscription.status === 'active') {
      // Get thesis data
      const { data: thesisData } = await supabase
        .from('thesis_drafts')
        .select('*')
        .eq('user_id', loggedInUserId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (thesisData) {
        setThesisId(thesisData.id);
        
        // Load chapter contents from thesis_drafts
        const chaptersState = { ...appState.chapters };
        if (thesisData.chapters_data) {
          Object.keys(thesisData.chapters_data).forEach((key) => {
            if (chaptersState[key as Chapter]) {
              chaptersState[key as Chapter] = {
                ...chaptersState[key as Chapter],
                ...thesisData.chapters_data[key],
              };
            }
          });
        }

        setAppState((prev) => ({
          ...prev,
          paymentStatus: 'paid',
          step: 'chapter-writing',
          selectedTitle: thesisData.title,
          chapters: chaptersState,
          leadData: {
            email: '',
            fakultas: thesisData.fakultas || '',
            jurusan: thesisData.jurusan || '',
            peminatan: thesisData.peminatan || '',
          },
        }));

        toast.success('Selamat datang kembali!', {
          description: 'Melanjutkan penulisan skripsi Anda.',
        });
      }
    } else {
      toast.warning('Langganan tidak aktif', {
        description: 'Langganan Anda telah berakhir. Silakan lakukan pembayaran baru.',
      });
    }
  };

  const handleAccountSetupSuccess = () => {
    setShowAccountSetupModal(false);
    setHasSetPassword(true);
    toast.success('Sekarang Anda dapat login kapan saja!', {
      description: 'Gunakan email dan password untuk mengakses skripsi Anda.',
    });
  };

  return (
    <>
      {appState.step === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} onLogin={handleOpenLogin} />
      )}

      {appState.step === 'lead-form' && (
        <LeadCaptureForm
          onSubmit={handleLeadFormSubmit}
          isLoading={appState.isGenerating}
          onBack={() => setAppState((prev) => ({ ...prev, step: 'landing' }))}
        />
      )}

      {appState.step === 'title-selection' && (
        <TitleSelection
          titleIdeas={appState.titleIdeas}
          onSelectTitle={handleTitleSelect}
          onProceedToPayment={handleDirectPayment}
          isProcessingPayment={isProcessingPayment}
        />
      )}

      {appState.step === 'chapter-writing' && appState.selectedTitle && appState.currentChapter && (
        <ChapterWorkspace
          chapters={appState.chapters}
          currentChapter={appState.currentChapter}
          selectedTitle={appState.selectedTitle}
          isGenerating={appState.isGenerating}
          onStartChapter={handleStartChapter}
          onCompleteChapter={handleCompleteChapter}
          onReviseChapter={handleReviseChapter}
          onDownload={handleDownload}
        />
      )}

      {/* Account Setup Modal - shown after payment */}
      <AccountSetupModal
        isOpen={showAccountSetupModal}
        onClose={() => setShowAccountSetupModal(false)}
        email={appState.leadData?.email || ''}
        onSuccess={handleAccountSetupSuccess}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}

export default Home;
