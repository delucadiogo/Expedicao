import { Router } from 'express';
import { ExpeditionResponsibleController } from '../controllers/expeditionResponsible.controller';

const router = Router();
const expeditionResponsibleController = new ExpeditionResponsibleController();

// Rotas para responsáveis de expedição
router.get('/', expeditionResponsibleController.getAll);
router.get('/:id', expeditionResponsibleController.getById);
router.post('/', expeditionResponsibleController.create);
router.put('/:id', expeditionResponsibleController.update);
router.delete('/:id', expeditionResponsibleController.delete);

export default router; 