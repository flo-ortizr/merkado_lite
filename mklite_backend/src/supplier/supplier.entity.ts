import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../product/product.entity';
import { PurchaseOrder } from '../purchase_order/purchase_order.entity';
@Entity('supplier')
export class Supplier {
  @PrimaryGeneratedColumn()
  id_supplier: number;

  @Column()
  name: string; // nombre de la empresa

  @Column()
  address: string;

  @Column()
  manager_name: string; // gerente de ventas

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  category: string;

  @OneToMany(() => Product, (product) => product.supplier)
  products: Product[];

  @OneToMany(() => PurchaseOrder, (order) => order.supplier)
  purchaseOrders: PurchaseOrder[];
}
