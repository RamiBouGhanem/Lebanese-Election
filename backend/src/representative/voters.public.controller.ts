import { Controller, Get, Query, Patch, Param, Body, Post, BadRequestException } from '@nestjs/common';
import { RepresentativeService } from './representative.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Voter, VoterDocument } from '../common/schemas/voter.schema';
import { PollingCenter, PollingCenterDocument } from '../common/schemas/polling-center.schema';

@Controller('voters')
export class PublicVotersController {
  constructor(
    private readonly svc: RepresentativeService,
    @InjectModel(Voter.name) private readonly voterModel: Model<VoterDocument>,
    @InjectModel(PollingCenter.name) private readonly centerModel: Model<PollingCenterDocument>,
  ) {}

  // GET /voters?centerId=&station=&q=&page=&limit=
  @Get()
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

  // GET /voters/all?centerId=
  @Get('all')
  async getAll(@Query('centerId') centerId: string) {
    return this.svc.getAllVoters(centerId);
  }

  // PATCH /voters/:id/checkin
  @Patch(':id/checkin')
  async checkin(
    @Param('id') id: string,
    @Body() body: { userId: string; candidateId?: string },
  ) {
    const { userId, candidateId } = body || ({} as any);
    return this.svc.checkInVoter(id, userId, candidateId);
  }

  // ✅ NEW: POST /voters/dev-seed  → quickly add voters for a center
  @Post('dev-seed')
  async devSeed(
    @Body() body: { centerId: string; count?: number }
  ) {
    const { centerId, count = 60 } = body || ({} as any);
    if (!centerId) throw new BadRequestException('centerId is required');

    const center = await this.centerModel.findById(centerId).lean();
    if (!center) throw new BadRequestException('center not found');

    const stations: string[] = (center as any).stations?.length ? (center as any).stations : ['A', 'B'];
    const first = ['نعيم','جورج','رامي','بسام','شربل','رواد','مازن','جهاد','جاد','فراس','طارق','فادي','رائد','حسن','إيلي'];
    const last  = ['قزي','حداد','رحمة','حبيب','الخوري','مرادي','بو حبيب','ضو','بو خليل','الخازن','فرماوي','فتال','كرم','عون','فرنجية'];

    const randName = (i: number) => `${first[i % first.length]} ${last[i % last.length]}`;

    const docs = Array.from({ length: count }).map((_, i) => ({
      centerId,
      station: stations[i % stations.length],
      fullName: randName(i + 1),
      nationalId: `DEV${Date.now()}${i + 1}`,
      checkedIn: false,
    }));

    await this.voterModel.insertMany(docs, { ordered: false });
    return { ok: true, inserted: docs.length };
  }
}
