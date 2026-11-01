# Roadmap — Plano de correção Marisca

- [x] Etapa 1 — Pagamento seguro (código pronto: preços/stock/defeso no servidor, webhook verificado e sem repetições, só o servidor marca pago, carrinho só limpa após pagamento)
  - [ ] Publicar as funções de pagamento (`create-payment`, `stripe-webhook`, `order-status`) — bloqueado: ligação Supabase sem permissões
  - [ ] Migração da base de dados (colunas de defeso/ficha técnica, remover permissões de clientes alterarem encomendas, proteger baixa de stock) — bloqueado: ligação Supabase sem permissões
- [x] Etapa 2 — Limpeza (Excel, demo, Grelhado, carrinho duplicado)
- [x] Etapa 3 — Admin completo (editar/apagar produtos, parcerias, reclamações, defeso, dividir Admin, export CSV)
- [x] Etapa 4 — Dados sempre atualizados (carrinho com preços atuais, useProduct, React Query)
- [x] Etapa 5 — Paleta oficial, tipografia da marca e contraste AA
- [x] Etapa 6 — Testes automáticos (`npm test`)
