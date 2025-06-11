import { Request, Response } from 'express';
import { DriverService } from '../services/driver.service';
import { CreateDriverDTO, UpdateDriverDTO } from '../types/driver';

export class DriverController {
  private driverService: DriverService;

  constructor() {
    this.driverService = new DriverService();
  }

  // Obter todos os motoristas
  getAll = async (req: Request, res: Response) => {
    try {
      const drivers = await this.driverService.getAll();
      res.json(drivers);
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error);
      res.status(500).json({ error: 'Erro ao buscar motoristas' });
    }
  };

  // Obter motorista por ID
  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const driver = await this.driverService.getById(id);

      if (!driver) {
        return res.status(404).json({ error: 'Motorista não encontrado' });
      }

      res.json(driver);
    } catch (error) {
      console.error('Erro ao buscar motorista por ID:', error);
      res.status(500).json({ error: 'Erro ao buscar motorista' });
    }
  };

  // Criar novo motorista
  create = async (req: Request, res: Response) => {
    try {
      const driverData: CreateDriverDTO = req.body;
      const newDriver = await this.driverService.create(driverData);
      res.status(201).json(newDriver);
    } catch (error) {
      console.error('Erro ao criar motorista:', error);
      res.status(500).json({ error: 'Erro ao criar motorista' });
    }
  };

  // Atualizar motorista
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData: UpdateDriverDTO = req.body;
      const updatedDriver = await this.driverService.update(id, updateData);

      if (!updatedDriver) {
        return res.status(404).json({ error: 'Motorista não encontrado' });
      }

      res.json(updatedDriver);
    } catch (error) {
      console.error('Erro ao atualizar motorista:', error);
      res.status(500).json({ error: 'Erro ao atualizar motorista' });
    }
  };

  // Deletar motorista
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await this.driverService.delete(id);

      if (!success) {
        return res.status(404).json({ error: 'Motorista não encontrado' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar motorista:', error);
      res.status(500).json({ error: 'Erro ao deletar motorista' });
    }
  };
} 