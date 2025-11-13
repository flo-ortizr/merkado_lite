import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn()
  id_notification: number;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'id_user' })
  user: User;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ default: false })
  read: boolean;
}
