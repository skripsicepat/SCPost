import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { RefreshCw } from 'lucide-react';

interface RevisionQuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
  chapterName: string;
}

export function RevisionQuotaModal({ isOpen, onClose, onPurchase, chapterName }: RevisionQuotaModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] border-white/10">
        <AlertDialogHeader>
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mb-4 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-white" />
          </div>
          <AlertDialogTitle className="text-2xl font-bold text-white text-center">
            Kuota Revisi Habis
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white/70 text-center">
            Kuota revisi untuk <span className="font-semibold text-white">{chapterName}</span> telah habis.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 my-4">
          <div className="text-center mb-4">
            <p className="text-white/60 text-sm mb-2">Paket Revisi Tambahan</p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-3xl font-bold text-white">Rp 99.000</span>
            </div>
            <p className="text-cyan-400 text-sm mt-1">+5 Revisi Tambahan</p>
          </div>
          
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Berlaku untuk satu bab
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Tidak ada batasan waktu penggunaan
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Langsung aktif setelah pembayaran
            </li>
          </ul>
        </div>

        <AlertDialogFooter className="flex-col sm:flex-row gap-3">
          <AlertDialogCancel className="h-12 rounded-full border-white/20 text-white hover:bg-white/10 w-full sm:w-auto">
            Nanti Saja
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onPurchase}
            className="h-12 px-8 font-bold rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white w-full sm:w-auto"
          >
            Beli Paket Revisi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
