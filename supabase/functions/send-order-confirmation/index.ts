import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  state: string;
}

interface OrderConfirmationRequest {
  orderId: string;
  orderNumber: string;
  email: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: {
    name: string;
    street: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  deliveryTimeSlot?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: OrderConfirmationRequest = await req.json();
    console.log("Sending order confirmation email to:", data.email);

    // Create items HTML
    const itemsHtml = data.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.product_name} (${item.state})</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.unit_price.toFixed(2)}€</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${(item.quantity * item.unit_price).toFixed(2)}€</td>
        </tr>
      `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmação de Encomenda - Marisca</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0A2342, #1a3a5a); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Marisca</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Da maré para a sua mesa</p>
          </div>

          <!-- Content -->
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            
            <h2 style="color: #0A2342; margin-top: 0;">Encomenda Confirmada! 🎉</h2>
            
            <p>Olá <strong>${data.customerName}</strong>,</p>
            
            <p>A sua encomenda foi recebida e confirmada com sucesso. Estamos a tratar de tudo para que o marisco mais fresco chegue à sua mesa.</p>
            
            <!-- Order Details -->
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #0A2342;">Detalhes da Encomenda</h3>
              <p style="margin: 5px 0;"><strong>Número da Encomenda:</strong> ${data.orderNumber}</p>
              ${data.deliveryTimeSlot ? `<p style="margin: 5px 0;"><strong>Horário de Entrega:</strong> ${data.deliveryTimeSlot}</p>` : ""}
            </div>

            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Produto</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qtd</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Preço Unit.</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 12px; text-align: right;">Subtotal:</td>
                  <td style="padding: 12px; text-align: right;">${data.subtotal.toFixed(2)}€</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 12px; text-align: right;">Taxa de Entrega:</td>
                  <td style="padding: 12px; text-align: right;">${data.deliveryFee.toFixed(2)}€</td>
                </tr>
                <tr style="font-weight: 600; font-size: 18px;">
                  <td colspan="3" style="padding: 12px; text-align: right; border-top: 2px solid #e5e7eb;">Total:</td>
                  <td style="padding: 12px; text-align: right; border-top: 2px solid #e5e7eb; color: #E36355;">${data.total.toFixed(2)}€</td>
                </tr>
              </tfoot>
            </table>

            <!-- Delivery Address -->
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #0A2342;">Morada de Entrega</h3>
              <p style="margin: 5px 0;">${data.deliveryAddress.name}</p>
              <p style="margin: 5px 0;">${data.deliveryAddress.street}</p>
              <p style="margin: 5px 0;">${data.deliveryAddress.city}, ${data.deliveryAddress.postalCode}</p>
              <p style="margin: 5px 0;"><strong>Telefone:</strong> ${data.deliveryAddress.phone}</p>
            </div>

            <p style="margin: 30px 0;">Se tiver alguma dúvida, não hesite em contactar-nos:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="margin: 5px 0;"><strong>📧 Email:</strong> info@marisca.pt</p>
              <p style="margin: 5px 0;"><strong>📞 Telefone:</strong> +351 220 145 169</p>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Obrigado por escolher a Marisca. Frescura e autenticidade em cada encomenda.
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p>© 2024 Marisca. Todos os direitos reservados.</p>
            <p>Edifício Diplomata, Matosinhos</p>
          </div>
        </body>
      </html>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: "Marisca <info@marisca.pt>",
      to: [data.email],
      subject: `Encomenda Confirmada #${data.orderNumber} - Marisca`,
      html,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw error;
    }

    console.log("Email sent successfully:", emailData);

    return new Response(
      JSON.stringify({ success: true, emailId: emailData.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-order-confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
