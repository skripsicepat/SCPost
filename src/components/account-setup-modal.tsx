import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CheckCircle2, Lock, Mail, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface AccountSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onSuccess: () => void;
}

export function AccountSetupModal({
  isOpen,
  onClose,
  email,
  onSuccess,
}: AccountSetupModalProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordRequirements = [
    { met: password.length >= 8, text: "Minimal 8 karakter" },
    { met: /[A-Z]/.test(password), text: "Minimal 1 huruf kapital" },
    { met: /[0-9]/.test(password), text: "Minimal 1 angka" },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.met);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!allRequirementsMet) {
      setError("Password tidak memenuhi persyaratan");
      return;
    }

    if (!passwordsMatch) {
      setError("Password tidak cocok");
      return;
    }

    setIsLoading(true);

    try {
      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      toast.success("Akun berhasil dibuat!", {
        description: "Anda dapat login kapan saja dengan email dan password ini.",
      });

      onSuccess();
    } catch (err: any) {
      console.error("Error updating password:", err);
      setError(err.message || "Gagal menyimpan password. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    toast.warning("Anda melewati pembuatan password", {
      description: "Perhatian: Anda mungkin tidak dapat mengakses akun ini lagi setelah menutup browser.",
      duration: 6000,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#1a1635] to-[#2d2460] border-purple-500/20 text-white p-0 overflow-hidden">
        {/* Header with celebration */}
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-b border-green-500/30 p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4"
          >
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Pembayaran Berhasil! 🎉
          </h2>
          <p className="text-white/70 text-sm">
            Sekarang buat password untuk akses 30 hari
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label className="text-white/80 text-sm flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Anda
            </Label>
            <Input
              type="email"
              value={email}
              disabled
              className="bg-white/5 border-white/10 text-white/60"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label className="text-white/80 text-sm flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Buat Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password requirements */}
            <div className="space-y-1 mt-2">
              {passwordRequirements.map((req, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 text-xs ${
                    req.met ? "text-green-400" : "text-white/40"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      req.met ? "bg-green-500/20" : "bg-white/10"
                    }`}
                  >
                    {req.met && <CheckCircle2 className="w-3 h-3" />}
                  </div>
                  {req.text}
                </div>
              ))}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label className="text-white/80 text-sm">Konfirmasi Password</Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password Anda"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && (
              <p
                className={`text-xs ${
                  passwordsMatch ? "text-green-400" : "text-red-400"
                }`}
              >
                {passwordsMatch ? "✓ Password cocok" : "✗ Password tidak cocok"}
              </p>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Info box */}
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
            <p className="text-cyan-300 text-sm">
              <strong>Mengapa ini penting?</strong>
            </p>
            <p className="text-white/60 text-xs mt-1">
              Dengan membuat password, Anda dapat:
            </p>
            <ul className="text-white/60 text-xs mt-1 space-y-1 list-disc list-inside">
              <li>Login kembali kapan saja dalam 30 hari</li>
              <li>Melanjutkan penulisan dari device manapun</li>
              <li>Melakukan revisi kapan saja Anda mau</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              type="submit"
              disabled={!allRequirementsMet || !passwordsMatch || isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-6 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </div>
              ) : (
                "Simpan & Mulai Menulis"
              )}
            </Button>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full text-white/50 hover:text-white/70 text-sm py-2 transition-colors"
            >
              Lewati untuk sekarang (tidak disarankan)
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
