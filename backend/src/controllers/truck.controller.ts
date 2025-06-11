import { Request, Response } from 'express';
import { TruckService } from '../services/truck.service';
import { CreateTruckDTO, UpdateTruckDTO } from '../types/truck';

export class TruckController {
  private truckService: TruckService;

  constructor() {
    this.truckService = new TruckService();
  }

  // Obter todos os caminhões
  getAll = async (req: Request, res: Response) => {
    try {
      const trucks = await this.truckService.getAll();
      res.json(trucks);
    } catch (error) {
      console.error('Erro ao buscar caminhões:', error);
      res.status(500).json({ error: 'Erro ao buscar caminhões' });
    }
  };

  // Obter caminhão por ID
  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const truck = await this.truckService.getById(id);

      if (!truck) {
        return res.status(404).json({ error: 'Caminhão não encontrado' });
      }

      res.json(truck);
    } catch (error) {
      console.error('Erro ao buscar caminhão por ID:', error);
      res.status(500).json({ error: 'Erro ao buscar caminhão' });
    }
  };

  // Criar novo caminhão
  create = async (req: Request, res: Response) => {
    try {
      const truckData: CreateTruckDTO = req.body;
      const newTruck = await this.truckService.create(truckData);
      res.status(201).json(newTruck);
    } catch (error) {
      console.error('Erro ao criar caminhão:', error);
      res.status(500).json({ error: 'Erro ao criar caminhão' });
    }
  };

  // Atualizar caminhão
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData: UpdateTruckDTO = req.body;
      const updatedTruck = await this.truckService.update(id, updateData);

      if (!updatedTruck) {
        return res.status(404).json({ error: 'Caminhão não encontrado' });
      }

      res.json(updatedTruck);
    } catch (error) {
      console.error('Erro ao atualizar caminhão:', error);
      res.status(500).json({ error: 'Erro ao atualizar caminhão' });
    }
  };

  // Deletar caminhão
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await this.truckService.delete(id);

      if (!success) {
        return res.status(404).json({ error: 'Caminhão não encontrado' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar caminhão:', error);
      res.status(500).json({ error: 'Erro ao deletar caminhão' });
    }
  };
} 