import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  await usersService.create('citizen', 'password123', 'مواطن عادي');
  await usersService.create('representative', 'password123', 'مندوب');
  await usersService.create('pollinghead', 'password123', 'رئيس قلم');

  console.log('✅ Users seeded successfully');
  await app.close();
}
bootstrap();
