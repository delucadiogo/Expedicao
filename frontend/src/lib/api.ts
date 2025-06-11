import { Expedition, CreateExpeditionDTO, UpdateExpeditionDTO, ExpeditionStats } from '@/types/expedition';

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