import { z } from "zod";

// Auth validation schemas
export const signUpSchema = z.object({
  firstName: z.string().trim().min(1, "Nome é obrigatório").max(50, "Nome deve ter no máximo 50 caracteres"),
  lastName: z.string().trim().min(1, "Apelido é obrigatório").max(50, "Apelido deve ter no máximo 50 caracteres"),
  email: z.string().trim().email("Email inválido").max(255, "Email deve ter no máximo 255 caracteres"),
  password: z.string().min(6, "Password deve ter pelo menos 6 caracteres").max(100, "Password deve ter no máximo 100 caracteres"),
});

export const signInSchema = z.object({
  email: z.string().trim().email("Email inválido").max(255, "Email deve ter no máximo 255 caracteres"),
  password: z.string().min(1, "Password é obrigatório").max(100, "Password deve ter no máximo 100 caracteres"),
});

// Checkout validation schemas
export const addressSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  street: z.string().trim().min(1, "Morada é obrigatória").max(200, "Morada deve ter no máximo 200 caracteres"),
  city: z.string().trim().min(1, "Cidade é obrigatória").max(100, "Cidade deve ter no máximo 100 caracteres"),
  postalCode: z.string().trim().regex(/^\d{4}-\d{3}$/, "Código postal deve ter o formato 0000-000"),
  phone: z.string().trim().regex(/^[0-9\s\+\-\(\)]+$/, "Telefone inválido").min(9, "Telefone deve ter pelo menos 9 dígitos").max(20, "Telefone deve ter no máximo 20 caracteres"),
});

export const guestEmailSchema = z.object({
  email: z.string().trim().email("Email inválido").max(255, "Email deve ter no máximo 255 caracteres"),
});

export const checkoutNotesSchema = z.object({
  notes: z.string().trim().max(500, "Notas devem ter no máximo 500 caracteres").optional(),
});

// Admin validation schemas
export const productSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z.string().trim().max(500, "Descrição deve ter no máximo 500 caracteres").optional(),
  price: z.number().positive("Preço deve ser positivo").max(999999, "Preço deve ser menor que 999999"),
  weight: z.string().trim().max(50, "Peso deve ter no máximo 50 caracteres").optional(),
  prep_time: z.string().trim().max(50, "Tempo de preparação deve ter no máximo 50 caracteres").optional(),
  stock: z.number().int("Stock deve ser um número inteiro").min(0, "Stock não pode ser negativo").max(99999, "Stock deve ser menor que 99999").optional(),
  image_url: z.string().trim().url("URL da imagem inválida").max(500, "URL da imagem deve ter no máximo 500 caracteres").optional().or(z.literal("")),
});

// Payment validation schemas
export const paymentRequestSchema = z.object({
  items: z.array(z.object({
    id: z.string().uuid("ID do produto inválido"),
    name: z.string().trim().min(1, "Nome do produto é obrigatório").max(100),
    price: z.number().positive("Preço deve ser positivo"),
    quantity: z.number().int("Quantidade deve ser um número inteiro").positive("Quantidade deve ser positiva").max(99, "Quantidade máxima é 99"),
    state: z.enum(["CRU", "COZIDO", "GRELHADO"], { errorMap: () => ({ message: "Estado inválido" }) }),
  })).min(1, "Pelo menos um item é obrigatório"),
  deliveryAddress: addressSchema,
  deliveryTimeSlot: z.string().trim().min(1, "Horário de entrega é obrigatório").max(50),
  notes: z.string().trim().max(500, "Notas devem ter no máximo 500 caracteres").optional(),
  guestEmail: z.string().trim().email("Email inválido").max(255).optional(),
});

// Partnership validation schema
export const partnershipSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z.string().trim().email("Email inválido").max(255, "Email deve ter no máximo 255 caracteres"),
  partnershipType: z.enum(["gastronomia", "desporto", "cultura", "outro"], {
    errorMap: () => ({ message: "Tipo de parceria inválido" })
  }),
  message: z.string().trim().min(10, "Mensagem deve ter pelo menos 10 caracteres").max(1000, "Mensagem deve ter no máximo 1000 caracteres"),
});

// Complaint validation schema
export const complaintSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z.string().trim().email("Email inválido").max(255, "Email deve ter no máximo 255 caracteres"),
  phone: z.string().trim().regex(/^[0-9\s\+\-\(\)]+$/, "Telefone inválido").min(9, "Telefone deve ter pelo menos 9 dígitos").max(20, "Telefone deve ter no máximo 20 caracteres").optional(),
  complaintType: z.enum(["produto", "entrega", "atendimento", "outro"], {
    errorMap: () => ({ message: "Tipo de reclamação inválido" })
  }),
  description: z.string().trim().min(20, "Descrição deve ter pelo menos 20 caracteres").max(2000, "Descrição deve ter no máximo 2000 caracteres"),
  orderId: z.string().uuid("ID de encomenda inválido").optional(),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type PaymentRequestData = z.infer<typeof paymentRequestSchema>;
export type PartnershipFormData = z.infer<typeof partnershipSchema>;
export type ComplaintFormData = z.infer<typeof complaintSchema>;