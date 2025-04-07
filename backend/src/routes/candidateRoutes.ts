import { Router } from 'express';
import { candidateController } from '../presentation/controllers/candidateController';

const router = Router();

router.post('/', candidateController.addCandidate);
router.get('/:id', candidateController.getCandidate);
router.put('/:id', candidateController.updateCandidate);

export default router;
