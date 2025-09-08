// src: main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Keep global prefix commented since frontend calls /auth, /candidates, /centers, /representative directly
  // app.setGlobalPrefix('api');

  const allowed =
    (process.env.FRONTEND_ORIGIN || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

  app.enableCors({
    origin: allowed.length ? allowed : [/^http:\/\/localhost:(3000|5173)$/],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 API running on http://localhost:${port}`);
}
bootstrap();
