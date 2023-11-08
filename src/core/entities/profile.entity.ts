import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';

import { IEntity } from './base.entity';
import { Game } from './game.entity';
import { User } from './user.entity';

@Entity('profiles')
class Profile extends IEntity {
  @Column()
  about: string;

  @Column()
  age: number;

  @Column({
    name: 'file_id',
  })
  fileId: string;

  @JoinTable()
  @ManyToMany(() => Game, (game) => game.profiles)
  games: Game[];

  @Column()
  name: string;

  @JoinColumn()
  @OneToOne(() => User, (user) => user.profile)
  user: User;
}

export { Profile };
