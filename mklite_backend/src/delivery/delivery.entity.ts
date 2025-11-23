import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';

@Entity('delivery')
export class Delivery {
  @PrimaryGeneratedColumn()
  id_delivery: number;

  @OneToOne(() => Order, (order) => order.delivery)
  @JoinColumn({ name: 'id_order' })
  order: Order;

  @ManyToOne(() => User, (user) => user.id_user)
  @JoinColumn({ name: 'id_driver' })
  driver: User;

  @Column({ type: 'datetime' })
  scheduled_date: Date;

  @Column({ type: 'datetime', nullable: true })
  delivered_date: Date;

  @Column({ type: 'enum', enum: ['pending', 'delivered', 'cancelled', 'on_way'], default: 'pending' })
  status: string;
}
