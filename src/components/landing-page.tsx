import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  FileText,
  CreditCard,
  Bot,
  RefreshCw,
  Download,
  CheckCircle2,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Star,
  LogIn,
} from "lucide-react";
import { Footer } from "./footer";
import { SkripsiCalculator } from "./skripsi-calculator";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin?: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      {/* Sticky Promo Banner */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 py-3 px-4 text-center"
      >
        <div className="flex items-center justify-center gap-4">
          <p className="text-white font-semibold text-sm md:text-base">
            🔥 PROMO KUOTA TERBATAS! Untuk Penulisan Skripsi Lengkap hanya{" "}
            <span className="line-through opacity-80">(Rp 1.200.000)</span>.{" "}
            <span className="font-bold">Rp 199.000.</span>{" "}
            <span className="hidden sm:inline">Jangan Sampai Kehabisan!</span>
          </p>
          {onLogin && (
            <button
              onClick={onLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm font-medium transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Kalkulator Skripsi - Above the Fold */}
      <SkripsiCalculator />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24 lg:py-32">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-white/90">
                Bantuan Penulisan Akademik
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Selesaikan Skripsi S1{" "}
            </h1>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              10x Lebih Cepat
            </h1>

            <h1 className="text-lg md:text-xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              Gunakan metode skripsicepat.com! Selesaikan terlebih dahulu
              penulisan skripsi dari judul, Bab I-V, hingga daftar pustaka
              dengan mudah memanfaatkan bantuan skripsicepat.com. Konsultasikan
              tiap bagian skripsi ke dosen pembimbing. Sempurnakan penulisan
              skripsi dengan menggunakan fasilitas revisi di skripsicepat.com.
              Skripsi selesai, wisuda siap digapai!
            </h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Button
                onClick={onGetStarted}
                size="lg"
                className="h-14 px-8 text-lg font-bold rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white shadow-2xl shadow-purple-500/30 active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Ide Judul Gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-10 text-white/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-sm">500.000+ Mahasiswa Terbantu</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="text-sm">Pembayaran Aman</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">Akses Penuh</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-16 md:py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Cara Kerja{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                SkripsiCepat
              </span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              5 langkah mudah menuju skripsi lengkap yang siap dikonsultasikan
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: 1,
                icon: <FileText className="w-8 h-8" />,
                title: "Masukkan Jurusan",
                desc: "Dapatkan 10 Ide Judul Gratis",
                color: "from-cyan-500 to-blue-500",
              },
              {
                step: 2,
                icon: <CreditCard className="w-8 h-8" />,
                title: "Pilih & Bayar",
                desc: "Pembayaran Aman via Payment Gateway Terpercaya",
                color: "from-blue-500 to-purple-500",
              },
              {
                step: 3,
                icon: <Bot className="w-8 h-8" />,
                title: "Aplikasi Mulai Menulis",
                desc: "Bab demi Bab Secara Sekuensial",
                color: "from-purple-500 to-pink-500",
              },
              {
                step: 4,
                icon: <RefreshCw className="w-8 h-8" />,
                title: "Review & Revisi",
                desc: "Tersedia 5x Revisi per Bab",
                color: "from-pink-500 to-orange-500",
              },
              {
                step: 5,
                icon: <Download className="w-8 h-8" />,
                title: "Download",
                desc: "Download File Final",
                color: "from-orange-500 to-yellow-500",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all hover:bg-white/15 h-full">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4 shadow-lg`}
                  >
                    {item.icon}
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
                {index < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-white/30">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Fitur{" "}
              <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                Unggulan
              </span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Kenapa SkripsiCepat berbeda dari yang lain?
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-10 h-10" />,
                title: "Alur Logis & Terstruktur",
                desc: "Penulisan tiap bab akan merujuk pada bab sebelumnya, sehingga alur logika penelitian Anda tetap terhubung dan koheren.",
                gradient: "from-cyan-500 to-blue-500",
              },
              {
                icon: <RefreshCw className="w-10 h-10" />,
                title: "Revisi Terkendali",
                desc: "Tidak puas dengan hasil di bab tertentu? Gunakan fitur Revisi. Masukkan instruksi Anda, dan Anda akan dapat memperbaikinya secara instan.",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: <Shield className="w-10 h-10" />,
                title: "Cara Pembayaran Lengkap",
                desc: "Bayar pakai apa saja bisa. QRIS, Gopay, ShopeePay, hingga Transfer Bank melalui gerbang pembayaran yang aman.",
                gradient: "from-orange-500 to-yellow-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all hover:bg-white/10"
              >
                <div
                  className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-xl`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-white font-bold text-xl mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 py-16 md:py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-2xl md:text-3xl font-bold text-white mb-10"
          >
            Kata Mereka Tentang SkripsiCepat
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                initial: "A",
                gradient: "from-cyan-400 to-purple-400",
                quote:
                  "SkripsiCepat sangat membantu saya yang dikejar deadline. Hasil tulisannya terstruktur dan mudah dipahami dosen pembimbing!",
                name: "Andi Pratama",
                major: "Mahasiswa Teknik Informatika",
                delay: 0,
              },
              {
                initial: "S",
                gradient: "from-emerald-400 to-teal-400",
                quote:
                  "Awalnya saya ragu, tapi setelah coba ternyata hasilnya luar biasa! Bab 1 dan Bab 2 selesai dalam sehari. Dosen saya bilang kerangkanya sangat sistematis.",
                name: "Sari Rahayu",
                major: "Mahasiswi Manajemen Bisnis",
                delay: 0.1,
              },
              {
                initial: "R",
                gradient: "from-pink-400 to-orange-400",
                quote:
                  "Fitur revisi per bab sangat berguna. Saya bisa minta perbaikan sampai hasilnya benar-benar sesuai dengan arahan dosen. Hemat waktu dan tenaga!",
                name: "Rizky Firmansyah",
                major: "Mahasiswa Akuntansi",
                delay: 0.2,
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item.delay }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="flex justify-start gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-white/80 text-sm md:text-base italic flex-1">
                  "{item.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {item.initial}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-sm">
                      {item.name}
                    </p>
                    <p className="text-white/50 text-xs">{item.major}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-8 md:p-12 text-center"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Siap Menulis Skripsi?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
                Mulai dengan mencoba 10 ide judul gratis. Tanpa bayar, tanpa
                kartu kredit, tanpa komitmen.
              </p>
              <Button
                onClick={onGetStarted}
                size="lg"
                className="h-14 px-10 text-lg font-bold rounded-full bg-white text-purple-600 hover:bg-white/90 shadow-2xl active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Mulai Sekarang!
              </Button>
              <p className="text-white/70 text-sm mt-4">
                Sudah digunakan oleh 500.000+ mahasiswa di seluruh Indonesia
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
