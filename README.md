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

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta Supabase
- Conta Stripe (para pagamentos)

### Configuração

1. **Clonar e instalar dependências**
```bash
git clone <repository-url>
cd marisca
npm install
```

2. **Configurar variáveis de ambiente**
```bash
# Copiar arquivo de exemplo
cp env.example .env.local

# Editar .env.local com suas credenciais
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

3. **Configurar Supabase**
- Criar projeto no Supabase
- Executar migrações do banco de dados
- Configurar Edge Functions para pagamentos

4. **Iniciar desenvolvimento**
```bash
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

## 🔧 Melhorias Implementadas

### Segurança
- ✅ Credenciais movidas para variáveis de ambiente
- ✅ Configuração TypeScript mais strict
- ✅ Confirmação de email ativada
- ✅ Rate limiting implementado
- ✅ Logging estruturado para auditoria

### Performance
- ✅ Service Worker otimizado com cache strategies
- ✅ Lazy loading de imagens
- ✅ Error Boundaries implementados
- ✅ PWA melhorado com shortcuts e screenshots

### Qualidade de Código
- ✅ Validação consistente com Zod
- ✅ Error handling melhorado
- ✅ Estados de produto consistentes
- ✅ Acessibilidade melhorada

### Monitoramento
- ✅ Sistema de logging estruturado
- ✅ Error tracking implementado
- ✅ Performance monitoring

## 🔗 Links Úteis

- **Supabase Dashboard**: Gestão da base de dados
- **Stripe Dashboard**: Gestão de pagamentos
- **PWA Testing**: Teste a instalação como app

## 🚨 Próximos Passos Recomendados

1. **Testes**: Implementar testes unitários e de integração
2. **CI/CD**: Configurar pipeline de deployment
3. **Monitoring**: Integrar com serviços de monitoramento
4. **Analytics**: Adicionar tracking de eventos
5. **Backup**: Configurar backup automático da base de dados

---

**Marisca** - O seu marisco fresco, entregue com qualidade! 🌊
