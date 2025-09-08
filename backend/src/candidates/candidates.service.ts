import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Candidate } from './schemas/candidate.schema';
import { PollingCenter, PollingCenterDocument } from '../common/schemas/polling-center.schema';

type FindAllParams = {
  centerId?: string;   // نمرره من الواجهة
  area?: string;       // بديل يدوي
  district?: string;   // بديل يدوي
  q?: string;          // بحث بالاسم
};

function esc(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// aliasات بسيطة؛ زوّدها حسب بياناتك
function areaAliases(a: string): string[] {
  const key = (a || '').trim().toLowerCase();

  // عاليه
  if (key === 'aley' || key === 'عاليه') {
    return ['عاليه', 'Aley', 'الشوف-عاليه', 'Chouf-Aley', 'Mount Lebanon IV', 'جبل لبنان الرابعة'];
  }

  // كسروان
  if (key === 'keserwan' || key === 'كسروان') {
    return ['كسروان', 'Keserwan', 'Mount Lebanon I', 'جبل لبنان الأولى'];
  }

  return [a];
}

@Injectable()
export class CandidatesService {
  constructor(
    @InjectModel(Candidate.name) private candidateModel: Model<Candidate>,
    @InjectModel(PollingCenter.name) private centers: Model<PollingCenterDocument>,
  ) {}

  async findAll({ centerId, area, district, q }: FindAllParams = {}): Promise<Candidate[]> {
    // لو وصل centerId فقط، نحوّله لمفتاح المنطقة/الدائرة
    if (centerId && !area && !district) {
      const center = await this.centers.findById(centerId).lean();
      if (!center) throw new NotFoundException('Center not found');
      // استخدم الحقل الموجود عندك فعليًا (districtId أو district أو area)
      const centerKey: string =
        (center as any).districtId || (center as any).district || (center as any).area;
      area = centerKey;
    }

    const filter: FilterQuery<Candidate> = {};
    const or: FilterQuery<Candidate>[] = [];

    const key = area || district;
    if (key?.trim()) {
      const aliases = areaAliases(key);
      // مطابقة دقيقة + case-insensitive + احتفاظ باحتمال substring
      for (const a of aliases) {
        or.push({ area: a });
        or.push({ district: a });
        or.push({ area: { $regex: `^${esc(a)}$`, $options: 'i' } });
        or.push({ district: { $regex: `^${esc(a)}$`, $options: 'i' } });
      }
      or.push({ area: { $regex: esc(key), $options: 'i' } });
      or.push({ district: { $regex: esc(key), $options: 'i' } });
    }

    if (q?.trim()) {
      filter.name = { $regex: q.trim(), $options: 'i' };
    }
    if (or.length) filter.$or = or;

    return this.candidateModel.find(filter).sort({ name: 1 }).lean();
  }

  async findOne(id: string): Promise<Candidate> {
    const candidate = await this.candidateModel.findById(id).lean();
    if (!candidate) throw new NotFoundException(`Candidate with id "${id}" not found`);
    return candidate;
  }

  async create(data: Partial<Candidate>): Promise<Candidate> {
    // نقبل area أو district ونملأ الاثنين للتوافق
    const area = (data.area ?? data.district)?.toString().trim();
    if (!data?.name?.trim() || !data?.summary?.trim() || !area) {
      throw new Error('name, summary, and area/district are required');
    }
    const payload: Partial<Candidate> = {
      name: data.name.trim(),
      summary: data.summary.trim(),
      party: data.party?.toString().trim() || undefined,
      bio: data.bio?.toString().trim() || undefined,
      image: data.image?.toString().trim() || undefined,
      area,
      district: data.district?.toString().trim() || area,
    };
    const doc = new this.candidateModel(payload);
    return doc.save();
  }

  // أداة مفيدة لفحص التسميات المتوفرة
  async distinctDistricts(): Promise<string[]> {
    const a = await this.candidateModel.distinct('area');
    const d = await this.candidateModel.distinct('district');
    const set = new Set<string>([...a, ...d].filter(Boolean));
    return Array.from(set);
  }
}
