import { Router } from 'express';
import { SupplierController } from '../controllers/supplier.controller';

const router = Router();
const supplierController = new SupplierController();

// Rotas para fornecedores
router.get('/', supplierController.getAll);
router.get('/:id', supplierController.getById);
router.post('/', supplierController.create);
router.put('/:id', supplierController.update);
router.delete('/:id', supplierController.delete);

export default router; 