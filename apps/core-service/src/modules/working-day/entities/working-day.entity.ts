import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, ValueTransformer } from 'typeorm';
import moment from 'moment';
import { UserEntity } from '../../users/entities/users.entity';

// Define the transformer using Moment.js
const dateTransformer: ValueTransformer = {
  to: (value: Date): string => {
    // Convert the date to "YYYY-MM-DD" format when saving to the database
    return moment(value).format('YYYY-MM-DD');
  },
  from: (value: string): Date => {
    // Convert the "YYYY-MM-DD" format string back to a Date object when reading from the database
    return moment(value, 'YYYY-MM-DD').toDate();
  },
};

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
  @Column({ type: 'date', transformer: dateTransformer })
  workingDate: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
