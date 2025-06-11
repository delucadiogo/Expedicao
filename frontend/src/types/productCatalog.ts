export interface ProductCatalog {
  id: string;
  name: string;
  code: string;
  category: string;
  unit: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductCatalogDTO {
  name: string;
  code: string;
  category: string;
  unit: string;
  description?: string;
}

export type UpdateProductCatalogDTO = Partial<CreateProductCatalogDTO>; 