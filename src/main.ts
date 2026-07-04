import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {bufferLogs:true,});
  app.useGlobalPipes(new ValidationPipe({whitelist: true,transform: true, forbidNonWhitelisted: true}));
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
