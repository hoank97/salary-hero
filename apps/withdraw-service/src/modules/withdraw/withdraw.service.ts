import { IWorkingDayData } from '@libs/shared/interfaces';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WithdrawEntity } from './entities/withdraw.entity';
import { In, Repository } from 'typeorm';
import { WORKING_HOURS_PER_DAY } from '@libs/shared/constants';

@Injectable()
export class WithdrawService {
  constructor(@InjectRepository(WithdrawEntity) private withdrawRepo: Repository<WithdrawEntity>) {}

  async createOrUpdateWithdrawBalance(workingDays: IWorkingDayData[]): Promise<WithdrawEntity[]> {
    // Map the working days
    const mapWorkingDayList = new Map<number, IWorkingDayData>();
    workingDays.forEach((wd) => {
      mapWorkingDayList.set(wd.userId, wd);
    });

    /**
     * Get the userIds from the Map
     * Avoid N+1 queries
     */
    const userIds = [...mapWorkingDayList.keys()];
    const appliedIn = workingDays[0].appliedIn;
    const withdrawList = await this.withdrawRepo.findBy({ userId: In(userIds), appliedIn });

    // Map the withdrawList
    const mapWithdrawList = new Map<number, WithdrawEntity>();
    withdrawList.forEach((w) => {
      mapWithdrawList.set(w.userId, w);
    });

    // Create a bucket of withdraw data to bulk inset
    const withdrawBucket: WithdrawEntity[] = [];
    userIds.forEach((key) => {
      const workingDaysInfo = mapWorkingDayList.get(key);
      // If user working over time, the earning will be increased
      const workingDay = workingDaysInfo.workingTime / WORKING_HOURS_PER_DAY;
      const amount = workingDay * workingDaysInfo.salaryPerDay;

      // Update record if it exists
      if (mapWithdrawList.has(key)) {
        const withdrawInfo = mapWithdrawList.get(key);

        return withdrawBucket.push({
          ...withdrawInfo,
          totalWorkingDay: Number(withdrawInfo.totalWorkingDay) + workingDay,
          totalAmount: Number(withdrawInfo.totalAmount) + amount,
        });
      }

      // Update record if it not exists
      const newWithdrawRecord = this.withdrawRepo.create({
        userId: key,
        salaryPerDay: workingDaysInfo.salaryPerDay,
        totalWorkingDay: workingDay,
        totalAmount: amount,
        withdrawnAmount: 0,
        appliedIn,
      });
      return withdrawBucket.push(newWithdrawRecord);
    });

    if (withdrawBucket.length) {
      return this.withdrawRepo.save(withdrawBucket);
    }
  }
}
