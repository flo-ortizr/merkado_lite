import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { PurchaseOrder } from './purchase_order.entity';

@Entity('supplier')
export class Supplier {
  @PrimaryGeneratedColumn()
  id_supplier: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @OneToMany(() => Product, (product) => product.supplier)
  products: Product[];

  @OneToMany(() => PurchaseOrder, (order) => order.supplier)
  purchaseOrders: PurchaseOrder[];
}
