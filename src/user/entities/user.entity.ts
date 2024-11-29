import { Gender } from 'src/enum/gender';
import { Role } from 'src/enum/role';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  email: string;

  @Index('phone_number_idx', { unique: true })
  @Column({ nullable: false })
  phone_number: string;

  @Column({ nullable: false })
  fullname: string;

  @Column()
  password_hash: string;

  @Column()
  birthday: Date;

  @Column()
  gender: Gender;
  
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public updatedAt: Date;

  @BeforeInsert()
  updateCreatedAt() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  updateUpdatedAt() {
    this.updatedAt = new Date();
  }
}
