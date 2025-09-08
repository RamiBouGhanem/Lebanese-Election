import { Controller, Get, Query, Patch, Param, Body } from '@nestjs/common';
import { RepresentativeService } from './representative.service';

@Controller('representative')
export class VotersController {
  constructor(private readonly svc: RepresentativeService) {}

  // GET /representative/voters/all?centerId=
  @Get('voters/all')
  async getAll(@Query('centerId') centerId: string) {
    return this.svc.getAllVoters(centerId);
  }

  // GET /representative/voters?centerId=&station=&q=&page=&limit=
  @Get('voters')
  async list(
    @Query('centerId') centerId: string,
    @Query('station') station?: string,
    @Query('q') q?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '50',
  ) {
    return this.svc.listVoters({
      centerId,
      station,
      q,
      page: Number(page) || 1,
      limit: Math.max(1, Math.min(200, Number(limit) || 50)),
    });
  }

  // PATCH /representative/voters/:id/checkin
  @Patch('voters/:id/checkin')
  async checkin(
    @Param('id') id: string,
    @Body() body: { userId: string; candidateId?: string },
  ) {
    const { userId, candidateId } = body || ({} as any);
    return this.svc.checkInVoter(id, userId, candidateId);
  }
}
