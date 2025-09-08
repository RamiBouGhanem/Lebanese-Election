import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CentersController } from './centers.controller';
import { PollingCenter } from '../common/schemas/polling-center.schema';
import { PollingCenterSchema } from '../common/schemas/polling-center.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PollingCenter.name, schema: PollingCenterSchema }]),
  ],
  controllers: [CentersController],
})
export class CentersModule {}
