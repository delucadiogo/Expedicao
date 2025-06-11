import { Router } from 'express';
import { ExpeditionController } from '../controllers/expedition.controller';

const router = Router();
const expeditionController = new ExpeditionController();

// Rotas para expedições
router.get('/expeditions', expeditionController.getAll);
router.get('/expeditions/stats', expeditionController.getStats);
router.get('/expeditions/:id', expeditionController.getById);
router.post('/expeditions', expeditionController.create);
router.put('/expeditions/:id', expeditionController.update);
router.delete('/expeditions/:id', expeditionController.delete);

// Rotas para controle de qualidade
router.put('/expeditions/:id/quality-control', expeditionController.updateQualityControl);

// Rotas para rejeição
router.put('/expeditions/:id/rejection', expeditionController.updateRejection);

export default router; 