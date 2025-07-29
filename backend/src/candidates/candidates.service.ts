import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Candidate } from './schemas/candidate.schema';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectModel(Candidate.name) private candidateModel: Model<Candidate>,
  ) {}

  // Get all candidates
  async findAll(): Promise<Candidate[]> {
    return this.candidateModel.find();
  }

  // Get a single candidate by id
  async findOne(id: string): Promise<Candidate> {
    const candidate = await this.candidateModel.findById(id);
    if (!candidate) {
      throw new NotFoundException(`Candidate with id "${id}" not found`);
    }
    return candidate;
  }

  // Create a new candidate
  async create(data: Partial<Candidate>): Promise<Candidate> {
    const newCandidate = new this.candidateModel(data);
    return newCandidate.save();
  }
}
