import { Controller, Get, Param } from '@nestjs/common';
import { CandidatesService } from './candidates.service';

@Controller('candidates')
export class CandidatesController {
  constructor(private candidatesService: CandidatesService) {}

  @Get()
  async getAll() {
    return this.candidatesService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.candidatesService.findOne(id);
  }
}
