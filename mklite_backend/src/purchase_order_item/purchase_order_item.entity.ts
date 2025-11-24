import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PurchaseOrder } from '../purchase_order/purchase_order.entity';
import { Product } from '../product/product.entity';

@Entity('purchase_order_item')
export class PurchaseOrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PurchaseOrder, (order) => order.items)
  @JoinColumn({ name: 'id_purchase_order' })
  purchaseOrder: PurchaseOrder;

  @ManyToOne(() => Product, (product) => product.id_product)
  @JoinColumn({ name: 'id_product' })
  product: Product;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;
}
