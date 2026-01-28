import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  Download,
  Loader2,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { Chapter, ChapterContent, Subscription } from "@/types/app";
import { motion } from "framer-motion";
import { SubscriptionWarning } from "./subscription-warning";
import { RevisionQuotaModal } from "./revision-quota-modal";

interface ChapterWorkspaceProps {
  chapters: Record<Chapter, ChapterContent>;
  currentChapter: Chapter;
  selectedTitle: string;
  isGenerating: boolean;
  subscription?: Subscription;
  onStartChapter: (chapter: Chapter) => void;
  onCompleteChapter: (chapter: Chapter) => void;
  onReviseChapter: (chapter: Chapter, feedback: string) => void;
  onDownload: () => void;
  onRenewSubscription: () => void;
  onPurchaseRevisions: (chapter: Chapter) => void;
}

const CHAPTER_ORDER: Chapter[] = [
  "bab-1",
  "bab-2",
  "bab-3",
  "bab-4",
  "bab-5",
  "daftar-pustaka",
];

const CHAPTER_LABELS: Record<Chapter, string> = {
  "bab-1": "Bab 1: Pendahuluan",
  "bab-2": "Bab 2: Tinjauan Pustaka",
  "bab-3": "Bab 3: Metodologi Penelitian",
  "bab-4": "Bab 4: Hasil dan Pembahasan",
  "bab-5": "Bab 5: Kesimpulan dan Saran",
  "daftar-pustaka": "Daftar Pustaka",
};

export function ChapterWorkspace({
  chapters,
  currentChapter,
  selectedTitle,
  isGenerating,
  subscription,
  onStartChapter,
  onCompleteChapter,
  onReviseChapter,
  onDownload,
  onRenewSubscription,
  onPurchaseRevisions,
}: ChapterWorkspaceProps) {
  const [revisionFeedback, setRevisionFeedback] = useState<
    Record<Chapter, string>
  >({
    "bab-1": "",
    "bab-2": "",
    "bab-3": "",
    "bab-4": "",
    "bab-5": "",
    "daftar-pustaka": "",
  });
  const [showRevisionQuotaModal, setShowRevisionQuotaModal] = useState(false);
  const [selectedChapterForTopup, setSelectedChapterForTopup] =
    useState<Chapter | null>(null);

  const completedCount = CHAPTER_ORDER.filter(
    (ch) => chapters[ch].isComplete,
  ).length;
  const progressPercent = (completedCount / CHAPTER_ORDER.length) * 100;
  const allChaptersComplete = completedCount === CHAPTER_ORDER.length;

  const isSubscriptionExpired =
    subscription &&
    (subscription.status === "expired" ||
      new Date(subscription.expiryDate) < new Date());

  const handleRevise = (chapter: Chapter) => {
    const chapterData = chapters[chapter];

    if (chapterData.revisionsRemaining === 0) {
      setSelectedChapterForTopup(chapter);
      setShowRevisionQuotaModal(true);
      return;
    }

    if (revisionFeedback[chapter].trim()) {
      onReviseChapter(chapter, revisionFeedback[chapter]);
      setRevisionFeedback({ ...revisionFeedback, [chapter]: "" });
    }
  };

  const handlePurchaseRevisions = () => {
    if (selectedChapterForTopup) {
      onPurchaseRevisions(selectedChapterForTopup);
      setShowRevisionQuotaModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      {/* Header with Progress */}
      <div className="sticky top-0 z-10 bg-[#0f0c29]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
              {selectedTitle}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-white/60 whitespace-nowrap">
                {completedCount}/{CHAPTER_ORDER.length} Selesai
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {subscription && (
          <SubscriptionWarning
            subscription={subscription}
            onRenew={onRenewSubscription}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Timeline Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-2">
              {CHAPTER_ORDER.map((chapter, index) => {
                const chapterData = chapters[chapter];
                const isActive = currentChapter === chapter;
                const isUnlocked =
                  index === 0 || chapters[CHAPTER_ORDER[index - 1]].isComplete;

                return (
                  <motion.button
                    key={chapter}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => isUnlocked && onStartChapter(chapter)}
                    disabled={!isUnlocked}
                    className={`
                      w-full text-left p-4 rounded-2xl transition-all border
                      ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/30 border-transparent"
                          : chapterData.isComplete
                            ? "bg-green-500/10 border-green-500/30"
                            : isUnlocked
                              ? "bg-white/5 border-white/10 hover:border-white/30"
                              : "bg-white/5 border-white/5 opacity-40 cursor-not-allowed"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                        ${
                          isActive
                            ? "bg-white text-purple-600"
                            : chapterData.isComplete
                              ? "bg-green-500 text-white"
                              : "bg-white/10 text-white/60"
                        }
                      `}
                      >
                        {chapterData.isComplete ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm font-semibold truncate ${
                            isActive
                              ? "text-white"
                              : chapterData.isComplete
                                ? "text-green-400"
                                : "text-white/80"
                          }`}
                        >
                          {CHAPTER_LABELS[chapter]}
                        </div>
                        {chapterData.content && !chapterData.isComplete && (
                          <div
                            className={`text-xs ${
                              isActive ? "text-white/70" : "text-white/40"
                            }`}
                          >
                            Dalam proses
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {currentChapter && (
              <ChapterEditor
                chapter={currentChapter}
                chapterData={chapters[currentChapter]}
                isGenerating={isGenerating}
                isSubscriptionExpired={isSubscriptionExpired || false}
                revisionFeedback={revisionFeedback[currentChapter]}
                onRevisionFeedbackChange={(value) =>
                  setRevisionFeedback({
                    ...revisionFeedback,
                    [currentChapter]: value,
                  })
                }
                onStartGeneration={() => onStartChapter(currentChapter)}
                onComplete={() => onCompleteChapter(currentChapter)}
                onRevise={() => handleRevise(currentChapter)}
                onOpenRevisionPurchase={() => {
                  setSelectedChapterForTopup(currentChapter);
                  setShowRevisionQuotaModal(true);
                }}
              />
            )}

            {allChaptersComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-3xl p-8 text-center border-2 border-green-500/30"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-cyan-400 mx-auto mb-4 flex items-center justify-center shadow-xl shadow-green-500/30">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  🎉 Selamat! Skripsi Anda Selesai
                </h3>
                <p className="text-white/60 mb-6 max-w-md mx-auto">
                  Semua bab telah selesai ditulis. Klik tombol di bawah untuk
                  mengunduh skripsi Anda.
                </p>
                <Button
                  onClick={onDownload}
                  size="lg"
                  className="h-16 px-8 text-lg font-bold rounded-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-white active:scale-[0.98] transition-all shadow-xl shadow-green-500/30"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Skripsi (.docx)
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <RevisionQuotaModal
        isOpen={showRevisionQuotaModal}
        onClose={() => setShowRevisionQuotaModal(false)}
        onPurchase={handlePurchaseRevisions}
        chapterName={
          selectedChapterForTopup ? CHAPTER_LABELS[selectedChapterForTopup] : ""
        }
      />
    </div>
  );
}

interface ChapterEditorProps {
  chapter: Chapter;
  chapterData: ChapterContent;
  isGenerating: boolean;
  isSubscriptionExpired: boolean;
  revisionFeedback: string;
  onRevisionFeedbackChange: (value: string) => void;
  onStartGeneration: () => void;
  onComplete: () => void;
  onRevise: () => void;
  onOpenRevisionPurchase: () => void;
}

function ChapterEditor({
  chapter,
  chapterData,
  isGenerating,
  isSubscriptionExpired,
  revisionFeedback,
  onRevisionFeedbackChange,
  onStartGeneration,
  onComplete,
  onRevise,
  onOpenRevisionPurchase,
}: ChapterEditorProps) {
  const isRevisionDisabled = chapterData.revisionsRemaining === 0;
  const canSubmitRevision =
    revisionFeedback.trim() &&
    !isGenerating &&
    !isSubscriptionExpired &&
    !isRevisionDisabled;

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/10">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          {CHAPTER_LABELS[chapter]}
        </h2>

        {!chapterData.content && !isGenerating && (
          <div className="text-center py-12">
            <p className="text-white/50 mb-6">
              Klik tombol di bawah untuk mulai menghasilkan konten bab ini
            </p>
            <Button
              onClick={(e) => {
                e.preventDefault();
                onStartGeneration();
              }}
              disabled={isSubscriptionExpired}
              size="lg"
              className="h-14 px-8 text-lg font-bold rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white shadow-xl shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 mr-2" />
              {isSubscriptionExpired
                ? "Berlangganan Habis"
                : `Mulai ${CHAPTER_LABELS[chapter]}`}
            </Button>
          </div>
        )}

        {isGenerating && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-cyan-400" />
            <p className="text-lg font-semibold text-white mb-2">
              Memproses permintaan...
            </p>
            <p className="text-sm text-white/50">
              Sedang menulis {CHAPTER_LABELS[chapter]} untuk Anda
            </p>
          </div>
        )}

        {chapterData.content && !isGenerating && (
          <div className="space-y-6">
            <div className="prose prose-sm max-w-none bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="whitespace-pre-wrap text-white/90 leading-relaxed text-sm md:text-base">
                {chapterData.content}
              </div>
            </div>

            {/* Revision Panel - Always visible below content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-5 border border-white/10 shadow-inner"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-base font-semibold text-white">
                    Panel Revisi Mandiri
                  </h4>
                </div>
                <div
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    isRevisionDisabled
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  }`}
                >
                  Sisa kuota revisi: {chapterData.revisionsRemaining}/5
                </div>
              </div>

              {isRevisionDisabled ? (
                <div className="space-y-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <p className="text-sm text-red-400 font-medium mb-1">
                      ⚠️ Kuota revisi untuk bagian ini telah habis
                    </p>
                    <p className="text-xs text-white/50">
                      Anda dapat membeli tambahan kuota revisi untuk melanjutkan
                      revisi pada {CHAPTER_LABELS[chapter]}.
                    </p>
                  </div>
                  <Button
                    onClick={onOpenRevisionPurchase}
                    className="w-full h-11 font-bold rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Beli Tambahan Revisi (Rp 399.000)
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-white/50 mb-3">
                    {chapter === "daftar-pustaka"
                      ? "Masukkan instruksi untuk memperbaiki format atau menambah referensi yang tertinggal. Referensi yang sudah ada di bab sebelumnya akan dipertahankan."
                      : "Masukkan instruksi revisi spesifik. AI akan mempertahankan referensi ilmiah yang sudah digunakan dan menjaga konsistensi dengan bab lainnya."}
                  </p>
                  <Textarea
                    placeholder={
                      chapter === "daftar-pustaka"
                        ? "Contoh: Perbaiki format APA pada referensi nomor 5, 12, dan 18. Tambahkan juga referensi untuk teori X yang disebutkan di Bab 2..."
                        : "Contoh: Tolong tambahkan lebih banyak teori tentang... atau Perbaiki bagian metodologi dengan penjelasan lebih detail tentang..."
                    }
                    value={revisionFeedback}
                    onChange={(e) => onRevisionFeedbackChange(e.target.value)}
                    disabled={isSubscriptionExpired}
                    className="min-h-[100px] mb-4 bg-white/5 border-white/10 text-white placeholder:text-white/30 disabled:opacity-50"
                  />
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        onRevise();
                      }}
                      disabled={!canSubmitRevision}
                      className="flex-1 h-11 font-bold rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Merevisi...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Revisi Sekarang
                        </>
                      )}
                    </Button>
                  </div>
                  {isSubscriptionExpired && (
                    <p className="text-xs text-amber-400 mt-3">
                      ⚠️ Berlangganan Anda telah habis. Perbarui untuk melakukan
                      revisi.
                    </p>
                  )}
                </>
              )}
            </motion.div>

            {/* Complete Button */}
            {!chapterData.isComplete && (
              <div className="pt-2 pb-8">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    onComplete();
                  }}
                  disabled={isSubscriptionExpired}
                  className="w-full h-12 font-bold rounded-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Selesai & Lanjut ke Bab Berikutnya
                </Button>
              </div>
            )}

            {chapterData.isComplete && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-sm font-semibold text-green-400">
                  Bab ini telah selesai
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
