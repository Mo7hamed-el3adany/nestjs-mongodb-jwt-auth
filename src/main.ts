import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV } from './common/enums/env.enum';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.enableCors();
  app.use(
    rateLimit({
      windowMs: 10000, // 10 sec
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The API documentation')
    .setVersion('1.0')
    .addTag('nestjs-mongodb-jwt-auth-starter')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ErrorInterceptor());

  await app.listen(+configService.get(ENV.PORT), configService.get(ENV.HOST));

  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
