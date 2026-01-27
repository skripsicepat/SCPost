import { AlertCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Subscription } from '@/types/app';

interface SubscriptionWarningProps {
  subscription: Subscription;
  onRenew: () => void;
}

export function SubscriptionWarning({ subscription, onRenew }: SubscriptionWarningProps) {
  const expiryDate = new Date(subscription.expiryDate);
  const now = new Date();
  const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  const isExpired = subscription.status === 'expired' || daysRemaining <= 0;
  const isExpiringSoon = daysRemaining <= 3 && daysRemaining > 0;

  if (!isExpired && !isExpiringSoon) {
    return null;
  }

  if (isExpired) {
    return (
      <Alert className="mb-6 border-red-500/50 bg-red-500/10">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <AlertDescription className="ml-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-semibold text-red-500 mb-1">
                Masa Berlaku Berlangganan Anda Telah Habis
              </p>
              <p className="text-sm text-red-400">
                Silakan perpanjang berlangganan untuk melanjutkan menggunakan fitur penulisan dan revisi.
              </p>
            </div>
            <Button
              onClick={onRenew}
              className="h-11 px-6 font-bold rounded-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white whitespace-nowrap"
            >
              Perpanjang Sekarang
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10">
      <Clock className="h-5 w-5 text-yellow-500" />
      <AlertDescription className="ml-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-semibold text-yellow-500 mb-1">
              Berlangganan Anda Akan Berakhir dalam {daysRemaining} Hari
            </p>
            <p className="text-sm text-yellow-400">
              Perpanjang sekarang untuk tetap mengakses semua fitur tanpa gangguan.
            </p>
          </div>
          <Button
            onClick={onRenew}
            className="h-11 px-6 font-bold rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white whitespace-nowrap"
          >
            Perpanjang Sekarang
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
