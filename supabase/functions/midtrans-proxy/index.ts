const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface MidtransRequest {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  customer_details: {
    email: string;
    first_name?: string;
  };
  item_details?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

Deno.serve(async (req) => {
  console.log('Midtrans proxy called with method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const serverKey = Deno.env.get('MIDTRANS_SERVER_KEY');
    
    console.log('Server key exists:', !!serverKey);
    console.log('Server key length:', serverKey?.length || 0);
    
    if (!serverKey) {
      console.error('MIDTRANS_SERVER_KEY is not configured in Supabase secrets');
      return new Response(
        JSON.stringify({ 
          error: 'Midtrans Server Key tidak dikonfigurasi.',
          code: 'MISSING_SERVER_KEY',
          hint: 'Tambahkan MIDTRANS_SERVER_KEY di Supabase Dashboard > Edge Functions > Secrets'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    let requestBody: MidtransRequest;
    try {
      requestBody = await req.json();
      console.log('Request body received:', JSON.stringify(requestBody));
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const isProduction = Deno.env.get('MIDTRANS_IS_PRODUCTION') === 'true';
    const midtransUrl = isProduction 
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    console.log('Using Midtrans URL:', midtransUrl);

    const authHeader = btoa(`${serverKey}:`);

    const midtransResponse = await fetch(midtransUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authHeader}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Midtrans response status:', midtransResponse.status);

    const responseText = await midtransResponse.text();
    console.log('Midtrans response body:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse Midtrans response as JSON');
      return new Response(
        JSON.stringify({ error: 'Invalid response from Midtrans', raw: responseText }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (!midtransResponse.ok) {
      console.error('Midtrans error:', data);
      
      // Handle specific error cases
      let errorMessage = 'Midtrans API error';
      
      if (data.error_messages) {
        errorMessage = data.error_messages.join(', ');
      } else if (data.status_message) {
        errorMessage = data.status_message;
      } else if (midtransResponse.status === 401) {
        errorMessage = 'Unauthorized - Server Key tidak valid atau tidak cocok dengan environment (sandbox vs production)';
      } else if (midtransResponse.status === 402) {
        errorMessage = 'Unauthorized transaction - pastikan Client Key dan Server Key dari environment yang sama (keduanya sandbox atau keduanya production)';
      }
      
      return new Response(
        JSON.stringify({
          error: errorMessage,
          details: data,
          hint: 'Pastikan MIDTRANS_SERVER_KEY di Supabase secrets menggunakan key dari environment yang sama dengan VITE_MIDTRANS_CLIENT_KEY (sandbox atau production)'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: midtransResponse.status }
      );
    }

    console.log('Midtrans success, returning token');

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Edge function error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage, type: 'edge_function_error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
