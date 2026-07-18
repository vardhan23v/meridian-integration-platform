import { Router } from 'express';
import {
  listDLQ,
  retryMessage,
  resolveMessage,
} from '../controllers/DLQController';

const router: Router = Router();

router.get('/', listDLQ);
router.post('/:id/retry', retryMessage);
router.post('/:id/resolve', resolveMessage);

export const dlqRoutes: Router = router;
