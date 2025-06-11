import { Request, Response } from 'express';
import { TransportCompanyService } from '../services/transportCompany.service';
import { CreateTransportCompanyDTO, UpdateTransportCompanyDTO } from '../types/transportCompany';

export class TransportCompanyController {
  private transportCompanyService: TransportCompanyService;

  constructor() {
    this.transportCompanyService = new TransportCompanyService();
  }

  // Obter todas as empresas de transporte
  getAll = async (req: Request, res: Response) => {
    try {
      const companies = await this.transportCompanyService.getAll();
      res.json(companies);
    } catch (error) {
      console.error('Erro ao buscar empresas de transporte:', error);
      res.status(500).json({ error: 'Erro ao buscar empresas de transporte' });
    }
  };

  // Obter empresa de transporte por ID
  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const company = await this.transportCompanyService.getById(id);

      if (!company) {
        return res.status(404).json({ error: 'Empresa de transporte não encontrada' });
      }

      res.json(company);
    } catch (error) {
      console.error('Erro ao buscar empresa de transporte por ID:', error);
      res.status(500).json({ error: 'Erro ao buscar empresa de transporte' });
    }
  };

  // Criar nova empresa de transporte
  create = async (req: Request, res: Response) => {
    try {
      const companyData: CreateTransportCompanyDTO = req.body;
      const newCompany = await this.transportCompanyService.create(companyData);
      res.status(201).json(newCompany);
    } catch (error) {
      console.error('Erro ao criar empresa de transporte:', error);
      res.status(500).json({ error: 'Erro ao criar empresa de transporte' });
    }
  };

  // Atualizar empresa de transporte
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData: UpdateTransportCompanyDTO = req.body;
      const updatedCompany = await this.transportCompanyService.update(id, updateData);

      if (!updatedCompany) {
        return res.status(404).json({ error: 'Empresa de transporte não encontrada' });
      }

      res.json(updatedCompany);
    } catch (error) {
      console.error('Erro ao atualizar empresa de transporte:', error);
      res.status(500).json({ error: 'Erro ao atualizar empresa de transporte' });
    }
  };

  // Deletar empresa de transporte
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await this.transportCompanyService.delete(id);

      if (!success) {
        return res.status(404).json({ error: 'Empresa de transporte não encontrada' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar empresa de transporte:', error);
      res.status(500).json({ error: 'Erro ao deletar empresa de transporte' });
    }
  };
} 