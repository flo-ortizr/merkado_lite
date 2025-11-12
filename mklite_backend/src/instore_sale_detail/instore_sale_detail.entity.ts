import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { InStoreSale } from '../instore_sale/instore_sale.entity';
import { Product } from '../product/product.entity';

@Entity('instore_sale_detail')
export class InStoreSaleDetail {
  @PrimaryGeneratedColumn()
  id_sale_detail: number;

  @ManyToOne(() => InStoreSale, (sale) => sale.details)
  @JoinColumn({ name: 'id_sale' })
  sale: InStoreSale;

  @ManyToOne(() => Product, (product) => product.saleDetails)
  @JoinColumn({ name: 'id_product' })
  product: Product;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}
