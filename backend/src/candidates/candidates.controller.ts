import type { Express } from 'express';
import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';

import { CandidatesService } from './candidates.service';
import { S3Service } from '../files/s3.service';

@Controller('candidates')
export class CandidatesController {
  constructor(
    private readonly candidatesService: CandidatesService,
    private readonly s3: S3Service,
  ) {}

  /**
   * GET /candidates?centerId=&area=&district=&q=
   * مرّر centerId وسيقوم السيرفس بتحويله لمنطقة/دائرة وإرجاع المطابقين فقط.
   */
  @Get()
  async getAll(
    @Query('centerId') centerId?: string,
    @Query('area') area?: string,
    @Query('district') district?: string,
    @Query('q') q?: string,
  ) {
    return this.candidatesService.findAll({ centerId, area, district, q });
  }

  @Get('distinct/districts')
  async distinctDistricts() {
    return this.candidatesService.distinctDistricts();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.candidatesService.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (file && !file.mimetype?.startsWith('image/')) {
          return cb(
            new BadRequestException('Only image files are allowed') as any,
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async create(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const { name, summary, area, district, party, bio, imageUrl } = body;

    if (!name?.trim() || !summary?.trim() || !(area?.trim() || district?.trim())) {
      throw new BadRequestException('name, summary, and area/district are required');
    }

    let finalUrl = (imageUrl && String(imageUrl).trim()) || '';
    if (file) {
      const key = `candidates/${randomUUID()}${extname(file.originalname || '.jpg')}`;
      finalUrl = await this.s3.uploadImage(file.buffer, file.mimetype, key);
    }

    return this.candidatesService.create({
      name: String(name).trim(),
      summary: String(summary).trim(),
      area: area ? String(area).trim() : undefined,
      district: district ? String(district).trim() : undefined,
      party: party ? String(party).trim() : undefined,
      bio: bio ? String(bio).trim() : undefined,
      image: finalUrl || undefined,
    });
  }
}
