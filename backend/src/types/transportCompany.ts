export interface TransportCompany {
  id: string;
  name: string;
  document: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransportCompanyDTO {
  name: string;
  document: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export type UpdateTransportCompanyDTO = Partial<CreateTransportCompanyDTO>; 