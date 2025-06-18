import { Router } from 'express';
import { ProductCatalogController } from '../controllers/productCatalog.controller';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

const router = Router();
const productCatalogController = new ProductCatalogController();

const createProductCatalogSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  code: z.string().min(1, 'Código é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  unit: z.string().min(1, 'Unidade é obrigatória'),
  description: z.string().optional(),
});
const updateProductCatalogSchema = createProductCatalogSchema.partial();

function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    next();
  };
}

// Rotas para o catálogo de produtos
router.get('/product-catalog', productCatalogController.getAll);
router.get('/product-catalog/:id', productCatalogController.getById);
router.post('/product-catalog', validate(createProductCatalogSchema), productCatalogController.create);
router.put('/product-catalog/:id', validate(updateProductCatalogSchema), productCatalogController.update);
router.delete('/product-catalog/:id', productCatalogController.delete);

export default router;