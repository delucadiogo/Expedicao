export interface Truck {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: number;
  axles: number;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTruckDTO {
  plate: string;
  model: string;
  brand: string;
  year: number;
  axles: number;
  capacity: number;
}

export type UpdateTruckDTO = Partial<CreateTruckDTO>; 