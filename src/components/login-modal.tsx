import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, AlertCircle, LogIn, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userId: string) => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email dan password harus diisi");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          throw new Error("Email atau password salah");
        }
        throw signInError;
      }

      if (data.user) {
        toast.success("Login berhasil!", {
          description: "Selamat datang kembali di SkripsiCepat.",
        });
        onSuccess(data.user.id);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Gagal login. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Masukkan email Anda");
      return;
    }

    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}?reset=true`,
      });

      if (resetError) {
        throw resetError;
      }

      setResetEmailSent(true);
      toast.success("Email reset password terkirim!", {
        description: "Cek inbox email Anda untuk melanjutkan.",
      });
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError(err.message || "Gagal mengirim email reset. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError(null);
    setForgotPasswordMode(false);
    setResetEmailSent(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#1a1635] to-[#2d2460] border-purple-500/20 text-white p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-b border-cyan-500/30 p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/20 rounded-full mb-4"
          >
            <BookOpen className="w-10 h-10 text-cyan-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {forgotPasswordMode ? "Reset Password" : "Selamat Datang Kembali"}
          </h2>
          <p className="text-white/70 text-sm">
            {forgotPasswordMode
              ? "Masukkan email untuk reset password"
              : "Login untuk melanjutkan penulisan skripsi"}
          </p>
        </div>

        {resetEmailSent ? (
          <div className="p-6 text-center">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-4">
              <Mail className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Email Terkirim!
              </h3>
              <p className="text-white/60 text-sm">
                Kami telah mengirim link reset password ke <strong>{email}</strong>.
                Cek inbox atau folder spam Anda.
              </p>
            </div>
            <Button
              onClick={() => {
                setForgotPasswordMode(false);
                setResetEmailSent(false);
              }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Kembali ke Login
            </Button>
          </div>
        ) : forgotPasswordMode ? (
          <form onSubmit={handleForgotPassword} className="p-6 space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label className="text-white/80 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                autoFocus
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-6 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Mengirim...
                  </div>
                ) : (
                  "Kirim Link Reset"
                )}
              </Button>

              <button
                type="button"
                onClick={() => setForgotPasswordMode(false)}
                className="w-full text-white/50 hover:text-white/70 text-sm py-2 transition-colors"
              >
                Kembali ke Login
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="p-6 space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label className="text-white/80 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                autoFocus
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-white/80 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password link */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => setForgotPasswordMode(true)}
                className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
              >
                Lupa password?
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-6 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Masuk
                  </div>
                )}
              </Button>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-white/50 hover:text-white/70 text-sm py-2 transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
