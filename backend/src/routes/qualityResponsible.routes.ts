import { Router } from 'express';
import { QualityResponsibleController } from '../controllers/qualityResponsible.controller';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

const router = Router();
const qualityResponsibleController = new QualityResponsibleController();

const createQualityResponsibleSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  position: z.string().min(1, 'Cargo é obrigatório'),
  sector: z.string().min(1, 'Setor é obrigatório'),
  email: z.string().email('E-mail inválido').optional(),
  phone: z.string().optional(),
  digitalSignature: z.string().optional(),
});
const updateQualityResponsibleSchema = createQualityResponsibleSchema.partial();

function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    next();
  };
}

// Rotas para responsáveis pela qualidade
router.get('/', qualityResponsibleController.getAll);
router.get('/:id', qualityResponsibleController.getById);
router.post('/', validate(createQualityResponsibleSchema), qualityResponsibleController.create);
router.put('/:id', validate(updateQualityResponsibleSchema), qualityResponsibleController.update);
router.delete('/:id', qualityResponsibleController.delete);

export default router; 