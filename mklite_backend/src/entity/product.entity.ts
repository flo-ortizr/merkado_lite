import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, JoinColumn} from 'typeorm';
import { Category } from './category.entity';
import { Supplier } from './supplier.entity';
import { Inventory } from './inventory.entity';
import { OrderDetail } from './order_detail.entity';
import { SaleDetail } from './sale_detail.entity';
import { Promotion } from './promotion.entity';
import { PriceHistory } from './price_history.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id_product: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'date', nullable: true })
  expiration_date: Date;

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @ManyToOne(() => Category, (cat) => cat.products)
  @JoinColumn({ name: 'id_category' })
  category: Category;

  @ManyToOne(() => Supplier, (supp) => supp.products)
  @JoinColumn({ name: 'id_supplier' })
  supplier: Supplier;

  @OneToOne(() => Inventory, (inv) => inv.product)
  inventory: Inventory;

  @OneToMany(() => OrderDetail, (dp) => dp.product)
  orderDetails: OrderDetail[];

  @OneToMany(() => SaleDetail, (dv) => dv.product)
  saleDetails: SaleDetail[];

  @OneToMany(() => Promotion, (promo) => promo.product)
  promotions: Promotion[];

  @OneToMany(() => PriceHistory, (hist) => hist.product)
  priceHistory: PriceHistory[];
}
