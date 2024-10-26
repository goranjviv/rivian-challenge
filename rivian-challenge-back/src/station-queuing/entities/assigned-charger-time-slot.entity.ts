import { ChargingStation } from 'src/charging-station/entities/charging-station.entity';
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
export class AssignedChargerTimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  assignedStartsAt: Date;

  @Column()
  assignedEndsAt: Date;

  @Column({
    nullable: true
  })
  startedAt?: Date;

  @ManyToOne(() => User)
  employee: User;

  @ManyToOne(() => ChargingStation)
  chargingStation: ChargingStation;

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
