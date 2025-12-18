import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from './data-source';
import * as express from 'express';

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log('DataSource inicializado correctamente');
  } catch (error) {
    console.error('Error inicializando DataSource:', error);
  }

  const app = await NestFactory.create(AppModule);

  // Configuración de CORS para permitir cualquier origen
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Middleware para parsear JSON
  app.use(express.json());

  // Puerto dinámico para Railway
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Servidor corriendo en el puerto ${port}`);
}

bootstrap();
