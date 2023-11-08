import { Column, Entity, ManyToOne } from 'typeorm';

import { IEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Report extends IEntity {
  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.reported)
  reporter: User;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
