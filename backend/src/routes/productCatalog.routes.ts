import { Router } from 'express';
import { ProductCatalogController } from '../controllers/productCatalog.controller';

const router = Router();
const productCatalogController = new ProductCatalogController();

// Rotas para o catálogo de produtos
router.get('/product-catalog', productCatalogController.getAll);
router.get('/product-catalog/:id', productCatalogController.getById);
router.post('/product-catalog', productCatalogController.create);
router.put('/product-catalog/:id', productCatalogController.update);
router.delete('/product-catalog/:id', productCatalogController.delete);

export default router;