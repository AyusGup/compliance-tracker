import { Router } from 'express';
import { getClients } from '../../controllers/v1/clients';

const router = Router();

router.get('/', getClients);

export default router;
