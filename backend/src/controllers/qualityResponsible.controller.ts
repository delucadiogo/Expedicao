import { Request, Response } from 'express';
import { QualityResponsibleService } from '../services/qualityResponsible.service';
import { CreateQualityResponsibleDTO, UpdateQualityResponsibleDTO } from '../types/qualityResponsible';

export class QualityResponsibleController {
  private qualityResponsibleService: QualityResponsibleService;

  constructor() {
    this.qualityResponsibleService = new QualityResponsibleService();
  }

  // Obter todos os responsáveis pela qualidade
  getAll = async (req: Request, res: Response) => {
    try {
      const qualityResponsibles = await this.qualityResponsibleService.getAll();
      res.json(qualityResponsibles);
    } catch (error) {
      console.error('Erro ao buscar responsáveis pela qualidade:', error);
      res.status(500).json({ error: 'Erro ao buscar responsáveis pela qualidade' });
    }
  };

  // Obter responsável pela qualidade por ID
  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const qualityResponsible = await this.qualityResponsibleService.getById(id);

      if (!qualityResponsible) {
        return res.status(404).json({ error: 'Responsável pela qualidade não encontrado' });
      }

      res.json(qualityResponsible);
    } catch (error) {
      console.error('Erro ao buscar responsável pela qualidade por ID:', error);
      res.status(500).json({ error: 'Erro ao buscar responsável pela qualidade' });
    }
  };

  // Criar novo responsável pela qualidade
  create = async (req: Request, res: Response) => {
    try {
      const qualityResponsibleData: CreateQualityResponsibleDTO = req.body;
      const newQualityResponsible = await this.qualityResponsibleService.create(qualityResponsibleData);
      res.status(201).json(newQualityResponsible);
    } catch (error) {
      console.error('Erro ao criar responsável pela qualidade:', error);
      res.status(500).json({ error: 'Erro ao criar responsável pela qualidade' });
    }
  };

  // Atualizar responsável pela qualidade
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData: UpdateQualityResponsibleDTO = req.body;
      const updatedQualityResponsible = await this.qualityResponsibleService.update(id, updateData);

      if (!updatedQualityResponsible) {
        return res.status(404).json({ error: 'Responsável pela qualidade não encontrado' });
      }

      res.json(updatedQualityResponsible);
    } catch (error) {
      console.error('Erro ao atualizar responsável pela qualidade:', error);
      res.status(500).json({ error: 'Erro ao atualizar responsável pela qualidade' });
    }
  };

  // Deletar responsável pela qualidade
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await this.qualityResponsibleService.delete(id);

      if (!success) {
        return res.status(404).json({ error: 'Responsável pela qualidade não encontrado' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar responsável pela qualidade:', error);
      res.status(500).json({ error: 'Erro ao deletar responsável pela qualidade' });
    }
  };
} 