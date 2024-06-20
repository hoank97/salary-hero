import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/users.entity';

@Entity('working-days')
export class WorkingDayEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  /**
   * A working day is 8hours
   * Workers who work over time can log the total working hours to the system
   */
  @Column({ type: 'smallint' })
  workingTime: number;

  // Tracking the date workers are working
  @Column({ type: 'date' })
  workingDate: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
