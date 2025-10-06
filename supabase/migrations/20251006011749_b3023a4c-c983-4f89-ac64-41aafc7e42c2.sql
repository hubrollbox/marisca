-- Remove produtos de demonstração (mantém apenas os do catálogo real)
DELETE FROM products 
WHERE name IN (
  'Amêijoas Japonesas',
  'Berbigão',
  'Camarões Tigre',
  'Gamba Vermelha',
  'Lagosta Fresca',
  'Lingueirão',
  'Mexilhões da Ria',
  'Polvinho Baby',
  'Santola Inteira',
  'Sapateira Pequena'
);