export type ExpeditionStatus = 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado' | 'retido';

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
  status: ExpeditionStatus;
  
  // Informações de Transporte
  truckPlate: string;
  driverName: string;
  driverDocument: string;
  transportCompany?: string;
  
  // Responsáveis
  expeditionResponsible: string;
  responsiblePosition: string;
  supplierName: string;
  supplierDocument: string;
  
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
  observations?: string;
}

export interface ExpeditionStats {
  total: number;
  pending: number;
  in_analysis: number;
  approved: number;
  rejected: number;
  retained: number;
}

// DTOs para as requisições (definido explicitamente)
export interface CreateExpeditionDTO {
  expeditionNumber: string;
  truckPlate: string;
  driverName: string;
  driverDocument: string;
  transportCompany?: string;
  supplierName: string;
  supplierDocument: string;
  expeditionResponsible: string;
  responsiblePosition?: string;
  products: Product[];
  status: ExpeditionStatus;
  qualityControl: QualityControl;
  rejection?: Rejection;
  dateTime: string;
  createdBy: string;
  observations?: string;
}

export type UpdateExpeditionDTO = Partial<Omit<Expedition, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'> & { status?: ExpeditionStatus }>; 