import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('audit_log')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id_log: number;

  @ManyToOne(() => User, (user) => user.logs)
  @JoinColumn({ name: 'id_user' })
  user: User;

  @Column()
  action: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
