import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { IEntity } from './base.entity';
import { File } from './file.entity';
import { Game } from './game.entity';
import { User } from './user.entity';

@Entity('profiles')
class Profile extends IEntity {
  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  about: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;

  @JoinTable()
  @ManyToMany(() => Game, (game) => game.profiles)
  games: Game[];

  @JoinColumn()
  @OneToOne(() => File)
  file: File;
}

export { Profile };
