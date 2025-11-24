import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Supplier } from '../supplier/supplier.entity';
import { PurchaseOrderItem } from '../purchase_order_item/purchase_order_item.entity';

@Entity('purchase_order')
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id_purchase_order: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.purchaseOrders)
  @JoinColumn({ name: 'id_supplier' })
  supplier: Supplier;

  @Column({ type: 'date' })
  order_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'enum', enum: ['pending', 'received'], default: 'pending' })
  status: string;

  @OneToMany(() => PurchaseOrderItem, (item) => item.purchaseOrder, { cascade: true })
  items: PurchaseOrderItem[];
}
