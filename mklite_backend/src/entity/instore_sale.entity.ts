import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { SaleDetail } from './sale_detail.entity';

@Entity('instore_sale')
export class InStoreSale {
  @PrimaryGeneratedColumn()
  id_sale: number;

  @ManyToOne(() => User, (user) => user.sales)
  @JoinColumn({ name: 'id_user' })
  user: User;

  @Column({ type: 'datetime' })
  sale_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column()
  payment_method: string;

  @OneToMany(() => SaleDetail, (detail) => detail.sale)
  details: SaleDetail[];
}
