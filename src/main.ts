import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './users/modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global: todas las rutas quedan bajo /api/...
  app.setGlobalPrefix('api');

  // Habilitar validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Remueve propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades extras
      transform: true,            // Transforma tipos automáticamente
    })
  );

  // Habilitar CORS si necesitas frontend
  app.enableCors();

  // SOLO UNA LLAMADA A listen()
  const port = process.env.PORT || 4000;
  await app.listen(4000, '0.0.0.0');
  console.log(`🚀 API corriendo en http://localhost:4000/api`);
  console.log(`📱 Acceso móvil: http://10.73.162.38:4000/api`);
  
}
bootstrap();