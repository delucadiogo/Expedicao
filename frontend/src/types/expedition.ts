export type ExpeditionStatus = 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado' | 'retido';

export interface Product {
  id: string;
  name: string;
  code: string;
  quantity: string;
  unit: string;
  batch?: string;
  expiryDate?: string;
  status: string;
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
  responsible: string;
}

export interface Expedition {
  id: string;
  expeditionNumber: string;
  dateTime: string;
  status: ExpeditionStatus;
  truckPlate: string;
  driverName: string;
  driverDocument: string;
  transportCompany?: string;
  supplierName: string;
  supplierDocument: string;
  expeditionResponsible: string;
  responsiblePosition?: string;
  products: Product[];
  qualityControl: QualityControl;
  rejection?: Rejection;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ExpeditionStats {
  total: number;
  pending: number;
  inAnalysis: number;
  approved: number;
  rejected: number;
  retained: number;
}

// DTOs para as requisições
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
  createdBy?: string;
}

export type UpdateExpeditionDTO = Partial<Omit<Expedition, 'id' | 'createdAt' | 'updatedAt' | 'updatedBy'>> & {
  status?: ExpeditionStatus;
};
