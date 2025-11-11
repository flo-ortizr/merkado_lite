import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { ManyToOne, OneToOne, OneToMany, JoinColumn } from "typeorm";
import { Role } from "../role/role.entity";
import { Customer } from "../customer/customer.entity";
import { InStoreSale } from "../entity/instore_sale.entity";
import { AuditLog } from "../entity/audit_log.entity";
import { Notification } from "../entity/notificaction.entity";

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20 })
  ci : string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'id_role' })
  role: Role;

  @OneToOne(() => Customer, (customer) => customer.user)
  customer: Customer;

  @OneToMany(() => InStoreSale, (sale) => sale.user)
  sales: InStoreSale[];

  @OneToMany(() => AuditLog, (log) => log.user)
  logs: AuditLog[];

  @OneToMany(() => Notification, (notif) => notif.user)
  notifications: Notification[];
}
