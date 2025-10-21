// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RidesModule } from './rides/rides.module';
import { SlotsModule } from './slots/slots.module';

@Module({
  imports: [

    ConfigModule.forRoot({ isGlobal: true }),


    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        uri: cfg.get<string>(
          'MONGODB_URI',

          'mongodb://api_user:api1234@mongo:27017/jsrl_project?authSource=admin',
        ),
      }),
    }),


    AuthModule,
    UsersModule,


    RidesModule,
    SlotsModule,
  ],
})
export class AppModule {}
