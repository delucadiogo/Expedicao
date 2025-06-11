import { Request, Response } from 'express';
import { SupplierService } from '../services/supplier.service';
import { CreateSupplierDTO, UpdateSupplierDTO } from '../types/supplier';

export class SupplierController {
  private supplierService: SupplierService;

  constructor() {
    this.supplierService = new SupplierService();
  }

  // Obter todos os fornecedores
  getAll = async (req: Request, res: Response) => {
    try {
      const suppliers = await this.supplierService.getAll();
      res.json(suppliers);
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
      res.status(500).json({ error: 'Erro ao buscar fornecedores' });
    }
  };

  // Obter fornecedor por ID
  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const supplier = await this.supplierService.getById(id);

      if (!supplier) {
        return res.status(404).json({ error: 'Fornecedor não encontrado' });
      }

      res.json(supplier);
    } catch (error) {
      console.error('Erro ao buscar fornecedor por ID:', error);
      res.status(500).json({ error: 'Erro ao buscar fornecedor' });
    }
  };

  // Criar novo fornecedor
  create = async (req: Request, res: Response) => {
    try {
      const supplierData: CreateSupplierDTO = req.body;
      const newSupplier = await this.supplierService.create(supplierData);
      res.status(201).json(newSupplier);
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error);
      res.status(500).json({ error: 'Erro ao criar fornecedor' });
    }
  };

  // Atualizar fornecedor
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData: UpdateSupplierDTO = req.body;
      const updatedSupplier = await this.supplierService.update(id, updateData);

      if (!updatedSupplier) {
        return res.status(404).json({ error: 'Fornecedor não encontrado' });
      }

      res.json(updatedSupplier);
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error);
      res.status(500).json({ error: 'Erro ao atualizar fornecedor' });
    }
  };

  // Deletar fornecedor
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await this.supplierService.delete(id);

      if (!success) {
        return res.status(404).json({ error: 'Fornecedor não encontrado' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar fornecedor:', error);
      res.status(500).json({ error: 'Erro ao deletar fornecedor' });
    }
  };
} 