# Panduan Setup Midtrans

Dokumen ini menjelaskan cara mengintegrasikan Midtrans dengan SkripsiCepat.

## 1. Registrasi Midtrans

1. Daftar di [Midtrans Dashboard](https://dashboard.midtrans.com/)
2. Pilih mode **Sandbox** untuk testing atau **Production** untuk live
3. Dapatkan credentials dari Settings → Access Keys:
   - **Server Key** (untuk backend)
   - **Client Key** (untuk frontend)

## 2. Konfigurasi Supabase Edge Function

### 2.1 Set Environment Variables di Supabase

Masuk ke Supabase Dashboard → **Project Settings** → **Edge Functions** → **Add secret**:

1. `MIDTRANS_SERVER_KEY`
   - Value: Server Key dari Midtrans Dashboard
   - Contoh: `SB-Mid-server-xxxxxxxxxxxxx` (sandbox) atau `Mid-server-xxxxxxxxxxxxx` (production)

2. `MIDTRANS_IS_PRODUCTION`
   - Value: `false` untuk sandbox, `true` untuk production

### 2.2 Deploy Edge Function

Edge function sudah dibuat di `supabase/functions/midtrans-proxy/index.ts` dan sudah di-deploy.

Jika perlu deploy ulang:
```bash
supabase functions deploy midtrans-proxy
```

## 3. Konfigurasi Frontend

### 3.1 Set Environment Variable

Buka **Tempo Project Settings** atau tambahkan di `.env.local`:

```env
VITE_MIDTRANS_CLIENT_KEY=YOUR_MIDTRANS_CLIENT_KEY
```

**PENTING**: 
- Untuk **Sandbox**: Gunakan Client Key yang dimulai dengan `SB-Mid-client-...`
- Untuk **Production**: Gunakan Client Key yang dimulai dengan `Mid-client-...`

### 3.2 URL Midtrans Snap

Script Midtrans Snap akan dimuat otomatis:
- **Sandbox**: `https://app.sandbox.midtrans.com/snap/snap.js`
- **Production**: `https://app.midtrans.com/snap/snap.js`

Untuk production, ubah URL di `src/components/home.tsx`:
```typescript
script.src = 'https://app.midtrans.com/snap/snap.js';
```

## 4. Cara Kerja Payment Flow

1. **User memilih judul** → Klik "Lanjutkan"
2. **Paywall Modal muncul** → Klik "Bayar & Mulai Menulis Skripsi"
3. **System memanggil Edge Function** → Membuat transaction di Midtrans
4. **Midtrans Snap terbuka** → User memilih metode pembayaran
5. **User melakukan pembayaran**:
   - ✅ **Success**: Subscription dibuat → Thesis draft dibuat → Akses chapter workspace
   - ⏳ **Pending**: Toast notifikasi pending
   - ❌ **Error**: Tampilkan toast error (user bisa retry)
   - 🚫 **Close**: Toast canceled → User bisa retry kapan saja

## 5. Testing di Sandbox Mode

### 5.1 Payment Methods untuk Testing

Midtrans Sandbox menyediakan credentials testing:

**Credit Card**:
- Card Number: `4811 1111 1111 1114`
- CVV: `123`
- Exp: `01/25`

**GoPay/QRIS**: 
- Akan tampil QR code dummy yang bisa di-simulate

**Bank Transfer**:
- VA Number akan di-generate
- Simulate payment di Midtrans Dashboard

### 5.2 Simulate Payment

1. Lakukan transaksi di app
2. Buka [Midtrans Dashboard Sandbox](https://dashboard.sandbox.midtrans.com/)
3. Menu **Transactions** → Cari order ID
4. Klik **Actions** → **Set Status** → Success/Failure/Pending

## 6. Webhook untuk Notifikasi Payment

Midtrans akan mengirim notifikasi ke webhook URL saat payment berubah status.

### 6.1 Setup Webhook (Opsional)

1. Buat edge function untuk handle webhook:
   ```typescript
   // supabase/functions/midtrans-webhook/index.ts
   ```

2. Set Webhook URL di Midtrans Dashboard:
   ```
   https://YOUR_PROJECT.supabase.co/functions/v1/midtrans-webhook
   ```

3. Verify signature untuk keamanan

## 7. Migration ke Production

Saat siap production:

1. **Ubah Supabase Secrets**:
   - `MIDTRANS_SERVER_KEY`: Ganti dengan production server key
   - `MIDTRANS_IS_PRODUCTION`: Set `true`

2. **Ubah Frontend**:
   - `VITE_MIDTRANS_CLIENT_KEY`: Ganti dengan production client key
   - Ubah script URL dari sandbox ke production

3. **Test Payment Real**:
   - Gunakan kartu kredit asli atau e-wallet
   - Pastikan webhook working (jika ada)

## 8. Security Best Practices

✅ **DO**:
- Server Key **HANYA** di server-side (Edge Function)
- Validate payment status dari server, bukan trust client
- Implement webhook untuk auto-verification
- Log semua transactions untuk audit

❌ **DON'T**:
- JANGAN hardcode Server Key di frontend
- JANGAN skip signature verification di webhook
- JANGAN trust payment status dari client saja

## 9. Troubleshooting

### Error: "Midtrans Server Key tidak dikonfigurasi"
- Pastikan `MIDTRANS_SERVER_KEY` sudah diset di Supabase Edge Functions secrets

### Error: "snap is not defined"
- Pastikan Snap script sudah dimuat
- Cek network tab untuk error loading script
- Pastikan `VITE_MIDTRANS_CLIENT_KEY` sudah set

### Payment Success tapi Subscription Tidak Dibuat
- Cek console untuk error message
- Pastikan user sudah authenticated
- Cek Supabase database logs

### Transaction Tidak Muncul di Midtrans Dashboard
- Pastikan menggunakan credentials yang benar (sandbox vs production)
- Cek Edge Function logs untuk error

## 10. Support

- **Midtrans Docs**: https://docs.midtrans.com/
- **Supabase Edge Functions**: https://supabase.com/docs/guides/functions
- **SkripsiCepat Support**: [Your support email]
