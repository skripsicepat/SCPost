import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Check, Edit3, Sparkles, ThumbsUp, ArrowRight, X } from "lucide-react";
import { TitleIdea } from "@/types/app";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "./footer";

interface TitleSelectionProps {
  titleIdeas: TitleIdea[];
  onSelectTitle: (title: string) => void;
}

export function TitleSelection({
  titleIdeas,
  onSelectTitle,
}: TitleSelectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSelectCard = (id: string, title: string) => {
    setSelectedId(id);
    setCustomTitle(title);
    setShowCustomInput(false);
    setShowConfirmModal(true);
  };

  const handleCustomTitle = () => {
    setShowCustomInput(true);
    setSelectedId("custom");
  };

  const handleContinue = () => {
    if (selectedId && customTitle) {
      onSelectTitle(customTitle);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4 py-12">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 backdrop-blur-sm rounded-full mb-4 border border-green-500/30">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">
                  10 Ide Judul Berhasil Dibuat!
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Pilih Judul{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Favorit Anda
                </span>
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                AI kami telah menganalisis tren penelitian terbaru dan
                menghasilkan 10 ide judul yang relevan dengan bidang studi Anda
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            {titleIdeas.map((idea, index) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <button
                  onClick={() => handleSelectCard(idea.id, idea.title)}
                  className={`
                  w-full h-full p-6 rounded-2xl text-left transition-all
                  border-2 backdrop-blur-sm
                  ${
                    selectedId === idea.id
                      ? "border-cyan-400 bg-cyan-500/20 scale-[1.02]"
                      : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                  }
                  active:scale-[0.98]
                `}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold text-white/50 px-2 py-1 bg-white/10 rounded-full">
                      Ide #{index + 1}
                    </span>
                    {selectedId === idea.id && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-white/90">
                    {idea.title}
                  </p>
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Edit3 className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Atau Gunakan Judul Sendiri
                  </h3>
                  <p className="text-sm text-white/50 mb-4">
                    Jika Anda sudah memiliki ide judul, masukkan di bawah ini
                  </p>
                  {showCustomInput && (
                    <Input
                      placeholder="Masukkan judul skripsi Anda..."
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-cyan-400"
                      autoFocus
                    />
                  )}
                  {!showCustomInput && (
                    <Button
                      variant="outline"
                      onClick={handleCustomTitle}
                      className="rounded-full border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Tulis Judul Sendiri
                    </Button>
                  )}
                </div>
              </div>

              {showCustomInput && customTitle && (
                <Button
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full h-14 text-lg font-bold rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white shadow-2xl shadow-purple-500/30 active:scale-[0.98] transition-all"
                >
                  Lanjutkan dengan Judul Ini
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Confirmation Modal */}
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent className="max-w-lg bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-white/20 text-white">
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center py-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400 to-cyan-400 flex items-center justify-center"
              >
                <ThumbsUp className="w-10 h-10 text-white" />
              </motion.div>

              <h3 className="text-2xl font-bold mb-2">
                Pilihan yang Cerdas! 🎯
              </h3>
              <p className="text-white/60 mb-4">
                Judul ini memiliki potensi tinggi untuk disetujui dosen
                pembimbing.
              </p>

              <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
                <p className="text-sm text-white/50 mb-2">
                  Judul yang Anda pilih:
                </p>
                <p className="text-white font-medium leading-relaxed">
                  {customTitle}
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl p-4 mb-6 border border-orange-500/30">
                <p className="text-orange-400 font-semibold mb-1">
                  🔥 PROMO KUOTA TERBATAS
                </p>
                <p className="text-white/80 text-sm">
                  Ingin AI kami menuliskan draf lengkap{" "}
                  <span className="font-bold">Bab 1 sampai Bab 5</span>{" "}
                  berdasarkan judul ini?
                </p>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-white">
                    Rp 399.000
                  </span>
                  <span className="text-white/50 line-through ml-2">
                    Rp 1.200.000
                  </span>
                </div>
              </div>

              <Button
                onClick={handleContinue}
                className="w-full h-14 text-lg font-bold rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white shadow-2xl active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Mulai Tulis Skripsi Saya Sekarang
              </Button>

              <button
                onClick={handleCloseModal}
                className="mt-4 text-white/40 hover:text-white/70 text-sm transition-colors"
              >
                Pilih judul lain
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </>
  );
}
