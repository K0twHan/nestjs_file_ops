import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  app.getHttpServer().setTimeout(5);
  app.getHttpServer().headersTimeout = 5000;
  app.getHttpServer().keepAliveTimeout = 5000;
}
bootstrap();
