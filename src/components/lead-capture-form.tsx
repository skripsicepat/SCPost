import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowLeft, Bot, TrendingUp } from "lucide-react";
import { LeadFormData } from "@/types/app";
import { motion } from "framer-motion";
import { Footer } from "./footer";

interface LeadCaptureFormProps {
  onSubmit: (data: LeadFormData) => void;
  isLoading?: boolean;
  onBack?: () => void;
}

export function LeadCaptureForm({
  onSubmit,
  isLoading,
  onBack,
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    fakultas: "",
    jurusan: "",
    peminatan: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = formData.fakultas && formData.jurusan && formData.email;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center px-4 py-12">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        </div>

        <div className="relative w-full max-w-2xl">
          {onBack && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={onBack}
              className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Kembali ke Beranda</span>
            </motion.button>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4 border border-white/20">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-white/90">
                AI Thesis Generator
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Dapatkan Ide Judul{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Skripsi Sekarang
              </span>
            </h1>
            <p className="text-lg text-white/60 max-w-xl mx-auto">
              Isi data di bawah ini, dan kami akan menganalisis tren penelitian
              terbaru di jurusan Anda
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/20"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="fakultas"
                  className="text-sm font-semibold text-white/90"
                >
                  Fakultas <span className="text-pink-400">*</span>
                </Label>
                <Input
                  id="fakultas"
                  placeholder="Contoh: Fakultas Ilmu Komputer"
                  value={formData.fakultas}
                  onChange={(e) =>
                    setFormData({ ...formData, fakultas: e.target.value })
                  }
                  className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-cyan-400 focus:ring-cyan-400/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="jurusan"
                  className="text-sm font-semibold text-white/90"
                >
                  Jurusan <span className="text-pink-400">*</span>
                </Label>
                <Input
                  id="jurusan"
                  placeholder="Contoh: Teknik Informatika"
                  value={formData.jurusan}
                  onChange={(e) =>
                    setFormData({ ...formData, jurusan: e.target.value })
                  }
                  className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-cyan-400 focus:ring-cyan-400/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="peminatan"
                  className="text-sm font-semibold text-white/90"
                >
                  Peminatan{" "}
                  <span className="text-white/40 text-xs">(Opsional)</span>
                </Label>
                <Input
                  id="peminatan"
                  placeholder="Contoh: Kecerdasan Buatan"
                  value={formData.peminatan}
                  onChange={(e) =>
                    setFormData({ ...formData, peminatan: e.target.value })
                  }
                  className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-cyan-400 focus:ring-cyan-400/20"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-white/90"
                >
                  Email <span className="text-pink-400">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@universitas.ac.id"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-cyan-400 focus:ring-cyan-400/20"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg font-bold rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white shadow-2xl shadow-purple-500/30 active:scale-[0.98] transition-all"
                disabled={!isValid || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⚡</span>
                    Sedang Menyusun Judul...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Dapatkan 10 Ide Judul Sekarang (Gratis!)
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
                <TrendingUp className="w-4 h-4" />
                <span>
                  AI kami menganalisis 1000+ jurnal ilmiah terbaru untuk jurusan
                  Anda
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 grid grid-cols-3 gap-4 text-center"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                10+
              </div>
              <div className="text-xs md:text-sm text-white/50">
                Ide Judul Unik
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                5
              </div>
              <div className="text-xs md:text-sm text-white/50">
                Bab Lengkap
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                ∞
              </div>
              <div className="text-xs md:text-sm text-white/50">
                Akses penuh selama 30 hari.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
