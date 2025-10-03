-- Atualizar produtos existentes com categorias corretas
UPDATE products SET category = 'Crustáceos' WHERE name IN ('Lagosta Fresca', 'Camarões Tigre', 'Gamba Vermelha', 'Sapateira Pequena', 'Santola Inteira', 'Polvinho Baby');
UPDATE products SET category = 'Bivalves' WHERE name IN ('Mexilhões da Ria', 'Lingueirão', 'Amêijoas Japonesas', 'Berbigão');

-- Adicionar produtos do catálogo Marisca que faltam
INSERT INTO products (name, slug, category, price, weight, available, states, prep_time, description, stock, image_url) VALUES
  ('Lagostim', 'lagostim', 'Crustáceos', 42.00, '400-500g', true, ARRAY['CRU', 'COZIDO']::product_state[], '20-25 min', 'Lagostim fresco da costa portuguesa, com sabor intenso e textura delicada.', 8, NULL),
  ('Ameijoa', 'ameijoa', 'Bivalves', 14.50, '1kg', true, ARRAY['CRU']::product_state[], '5-10 min', 'Ameijoa fresca da Ria Formosa, ideal para cataplana ou à bulhão pato.', 25, NULL),
  ('Ostras', 'ostras', 'Bivalves', 28.00, '12 unidades', true, ARRAY['CRU']::product_state[], 'Consumo imediato', 'Ostras frescas portuguesas, perfeitas para consumir ao natural com limão.', 15, NULL),
  ('Lavagante', 'lavagante', 'Crustáceos', 52.00, '500-700g', true, ARRAY['CRU', 'COZIDO']::product_state[], '25-30 min', 'Lavagante fresco, considerado o marisco mais nobre da costa portuguesa.', 5, NULL),
  ('Percebes', 'percebes', 'Crustáceos', 65.00, '500g', true, ARRAY['CRU']::product_state[], '3-5 min', 'Percebes frescos das rochas portuguesas, uma iguaria rara e apreciada.', 3, NULL),
  ('Ouriços', 'ouricos', 'Bivalves', 18.50, '6 unidades', true, ARRAY['CRU']::product_state[], 'Consumo imediato', 'Ouriços do mar frescos, com sabor intenso a mar. Consumir crus.', 12, NULL),
  ('Camarão da Costa', 'camarao-da-costa', 'Crustáceos', 22.00, '500g', true, ARRAY['CRU', 'COZIDO']::product_state[], '10-12 min', 'Camarão da costa portuguesa, fresco e saboroso, perfeito para grelhar.', 20, NULL)
ON CONFLICT (slug) DO NOTHING;