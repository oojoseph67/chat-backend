import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    // { bufferLogs: true }
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.use(cookieParser());

  // app.useLogger(app.get(Logger));

  app.enableCors({
    origin: ['http://localhost:7777', 'http://localhost:5173'],
    credentials: true,
  });

  await app.listen(7778);
}
bootstrap();
