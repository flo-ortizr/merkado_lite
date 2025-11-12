import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Supplier } from '../supplier/supplier.entity';

@Entity('purchase_order')
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id_order: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.purchaseOrders)
  @JoinColumn({ name: 'id_supplier' })
  supplier: Supplier;

  @Column({ type: 'date' })
  order_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'enum', enum: ['pending', 'received'], default: 'pending' })
  status: string;
}
