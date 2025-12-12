import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, Column } from 'typeorm';
import { User } from '../user/user.entity';
import { Order } from '../order/order.entity';
import { Cart } from '../cart/cart.entity';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn()
  id_customer: number;

  @OneToOne(() => User, (user) => user.customer)
  @JoinColumn({ name: 'id_user' })
  user: User;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @OneToOne(() => Cart, (cart) => cart.customer)
  cart: Cart[];

}
