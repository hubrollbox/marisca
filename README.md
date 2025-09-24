# Marisca - MVP PWA para Marisco Fresco 🦐

**Marisca** é uma aplicação web progressiva (PWA) mobile-first para venda e entrega de marisco fresco ao domicílio em Portugal.

## 🚀 Funcionalidades

### Core App (Mobile-First)
- ✅ **Home**: Lista de produtos com cards (foto, nome, preço, peso, estado CRU/COZIDO)
- ✅ **Product Quick-View Modal**: Modal sem navegação com quantidade, toggle CRU/COZIDO, tempo de preparação
- ✅ **Carrinho Persistente**: Visível em rodapé com gestão de itens
- ✅ **Checkout One-Page**: Morada, janela horária, observações, pagamento
- ✅ **Express Checkout**: Integração com Stripe para pagamentos rápidos
- ✅ **Guest Checkout**: Checkout sem registo + opção de registar

### Utilizador (Dashboard)
- ✅ **Histórico de Encomendas**: Estados (pendente, confirmado, preparado, em entrega, entregue)
- ✅ **Detalhe da Encomenda**: Informações completas das encomendas
- ✅ **Perfil de Utilizador**: Gestão de dados pessoais

### Administrador (Dashboard Web)
- ✅ **CRUD de Produtos**: Nome, descrição, preço, estado, stock
- ✅ **Gestão de Encomendas**: Filtrar por estado, mudar status
- ✅ **Visão Geral**: Dashboard com métricas do dia
- ✅ **Relatórios Simples**: Vendas do dia, produtos ativos

### Integrações Técnicas
- ✅ **Supabase**: Autenticação + Base de dados PostgreSQL
- ✅ **Stripe**: Pagamentos (cartão + wallets)
- ✅ **PWA**: Manifest + Service Worker
- ✅ **Design System**: Cores da marca Marisca

## 🎨 Design System - Paleta "Marisca"

- **Azul Profundo (Base)**: `#003049` - Confiança, frescura
- **Verde-Alga (Secundário)**: `#2A9D8F` - Orgânico, natural
- **Coral Suave (Acento)**: `#E76F51` - Vitalidade, contraste
- **Areia Clara (Neutro)**: `#F4E9DC` - Minimal, suavidade
- **Branco Puro**: `#FFFFFF` - Espaço, clareza
- **Cinza Pérola**: `#6C757D` - Texto secundário

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Payments**: Stripe
- **PWA**: Service Worker + Web App Manifest

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Iniciar desenvolvimento
npm run dev
```

## 📱 PWA Features

- **Installable**: Pode ser instalada como app nativo
- **Offline Ready**: Service Worker para cache básico
- **Mobile-First**: Design otimizado para dispositivos móveis
- **App Icons**: Icons 192x192 e 512x512 para diferentes dispositivos

## 🗄️ Base de Dados

### Tabelas Principais:
- `products`: Produtos (marisco fresco)
- `orders`: Encomendas dos clientes
- `order_items`: Itens das encomendas
- `profiles`: Perfis dos utilizadores
- `addresses`: Moradas de entrega

### Seed Data:
Incluí 10 produtos de exemplo (lagosta, camarões, mexilhões, etc.)

## 💳 Pagamentos

### Stripe Integration:
- **Checkout Session**: Pagamento seguro via Stripe
- **Guest Payments**: Pagamento sem registo
- **Automatic Order Creation**: Encomendas criadas automaticamente
- **Payment Success**: Página de confirmação pós-pagamento

## 👥 Utilizadores

### Acesso Admin:
Para aceder à área de administração, use um email que contenha "admin" (ex: admin@marisca.pt)

### Funcionalidades de Admin:
- Dashboard com métricas
- Gestão de produtos (criar/editar)
- Gestão de encomendas (atualizar estados)
- Visão geral de vendas

## 🔐 Autenticação

- **Signup/Login**: Via email e password
- **Guest Checkout**: Compras sem registo
- **Session Management**: Gestão automática de sessões
- **Profile Management**: Gestão de perfis de utilizador

## 📈 Estados das Encomendas

1. **Pendente**: Encomenda criada, pagamento pendente
2. **Confirmado**: Pagamento confirmado
3. **Preparado**: Marisco preparado
4. **Em Entrega**: Encomenda a caminho
5. **Entregue**: Encomenda entregue
6. **Cancelado**: Encomenda cancelada

## 🎯 Objetivos de UX

- **Checkout rápido**: Mínimo de cliques possível
- **Mobile-first**: Design otimizado para telemóvel
- **Microinterações**: Toasts, loaders, transições suaves
- **Acessibilidade**: Design inclusivo e intuitivo

## 🔗 Links Úteis

- **Supabase Dashboard**: Gestão da base de dados
- **Stripe Dashboard**: Gestão de pagamentos
- **PWA Testing**: Teste a instalação como app

---

**Marisca** - O seu marisco fresco, entregue com qualidade! 🌊
