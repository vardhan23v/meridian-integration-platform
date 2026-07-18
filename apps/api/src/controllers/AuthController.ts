import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { successResponse } from '../utils/response';
import { z } from 'zod';
import { ValidationException } from '../exceptions';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationException('Invalid login payload', parsed.error.format());
      }

      const { email, password } = parsed.data;
      const result = await this.authService.login(email, password);

      return successResponse(res, 200, 'Login successful', result);
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const user = await this.authService.getMe(userId);
      return successResponse(res, 200, 'User profile retrieved', user);
    } catch (error) {
      next(error);
    }
  };
}
