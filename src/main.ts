// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './users/modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👇 prefijo global uniforme: todas las rutas quedan bajo /api/...
  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
