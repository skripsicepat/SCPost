import { useState } from "react";
import { Mail, FileCheck } from "lucide-react";
import { TermsModal } from "./terms-modal";

export function Footer() {
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <>
      <footer className="px-4 py-10 border-t border-white/10 bg-white/5">
        <div className="max-w-6xl mx-auto">
          {/* Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-white font-bold text-xl mb-2">
                SkripsiCepat
              </h3>
              <p className="text-white/60 text-sm">
                Asisten Penulisan Skripsi untuk Mahasiswa Indonesia
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-3">Informasi</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setIsTermsOpen(true)}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm group"
                >
                  <FileCheck className="w-4 h-4 group-hover:text-cyan-400" />
                  Syarat & Ketentuan
                </button>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-3">Hubungi Kami</h4>
              <a
                href="mailto:skripsicepat2@gmail.com"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm group"
              >
                <Mail className="w-4 h-4 group-hover:text-cyan-400" />
                <span className="group-hover:text-cyan-400">skripsicepat</span>
              </a>
              <p className="text-white/40 text-xs mt-2">
                Kami siap membantu Anda
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pt-6 border-t border-white/10">
            <p className="text-white/40 text-sm">
              © 2025 SkripsiCepat. Semua Hak Dilindungi.
            </p>
          </div>
        </div>
      </footer>

      {/* Terms Modal */}
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </>
  );
}
