import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Clock, Mail, ChevronDown, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

type ProgressLevel = "" | "belum-mulai" | "bab-1" | "bab-2" | "bab-3" | "bab-4";

interface CalculatorResult {
  estimasiHari: number;
  estimasiBulan: number;
  status: "aman" | "rawan" | "telat";
  statusLabel: string;
  statusEmoji: string;
  pesan: string;
}

const progressOptions: { value: ProgressLevel; label: string }[] = [
  { value: "", label: "Pilih progress skripsi..." },
  { value: "belum-mulai", label: "Belum mulai" },
  { value: "bab-1", label: "Bab 1" },
  { value: "bab-2", label: "Bab 2" },
  { value: "bab-3", label: "Bab 3" },
  { value: "bab-4", label: "Bab 4" },
];

const sisaHariMap: Record<string, number> = {
  "belum-mulai": 150,
  "bab-1": 120,
  "bab-2": 90,
  "bab-3": 60,
  "bab-4": 30,
};

function calculateResult(
  progress: ProgressLevel,
  jamPerHari: number,
  targetBulan: number
): CalculatorResult {
  const sisaHari = sisaHariMap[progress] || 150;
  // estimasiHari = sisaHari * 3 / jamPerHari  (basis 3 jam/hari)
  const estimasiHari = (sisaHari * 3) / jamPerHari;
  const estimasiBulan = estimasiHari / 30;

  let status: "aman" | "rawan" | "telat";
  let statusLabel: string;
  let statusEmoji: string;
  let pesan: string;

  if (estimasiBulan <= targetBulan) {
    status = "aman";
    statusLabel = "Aman";
    statusEmoji = "✅";
    pesan = "Kamu masih on track! Tapi jangan sampai lengah. Konsistensi adalah kunci keberhasilan skripsi.";
  } else if (estimasiBulan <= targetBulan + 1) {
    status = "rawan";
    statusLabel = "Rawan Telat";
    statusEmoji = "⚠️";
    pesan = "Waktumu sangat tipis! Banyak mahasiswa gagal di titik ini karena kurang strategi. Kamu butuh percepatan sekarang.";
  } else {
    status = "telat";
    statusLabel = "Hampir Pasti Telat";
    statusEmoji = "🚨";
    pesan = "Kalau cara pengerjaan tidak berubah, wisuda bisa tertunda. Kamu butuh bantuan sekarang juga!";
  }

  return { estimasiHari, estimasiBulan, status, statusLabel, statusEmoji, pesan };
}

export function SkripsiCalculator() {
  const [progress, setProgress] = useState<ProgressLevel>("");
  const [jamPerHari, setJamPerHari] = useState<string>("");
  const [targetBulan, setTargetBulan] = useState<string>("");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!progress) newErrors.progress = "Pilih progress skripsi";
    if (!jamPerHari || Number(jamPerHari) <= 0) newErrors.jamPerHari = "Masukkan jam per hari";
    if (!targetBulan || Number(targetBulan) <= 0) newErrors.targetBulan = "Masukkan target bulan";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateResult(progress, Number(jamPerHari), Number(targetBulan));
    setResult(res);
  };

  const statusColors = {
    aman: {
      bg: "from-emerald-500/20 to-green-500/20",
      border: "border-emerald-500/40",
      text: "text-emerald-400",
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-400" />,
      glow: "shadow-emerald-500/20",
    },
    rawan: {
      bg: "from-amber-500/20 to-yellow-500/20",
      border: "border-amber-500/40",
      text: "text-amber-400",
      icon: <AlertTriangle className="w-8 h-8 text-amber-400" />,
      glow: "shadow-amber-500/20",
    },
    telat: {
      bg: "from-red-500/20 to-rose-500/20",
      border: "border-red-500/40",
      text: "text-red-400",
      icon: <XCircle className="w-8 h-8 text-red-400" />,
      glow: "shadow-red-500/20",
    },
  };

  return (
    <section className="relative px-4 py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Glow behind card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20" />

          <div className="relative bg-white/[0.07] backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-8 pb-4 md:px-8 md:pt-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/15 border border-green-500/30 rounded-full mb-4">
                <Calculator className="w-4 h-4 text-green-400" />
                <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">
                  Gratis & hanya 30 detik
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                Kapan Kamu Lulus{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Skripsi?
                </span>
              </h2>
              <p className="text-white/60 text-base md:text-lg">
                Cek dalam 30 detik. Jangan sampai telat lulus.
              </p>
            </div>

            {/* Form */}
            <div className="px-6 pb-8 md:px-8 space-y-5">
              {/* Progress Skripsi */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">
                  Progress Skripsi
                </label>
                <div className="relative">
                  <select
                    value={progress}
                    onChange={(e) => {
                      setProgress(e.target.value as ProgressLevel);
                      setErrors((prev) => ({ ...prev, progress: "" }));
                    }}
                    className={`w-full appearance-none bg-white/[0.06] border ${
                      errors.progress ? "border-red-500/60" : "border-white/15"
                    } rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all cursor-pointer`}
                  >
                    {progressOptions.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        className="bg-[#1a1a2e] text-white"
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                </div>
                {errors.progress && (
                  <p className="text-red-400 text-xs mt-1">{errors.progress}</p>
                )}
              </div>

              {/* Jam per hari & Target bulan side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5">
                    Jam mengerjakan per hari
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={jamPerHari}
                      onChange={(e) => {
                        setJamPerHari(e.target.value);
                        setErrors((prev) => ({ ...prev, jamPerHari: "" }));
                      }}
                      placeholder="contoh: 3"
                      className={`w-full bg-white/[0.06] border ${
                        errors.jamPerHari ? "border-red-500/60" : "border-white/15"
                      } rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all`}
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  </div>
                  {errors.jamPerHari && (
                    <p className="text-red-400 text-xs mt-1">{errors.jamPerHari}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5">
                    Target sidang (bulan)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="36"
                    value={targetBulan}
                    onChange={(e) => {
                      setTargetBulan(e.target.value);
                      setErrors((prev) => ({ ...prev, targetBulan: "" }));
                    }}
                    placeholder="contoh: 6"
                    className={`w-full bg-white/[0.06] border ${
                      errors.targetBulan ? "border-red-500/60" : "border-white/15"
                    } rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all`}
                  />
                  {errors.targetBulan && (
                    <p className="text-red-400 text-xs mt-1">{errors.targetBulan}</p>
                  )}
                </div>
              </div>

              {/* Calculate Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleCalculate}
                className="w-full py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 shadow-lg shadow-green-500/25 transition-all active:shadow-md"
              >
                <Calculator className="w-5 h-5 inline-block mr-2 -mt-0.5" />
                Hitung Sekarang
              </motion.button>

              {/* Result */}
              <AnimatePresence mode="wait">
                {result && (
                  <motion.div
                    key={result.status}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`bg-gradient-to-br ${statusColors[result.status].bg} border ${statusColors[result.status].border} rounded-2xl p-5 md:p-6 shadow-xl ${statusColors[result.status].glow}`}
                  >
                    {/* Status badge */}
                    <div className="flex items-center gap-3 mb-4">
                      {statusColors[result.status].icon}
                      <div>
                        <p className={`text-xl font-bold ${statusColors[result.status].text}`}>
                          {result.statusEmoji} {result.statusLabel}
                        </p>
                        <p className="text-white/50 text-sm">Hasil analisis skripsimu</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white/[0.05] rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-white">
                          {result.estimasiBulan.toFixed(1)}
                        </p>
                        <p className="text-white/50 text-xs mt-0.5">Estimasi Bulan</p>
                      </div>
                      <div className="bg-white/[0.05] rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-white">
                          {Math.round(result.estimasiHari)}
                        </p>
                        <p className="text-white/50 text-xs mt-0.5">Estimasi Hari</p>
                      </div>
                    </div>

                    {/* Emotional message */}
                    <p className="text-white/70 text-sm leading-relaxed mb-5 italic">
                      "{result.pesan}"
                    </p>

                    {/* CTA */}
                    <a
                      href="mailto:skripsicepat2@gmail.com?subject=Konsultasi%20Skripsi%20Gratis&body=Halo%20SkripsiCepat,%20saya%20ingin%20konsultasi%20tentang%20skripsi%20saya."
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 shadow-lg shadow-purple-500/20 transition-all"
                    >
                      <Mail className="w-5 h-5" />
                      🚀 Konsultasi Gratis via Email
                    </a>
                    <p className="text-center text-white/40 text-xs mt-2">
                      Banyak mahasiswa terlambat karena kurang strategi. Jangan jadi salah satunya.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
