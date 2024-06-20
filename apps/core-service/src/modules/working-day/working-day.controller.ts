import { Controller } from '@nestjs/common';
import { WorkingDayService } from './working-day.service';

@Controller('working-day')
export class WorkingDayController {
  constructor(private readonly workingDayService: WorkingDayService) {}
}
