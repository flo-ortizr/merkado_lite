import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../order/order.entity';

@Entity('return')
export class Return {
  @PrimaryGeneratedColumn()
  id_return: number;

  @ManyToOne(() => Order, (order) => order.returns)
  @JoinColumn({ name: 'id_order' })
  order: Order;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: ['pending', 'processed'], default: 'pending' })
  status: string;
}
