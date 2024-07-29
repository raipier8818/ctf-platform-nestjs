import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigType } from '@nestjs/config';
import appConfig from './config/app.config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  const port = config.port;
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(port);
  logger.log('Application listening on port 3000');
}
bootstrap();
