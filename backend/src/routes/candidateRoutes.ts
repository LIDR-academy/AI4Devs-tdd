import { Router } from 'express';
import { candidateController } from '../presentation/controllers/candidateController';

const router = Router();

router.post('/', candidateController.addCandidate);

export default router;
