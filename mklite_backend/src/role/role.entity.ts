import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { OneToMany } from "typeorm";
import { User } from "../user/user.entity";

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id_role: number;

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
