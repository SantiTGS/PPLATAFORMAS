import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  /**
   * Login flow used by AuthController.
   * Accepts email/password, validates against either passwordHash (preferred) or password (plaintext fallback),
   * then signs a JWT with { sub, email, roles }.
   */
  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Support both hashed and plaintext (for existing seeded admins)
    const stored = (user as any).passwordHash ?? (user as any).password;
    if (!stored) {
      throw new UnauthorizedException('Invalid credentials');
    }

    let ok = false;
    // If it looks like a bcrypt hash, compare; otherwise compare plaintext.
    if (typeof stored === 'string' && stored.startsWith('$2')) {
      ok = await bcrypt.compare(password, stored);
    } else {
      ok = stored === password;
    }

    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Normalize id coming from SQL (id: number/string) or Mongo (ObjectId in _id)
    const rawId = (user as any).id ?? (user as any)._id;
    const userId =
      typeof rawId === 'object'
        ? (rawId && typeof rawId.toString === 'function' ? rawId.toString() : String(rawId))
        : rawId;

    const payload = { sub: userId, email: user.email, roles: (user as any).roles ?? [] };
    const access_token = await this.jwt.signAsync(payload);

    // Return minimal safe user data
    const safeUser = {
      id: userId,
      email: user.email,
      roles: (user as any).roles ?? [],
    };

    return { access_token, user: safeUser };
  }
}
