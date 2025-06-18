import { Router } from 'express';
import { ExpeditionResponsibleController } from '../controllers/expeditionResponsible.controller';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();
const expeditionResponsibleController = new ExpeditionResponsibleController();

// Rotas para responsáveis de expedição
router.get('/', authenticate, expeditionResponsibleController.getAll);
router.get('/:id', authenticate, expeditionResponsibleController.getById);

const createExpeditionResponsibleSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  position: z.string().min(1, 'Cargo é obrigatório'),
  sector: z.string().min(1, 'Setor é obrigatório'),
  email: z.string().email('E-mail inválido').optional(),
  phone: z.string().optional(),
});
const updateExpeditionResponsibleSchema = createExpeditionResponsibleSchema.partial();

function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    next();
  };
}

router.post('/', authenticate, validate(createExpeditionResponsibleSchema), expeditionResponsibleController.create);
router.put('/:id', authenticate, validate(updateExpeditionResponsibleSchema), expeditionResponsibleController.update);
router.delete('/:id', authenticate, expeditionResponsibleController.delete);

export default router; 