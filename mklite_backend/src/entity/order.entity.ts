import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { OrderDetail } from './order_detail.entity';
import { Delivery } from './delivery.entity';
import { Return } from './return.entity';  

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id_order: number;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'id_customer' })
  customer: Customer;

  @Column({ type: 'datetime' })
  order_date: Date;

  @Column({ type: 'enum', enum: ['pending', 'delivered', 'cancelled'], default: 'pending' })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column()
  payment_method: string;

  @OneToMany(() => OrderDetail, (detail) => detail.order)
  details: OrderDetail[];

  @OneToOne(() => Delivery, (delivery) => delivery.order)
  delivery: Delivery;

  @OneToMany(() => Return, (ret) => ret.order)
  returns: Return[];
}
