import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('withdraw')
@Index(['userId', 'appliedIn']) // Composite index
export class WithdrawEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  salaryPerDay: number;

  /**
   * totalWorkingDay = totalWorkingHours / workingHoursPerDay
   * assume workingHoursPerDay = 8
   */
  @Column({type: 'decimal'})
  totalWorkingDay: number;

  @Column({type: 'decimal'})
  totalAmount: number;

  @Column({type: 'decimal'})
  withdrawnAmount: number;

  /**
   * User only withdraw money in the current month
   * Format 'YYYY-MM'
   */
  @Column()
  appliedIn: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
