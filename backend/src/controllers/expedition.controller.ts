import { Request, Response } from 'express';
import { ExpeditionService } from '../services/expedition.service';
import { CreateExpeditionDTO, UpdateExpeditionDTO } from '../types/expedition';

export class ExpeditionController {
  private expeditionService: ExpeditionService;

  constructor() {
    this.expeditionService = new ExpeditionService();
  }

  // Obter todas as expedições
  getAll = async (req: Request, res: Response) => {
    try {
      const filters = req.query;
      const expeditions = await this.expeditionService.getAll(filters);
      res.json(expeditions);
    } catch (error) {
      console.error('Erro ao buscar expedições no controller:', error);
      res.status(500).json({ error: 'Erro ao buscar expedições' });
    }
  };

  // Obter estatísticas das expedições
  getStats = async (req: Request, res: Response) => {
    try {
      const stats = await this.expeditionService.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Erro ao buscar estatísticas no controller:', error);
      res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
  };

  // Obter expedição por ID
  getById = async (req: Request, res: Response) => {
    try {
      console.log('Requisição GET /expeditions/:id recebida para ID:', req.params.id);
      const { id } = req.params;
      const expedition = await this.expeditionService.getById(id);
      
      if (!expedition) {
        return res.status(404).json({ error: 'Expedição não encontrada' });
      }
      
      res.json(expedition);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar expedição' });
    }
  };

  // Criar nova expedição
  create = async (req: Request, res: Response) => {
    try {
      console.log('Recebendo requisição para criar expedição:', req.body);
      const expeditionData: CreateExpeditionDTO = req.body;
      const newExpedition = await this.expeditionService.create(expeditionData);
      res.status(201).json(newExpedition);
    } catch (error) {
      console.error('Erro ao criar expedição no controller:', error);
      res.status(500).json({ error: 'Erro ao criar expedição' });
    }
  };

  // Atualizar expedição
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData: UpdateExpeditionDTO = req.body;
      const updatedExpedition = await this.expeditionService.update(id, updateData);
      
      if (!updatedExpedition) {
        return res.status(404).json({ error: 'Expedição não encontrada' });
      }
      
      res.json(updatedExpedition);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar expedição' });
    }
  };

  // Deletar expedição
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await this.expeditionService.delete(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Expedição não encontrada' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar expedição' });
    }
  };

  // Atualizar controle de qualidade
  updateQualityControl = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const qualityControlData = req.body;
      const updatedExpedition = await this.expeditionService.updateQualityControl(id, qualityControlData);
      
      if (!updatedExpedition) {
        return res.status(404).json({ error: 'Expedição não encontrada' });
      }
      
      res.json(updatedExpedition);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar controle de qualidade' });
    }
  };

  // Atualizar rejeição
  updateRejection = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const rejectionData = req.body;
      const updatedExpedition = await this.expeditionService.updateRejection(id, rejectionData);
      
      if (!updatedExpedition) {
        return res.status(404).json({ error: 'Expedição não encontrada' });
      }
      
      res.json(updatedExpedition);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar rejeição' });
    }
  };
} 