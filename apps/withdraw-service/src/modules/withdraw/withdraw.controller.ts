import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WithdrawService } from './withdraw.service';
import { IWorkingDayData } from '@libs/shared/interfaces';
import { WithdrawEntity } from './entities/withdraw.entity';

@Controller('withdraw')
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

  @MessagePattern('update-balance')
  createOrUpdateWithdrawBalance(@Payload() workingDays: IWorkingDayData[]): Promise<WithdrawEntity[]> {
    return this.withdrawService.createOrUpdateWithdrawBalance(workingDays);
  }
}
