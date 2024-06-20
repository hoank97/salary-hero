import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawController } from './withdraw.controller';
import { WithdrawService } from './withdraw.service';
import { IWorkingDayData } from '@libs/shared/interfaces';

describe('WithdrawController', () => {
  let withdrawController: WithdrawController;
  let withdrawService: WithdrawService;

  const mockWithdrawService = {
    createOrUpdateWithdrawBalance: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WithdrawController],
      providers: [
        {
          provide: WithdrawService,
          useValue: mockWithdrawService,
        },
      ],
    }).compile();

    withdrawController = module.get<WithdrawController>(WithdrawController);
    withdrawService = module.get<WithdrawService>(WithdrawService);
  });

  it('should be defined', () => {
    expect(withdrawController).toBeDefined();
  });

  describe('createOrUpdateWithdrawBalance', () => {
    it('should call withdrawService.createOrUpdateWithdrawBalance with correct parameters', async () => {
      const workingDays: IWorkingDayData[] = [
        {
          userId: 1,
          workingTime: 8,
          appliedIn: '2021-01',
          salaryPerDay: 1000,
        },
      ];

      const result = { success: true };
      mockWithdrawService.createOrUpdateWithdrawBalance.mockResolvedValue(result);

      const response = await withdrawController.createOrUpdateWithdrawBalance(workingDays);

      expect(response).toEqual(result);
      expect(withdrawService.createOrUpdateWithdrawBalance).toHaveBeenCalledWith(workingDays);
    });
  });
});
