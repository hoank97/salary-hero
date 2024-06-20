import { IWorkingDayData } from '@libs/shared/interfaces';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WithdrawEntity } from './entities/withdraw.entity';
import { WithdrawService } from './withdraw.service';

describe('WithdrawService', () => {
  let service: WithdrawService;

  const mockRepository = {
    findBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WithdrawService,
        {
          provide: getRepositoryToken(WithdrawEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<WithdrawService>(WithdrawService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrUpdateWithdrawBalance', () => {
    it('should create or update withdraw balance correctly', async () => {
      const workingDays: IWorkingDayData[] = [
        {
          userId: 1,
          workingTime: 16,
          salaryPerDay: 100,
          appliedIn: '2023-06',
        },
        {
          userId: 2,
          workingTime: 8,
          salaryPerDay: 80,
          appliedIn: '2023-06',
        },
      ];

      const existingWithdraw: WithdrawEntity[] = [
        {
          id: 1,
          userId: 1,
          totalWorkingDay: 1,
          totalAmount: 100,
          withdrawnAmount: 0,
          salaryPerDay: 100,
          appliedIn: '2023-06',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ];

      const expectedNewWithdraw = {
        userId: 2,
        totalWorkingDay: 1,
        totalAmount: 80,
        withdrawnAmount: 0,
        salaryPerDay: 80,
        appliedIn: '2023-06',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };

      mockRepository.findBy.mockResolvedValue(existingWithdraw);
      mockRepository.create.mockReturnValue(expectedNewWithdraw);
      mockRepository.save.mockResolvedValue([
        {
          ...existingWithdraw[0],
          totalWorkingDay: 3,
          totalAmount: 300,
        },
        expectedNewWithdraw,
      ]);

      const result = await service.createOrUpdateWithdrawBalance(workingDays);

      expect(mockRepository.create).toHaveBeenCalledWith({
        userId: 2,
        salaryPerDay: 80,
        totalWorkingDay: 1,
        totalAmount: 80,
        withdrawnAmount: 0,
        appliedIn: '2023-06',
      });

      expect(mockRepository.save).toHaveBeenCalledWith([
        {
          ...existingWithdraw[0],
          totalWorkingDay: 3,
          totalAmount: 300,
        },
        expectedNewWithdraw,
      ]);

      expect(result).toEqual([
        {
          ...existingWithdraw[0],
          totalWorkingDay: 3,
          totalAmount: 300,
        },
        expectedNewWithdraw,
      ]);
    });
  });
});
