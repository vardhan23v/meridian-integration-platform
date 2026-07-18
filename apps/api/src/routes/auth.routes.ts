import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { prisma } from '../prisma/client';
import { requireAuth } from '../auth/rbac.middleware';

const router: Router = Router();
const authService = new AuthService(prisma);
const authController = new AuthController(authService);

router.post('/login', authController.login);
router.get('/me', requireAuth, authController.getMe);

export { router as authRoutes };
