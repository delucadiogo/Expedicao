import { Router } from 'express';
import { QualityResponsibleController } from '../controllers/qualityResponsible.controller';

const router = Router();
const qualityResponsibleController = new QualityResponsibleController();

// Rotas para responsáveis pela qualidade
router.get('/', qualityResponsibleController.getAll);
router.get('/:id', qualityResponsibleController.getById);
router.post('/', qualityResponsibleController.create);
router.put('/:id', qualityResponsibleController.update);
router.delete('/:id', qualityResponsibleController.delete);

export default router; 