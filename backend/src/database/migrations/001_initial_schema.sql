-- Criação da tabela de expedições
CREATE TABLE expeditions (
  id UUID PRIMARY KEY,
  expedition_number VARCHAR(50) NOT NULL UNIQUE,
  date_time TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pendente', 'em_analise', 'aprovado', 'rejeitado', 'retido')),
  
  -- Informações de Transporte
  truck_plate VARCHAR(10) NOT NULL,
  driver_name VARCHAR(100) NOT NULL,
  driver_document VARCHAR(20) NOT NULL,
  transport_company VARCHAR(100),
  
  -- Responsáveis
  expedition_responsible VARCHAR(100) NOT NULL,
  responsible_position VARCHAR(50) NOT NULL,
  supplier_name VARCHAR(100) NOT NULL,
  
  -- Auditoria
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  created_by VARCHAR(100) NOT NULL,
  updated_by VARCHAR(100)
);

-- Criação da tabela de produtos
CREATE TABLE products (
  id UUID PRIMARY KEY,
  expedition_id UUID NOT NULL REFERENCES expeditions(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) NOT NULL,
  quantity NUMERIC(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  batch VARCHAR(50),
  expiry_date DATE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('novo', 'usado', 'danificado', 'a_verificar')),
  observations TEXT
);

-- Criação da tabela de controle de qualidade
CREATE TABLE quality_control (
  id UUID PRIMARY KEY,
  expedition_id UUID NOT NULL REFERENCES expeditions(id) ON DELETE CASCADE,
  responsible_name VARCHAR(100) NOT NULL,
  analysis_date_time TIMESTAMP,
  approval_status VARCHAR(20) NOT NULL CHECK (approval_status IN ('aprovado', 'rejeitado', 'pendente')),
  justification TEXT,
  digital_signature TEXT,
  observations TEXT
);

-- Criação da tabela de rejeições
CREATE TABLE rejections (
  id UUID PRIMARY KEY,
  expedition_id UUID NOT NULL REFERENCES expeditions(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  sent_to_supplies BOOLEAN NOT NULL DEFAULT false,
  supplies_date_time TIMESTAMP,
  supplies_responsible VARCHAR(100),
  cargo_retained BOOLEAN NOT NULL DEFAULT false,
  retained_quantity NUMERIC(10,2),
  retention_location VARCHAR(100),
  corrective_actions TEXT
);

-- Índices
CREATE INDEX idx_expeditions_status ON expeditions(status);
CREATE INDEX idx_expeditions_date_time ON expeditions(date_time);
CREATE INDEX idx_products_expedition_id ON products(expedition_id);
CREATE INDEX idx_quality_control_expedition_id ON quality_control(expedition_id);
CREATE INDEX idx_rejections_expedition_id ON rejections(expedition_id); 