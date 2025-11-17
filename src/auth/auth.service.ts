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
    const userRoles = (user as any).roles || [];
    const userRole = userRoles[0] || 'passenger';
    
    const payload = { 
      sub: userId, 
      email: user.email, 
      roles: userRoles  // ← MANTENER ARRAY para el backend
    };
    const access_token = await this.jwt.signAsync(payload);

    return {
      access_token,
      user: {
        _id: userId,
        name: (user as any).name,
        email: user.email,
        role: userRole,  // ← String para el frontend
      },
    };
  }

  /**
   * Login flow
   */
  async login(loginDto: { email: string; password: string }) {
    // Validar que vengan los datos
    if (!loginDto || !loginDto.email || !loginDto.password) {
      throw new UnauthorizedException('Email y contraseña son requeridos');
    }

    const user = await this.users.findByEmail(loginDto.email);
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
      // Es un hash de bcrypt - validar que tengamos el password
      if (!loginDto.password) {
        throw new UnauthorizedException('Credenciales inválidas');
      }
      ok = await bcrypt.compare(loginDto.password, stored);
    } else {
      // Es plaintext
      ok = stored === loginDto.password;
    }

    if (!ok) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Normalize id and roles
    const userId = (user as any)._id?.toString() || (user as any).id;
    const userRoles = (user as any).roles ?? [];
    const userRole = userRoles[0] || 'passenger';
    
    const payload = { 
      sub: userId, 
      email: user.email, 
      roles: userRoles  // ← MANTENER ARRAY para el backend
    };
    const access_token = await this.jwt.signAsync(payload);

    const safeUser = {
      _id: userId,
      name: (user as any).name,
      email: user.email,
      role: userRole,  // ← String para el frontend
    };

    return { access_token, user: safeUser };
  }
}