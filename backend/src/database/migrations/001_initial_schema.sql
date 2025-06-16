-- Criação da tabela de expedições
CREATE TABLE expeditions (
  id UUID PRIMARY KEY,
  expedition_number VARCHAR(50) NOT NULL UNIQUE,
  date_time TIMESTAMP NOT NULL,
  arrival_datetime TIMESTAMP,
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
  supplier_document VARCHAR(20) NOT NULL,
  
  -- Auditoria
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  created_by VARCHAR(100) NOT NULL,
  updated_by VARCHAR(100)
);

-- Comentário explicativo para o campo arrival_datetime
COMMENT ON COLUMN expeditions.arrival_datetime IS 'Data e hora em que o caminhão chegou para a expedição';

-- Criação da tabela de produtos (para expedições)
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

-- Índices de Expedição
CREATE INDEX idx_expeditions_status ON expeditions(status);
CREATE INDEX idx_expeditions_date_time ON expeditions(date_time);
CREATE INDEX idx_products_expedition_id ON products(expedition_id);
CREATE INDEX idx_quality_control_expedition_id ON quality_control(expedition_id);
CREATE INDEX idx_rejections_expedition_id ON rejections(expedition_id);

-- Criação da tabela de papéis (roles)
CREATE TABLE roles (
  id UUID PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- Criação da tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Inserir papéis padrão (opcional, mas recomendado)
INSERT INTO roles (id, name) VALUES
  (uuid_generate_v4(), 'admin'),
  (uuid_generate_v4(), 'quality_control'),
  (uuid_generate_v4(), 'expedition_responsible'),
  (uuid_generate_v4(), 'viewer');

-- Índices para a tabela de usuários
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_username ON users(username);

-- Criação da tabela de motoristas
CREATE TABLE drivers (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  document VARCHAR(20) NOT NULL UNIQUE,
  phone VARCHAR(20),
  email VARCHAR(100) UNIQUE,
  cnh VARCHAR(20) NOT NULL UNIQUE,
  cnh_expiration_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para a tabela de motoristas
CREATE INDEX idx_drivers_document ON drivers(document);
CREATE INDEX idx_drivers_cnh ON drivers(cnh);

-- Criação da tabela de caminhões
CREATE TABLE trucks (
  id UUID PRIMARY KEY,
  plate VARCHAR(10) NOT NULL UNIQUE,
  model VARCHAR(100) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  axles INTEGER NOT NULL,
  capacity INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para a tabela de caminhões
CREATE INDEX idx_trucks_plate ON trucks(plate);

-- Criação da tabela de empresas de transporte
CREATE TABLE transport_companies (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  document VARCHAR(20) NOT NULL UNIQUE,
  phone VARCHAR(20),
  email VARCHAR(100) UNIQUE,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(10),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para a tabela de empresas de transporte
CREATE INDEX idx_transport_companies_document ON transport_companies(document);

-- Criação da tabela de catálogo de produtos (produtos genéricos)
CREATE TABLE products_catalog (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para a tabela de catálogo de produtos
CREATE INDEX idx_products_catalog_code ON products_catalog(code);

-- Criação da tabela de responsáveis de expedição
CREATE TABLE expedition_responsibles (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  sector VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para a tabela de responsáveis de expedição
CREATE INDEX idx_expedition_responsibles_email ON expedition_responsibles(email);

-- Criação da tabela de fornecedores
CREATE TABLE suppliers (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  document VARCHAR(20) NOT NULL UNIQUE,
  phone VARCHAR(20),
  email VARCHAR(100) UNIQUE,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(10),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para a tabela de fornecedores
CREATE INDEX idx_suppliers_document ON suppliers(document);

-- Criação da tabela de responsáveis da qualidade
CREATE TABLE quality_responsibles (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  sector VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  digital_signature TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para a tabela de responsáveis da qualidade
CREATE INDEX idx_quality_responsibles_email ON quality_responsibles(email); 