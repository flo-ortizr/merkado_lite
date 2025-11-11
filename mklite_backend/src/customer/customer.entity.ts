import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Order } from '../entity/order.entity';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn()
  id_customer: number;

  @OneToOne(() => User, (user) => user.customer)
  @JoinColumn({ name: 'id_user' })
  user: User;

  @Column()
  address: string;

  @Column({ type: 'enum', enum: ['frequent', 'occasional'], default: 'occasional' })
  customer_type: string;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
