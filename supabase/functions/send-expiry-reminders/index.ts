import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const { data: notifications, error: fetchError } = await supabase
      .from('email_notifications')
      .select(`
        *,
        users!inner(email),
        subscriptions!inner(expiry_date)
      `)
      .eq('status', 'pending')
      .eq('notification_type', 'subscription_expiry_reminder')
      .lte('scheduled_for', new Date().toISOString());

    if (fetchError) {
      throw fetchError;
    }

    const results = [];

    for (const notification of notifications || []) {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); padding: 40px 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; }
            .content h2 { color: #2c2416; margin-bottom: 20px; }
            .content p { color: #555; line-height: 1.8; margin-bottom: 15px; }
            .alert-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #06b6d4, #8b5cf6); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; margin-top: 20px; }
            .footer { background: #f9f6f1; padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ SkripsiCepat</h1>
            </div>
            <div class="content">
              <h2>Masa Aktif Berlangganan Anda Akan Berakhir</h2>
              <p>Halo,</p>
              <p>Kami ingin mengingatkan Anda bahwa masa aktif akses ke SkripsiCepat akan berakhir dalam <strong>3 hari</strong>.</p>
              
              <div class="alert-box">
                <strong>Tanggal Kedaluwarsa:</strong> ${new Date(notification.subscriptions.expiry_date).toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>

              <p>Setelah masa berlaku habis, Anda tidak akan dapat mengakses fitur penulisan dan revisi skripsi. Untuk tetap menggunakan layanan kami, silakan lakukan perpanjangan berlangganan.</p>

              <p><strong>Harga Perpanjangan:</strong> Rp 399.000 untuk 30 hari akses penuh</p>

              <a href="${supabaseUrl.replace('//', '//app.')}/perpanjang" class="cta-button">Perpanjang Sekarang</a>

              <p style="margin-top: 30px; font-size: 14px; color: #888;">Jika Anda sudah melakukan pembayaran, harap abaikan email ini.</p>
            </div>
            <div class="footer">
              <p>© 2024 SkripsiCepat. All rights reserved.</p>
              <p>Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          to: notification.users.email,
          subject: '⚠️ Pengingat: Masa Aktif Berlangganan SkripsiCepat Anda Akan Berakhir',
          html: emailHtml,
        }),
      });

      if (emailResponse.ok) {
        await supabase
          .from('email_notifications')
          .update({ 
            status: 'sent', 
            sent_at: new Date().toISOString() 
          })
          .eq('id', notification.id);

        results.push({ id: notification.id, status: 'sent' });
      } else {
        results.push({ id: notification.id, status: 'failed' });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: results.length,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
