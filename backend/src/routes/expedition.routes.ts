import { Router } from 'express';
import { ExpeditionController } from '../controllers/expedition.controller';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

const router = Router();
const expeditionController = new ExpeditionController();

// Schema para Product
const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  code: z.string().min(1),
  quantity: z.number(),
  unit: z.string().min(1),
  batch: z.string().optional(),
  expiryDate: z.string().optional(),
  status: z.enum(['novo', 'usado', 'danificado', 'a_verificar']),
  observations: z.string().optional(),
});

// Schema para QualityControl
const qualityControlSchema = z.object({
  responsibleName: z.string().min(1),
  analysisDateTime: z.string().optional(),
  approvalStatus: z.enum(['aprovado', 'rejeitado', 'pendente']),
  justification: z.string().optional(),
  digitalSignature: z.string().optional(),
  observations: z.string().optional(),
});

// Schema para Rejection
const rejectionSchema = z.object({
  reason: z.string().min(1),
  sentToSupplies: z.boolean(),
  suppliesDateTime: z.string().optional(),
  suppliesResponsible: z.string().optional(),
  cargoRetained: z.boolean(),
  retainedQuantity: z.number().optional(),
  retentionLocation: z.string().optional(),
  correctiveActions: z.string().optional(),
});

// Schema para criação de expedição
const createExpeditionSchema = z.object({
  expeditionNumber: z.string().min(1),
  truckPlate: z.string().min(1),
  driverName: z.string().min(1),
  driverDocument: z.string().min(1),
  transportCompany: z.string().optional(),
  supplierName: z.string().min(1),
  supplierDocument: z.string().min(1),
  expeditionResponsible: z.string().min(1),
  responsiblePosition: z.string().optional(),
  products: z.array(productSchema),
  status: z.enum(['pendente', 'em_analise', 'aprovado', 'rejeitado', 'retido']),
  qualityControl: qualityControlSchema,
  rejection: rejectionSchema.optional(),
  dateTime: z.string().min(1),
  createdBy: z.string().min(1),
  observations: z.string().optional(),
  arrivalDateTime: z.string().optional(),
});

// Schema para atualização de expedição (todos os campos opcionais)
const updateExpeditionSchema = createExpeditionSchema.partial();

// Middleware genérico de validação
function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    next();
  };
}

// Rotas para expedições
router.get('/expeditions', expeditionController.getAll);
router.get('/expeditions/stats', expeditionController.getStats);
router.get('/expeditions/:id', expeditionController.getById);
router.post('/expeditions', validate(createExpeditionSchema), expeditionController.create);
router.put('/expeditions/:id', validate(updateExpeditionSchema), expeditionController.update);
router.delete('/expeditions/:id', expeditionController.delete);

// Rotas para controle de qualidade
router.put('/expeditions/:id/quality-control', validate(qualityControlSchema), expeditionController.updateQualityControl);

// Rotas para rejeição
router.put('/expeditions/:id/rejection', validate(rejectionSchema), expeditionController.updateRejection);

export default router; 