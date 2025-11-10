import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  id_inventory: number;

  @OneToOne(() => Product, (product) => product.inventory)
  @JoinColumn({ name: 'id_product' })
  product: Product;

  @Column()
  quantity: number;

  @Column()
  min_stock: number;

  @Column({ nullable: true })
  location: string;
}
