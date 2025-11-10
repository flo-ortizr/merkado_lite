import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('price_history')
export class PriceHistory {
  @PrimaryGeneratedColumn()
  id_history: number;

  @ManyToOne(() => Product, (product) => product.priceHistory)
  @JoinColumn({ name: 'id_product' })
  product: Product;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  old_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  new_price: number;

  @Column({ type: 'datetime' })
  change_date: Date;
}
