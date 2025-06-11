import { Expedition, CreateExpeditionDTO, UpdateExpeditionDTO, ExpeditionStats } from '@/types/expedition';
import { Driver, CreateDriverDTO, UpdateDriverDTO } from '@/types/driver';
import { Truck, CreateTruckDTO, UpdateTruckDTO } from '@/types/truck';
import { TransportCompany, CreateTransportCompanyDTO, UpdateTransportCompanyDTO } from '@/types/transportCompany';
import { ProductCatalog, CreateProductCatalogDTO, UpdateProductCatalogDTO } from '@/types/productCatalog';
import { ExpeditionResponsible, CreateExpeditionResponsibleDTO, UpdateExpeditionResponsibleDTO } from '@/types/expeditionResponsible';
import { Supplier, CreateSupplierDTO, UpdateSupplierDTO } from '@/types/supplier';
import { QualityResponsible, CreateQualityResponsibleDTO, UpdateQualityResponsibleDTO } from '@/types/qualityResponsible';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Função auxiliar para fazer requisições
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro na requisição');
  }

  return response.json();
}

// Serviço de Expedição
export const expeditionService = {
  // Obter todas as expedições
  getAll: () => fetchAPI<Expedition[]>('/expeditions'),

  // Obter estatísticas
  getStats: () => fetchAPI<ExpeditionStats>('/expeditions/stats'),

  // Obter expedição por ID
  getById: (id: string) => fetchAPI<Expedition>(`/expeditions/${id}`),

  // Criar nova expedição
  create: (data: CreateExpeditionDTO) =>
    fetchAPI<Expedition>('/expeditions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Atualizar expedição
  update: (id: string, data: UpdateExpeditionDTO) =>
    fetchAPI<Expedition>(`/expeditions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Deletar expedição
  delete: (id: string) =>
    fetchAPI<void>(`/expeditions/${id}`, {
      method: 'DELETE',
    }),

  // Atualizar controle de qualidade
  updateQualityControl: (id: string, data: any) =>
    fetchAPI<Expedition>(`/expeditions/${id}/quality-control`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Atualizar rejeição
  updateRejection: (id: string, data: any) =>
    fetchAPI<Expedition>(`/expeditions/${id}/rejection`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Serviço de Motoristas
export const driverService = {
  getAll: () => fetchAPI<Driver[]>('/drivers'),
  getById: (id: string) => fetchAPI<Driver>(`/drivers/${id}`),
  create: (data: CreateDriverDTO) =>
    fetchAPI<Driver>('/drivers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateDriverDTO) =>
    fetchAPI<Driver>(`/drivers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchAPI<void>(`/drivers/${id}`, {
      method: 'DELETE',
    }),
};

// Serviço de Caminhões
export const truckService = {
  getAll: () => fetchAPI<Truck[]>('/trucks'),
  getById: (id: string) => fetchAPI<Truck>(`/trucks/${id}`),
  create: (data: CreateTruckDTO) =>
    fetchAPI<Truck>('/trucks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateTruckDTO) =>
    fetchAPI<Truck>(`/trucks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchAPI<void>(`/trucks/${id}`, {
      method: 'DELETE',
    }),
};

// Serviço de Empresas de Transporte
export const transportCompanyService = {
  getAll: () => fetchAPI<TransportCompany[]>('/transport-companies'),
  getById: (id: string) => fetchAPI<TransportCompany>(`/transport-companies/${id}`),
  create: (data: CreateTransportCompanyDTO) =>
    fetchAPI<TransportCompany>('/transport-companies', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateTransportCompanyDTO) =>
    fetchAPI<TransportCompany>(`/transport-companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchAPI<void>(`/transport-companies/${id}`, {
      method: 'DELETE',
    }),
};

// Serviço de Catálogo de Produtos
export const productCatalogService = {
  getAll: () => fetchAPI<ProductCatalog[]>('/product-catalog'),
  getById: (id: string) => fetchAPI<ProductCatalog>(`/product-catalog/${id}`),
  create: (data: CreateProductCatalogDTO) =>
    fetchAPI<ProductCatalog>('/product-catalog', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateProductCatalogDTO) =>
    fetchAPI<ProductCatalog>(`/product-catalog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchAPI<void>(`/product-catalog/${id}`, {
      method: 'DELETE',
    }),
};

// Serviço de Responsáveis de Expedição
export const expeditionResponsibleService = {
  getAll: () => fetchAPI<ExpeditionResponsible[]>('/expedition-responsibles'),
  getById: (id: string) => fetchAPI<ExpeditionResponsible>(`/expedition-responsibles/${id}`),
  create: (data: CreateExpeditionResponsibleDTO) =>
    fetchAPI<ExpeditionResponsible>('/expedition-responsibles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateExpeditionResponsibleDTO) =>
    fetchAPI<ExpeditionResponsible>(`/expedition-responsibles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchAPI<void>(`/expedition-responsibles/${id}`, {
      method: 'DELETE',
    }),
};

// Serviço de Fornecedores
export const supplierService = {
  getAll: () => fetchAPI<Supplier[]>('/suppliers'),
  getById: (id: string) => fetchAPI<Supplier>(`/suppliers/${id}`),
  create: (data: CreateSupplierDTO) =>
    fetchAPI<Supplier>('/suppliers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateSupplierDTO) =>
    fetchAPI<Supplier>(`/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchAPI<void>(`/suppliers/${id}`, {
      method: 'DELETE',
    }),
};

// Serviço de Responsáveis pela Qualidade
export const qualityResponsibleService = {
  getAll: () => fetchAPI<QualityResponsible[]>('/quality-responsibles'),
  getById: (id: string) => fetchAPI<QualityResponsible>(`/quality-responsibles/${id}`),
  create: (data: CreateQualityResponsibleDTO) =>
    fetchAPI<QualityResponsible>('/quality-responsibles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateQualityResponsibleDTO) =>
    fetchAPI<QualityResponsible>(`/quality-responsibles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchAPI<void>(`/quality-responsibles/${id}`, {
      method: 'DELETE',
    }),
}; 