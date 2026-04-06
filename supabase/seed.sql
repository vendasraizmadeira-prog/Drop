-- =============================================
-- SEED: Dados iniciais para a loja
-- Execute APÓS o schema.sql
-- =============================================

-- Configurações iniciais
INSERT INTO settings (key, value) VALUES
  ('pix_key',       'pedro_henrique1945@hotmail.com'),
  ('whatsapp_number', '5517981274774'),
  ('store_name',    'DROP STORE'),
  ('merchant_name', 'DROP STORE'),
  ('merchant_city', 'SAO PAULO')
ON CONFLICT (key) DO NOTHING;

-- 6 Produtos fictícios
INSERT INTO products (name, description, price, image_url, sizes, active) VALUES
(
  'Oversized Classic Black',
  'A camiseta preta essencial. Corte oversized, caimento perfeito para qualquer estilo. Tecido 100% algodão penteado 30.1, pré-encolhido.',
  79.90,
  'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=600&q=80',
  ARRAY['P','M','G','GG','XG'],
  true
),
(
  'Streetwear Acid Wash',
  'Lavagem ácida exclusiva, cada peça é única. Visual desgastado autêntico com textura marcada. Edição limitada.',
  99.90,
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80',
  ARRAY['P','M','G','GG'],
  true
),
(
  'Drop Graphic Tee Vol.1',
  'Estampa exclusiva do primeiro drop. Arte original desenvolvida para quem vive a cultura das ruas. Serigrafada à mão.',
  89.90,
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
  ARRAY['M','G','GG','XG'],
  true
),
(
  'Essentials White Oversize',
  'Branco imaculado. O básico que eleva qualquer look. Algodão premium com reforço nas costuras. Perfeita para layering.',
  74.90,
  'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80',
  ARRAY['P','M','G','GG','XG'],
  true
),
(
  'Vintage Washed Crop',
  'Crop top com lavagem vintage. Corte cropped moderno, ideal para quem curte o estilo Y2K com toque streetwear contemporâneo.',
  84.90,
  'https://images.unsplash.com/photo-1594938298603-c8148c4b4e39?w=600&q=80',
  ARRAY['P','M','G'],
  true
),
(
  'Heavy Weight OG Drop',
  'Para quem quer substância. Tecido heavyweight 240g/m², sensação premium, durabilidade máxima. O peso certo do estilo.',
  109.90,
  'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80',
  ARRAY['M','G','GG','XG'],
  true
);
