export interface ExpeditionResponsible {
  id: string;
  name: string;
  position: string;
  sector: string;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpeditionResponsibleDTO {
  name: string;
  position: string;
  sector: string;
  email?: string;
  phone?: string;
}

export type UpdateExpeditionResponsibleDTO = Partial<CreateExpeditionResponsibleDTO>; 