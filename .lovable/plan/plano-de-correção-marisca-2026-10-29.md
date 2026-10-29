# Plano de correção — Marisca

Seis etapas, por ordem de risco. Cada etapa deixa a loja a funcionar e é verificada antes de passar à seguinte.

## Etapa 1 — Pagamento seguro (crítico)

O que muda para o cliente e para a Marisca:
- O preço cobrado passa a vir sempre da base de dados, nunca do telemóvel do cliente.
- Antes de abrir o pagamento, o sistema confirma que o produto está disponível e que há stock suficiente. Se faltar algum, o cliente vê uma mensagem clara a dizer qual.
- A taxa de entrega (grátis a partir de 30 €, senão 4,99 €) passa a ser calculada só no servidor.
- Só o Stripe pode marcar uma encomenda como paga. A página "Pagamento concluído" passa apenas a mostrar a encomenda.
- O pagamento abre na mesma janela, em vez de num separador novo que o telemóvel pode bloquear.
- O carrinho só esvazia depois de o pagamento ser confirmado. Se o cliente desistir, o carrinho continua lá.

Como verifico: faço uma compra de teste completa e uma tentativa com o preço adulterado, que tem de ser rejeitada. Confirmo também que um cliente não consegue marcar a sua encomenda como paga.

## Etapa 2 — Limpeza

- Retirar o código de leitura do ficheiro Excel, a biblioteca do Excel e o ficheiro antigo de produtos de demonstração. A app fica mais leve a abrir.
- Retirar a opção "Grelhado", que não existe na venda, e manter "Cru / Cozido" em todo o lado.
- Juntar num só sítio as funções do carrinho que estão repetidas em três páginas.

Como verifico: Início, Produtos, Detalhe e Carrinho funcionam como antes.

## Etapa 3 — Admin completo

- Editar o preço, o stock, a disponibilidade, a foto e as fichas técnicas de cada produto.
- Apagar produtos, com confirmação antes.
- Ver os pedidos de parceria e as reclamações recebidas.
- Defeso automático: cada produto passa a ter um período de defeso com datas de início e de fim. Durante esse período, o produto aparece como "Em defeso" e não pode ser comprado. Esta regra também é aplicada no pagamento.
- Dividir o Admin em secções separadas (Produtos, Encomendas, Pedidos), para que alterar uma não estrague as outras.

Como verifico: altero o preço de um produto e vejo-o atualizado na loja e no pagamento. Ponho um produto em defeso e confirmo que deixa de poder ser comprado.

## Etapa 4 — Dados sempre atualizados

- O carrinho passa a mostrar os preços e o stock atuais, e avisa quando algo mudou desde que o produto foi adicionado.
- A página de cada produto carrega só esse produto, e não o catálogo inteiro.
- A Área do cliente, o Admin, os Endereços e a página de confirmação passam a ler os dados da mesma forma que o resto da app, com indicação de "a carregar" e mensagens de erro iguais em todo o lado.
- Os erros que hoje ficam escondidos passam a ser mostrados ao utilizador.

Como verifico: mudo um preço no Admin e o carrinho de um cliente atualiza-se sozinho.

## Etapa 5 — Paleta oficial e contraste

- Substituir as cores escritas à mão no cabeçalho, no banner de cookies, na Área do cliente, na página de pagamento concluído, na Como Funciona, no Livro de Reclamações e nas páginas legais pelas cores oficiais da Marisca: Azul Profundo, Areia Quente, e Vermelho Coral só nos botões de ação.
- Confirmar que o contraste cumpre o nível AA em todos os textos.

Como verifico: capturas de ecrã no telemóvel de cada página alterada.

## Etapa 6 — Testes automáticos

Pequenos testes que falham se alguma destas regras deixar de ser cumprida:
- entrega grátis a partir de 30 € e 4,99 € abaixo disso;
- o total é igual aos produtos mais a entrega;
- não se pode comprar mais unidades do que o stock;
- um produto em defeso não pode ser comprado;
- só são aceites os estados "Cru" e "Cozido".

## O que preciso de si

- **Ligação ao Supabase:** neste momento não tenho permissão para alterar a base de dados. É preciso voltar a ligar o projeto Supabase nas definições, antes das etapas 1 e 3.
- **Segurança:** no fim, corra a análise aprofundada no separador Security.
- **Defeso:** confirme que as datas oficiais de defeso de cada espécie vão ser introduzidas por si no Admin. Ligar à tabela oficial da DGRM de forma automática fica para uma fase posterior.

## Detalhes técnicos

- `create-payment`: receber só `{id, quantity, state}` de cada artigo. Ler `price`, `stock`, `available` e as datas de defeso de `products` com a service role, e rejeitar com 409 se faltar stock ou se o produto estiver em defeso. Calcular o subtotal e a taxa de entrega no servidor. Criar `orders`/`order_items` com `unit_price` vindo da base de dados.
- Migração: retirar a política "Users can update their pending orders", porque hoje permite a um utilizador alterar o `payment_status` da sua própria encomenda. Só o webhook (service role) e os admins podem atualizar encomendas.
- `PaymentSuccess`: apenas leitura. Limpar o carrinho quando `payment_status = 'paid'`, consultando de novo durante alguns segundos enquanto o webhook não chega.
- `Checkout`: `window.location.href = data.url` em vez de `window.open`, e retirar o `clear()` antes do pagamento.
- Retirar `xlsx`, `public/products.xlsx` e `src/data/products.ts`. O tipo de estado passa a ser `"CRU" | "COZIDO"` partilhado entre o carrinho, as validações e a função de pagamento.
- Migração de defeso: colunas `closed_season_start`/`closed_season_end` (mês e dia) em `products`, mais uma função SQL `is_in_closed_season(product)` usada pela loja e pela função de pagamento. O campo de texto `closed_season` fica como nota informativa.
- Novo hook `useProduct(id)` com `.eq('id', id).maybeSingle()`. Admin, Dashboard, AddressManager e PaymentSuccess passam a usar React Query, em vez de `useEffect` + `useState`.
- Admin dividido em `src/pages/admin/*`: produtos, encomendas, parcerias e reclamações.
- Testes com Vitest: lógica de totais extraída para `src/lib/pricing.ts`, partilhada entre o checkout e a função de pagamento através de uma cópia mínima em Deno.
- Criar `AGENTS.md` com as decisões estruturais: preços sempre do servidor, um só caminho de leitura de dados e o estado do pagamento atualizado só pelo webhook.
