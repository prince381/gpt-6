import { Router } from 'express';
import GPT from '../controllers/GPT';

const router = Router();

router.post('/query', GPT.query);

export default router;