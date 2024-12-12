import jwt from 'jsonwebtoken';
import { env } from '../env';

const secret = env.app.auth.jwtsecret;
const expiresIn = env.app.auth.expiresIn;
export function generateToken(payload: any): string {
  return jwt.sign(payload, secret, { expiresIn: expiresIn });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, secret);
  } catch (e) {
    return null;
  }
}
