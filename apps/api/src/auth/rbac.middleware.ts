import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './jwt.strategy';
import { UnauthorizedException, ForbiddenException } from '../exceptions';

// Extend Express Request interface to include user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedException('Missing or invalid Authorization header');
  }

const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  req.user = {
    id: decoded.sub,
    email: decoded.email,
    role: decoded.role,
  };

  next();
};

export const requireRoles = (roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenException(`Access denied. Requires one of roles: ${roles.join(', ')}`);
    }

    next();
  };
};
