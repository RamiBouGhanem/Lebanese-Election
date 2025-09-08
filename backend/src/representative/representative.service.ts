// src/representative/representative.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';

import { Voter, VoterDocument } from '../common/schemas/voter.schema';
import { LiveStats, LiveStatsDocument } from '../common/schemas/live-stats.schema';
import { PollingCenter, PollingCenterDocument } from '../common/schemas/polling-center.schema';
import { Candidate } from '../candidates/schemas/candidate.schema';

/* ---- alias helpers (keep minimal, extend as needed) ---- */
function areaAliases(a: string): string[] {
  const key = (a || '').trim().toLowerCase();
  if (key === 'aley' || key === 'عاليه') return ['عاليه','Aley','الشوف-عاليه','Chouf-Aley','Mount Lebanon IV','جبل لبنان الرابعة'];
  if (key === 'keserwan' || key === 'كسروان') return ['كسروان','Keserwan','Mount Lebanon I','جبل لبنان الأولى'];
  return [a];
}
const norm = (s?: string) => (s || '').trim().toLowerCase();
function sameArea(centerKey: string, candKey: string) {
  const c = new Set([norm(centerKey), ...areaAliases(centerKey).map(norm)]);
  for (const v of [norm(candKey), ...areaAliases(candKey).map(norm)]) if (c.has(v)) return true;
  return false;
}

/* ---- service ---- */
@Injectable()
export class RepresentativeService {
  constructor(
    @InjectModel(Voter.name)         private readonly voterModel: Model<VoterDocument>,
    @InjectModel(LiveStats.name)     private readonly statsModel: Model<LiveStatsDocument>,
    @InjectModel(PollingCenter.name) private readonly centerModel: Model<PollingCenterDocument>,
    @InjectModel(Candidate.name)     private readonly candModel: Model<Candidate>,
  ) {}

  async getAllVoters(centerId: string) {
    if (!centerId) return [];
    return this.voterModel.find({ centerId }).sort({ fullName: 1 }).lean();
  }

  async listVoters(params: { centerId: string; station?: string; q?: string; page?: number; limit?: number; }) {
    const { centerId, station, q, page = 1, limit = 50 } = params;
    if (!centerId) return { items: [], total: 0, page, limit };

    const filter: FilterQuery<VoterDocument> = { centerId };
    if (station) filter.station = station;
    if (q?.trim()) {
      filter.$or = [
        { fullName:   { $regex: q.trim(), $options: 'i' } },
        { nationalId: { $regex: q.trim(), $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.voterModel.find(filter).sort({ fullName: 1 }).skip((page - 1) * limit).limit(limit).lean(),
      this.voterModel.countDocuments(filter),
    ]);
    return { items, total, page, limit };
  }

  private async assertCandidateInSameArea(centerId: string, candidateId: string) {
    const [center, cand] = await Promise.all([
      this.centerModel.findById(centerId).lean(),
      this.candModel.findById(candidateId).lean(),
    ]);
    if (!center) throw new NotFoundException('Center not found');
    if (!cand)   throw new NotFoundException('Candidate not found');

    const centerKey: string = (center as any).districtId || (center as any).district || (center as any).area;
    const candKey: string = (cand as any).area || (cand as any).district;

    if (!centerKey || !candKey || !sameArea(centerKey, candKey)) {
      throw new BadRequestException('Candidate is not in the voter’s district/area');
    }
  }

  async checkInVoter(voterId: string, userId: string, candidateId?: string) {
    const voter = await this.voterModel.findById(voterId);
    if (!voter) throw new NotFoundException('Voter not found');

    if (candidateId) await this.assertCandidateInSameArea(voter.centerId, candidateId);

    if (!voter.checkedIn) {
      voter.checkedIn   = true;
      voter.checkedInAt = new Date();
      voter.checkedInBy = userId;
    }
    if (candidateId && !voter.predictedCandidateId) voter.predictedCandidateId = candidateId;

    await voter.save();

    if (candidateId) await this.incrementStats(voter.centerId, voter.station, candidateId);

    return { ok: true, voter: voter.toObject() };
  }

  private todayKey() { return new Date().toISOString().slice(0, 10); }

  private async incrementStats(centerId: string, station: string, candidateId: string) {
    const dateKey = this.todayKey();
    const update: any = { $inc: { totalCheckins: 1 }, $setOnInsert: { centerId, station, dateKey } };
    update.$inc[`counts.${candidateId}`] = 1;
    await this.statsModel.updateOne({ centerId, station, dateKey }, update, { upsert: true });
  }
}
