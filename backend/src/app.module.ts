import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CandidatesModule } from './candidates/candidates.module';
import { DashboardController } from './dashboard/dashboard.controller';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Makes .env available everywhere
    }),
    // MongoDB Connection
    MongooseModule.forRoot(process.env.MONGO_URI || ''),

    // Feature modules
    AuthModule,
    UsersModule,
    CandidatesModule,
  ],
  controllers: [DashboardController], // Register the dashboard routes
})
export class AppModule {}
