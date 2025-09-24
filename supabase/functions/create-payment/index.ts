import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  cartItems: Array<{
    product: {
      id: string;
      name: string;
      price: number;
    };
    quantity: number;
    state: "CRU" | "COZIDO";
  }>;
  deliveryFee: number;
  totalAmount: number;
  deliveryAddress: any;
  deliveryTimeSlot?: string;
  notes?: string;
  guestEmail?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { cartItems, deliveryFee, totalAmount, deliveryAddress, deliveryTimeSlot, notes, guestEmail }: PaymentRequest = await req.json();

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    let user = null;
    let customerId = undefined;

    // Try to get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabaseClient.auth.getUser(token);
        user = data.user;
      } catch (error) {
        console.log("No authenticated user, proceeding as guest");
      }
    }

    const customerEmail = user?.email || guestEmail;
    
    if (!customerEmail) {
      throw new Error("Email é obrigatório");
    }

    // Check if a Stripe customer record exists
    const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: customerEmail,
      });
      customerId = customer.id;
    }

    // Create line items for Stripe
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: `${item.product.name} (${item.state})`,
        },
        unit_amount: Math.round(item.product.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add delivery fee if applicable
    if (deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Taxa de Entrega',
          },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/checkout`,
      payment_method_types: ['card'],
      automatic_tax: {
        enabled: false,
      },
      shipping_address_collection: {
        allowed_countries: ['PT'],
      },
      metadata: {
        user_id: user?.id || 'guest',
        guest_email: guestEmail || '',
        delivery_time_slot: deliveryTimeSlot || '',
        notes: notes || '',
        delivery_address: JSON.stringify(deliveryAddress),
      },
    });

    // Create pending order in database
    const orderData = {
      user_id: user?.id || null,
      guest_email: guestEmail || null,
      status: 'pendente',
      total_amount: totalAmount,
      delivery_fee: deliveryFee,
      delivery_address: deliveryAddress,
      delivery_time_slot: deliveryTimeSlot,
      notes: notes,
      stripe_payment_intent_id: session.id,
      payment_status: 'pending',
    };

    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      state: item.state,
      unit_price: item.product.price,
    }));

    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return new Response(JSON.stringify({ 
      url: session.url,
      order_id: order.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});