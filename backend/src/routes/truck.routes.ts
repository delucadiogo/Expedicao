import { Router } from 'express';
import { TruckController } from '../controllers/truck.controller';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();
const truckController = new TruckController();

const createTruckSchema = z.object({
  plate: z.string().min(1, 'Placa é obrigatória'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  brand: z.string().min(1, 'Marca é obrigatória'),
  year: z.number(),
  axles: z.number(),
  capacity: z.number(),
});
const updateTruckSchema = createTruckSchema.partial();

function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    next();
  };
}

// Rotas para caminhões
router.get('/trucks', authenticate, truckController.getAll);
router.get('/trucks/:id', authenticate, truckController.getById);
router.post('/trucks', authenticate, validate(createTruckSchema), truckController.create);
router.put('/trucks/:id', authenticate, validate(updateTruckSchema), truckController.update);
router.delete('/trucks/:id', authenticate, truckController.delete);

export default router; 