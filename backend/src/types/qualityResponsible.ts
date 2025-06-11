export interface QualityResponsible {
  id: string;
  name: string;
  position: string;
  sector: string;
  email?: string;
  phone?: string;
  digitalSignature?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQualityResponsibleDTO {
  name: string;
  position: string;
  sector: string;
  email?: string;
  phone?: string;
  digitalSignature?: string;
}

export interface UpdateQualityResponsibleDTO extends Partial<CreateQualityResponsibleDTO> {} 