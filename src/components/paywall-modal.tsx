import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Check,
  Shield,
  Clock,
  FileText,
  Sparkles,
  CreditCard,
  Smartphone,
  Building,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { TermsModal } from "./terms-modal";

interface PaywallModalProps {
  isOpen: boolean;
  onProceedToPayment: () => Promise<void>;
  selectedTitle: string;
  isProcessing?: boolean;
}

export function PaywallModal({
  isOpen,
  onProceedToPayment,
  selectedTitle,
  isProcessing = false,
}: PaywallModalProps) {
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-white/20 text-white p-0">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 py-3 px-6 text-center">
            <p className="text-white font-semibold text-sm">
              🔥 PROMO KUOTA TERBATAS — Jangan Kehabisan!
            </p>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">
                Lanjutkan Penulisan{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Skripsi
                </span>
              </h2>
              <p className="text-white/60">
                Dapatkan akses penuh untuk menulis 5 bab skripsi secara lengkap.
              </p>
            </div>

            {/* Selected Title Display */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-4">
              <p className="text-xs font-semibold text-cyan-400 mb-2">
                JUDUL SKRIPSI ANDA
              </p>
              <p className="text-sm text-white/90 leading-relaxed">
                {selectedTitle}
              </p>
            </div>

            {/* Pricing */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="text-center py-6 bg-white/5 rounded-3xl border border-white/10"
            >
              <div className="mb-4">
                <div className="text-xl text-white/40 line-through">
                  Rp 1.200.000
                </div>
                <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent my-2">
                  Rp 399.000
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full border border-orange-500/30">
                  <span className="text-sm font-semibold text-orange-400">
                    Hemat 67% — Penawaran Terbatas
                  </span>
                </div>
              </div>
              <p className="text-sm text-white/50">
                Pembayaran satu kali, akses penuh selama 30 hari.
              </p>
            </motion.div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FeatureItem
                icon={<FileText className="w-5 h-5" />}
                title="5 Bab Lengkap + Daftar Pustaka"
                description="Dari Bab 1 hingga Bab 5 dengan referensi"
                gradient="from-cyan-500 to-blue-500"
              />
              <FeatureItem
                icon={<Sparkles className="w-5 h-5" />}
                title="5 Revisi Per Bab"
                description="Sempurnakan setiap bab sesuai kebutuhan"
                gradient="from-purple-500 to-pink-500"
              />
              <FeatureItem
                icon={<Clock className="w-5 h-5" />}
                title="Proses Super Cepat"
                description="Setiap bab dihasilkan dalam hitungan menit"
                gradient="from-orange-500 to-yellow-500"
              />
              <FeatureItem
                icon={<Shield className="w-5 h-5" />}
                title="Akses penuh selama 30 hari."
                description="Download dan edit kapan saja"
                gradient="from-green-500 to-cyan-500"
              />
            </div>

            {/* Payment Methods */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-xs font-semibold text-white/50 mb-3 text-center">
                METODE PEMBAYARAN TERSEDIA
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Smartphone className="w-4 h-4" />
                  <span>QRIS / Gopay / ShopeePay</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Building className="w-4 h-4" />
                  <span>Transfer Bank / VA</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <CreditCard className="w-4 h-4" />
                  <span>Kartu Kredit/Debit</span>
                </div>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="bg-white/5 rounded-2xl p-4 space-y-3 border border-white/10">
              <TrustSignal text="Berbasis AI terbaru dengan referensi akademik" />
              <TrustSignal text="Format sesuai standar penulisan skripsi Indonesia" />
              <TrustSignal text="Pembayaran aman melalui Midtrans (PCI DSS Certified)" />
              <TrustSignal text="Sudah dipercaya 500+ mahasiswa di seluruh Indonesia" />
            </div>

            {/* CTA Button */}
            <Button
              onClick={onProceedToPayment}
              disabled={isProcessing}
              className="w-full h-16 text-xl font-bold rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white shadow-2xl shadow-purple-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Membuka Pembayaran...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Bayar & Mulai Menulis Skripsi
                </>
              )}
            </Button>

            <p className="text-xs text-center text-white/40">
              Dengan melanjutkan, Anda menyetujui{" "}
              <button
                onClick={() => setIsTermsOpen(true)}
                className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
              >
                syarat dan ketentuan
              </button>{" "}
              SkripsiCepat
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms Modal */}
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </>
  );
}

function FeatureItem({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}
      >
        <div className="text-white">{icon}</div>
      </div>
      <div>
        <h4 className="font-semibold text-white mb-1">{title}</h4>
        <p className="text-sm text-white/50">{description}</p>
      </div>
    </div>
  );
}

function TrustSignal({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
      <span className="text-sm text-white/70">{text}</span>
    </div>
  );
}
