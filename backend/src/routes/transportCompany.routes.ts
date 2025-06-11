import { Router } from 'express';
import { TransportCompanyController } from '../controllers/transportCompany.controller';

const router = Router();
const transportCompanyController = new TransportCompanyController();

// Rotas para empresas de transporte
router.get('/transport-companies', transportCompanyController.getAll);
router.get('/transport-companies/:id', transportCompanyController.getById);
router.post('/transport-companies', transportCompanyController.create);
router.put('/transport-companies/:id', transportCompanyController.update);
router.delete('/transport-companies/:id', transportCompanyController.delete);

export default router; 