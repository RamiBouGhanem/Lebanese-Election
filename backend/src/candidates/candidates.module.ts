// src/candidates/candidates.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Candidate, CandidateSchema } from './schemas/candidate.schema';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';

import { PollingCenter, PollingCenterSchema } from '../common/schemas/polling-center.schema';
import { S3Service } from '../files/s3.service'; // 👈 هنا

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Candidate.name, schema: CandidateSchema },
      { name: PollingCenter.name, schema: PollingCenterSchema },
    ]),
  ],
  controllers: [CandidatesController],
  providers: [CandidatesService, S3Service], // 👈 مهم
  exports: [CandidatesService],
})
export class CandidatesModule {}
