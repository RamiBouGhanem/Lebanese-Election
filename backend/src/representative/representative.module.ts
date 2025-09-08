import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RepresentativeService } from './representative.service';
import { VotersController } from './voters.controller';
import { PublicVotersController } from './voters.public.controller';
import { CentersController } from './centers.controller';

import { Voter, VoterSchema } from '../common/schemas/voter.schema';
import { LiveStats, LiveStatsSchema } from '../common/schemas/live-stats.schema';
import { PollingCenter, PollingCenterSchema } from '../common/schemas/polling-center.schema';
import { Candidate, CandidateSchema } from '../candidates/schemas/candidate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Voter.name,         schema: VoterSchema },
      { name: LiveStats.name,     schema: LiveStatsSchema },
      { name: PollingCenter.name, schema: PollingCenterSchema },
      { name: Candidate.name,     schema: CandidateSchema },
    ]),
  ],
  controllers: [
    VotersController,        // /representative/voters...
    PublicVotersController,  // /voters...
    CentersController,       // /centers...
  ],
  providers: [RepresentativeService],
  exports: [RepresentativeService],
})
export class RepresentativeModule {}
