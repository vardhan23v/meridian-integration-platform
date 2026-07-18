import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { JwtPayload } from '@meridian/shared';
import { UnauthorizedException } from '../exceptions';

export const generateTokens = (user: { id: string; email: string; role: string }) => {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRY as jwt.SignOptions['expiresIn'],
  });

  const refreshToken = jwt.sign({ sub: user.id }, config.JWT_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRY as jwt.SignOptions['expiresIn'],
  });

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.JWT_SECRET) as JwtPayload;
  } catch {
    throw new UnauthorizedException('Invalid or expired token');
  }
};
