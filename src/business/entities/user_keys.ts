import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  Column,
} from 'typeorm';
import { User } from './user';

@Entity()
export class UserKeys {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, user => user.id)
  @JoinColumn()
  user: User;

  @Column()
  publicKey: string;

  @Column()
  privateKey: string;
  
}