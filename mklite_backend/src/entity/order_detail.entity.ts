import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../product/product.entity';

@Entity('order_detail')
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id_order_detail: number;

  @ManyToOne(() => Order, (order) => order.details)
  @JoinColumn({ name: 'id_order' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderDetails)
  @JoinColumn({ name: 'id_product' })
  product: Product;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}
