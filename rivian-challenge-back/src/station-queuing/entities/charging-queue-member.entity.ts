import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ChargingQueueMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  preferredChargingTimeInHours: number;

  @Column({
    default: false
  })
  isPriority: boolean;

  @Column({
    default: false
  })
  isProcessed: boolean;

  @ManyToOne(() => User)
  employee: User;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
