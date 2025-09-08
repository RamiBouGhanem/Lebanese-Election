import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';

import { Incident, IncidentSchema } from '../common/schemas/incident.schema';
import { UsersModule } from '../users/users.module'; // 👈 Needed for username→id fallback

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Incident.name, schema: IncidentSchema }]),
    UsersModule, // 👈 so controller can inject UsersService
  ],
  controllers: [IncidentsController],
  providers: [IncidentsService],
  exports: [IncidentsService],
})
export class IncidentsModule {}
