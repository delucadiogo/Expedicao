import { Router } from 'express';
import { TruckController } from '../controllers/truck.controller';

const router = Router();
const truckController = new TruckController();

// Rotas para caminhões
router.get('/trucks', truckController.getAll);
router.get('/trucks/:id', truckController.getById);
router.post('/trucks', truckController.create);
router.put('/trucks/:id', truckController.update);
router.delete('/trucks/:id', truckController.delete);

export default router; 