import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("stripe-signature");
    const body = await req.text();
    
    if (!signature) {
      throw new Error("Missing Stripe signature");
    }

    // Verify webhook signature
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    let event: Stripe.Event;

    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
      console.warn("⚠️ Webhook signature verification skipped (no secret configured)");
    }

    console.log(`🔔 Webhook received: ${event.type}`);

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("✅ Checkout session completed:", session.id);
        
        // Update order status
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            status: "confirmada",
          })
          .eq("stripe_payment_intent_id", session.payment_intent as string)
          .select("id, user_id, total_amount, delivery_fee, delivery_address, delivery_time_slot, guest_email")
          .single();

        if (orderError) {
          console.error("Error updating order:", orderError);
          throw orderError;
        }

        console.log("📦 Order updated:", order.id);

        // Decrease product stock in background
        EdgeRuntime.waitUntil(decreaseStockForOrder(order.id));

        // Send order confirmation email in background
        EdgeRuntime.waitUntil(sendOrderConfirmation(order));

        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("💳 Payment succeeded:", paymentIntent.id);
        
        await supabase
          .from("orders")
          .update({ payment_status: "paid" })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("❌ Payment failed:", paymentIntent.id);
        
        await supabase
          .from("orders")
          .update({ 
            payment_status: "failed",
            status: "cancelada"
          })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

// Background task: Decrease stock for order items
async function decreaseStockForOrder(orderId: string) {
  try {
    console.log("📉 Decreasing stock for order:", orderId);

    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", orderId);

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
      return;
    }

    for (const item of orderItems) {
      const { error: stockError } = await supabase.rpc("decrease_product_stock", {
        product_id: item.product_id,
        quantity: item.quantity,
      });

      if (stockError) {
        console.error(`Error decreasing stock for product ${item.product_id}:`, stockError);
      } else {
        console.log(`✅ Stock decreased for product ${item.product_id}: -${item.quantity}`);
      }
    }
  } catch (error) {
    console.error("Error in decreaseStockForOrder:", error);
  }
}

// Background task: Send order confirmation email
async function sendOrderConfirmation(order: any) {
  try {
    console.log("📧 Sending order confirmation for:", order.id);

    // Get order items with product details
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select(`
        quantity,
        unit_price,
        state,
        product_id
      `)
      .eq("order_id", order.id);

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
      return;
    }

    // Get product names
    const productIds = orderItems.map((item: any) => item.product_id);
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name")
      .in("id", productIds);

    if (productsError) {
      console.error("Error fetching products:", productsError);
      return;
    }

    // Map product names to items
    const itemsWithNames = orderItems.map((item: any) => {
      const product = products.find((p: any) => p.id === item.product_id);
      return {
        product_name: product?.name || "Produto",
        quantity: item.quantity,
        unit_price: parseFloat(item.unit_price),
        state: item.state,
      };
    });

    // Get customer info
    let customerName = "Cliente";
    if (order.user_id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("user_id", order.user_id)
        .single();

      if (profile) {
        customerName = `${profile.first_name} ${profile.last_name}`;
      }
    } else if (order.delivery_address?.name) {
      customerName = order.delivery_address.name;
    }

    // Call send-order-confirmation edge function
    const { error: emailError } = await supabase.functions.invoke("send-order-confirmation", {
      body: {
        orderId: order.id,
        orderNumber: order.id.substring(0, 8).toUpperCase(),
        email: order.guest_email || order.user_email,
        customerName,
        items: itemsWithNames,
        subtotal: parseFloat(order.total_amount) - parseFloat(order.delivery_fee),
        deliveryFee: parseFloat(order.delivery_fee),
        total: parseFloat(order.total_amount),
        deliveryAddress: order.delivery_address,
        deliveryTimeSlot: order.delivery_time_slot,
      },
    });

    if (emailError) {
      console.error("Error sending confirmation email:", emailError);
    } else {
      console.log("✅ Order confirmation email sent");
    }
  } catch (error) {
    console.error("Error in sendOrderConfirmation:", error);
  }
}
