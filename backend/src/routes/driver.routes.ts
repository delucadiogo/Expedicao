import { Router, Request, Response, NextFunction } from 'express';
import { DriverController } from '../controllers/driver.controller';
import { z } from 'zod';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();
const driverController = new DriverController();

// Schema Zod para criação de motorista
const createDriverSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  document: z.string().min(1, 'Documento é obrigatório'),
  phone: z.string().optional(),
  email: z.string().email('E-mail inválido').optional(),
  cnh: z.string().min(1, 'CNH é obrigatória'),
  cnhExpirationDate: z.string().min(1, 'Data de validade da CNH é obrigatória'),
});

// Schema Zod para atualização de motorista (todos os campos opcionais)
const updateDriverSchema = createDriverSchema.partial();

/**
 * Middleware para validar o corpo da requisição usando o schema Zod.
 * Retorna 400 e os erros de validação caso inválido.
 */
function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    next();
  };
}

// Rotas para motoristas
router.get('/drivers', authenticate, driverController.getAll);
router.get('/drivers/:id', authenticate, driverController.getById);
router.post('/drivers', authenticate, validate(createDriverSchema), driverController.create);
router.put('/drivers/:id', authenticate, validate(updateDriverSchema), driverController.update);
router.delete('/drivers/:id', authenticate, driverController.delete);

export default router; 