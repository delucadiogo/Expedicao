import { Router } from 'express';
import { SupplierController } from '../controllers/supplier.controller';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();
const supplierController = new SupplierController();

const createSupplierSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  document: z.string().min(1, 'Documento é obrigatório'),
  email: z.string().email('E-mail inválido').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});
const updateSupplierSchema = createSupplierSchema.partial();

function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    next();
  };
}

// Rotas para fornecedores
router.get('/', authenticate, supplierController.getAll);
router.get('/:id', authenticate, supplierController.getById);
router.post('/', authenticate, validate(createSupplierSchema), supplierController.create);
router.put('/:id', authenticate, validate(updateSupplierSchema), supplierController.update);
router.delete('/:id', authenticate, supplierController.delete);

export default router; 