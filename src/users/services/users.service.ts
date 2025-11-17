import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    // Seed de admin
    (async () => {
      const email = 'admin@demo.com';
      const exists = await this.findByEmail(email);
      if (!exists) {
        await this.create({
          email,
          name: 'Admin',
          password: 'admin123',
          roles: ['admin'],
          active: true,
        });
      }
    })();
  }

  async create(data: Partial<User>) {
    try {
      // Preparar objeto para crear
      const userData: any = {
        name: data.name,
        email: data.email,
        roles: data.roles ?? [],
        active: data.active ?? true,
      };

      // Agregar passwordHash si existe (IMPORTANTE)
      if (data.passwordHash) {
        userData.passwordHash = data.passwordHash;
      }

      // Agregar password solo si existe (para seeds)
      if (data.password && !data.passwordHash) {
        userData.password = data.password;
      }

      const doc = await this.userModel.create(userData);
      return doc.toObject();
    } catch (err: any) {
      if (err?.code === 11000) {
        throw new ConflictException('Email ya existe');
      }
      throw err;
    }
  }

  async findAll() {
    return this.userModel.find().lean().exec();
  }

  async findByEmail(email: string | any) {
    // Validar y extraer el email como string
    let emailStr: string;
    
    if (typeof email === 'string') {
      emailStr = email;
    } else if (email && typeof email === 'object' && email.email) {
      emailStr = email.email;
    } else {
      return null;
    }

    // Validar que sea un string válido
    if (!emailStr || typeof emailStr !== 'string') {
      return null;
    }

    return this.userModel.findOne({ email: emailStr.toLowerCase().trim() }).lean().exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).lean().exec();
  }

  async update(id: string, patch: Partial<User>) {
    const doc = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            ...(patch.name !== undefined ? { name: patch.name } : {}),
            ...(patch.email !== undefined ? { email: patch.email } : {}),
            ...(patch.password !== undefined ? { password: patch.password } : {}),
            ...(patch.passwordHash !== undefined ? { passwordHash: patch.passwordHash } : {}),
            ...(patch.roles !== undefined ? { roles: patch.roles } : {}),
            ...(patch.active !== undefined ? { active: patch.active } : {}),
          },
        },
        { new: true, runValidators: true },
      )
      .lean()
      .exec();
    return doc;
  }

  async remove(id: string) {
    const res = await this.userModel.findByIdAndDelete(id).lean().exec();
    return res;
  }
}