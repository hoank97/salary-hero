import { Module } from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { WithdrawController } from './withdraw.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrawEntity } from './entities/withdraw.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WithdrawEntity])],
  controllers: [WithdrawController],
  providers: [WithdrawService],
})
export class WithdrawModule {}
