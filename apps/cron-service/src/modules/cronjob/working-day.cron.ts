import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import 'moment-timezone';
import { DataSource, In } from 'typeorm';
import { JobEntity } from '../jobs/entities/jobs.entity';
import { WorkingDayEntity } from '../working-day/entities/working-day.entity';
import { ClientProxy } from '@nestjs/microservices';
import { clients } from '../config/client-proxy.config';
import { pattern } from '../config/pattern.config';
import { IWorkingDayData } from '@libs/shared/interfaces';
import { JobType } from '@libs/shared/constants';

@Injectable()
export class TasksService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(clients.WITHDRAW.name) private client: ClientProxy,
  ) {}

  private readonly logger = new Logger(TasksService.name);

  // Create a cron job for each day, running at 00:00:00 UTC+07:00
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    const workingDayRepo = this.dataSource.getRepository(WorkingDayEntity);

    // Setup Batch to process, can be increased or reduced based on the hardware configuration
    const batchSize = 2;
    let offset = 0;
    let done = false;

    /**
     * Because the cron will be executed on 00:00:00
     * Get worked users on the previous day to calculate
     */
    const timezone = 'Asia/Ho_Chi_Minh';
    const date = moment().subtract({ day: 1 }).tz(timezone).format('YYYY-MM-DD');

    // Find all the data in the working day repository on the selected day
    while (!done) {
      const workingDays = await workingDayRepo
        .createQueryBuilder('wd')
        .where('wd.workingDate =:date', { date })
        .offset(offset)
        .take(batchSize)
        .getMany();

      if (workingDays.length === 0) {
        done = true;
        break;
      } else {
        offset += batchSize;
      }

      // Get list worked users
      const map = new Map<number, Partial<IWorkingDayData>>();
      const currentMonth = moment(workingDays[0].workingDate).format('YYYY-MM');
      workingDays.forEach((wd) => {
        map.set(wd.userId, { userId: wd.userId, workingTime: wd.workingTime, appliedIn: currentMonth });
      });
      const userIds = [...map.keys()];

      // Get salary per day of each user
      const jobRepo = this.dataSource.getRepository(JobEntity);
      const jobsInfo = await jobRepo.findBy({ userId: In(userIds) });
      jobsInfo.forEach((job) => {
        const workingData = map.get(job.userId);
        const dayInMonth = moment().subtract({ day: 1 }).tz(timezone).daysInMonth();
        const salaryPerDay =
          job.type === JobType.DAILY_SALARY_RATE_WORKER ? job.dailySalary : job.baseSalary / dayInMonth;
        if (workingData) {
          map.set(job.userId, { ...workingData, salaryPerDay });
        }
      });

      // Send working data to withdraw service
      this.client.emit<void, IWorkingDayData[]>(pattern.withdraw.updateBalance, [...map.values()] as IWorkingDayData[]);
    }
  }
}
