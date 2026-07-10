import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadKeyVaultSecrets } from './config/keyvault.config';
import * as dotenv from 'dotenv';

async function bootstrap() {

  dotenv.config();

  const azureSecrets = await loadKeyVaultSecrets();

  Object.assign(process.env,azureSecrets);

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // Allows your Vite dev server
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);  
}
bootstrap();
