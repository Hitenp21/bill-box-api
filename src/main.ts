import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get the configuration service from the application
  const configService = app.get(ConfigService);

  // Configure CORS
  // Load allowed origins from environment (comma-separated) or use sensible defaults
  const envOrigins = configService.get<string>('FRONTEND_URLS') || configService.get<string>('FRONTEND_URL');
  const allowedOrigins = envOrigins
    ? envOrigins.split(',').map((s) => s.trim())
    : ['https://sales-summit-io.vercel.app', 'http://10.108.199.175:8080'];

  app.enableCors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
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

  // Try to load optional @scalar/nestjs-api-reference dynamically to avoid
  // serverless ESM require issues on platforms like Vercel. If it fails,
  // fall back to plain Swagger UI.
  try {
    // dynamic import returns a namespace; prefer named export `apiReference`
    const mod = await import('@scalar/nestjs-api-reference');
    const apiReference = (mod && (mod.apiReference || mod.default)) as any;
    if (apiReference) {
      app.use('/docs', apiReference({ content: document }));
    } else {
      console.warn('@scalar/nestjs-api-reference loaded but no export found');
    }
  } catch (err) {
    console.warn('@scalar/nestjs-api-reference not available or failed to load:', err?.message || err);
  }
  SwaggerModule.setup('swagger', app, document);

  // Get the port number from the configuration
  const port = configService.get<number>('port') || 3009;

  // Start the application
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
