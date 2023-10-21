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
import { File } from './file.entity';

@Entity('profiles')
class Profile extends IEntity {
  @Column()
  location: string;

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
