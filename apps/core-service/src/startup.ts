import { INestMicroservice } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserEntity } from './modules/users/entities/users.entity';
import { JobEntity } from './modules/jobs/entities/jobs.entity';
import { JobType } from '@libs/shared/constants';

export default async function startup(app: INestMicroservice) {
  const entityManager = app.get(EntityManager);

  await createWorkersIfNotExists(entityManager);
  await createJobsIfNotExists(entityManager);
}

async function createWorkersIfNotExists(entityManager: EntityManager) {
  const workers = await entityManager.count(UserEntity);

  if (workers === 0) {
    const dummyWorkers = [];
    const numberOfDummyWorkers = 10;
    for (let i = 1; i < numberOfDummyWorkers; i++) {
      dummyWorkers.push({
        name: `worker-${i}`,
        isActive: true,
      });
    }

    const workers = entityManager.create(UserEntity, dummyWorkers);
    await entityManager.save(workers);
  }
}

async function createJobsIfNotExists(entityManager: EntityManager) {
  const jobs = await entityManager.count(JobEntity);

  if (jobs === 0) {
    const workers = await entityManager.find(UserEntity);
    const dummyJobs: Partial<JobEntity>[] = [];
    for (let i = 0; i < workers.length; i++) {
      const dummyType = randomBetween(JobType.DAILY_SALARY_RATE_WORKER, JobType.MONTHLY_SALARY_RATE_WORKER);
      const salary = dummyType === JobType.MONTHLY_SALARY_RATE_WORKER ? { baseSalary: 30000 } : { dailySalary: 1000 };
      dummyJobs.push({
        ...salary,
        userId: workers[i].id,
        type: dummyType,
      });
    }

    const jobs = entityManager.create(JobEntity, dummyJobs);
    await entityManager.save(jobs);
  }
}

function randomBetween<T>(x: T, y: T): T {
  return Math.random() < 0.5 ? x : y;
}
