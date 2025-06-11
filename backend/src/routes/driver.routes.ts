import { Router } from 'express';
import { DriverController } from '../controllers/driver.controller';

const router = Router();
const driverController = new DriverController();

// Rotas para motoristas
router.get('/drivers', driverController.getAll);
router.get('/drivers/:id', driverController.getById);
router.post('/drivers', driverController.create);
router.put('/drivers/:id', driverController.update);
router.delete('/drivers/:id', driverController.delete);

export default router; 