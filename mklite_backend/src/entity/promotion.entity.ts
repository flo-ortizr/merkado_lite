import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('promotion')
export class Promotion {
  @PrimaryGeneratedColumn()
  id_promotion: number;

  @ManyToOne(() => Product, (product) => product.promotions)
  @JoinColumn({ name: 'id_product' })
  product: Product;

  @Column({ type: 'enum', enum: ['percentage', 'fixed'] })
  discount_type: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  value: number;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;
}
