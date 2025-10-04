import { Router } from 'express';
import * as controller from '../controllers/information.controller';

const router = Router();

router.get('/', (req, res) => res.json({ message: 'API is running' }));

router.get('/information', controller.listInformation);
router.get('/information/:id', controller.getInformationById);
router.get('/health', controller.health);

export default router;
