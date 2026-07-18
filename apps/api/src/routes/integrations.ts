import { Router } from 'express';
import {
  listJobs,
  getJob,
  triggerJob,
} from '../controllers/integrationJobController';

const router: Router = Router();

router.get('/', listJobs);
router.get('/:id', getJob);
router.post('/trigger', triggerJob);

export const integrationRoutes: Router = router;
