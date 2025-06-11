export interface Driver {
  id: string;
  name: string;
  document: string;
  phone?: string;
  email?: string;
  cnh: string;
  cnhExpirationDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDriverDTO {
  name: string;
  document: string;
  phone?: string;
  email?: string;
  cnh: string;
  cnhExpirationDate: string;
}

export type UpdateDriverDTO = Partial<CreateDriverDTO>; 