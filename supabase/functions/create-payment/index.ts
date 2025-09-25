import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    state: string;
  }>;
  deliveryAddress: {
    name: string;
    street: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  deliveryTimeSlot?: string;
  notes?: string;
  guestEmail?: string;
}

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

const validateItems = (items: any[]): boolean => {
  return items && 
    Array.isArray(items) && 
    items.length > 0 && 
    items.length <= 50 &&
    items.every(item => 
      item.id && typeof item.id === 'string' &&
      item.name && typeof item.name === 'string' && item.name.length <= 100 &&
      typeof item.price === 'number' && item.price > 0 && item.price <= 999999 &&
      typeof item.quantity === 'number' && item.quantity > 0 && item.quantity <= 99 &&
      item.state && ['CRU', 'COZIDO', 'GRELHADO'].includes(item.state)
    );
};

const validateAddress = (address: any): boolean => {
  const postalCodeRegex = /^\d{4}-\d{3}$/;
  return address &&
    address.name && typeof address.name === 'string' && address.name.length <= 100 &&
    address.street && typeof address.street === 'string' && address.street.length <= 200 &&
    address.city && typeof address.city === 'string' && address.city.length <= 100 &&
    address.postalCode && postalCodeRegex.test(address.postalCode) &&
    address.phone && typeof address.phone === 'string' && address.phone.length <= 20;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const paymentData: PaymentRequest = await req.json();
    
    // Validate request data
    if (!paymentData || typeof paymentData !== 'object') {
      throw new Error('Dados de pagamento inválidos');
    }
    
    if (!validateItems(paymentData.items)) {
      throw new Error('Items de carrinho inválidos');
    }
    
    if (!validateAddress(paymentData.deliveryAddress)) {
      throw new Error('Dados de entrega inválidos');
    }
    
    if (paymentData.notes && paymentData.notes.length > 500) {
      throw new Error('Notas excedem o limite de caracteres');
    }
    
    if (paymentData.guestEmail && !validateEmail(paymentData.guestEmail)) {
      throw new Error('Email de convidado inválido');
    }
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

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

    const customerEmail = user?.email || paymentData.guestEmail;
    
    if (!customerEmail) {
      throw new Error("Email é obrigatório");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

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
    const lineItems = paymentData.items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: `${item.name} (${item.state})`,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Calculate delivery fee
    const subtotal = paymentData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal >= 30 ? 0 : 4.99;
    
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

    const totalAmount = subtotal + deliveryFee;

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
        guest_email: paymentData.guestEmail || '',
        delivery_time_slot: paymentData.deliveryTimeSlot || '',
        notes: paymentData.notes || '',
        delivery_address: JSON.stringify(paymentData.deliveryAddress),
      },
    });

    // Create pending order in database
    const orderData = {
      user_id: user?.id || null,
      guest_email: paymentData.guestEmail || null,
      status: 'pendente' as const,
      total_amount: totalAmount,
      delivery_fee: deliveryFee,
      delivery_address: paymentData.deliveryAddress,
      delivery_time_slot: paymentData.deliveryTimeSlot,
      notes: paymentData.notes,
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
    const orderItems = paymentData.items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      state: item.state as "CRU" | "COZIDO" | "GRELHADO",
      unit_price: item.price,
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
    console.error('Payment creation error:', error);
    
    // Don't expose internal error details
    const isValidationError = error instanceof Error && (
      error.message.includes('inválido') || 
      error.message.includes('limite') || 
      error.message.includes('Email') ||
      error.message === 'User not authenticated'
    );
    
    const errorMessage = isValidationError ? error.message : 'Erro interno do servidor';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: isValidationError ? 400 : 500
      }
    );
  }
});