
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Remove the global prefix since Vite proxy already adds /api
  // app.setGlobalPrefix('api'); // Commented out to fix double /api issue
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Setup Swagger documentation (update path since no global prefix)
  const config = new DocumentBuilder()
    .setTitle('Doctor Finder API')
    .setDescription('API for finding and managing doctors')
    .setVersion('1.0')
    .addTag('doctors')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Changed from 'api/docs' to 'docs'
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend server is running on http://localhost:${port}`);
  console.log(`📚 API documentation available at http://localhost:${port}/docs`);
  console.log(`🏥 Doctors endpoint: http://localhost:${port}/doctors`);
}
bootstrap();
