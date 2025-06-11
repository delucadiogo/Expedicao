import { Request, Response } from 'express';
import { ProductCatalogService } from '../services/productCatalog.service';
import { CreateProductCatalogDTO, UpdateProductCatalogDTO } from '../types/productCatalog';

export class ProductCatalogController {
  private productCatalogService: ProductCatalogService;

  constructor() {
    this.productCatalogService = new ProductCatalogService();
  }

  // Obter todos os itens do catálogo de produtos
  getAll = async (req: Request, res: Response) => {
    try {
      const products = await this.productCatalogService.getAll();
      res.json(products);
    } catch (error) {
      console.error('Erro ao buscar produtos do catálogo:', error);
      res.status(500).json({ error: 'Erro ao buscar produtos do catálogo' });
    }
  };

  // Obter item do catálogo de produtos por ID
  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await this.productCatalogService.getById(id);

      if (!product) {
        return res.status(404).json({ error: 'Item do catálogo de produtos não encontrado' });
      }

      res.json(product);
    } catch (error) {
      console.error('Erro ao buscar item do catálogo de produtos por ID:', error);
      res.status(500).json({ error: 'Erro ao buscar item do catálogo de produtos' });
    }
  };

  // Criar novo item do catálogo de produtos
  create = async (req: Request, res: Response) => {
    try {
      const productData: CreateProductCatalogDTO = req.body;
      const newProduct = await this.productCatalogService.create(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Erro ao criar item do catálogo de produtos:', error);
      res.status(500).json({ error: 'Erro ao criar item do catálogo de produtos' });
    }
  };

  // Atualizar item do catálogo de produtos
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData: UpdateProductCatalogDTO = req.body;
      const updatedProduct = await this.productCatalogService.update(id, updateData);

      if (!updatedProduct) {
        return res.status(404).json({ error: 'Item do catálogo de produtos não encontrado' });
      }

      res.json(updatedProduct);
    } catch (error) {
      console.error('Erro ao atualizar item do catálogo de produtos:', error);
      res.status(500).json({ error: 'Erro ao atualizar item do catálogo de produtos' });
    }
  };

  // Deletar item do catálogo de produtos
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await this.productCatalogService.delete(id);

      if (!success) {
        return res.status(404).json({ error: 'Item do catálogo de produtos não encontrado' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar item do catálogo de produtos:', error);
      res.status(500).json({ error: 'Erro ao deletar item do catálogo de produtos' });
    }
  };
} 