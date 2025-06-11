import { Request, Response } from 'express';
import { ExpeditionResponsibleService } from '../services/expeditionResponsible.service';
import { CreateExpeditionResponsibleDTO, UpdateExpeditionResponsibleDTO } from '../types/expeditionResponsible';

export class ExpeditionResponsibleController {
  private expeditionResponsibleService: ExpeditionResponsibleService;

  constructor() {
    this.expeditionResponsibleService = new ExpeditionResponsibleService();
  }

  // Obter todos os responsáveis de expedição
  getAll = async (req: Request, res: Response) => {
    try {
      const responsibles = await this.expeditionResponsibleService.getAll();
      res.json(responsibles);
    } catch (error) {
      console.error('Erro ao buscar responsáveis de expedição:', error);
      res.status(500).json({ error: 'Erro ao buscar responsáveis de expedição' });
    }
  };

  // Obter responsável de expedição por ID
  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const responsible = await this.expeditionResponsibleService.getById(id);

      if (!responsible) {
        return res.status(404).json({ error: 'Responsável de expedição não encontrado' });
      }

      res.json(responsible);
    } catch (error) {
      console.error('Erro ao buscar responsável de expedição por ID:', error);
      res.status(500).json({ error: 'Erro ao buscar responsável de expedição' });
    }
  };

  // Criar novo responsável de expedição
  create = async (req: Request, res: Response) => {
    try {
      const responsibleData: CreateExpeditionResponsibleDTO = req.body;
      const newResponsible = await this.expeditionResponsibleService.create(responsibleData);
      res.status(201).json(newResponsible);
    } catch (error) {
      console.error('Erro ao criar responsável de expedição:', error);
      res.status(500).json({ error: 'Erro ao criar responsável de expedição' });
    }
  };

  // Atualizar responsável de expedição
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData: UpdateExpeditionResponsibleDTO = req.body;
      const updatedResponsible = await this.expeditionResponsibleService.update(id, updateData);

      if (!updatedResponsible) {
        return res.status(404).json({ error: 'Responsável de expedição não encontrado' });
      }

      res.json(updatedResponsible);
    } catch (error) {
      console.error('Erro ao atualizar responsável de expedição:', error);
      res.status(500).json({ error: 'Erro ao atualizar responsável de expedição' });
    }
  };

  // Deletar responsável de expedição
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await this.expeditionResponsibleService.delete(id);

      if (!success) {
        return res.status(404).json({ error: 'Responsável de expedição não encontrado' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar responsável de expedição:', error);
      res.status(500).json({ error: 'Erro ao deletar responsável de expedição' });
    }
  };
} 