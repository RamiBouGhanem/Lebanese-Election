import { Controller, Get, Query, Param, Post, Body, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { PollingCenter, PollingCenterDocument } from '../common/schemas/polling-center.schema';

@Controller('centers')
export class CentersController {
  constructor(
    @InjectModel(PollingCenter.name)
    private readonly centers: Model<PollingCenterDocument>,
  ) {}

  // GET /centers?district=&q=
  @Get()
  async list(
    @Query('district') district?: string,
    @Query('q') q?: string,
  ) {
    const filter: FilterQuery<PollingCenterDocument> = {};
    if (district?.trim()) {
      filter.$or = [
        { districtId: district.trim() },
        { district: district.trim() },
        { area: district.trim() },
      ];
    }
    if (q?.trim()) {
      filter.name = { $regex: q.trim(), $options: 'i' };
    }
    return this.centers.find(filter).sort({ name: 1 }).lean();
  }

  // GET /centers/:id
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.centers.findById(id).lean();
  }

  // ✅ NEW: POST /centers  → create a center quickly
  @Post()
  async create(
    @Body() body: { name: string; districtId: string; address?: string; stations?: string[] }
  ) {
    const { name, districtId, address, stations } = body || ({} as any);
    if (!name?.trim() || !districtId?.trim()) {
      throw new BadRequestException('name and districtId are required');
    }
    const doc = await this.centers.create({
      name: name.trim(),
      districtId: districtId.trim(), // Your existing centers use districtId ("Aley")
      address: address?.trim(),
      stations: Array.isArray(stations) && stations.length ? stations : ['A', 'B'],
    });
    return doc.toObject();
  }
}
