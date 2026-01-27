import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, RefreshCw, Shield, Clock } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Syarat & Ketentuan
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-white/80">
            {/* Tujuan Layanan */}
            <section>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Tujuan Layanan
                  </h3>
                  <p className="leading-relaxed">
                    SkripsiCepat adalah platform pembuatan draf akademik berupa
                    draft skripsi berbasis AI. Draft hasil penulisan harus
                    ditelaah kembali oleh pengguna sebelum diajukan ke instansi
                    pendidikan.
                  </p>
                  <p className="leading-relaxed mt-2 text-yellow-400/90 text-sm">
                    ⚠️ Pengguna bertanggung jawab penuh atas konten yang
                    diajukan kepada institusi pendidikan.
                  </p>
                </div>
              </div>
            </section>

            {/* Masa Aktif Berlangganan */}
            <section className="pt-4 border-t border-white/10">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Masa Aktif Berlangganan
                  </h3>
                  <p className="leading-relaxed">
                    Akses layanan SkripsiCepat berlaku{" "}
                    <strong className="text-white">
                      selama 30 hari kalender sejak pembayaran diverifikasi
                    </strong>
                    .
                  </p>
                  <ul className="list-disc list-inside mt-3 space-y-1 text-sm">
                    <li>
                      Setelah 30 hari, akses ke fitur penulisan dan revisi akan terkunci otomatis
                    </li>
                    <li>
                      Perpanjangan akses setelah 30 hari memerlukan pembayaran ulang sebesar Rp 399.000
                    </li>
                    <li>
                      Anda akan menerima email pengingat 3 hari sebelum masa aktif berakhir
                    </li>
                    <li>
                      Draft yang telah dibuat tetap tersimpan dan dapat diakses kembali setelah perpanjangan
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Batasan Revisi */}
            <section className="pt-4 border-t border-white/10">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Batasan Revisi
                  </h3>
                  <p className="leading-relaxed">
                    Pengguna berhak mendapatkan{" "}
                    <strong className="text-white">
                      maksimal 5 kali revisi per bab
                    </strong>
                    . Revisi dimaksudkan untuk menyempurnakan draft skripsi agar
                    sesuai kebutuhan pengguna.
                  </p>
                  <ul className="list-disc list-inside mt-3 space-y-1 text-sm">
                    <li>Setiap revisi akan mengurangi kuota yang tersedia</li>
                    <li>Revisi harus disertai instruksi yang jelas</li>
                    <li>
                      Kuota revisi yang telah habis dapat diisi ulang melalui{" "}
                      <strong className="text-white">fitur top-up</strong> di dalam aplikasi (Rp 99.000 untuk +5 revisi tambahan)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Kebijakan Pengembalian Dana */}
            <section className="pt-4 border-t border-white/10">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Kebijakan Pengembalian Dana (Refund Policy)
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-green-400 mb-1">
                        ✓ Pengembalian Dana Dapat Dilakukan Jika:
                      </h4>
                      <p className="leading-relaxed text-sm">
                        Terjadi{" "}
                        <strong className="text-white">
                          kegagalan sistem permanen
                        </strong>{" "}
                        yang menyebabkan draf tidak dapat di-generate sama
                        sekali setelah pembayaran berhasil diverifikasi.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-red-400 mb-1">
                        ✗ Pengembalian Dana TIDAK Dapat Dilakukan Jika:
                      </h4>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>
                          Pembayaran telah diverifikasi oleh Midtrans dan{" "}
                          <strong className="text-white">
                            proses penulisan AI sudah dimulai
                          </strong>{" "}
                          atau konten bab sudah ditampilkan kepada pengguna
                        </li>
                        <li>
                          <strong className="text-white">
                            Ketidaksesuaian gaya bahasa
                          </strong>{" "}
                          atau perbedaan pendapat subjektif mengenai kualitas
                          tulisan, mengingat pengguna memiliki kuota revisi
                          untuk menyesuaikan konten
                        </li>
                        <li>
                          Pengguna telah menggunakan seluruh atau sebagian fitur
                          revisi
                        </li>
                        <li>Pengguna telah mengunduh file hasil skripsi</li>
                      </ul>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-4">
                      <p className="text-sm leading-relaxed">
                        <strong className="text-white">Catatan Penting:</strong>{" "}
                        SkripsiCepat menyediakan 5 kali revisi per bab untuk
                        memastikan Anda puas dengan hasil. Mohon gunakan fitur
                        revisi dengan bijak agar diperoleh hasil penulisan yang
                        maksimal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Cara Mengajukan Refund */}
            <section className="pt-4 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-3">
                Cara Mengajukan Pengembalian Dana
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Hubungi tim support melalui email:{" "}
                  <strong className="text-cyan-400">
                    skripsicepat2@gmail.com
                  </strong>
                </li>
                <li>Sertakan bukti pembayaran dan deskripsi masalah teknis</li>
                <li>Tim kami akan merespons dalam waktu 1-3 hari kerja</li>
                <li>
                  Jika memenuhi syarat, pengembalian dana akan diproses dalam
                  7-14 hari kerja
                </li>
              </ol>
            </section>

            {/* Persetujuan */}
            <section className="pt-4 border-t border-white/10">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-4">
                <p className="text-sm leading-relaxed text-white/90">
                  Dengan melanjutkan pembayaran, Anda menyetujui seluruh{" "}
                  <strong>Syarat & Ketentuan</strong> yang berlaku di
                  SkripsiCepat, termasuk kebijakan revisi dan kebijakan
                  pengembalian dana yang telah dijelaskan di atas.
                </p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
