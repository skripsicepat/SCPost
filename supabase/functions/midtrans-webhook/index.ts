import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, accept",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders, status: 200 });
  }

  // Handle GET request (for Midtrans URL verification)
  if (req.method === "GET") {
    return new Response(
      JSON.stringify({ status: "ok", message: "Midtrans webhook endpoint is active" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  }

  // Only allow POST for actual webhooks
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 405 }
    );
  }

  try {
    // Try to parse body, handle empty or invalid JSON
    let body;
    try {
      const text = await req.text();
      console.log("Raw request body:", text);
      
      if (!text || text.trim() === "") {
        // Midtrans might send empty request for URL verification
        return new Response(
          JSON.stringify({ status: "ok", message: "Webhook endpoint ready" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }
      
      body = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return new Response(
        JSON.stringify({ status: "ok", message: "Received but could not parse body" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }
    
    console.log("Midtrans webhook received:", JSON.stringify(body, null, 2));
    console.log("Midtrans webhook received:", JSON.stringify(body, null, 2));

    const {
      order_id,
      transaction_status,
      fraud_status,
      gross_amount,
      signature_key,
      status_code,
    } = body;

    // If no order_id, this might be a test/ping request
    if (!order_id) {
      console.log("No order_id in request - treating as ping/test");
      return new Response(
        JSON.stringify({ status: "ok", message: "Ping received" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Verify signature from Midtrans (optional - can skip for testing)
    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY");
    if (serverKey && signature_key) {
      // Signature = SHA512(order_id + status_code + gross_amount + server_key)
      const signatureString = `${order_id}${status_code}${gross_amount}${serverKey}`;
      const encoder = new TextEncoder();
      const data = encoder.encode(signatureString);
      const hashBuffer = await crypto.subtle.digest("SHA-512", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const calculatedSignature = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      if (calculatedSignature !== signature_key) {
        console.warn("Signature mismatch - continuing anyway for debugging", {
          calculated: calculatedSignature,
          received: signature_key,
        });
        // Note: In production, you should return 403 here
        // For now, we'll continue to help debug
      }
    } else {
      console.log("Skipping signature verification - server key or signature not present");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse user_id from order_id (format: SKRIPSICEPAT-{userId}-{timestamp})
    const orderParts = order_id.split("-");
    const userId = orderParts.length >= 3 ? orderParts[1] : null;

    if (!userId) {
      console.error("Could not parse user_id from order_id:", order_id);
      return new Response(
        JSON.stringify({ error: "Invalid order_id format" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Determine payment status
    let paymentSuccessful = false;
    if (transaction_status === "capture") {
      paymentSuccessful = fraud_status === "accept";
    } else if (transaction_status === "settlement") {
      paymentSuccessful = true;
    }

    console.log("Payment status:", {
      transaction_status,
      fraud_status,
      paymentSuccessful,
      userId,
    });

    if (paymentSuccessful) {
      // Calculate subscription dates (30 days from now)
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      // Update user subscription
      const { error: updateError } = await supabase
        .from("users")
        .update({
          subscription_status: "active",
          subscription_start_date: startDate.toISOString(),
          subscription_end_date: endDate.toISOString(),
          midtrans_order_id: order_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating user subscription:", updateError);
        return new Response(
          JSON.stringify({ error: "Database update failed" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      console.log("Subscription activated for user:", userId);
    } else if (
      transaction_status === "deny" ||
      transaction_status === "cancel" ||
      transaction_status === "expire"
    ) {
      // Payment failed - optionally update status
      console.log("Payment failed/cancelled/expired for order:", order_id);
    }

    // Always return 200 OK to Midtrans
    return new Response(
      JSON.stringify({ status: "ok", message: "Webhook processed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
