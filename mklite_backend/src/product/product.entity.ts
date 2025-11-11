import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, JoinColumn} from 'typeorm';
import { Category } from '../category/category.entity';
import { Supplier } from '../entity/supplier.entity';
import { Inventory } from '../entity/inventory.entity';
import { OrderDetail } from '../entity/order_detail.entity';
import { SaleDetail } from '../entity/sale_detail.entity';
import { Promotion } from '../entity/promotion.entity';
import { PriceHistory } from '../entity/price_history.entity';

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
