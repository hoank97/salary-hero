import { Module } from '@nestjs/common';
import { WorkingDayService } from './working-day.service';
import { WorkingDayController } from './working-day.controller';

@Module({
  controllers: [WorkingDayController],
  providers: [WorkingDayService],
})
export class WorkingDayModule {}
