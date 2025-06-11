export interface Product {
  id: string;
  name: string;
  code: string;
  quantity: number;
  unit: string;
  batch?: string;
  expiryDate?: string;
  status: 'novo' | 'usado' | 'danificado' | 'a_verificar';
  observations?: string;
}

export interface QualityControl {
  responsibleName: string;
  analysisDateTime?: string;
  approvalStatus: 'aprovado' | 'rejeitado' | 'pendente';
  justification?: string;
  digitalSignature?: string;
  observations?: string;
}

export interface Rejection {
  reason: string;
  sentToSupplies: boolean;
  suppliesDateTime?: string;
  suppliesResponsible?: string;
  cargoRetained: boolean;
  retainedQuantity?: number;
  retentionLocation?: string;
  correctiveActions?: string;
}

export interface Expedition {
  id: string;
  expeditionNumber: string;
  dateTime: string;
  status: 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado' | 'retido';
  
  // Informações de Transporte
  truckPlate: string;
  driverName: string;
  driverDocument: string;
  transportCompany?: string;
  
  // Responsáveis
  expeditionResponsible: string;
  responsiblePosition: string;
  supplierName: string;
  
  // Produtos
  products: Product[];
  
  // Controle de Qualidade
  qualityControl: QualityControl;
  
  // Controle de Rejeição
  rejection?: Rejection;
  
  // Auditoria
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
}

export interface ExpeditionStats {
  total: number;
  pending: number;
  inAnalysis: number;
  approved: number;
  rejected: number;
  retained: number;
}

// Tipos para as requisições
export interface CreateExpeditionDTO extends Omit<Expedition, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'> {}
export interface UpdateExpeditionDTO extends Partial<CreateExpeditionDTO> {} 