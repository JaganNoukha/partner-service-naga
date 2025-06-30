import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { name } from '../package.json';
import { AppModule } from './app.module';
import { Whitelists } from './common/constants/service-common.constants';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseTransformInterceptor } from './common/interceptor/response-transform.interceptor';
import { AppLoggerService } from './common/logger/logger.service';
import { documentOptions, options, swaggerConfig } from './modules/swagger/swagger.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.setGlobalPrefix(`api/${name}`);
  
    app.enableCors({
    origin(origin, callback) {
      if (!origin || Whitelists.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  });

    app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Use custom logger globally
  const logger = app.get(AppLoggerService);
  app.useLogger(logger);

  // Swagger Setup
  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    documentOptions,
  );

  SwaggerModule.setup(`/api-docs/${name}`, app, document, options);


  logger.log('🚀 NestJS App Started...');
  const APP_PORT = process.env.PORT ?? 3000;
  await app.listen(APP_PORT, () => {
    logger.log(`✅ Server is running on http://localhost:${APP_PORT}`);
  });
}

bootstrap();
