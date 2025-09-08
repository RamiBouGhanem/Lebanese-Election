import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PollingCenter } from '../common/schemas/polling-center.schema';
import { PollingCenterDocument } from '../common/schemas/polling-center.schema'
import { Model } from 'mongoose';

@Injectable()
export class CentersService {
  constructor(@InjectModel(PollingCenter.name) private model: Model<PollingCenterDocument>) {}

  async listCenters(query: { districtId?: string }) {
    const filter: any = {};
    if (query.districtId) filter.districtId = query.districtId;
    return this.model.find(filter).sort({ name: 1 }).lean();
  }

  async getCenter(id: string) {
    return this.model.findById(id).lean();
  }
}
