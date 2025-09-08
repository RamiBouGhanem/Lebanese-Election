import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Incident, IncidentDocument } from '../common/schemas/incident.schema';
import { Model, FilterQuery } from 'mongoose';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectModel(Incident.name) private incidentModel: Model<IncidentDocument>,
  ) {}

  async createIncident(input: {
    centerId: string;
    station: string;
    severity: 'Low' | 'Medium' | 'High';
    category: 'Security' | 'Logistics' | 'Technical' | 'Other';
    description: string;
    userId: string;      // creator
    photos?: string[];
  }) {
    const doc = await this.incidentModel.create({
      centerId:   input.centerId,
      station:    input.station,
      severity:   input.severity,
      category:   input.category,
      description: input.description,
      createdBy:  input.userId,
      photos:     input.photos ?? [],
    });
    return doc.toObject();
  }

  async listIncidents(centerId?: string) {
    const filter: FilterQuery<IncidentDocument> = {};
    if (centerId) filter.centerId = centerId;
    return this.incidentModel.find(filter).sort({ createdAt: -1 }).lean();
  }

  async listMyIncidents(userId: string, centerId?: string) {
    const filter: FilterQuery<IncidentDocument> = { createdBy: userId };
    if (centerId) filter.centerId = centerId;
    return this.incidentModel.find(filter).sort({ createdAt: -1 }).lean();
  }
}
