import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { CandidatesModule } from './candidates/candidates.module';
import { AuthModule } from './auth/auth.module';
import { RepresentativeModule } from './representative/representative.module';
import { IncidentsModule } from './incidents/incidents.module';

// OPTIONAL: make guards global if you already have them implemented
// import { APP_GUARD } from '@nestjs/core';
// import { JwtAuthGuard } from './auth/jwt-auth.guard';
// import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/senior-project'),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    CandidatesModule,
    AuthModule,
    RepresentativeModule,
    IncidentsModule, // 👈 important
  ],
  // providers: [
  //   { provide: APP_GUARD, useClass: JwtAuthGuard },
  //   { provide: APP_GUARD, useClass: RolesGuard },
  // ],
})
export class AppModule {}
