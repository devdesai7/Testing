// src/middleware/auth.ts

import { Response, NextFunction } from 'express';
import { verifyToken } from './jwt';
import { IUserAuthInfoRequest } from '../types/express.type';

/*
    Use this as middleware on any routing

    e.g @UseBefore(authMiddleware([requiredRoles]))
*/

export function authMiddleware(requiredRoles?: string[]) {
  return (req: IUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // Expecting 'Bearer <token>'

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    // Check if the user's role matches any of the required roles
    if (requiredRoles?.length && !requiredRoles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // Attach user info to request object
    req.user = {
      _id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    return next();
  };
}
