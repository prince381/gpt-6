import { Router } from 'express';
import GPT from '../controllers/GPT';

const router = Router();

router.post('/query', GPT.query);
router.post('/create-embedding', GPT.createEmbedding);

export default router;