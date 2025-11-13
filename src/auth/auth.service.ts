import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/services/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  /**
   * Registro de nuevo usuario
   */
  async register(dto: RegisterDto) {
    // Verificar si el usuario ya existe
    const existing = await this.users.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Crear usuario con rol por defecto 'passenger' si no se especifica
    const user = await this.users.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      roles: dto.roles || ['passenger'],
      active: true,
    });

    // Generar token
    const userId = (user as any)._id?.toString() || (user as any).id;
    const payload = { 
      sub: userId, 
      email: user.email, 
      roles: (user as any).roles 
    };
    const access_token = await this.jwt.signAsync(payload);

    return {
      access_token,
      user: {
        id: userId,
        name: (user as any).name,
        email: user.email,
        roles: (user as any).roles,
      },
    };
  }

  /**
   * Login flow
   */
  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Support both hashed and plaintext (for existing seeded admins)
    const stored = (user as any).passwordHash ?? (user as any).password;
    if (!stored) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    let ok = false;
    // If it looks like a bcrypt hash, compare; otherwise compare plaintext.
    if (typeof stored === 'string' && stored.startsWith('$2')) {
      ok = await bcrypt.compare(password, stored);
    } else {
      ok = stored === password;
    }

    if (!ok) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Normalize id
    const userId = (user as any)._id?.toString() || (user as any).id;
    const payload = { 
      sub: userId, 
      email: user.email, 
      roles: (user as any).roles ?? [] 
    };
    const access_token = await this.jwt.signAsync(payload);

    const safeUser = {
      id: userId,
      name: (user as any).name,
      email: user.email,
      roles: (user as any).roles ?? [],
    };

    return { access_token, user: safeUser };
  }
}