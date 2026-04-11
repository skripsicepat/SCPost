import { useState } from "react";
import { Mail, FileCheck, Instagram } from "lucide-react";
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
              <div className="space-y-2">
                <a
                  href="mailto:skripsicepat2@gmail.com"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm group"
                >
                  <Mail className="w-4 h-4 group-hover:text-cyan-400" />
                  <span className="group-hover:text-cyan-400">skripsicepat2@gmail.com</span>
                </a>
                <a
                  href="https://instagram.com/skripsicepat.com_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm group"
                >
                  <Instagram className="w-4 h-4 group-hover:text-pink-400" />
                  <span className="group-hover:text-pink-400">@skripsicepat.com_</span>
                </a>
                <a
                  href="https://tiktok.com/@skripsicepat.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm group"
                >
                  {/* TikTok icon (lucide doesn't have TikTok, using a simple SVG) */}
                  <svg
                    className="w-4 h-4 group-hover:text-white fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z"/>
                  </svg>
                  <span className="group-hover:text-white">@skripsicepat.com</span>
                </a>
                <a
                  href="https://youtube.com/@SkripsiCepat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm group"
                >
                  {/* YouTube icon */}
                  <svg
                    className="w-4 h-4 group-hover:text-red-500 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span className="group-hover:text-red-500">@SkripsiCepat</span>
                </a>
              </div>
              <p className="text-white/40 text-xs mt-3">
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
