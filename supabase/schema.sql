-- =============================================
-- SCHEMA DO BANCO DE DADOS — DROP STORE
-- Execute no SQL Editor do Supabase
-- =============================================

-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- TABELA: products
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  price       DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  image_url   TEXT,
  sizes       TEXT[] NOT NULL DEFAULT ARRAY['P','M','G','GG','XG'],
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TABELA: orders
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  customer_name   TEXT NOT NULL,
  customer_phone  TEXT NOT NULL,
  size            TEXT NOT NULL CHECK (size IN ('P','M','G','GG','XG')),
  quantity        INTEGER NOT NULL CHECK (quantity >= 1 AND quantity <= 10),
  total_price     DECIMAL(10, 2) NOT NULL CHECK (total_price > 0),
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TABELA: settings
-- =============================================
CREATE TABLE IF NOT EXISTS settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ÍNDICES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);

-- =============================================
-- FUNÇÃO: atualiza updated_at automaticamente
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- RLS (Row Level Security) — desabilitado para anon key
-- Para produção, configure políticas específicas
-- =============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Permite leitura pública de produtos ativos
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (active = true);

-- Permite inserção pública (encomendas)
CREATE POLICY "orders_public_insert" ON orders
  FOR INSERT WITH CHECK (true);

-- Permite todas as operações via service_role (admin)
CREATE POLICY "products_service_all" ON products
  USING (auth.role() = 'service_role');

CREATE POLICY "orders_service_all" ON orders
  USING (auth.role() = 'service_role');

CREATE POLICY "settings_service_all" ON settings
  USING (auth.role() = 'service_role');

-- =============================================
-- ATENÇÃO: Para desenvolvimento local, use anon key
-- e desabilite RLS temporariamente:
-- ALTER TABLE products DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
-- =============================================
