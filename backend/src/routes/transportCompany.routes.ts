import { Router } from 'express';
import { TransportCompanyController } from '../controllers/transportCompany.controller';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();
const transportCompanyController = new TransportCompanyController();

// Rotas para empresas de transporte
router.get('/transport-companies', authenticate, transportCompanyController.getAll);
router.get('/transport-companies/:id', authenticate, transportCompanyController.getById);

const createTransportCompanySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  document: z.string().min(1, 'Documento é obrigatório'),
  phone: z.string().optional(),
  email: z.string().email('E-mail inválido').optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});
const updateTransportCompanySchema = createTransportCompanySchema.partial();

function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    next();
  };
}

router.post('/transport-companies', authenticate, validate(createTransportCompanySchema), transportCompanyController.create);
router.put('/transport-companies/:id', authenticate, validate(updateTransportCompanySchema), transportCompanyController.update);
router.delete('/transport-companies/:id', authenticate, transportCompanyController.delete);

export default router; 