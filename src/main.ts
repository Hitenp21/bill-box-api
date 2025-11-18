import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Define the Swagger options and document
  const options = new DocumentBuilder()
    .setTitle('NestJS Starter API')
    .setDescription('The API for the NestJS Starter project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  // Correct usage of @scalar/nestjs-api-reference
  app.use(
    '/docs',
    apiReference({
      content: document,
    }),
  );

  // Get the configuration service from the application
  const configService = app.get(ConfigService);

  // Get the port number from the configuration
  const port = configService.get<number>('port') || 3009;

  // Start the application
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
