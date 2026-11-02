import { z } from "zod";
import type { ProductState } from "@/lib/pricing";

/** Formulário do pedido de orçamento (enviado à função submit-order). */
export const quoteFormSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z.string().trim().email("Email inválido").max(255, "Email deve ter no máximo 255 caracteres"),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9\s+\-()]+$/, "Telefone inválido")
    .min(9, "Telefone deve ter pelo menos 9 dígitos")
    .max(20, "Telefone deve ter no máximo 20 caracteres"),
  street: z.string().trim().min(1, "Rua é obrigatória").max(200, "Rua deve ter no máximo 200 caracteres"),
  city: z.string().trim().min(1, "Localidade é obrigatória").max(100, "Localidade deve ter no máximo 100 caracteres"),
  postalCode: z.string().trim().regex(/^\d{4}-\d{3}$/, "Código postal deve ter o formato 0000-000"),
  deliveryTimeSlot: z.string().trim().max(50, "Horário deve ter no máximo 50 caracteres").optional(),
  notes: z.string().trim().max(500, "Notas devem ter no máximo 500 caracteres").optional(),
});

export type QuoteForm = z.infer<typeof quoteFormSchema>;

export interface QuoteLine {
  productId: string;
  quantity: number;
  state: ProductState;
  note?: string;
}

/** Corpo exato do pedido: sem preços, nomes, totais, estado de pagamento nem user_id. */
export function buildSubmitOrderBody(form: QuoteForm, lines: QuoteLine[], website: string) {
  const slot = form.deliveryTimeSlot?.trim();
  const notes = form.notes?.trim();
  return {
    customer: { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() },
    address: { street: form.street.trim(), city: form.city.trim(), postalCode: form.postalCode.trim() },
    ...(slot ? { deliveryTimeSlot: slot } : {}),
    ...(notes ? { notes } : {}),
    items: lines.map((l) => ({
      productId: l.productId,
      quantity: Math.min(100, Math.max(1, Math.floor(l.quantity))),
      state: l.state,
      ...(l.note?.trim() ? { note: l.note.trim().slice(0, 200) } : {}),
    })),
    website,
  };
}

export const quoteSuccessMessage = (orderRef: string) =>
  `Pedido #${orderRef} recebido. Vamos enviar-lhe o orçamento por WhatsApp ou email. Não foi cobrado nada.`;
