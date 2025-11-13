// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../../users/modules/users.module';
import { RidesModule } from '../../rides/modules/rides.module';

@Module({
  imports: [
    // Carga .env y lo vuelve global
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexión a Mongo leyendo MONGODB_URI del .env
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        uri: cfg.get<string>(
          'MONGODB_URI',
          // fallback solo si no hay .env; puedes dejarlo igual que tu compose
          'mongodb://api_user:api1234@mongo:27017/jsrl_project?authSource=admin',
        ),
      }),
    }),

    // Módulos de la app
    AuthModule,
    UsersModule,

    // 👇 Importa RidesModule DESPUÉS de Mongoose para que registre su schema y controller
    RidesModule,
  ],
})
export class AppModule {}
