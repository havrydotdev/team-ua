import { Column, Entity, ManyToMany, OneToOne } from 'typeorm';
import { IEntity } from './base.entity';
import { Game } from './game.entity';
import { User } from './user.entity';

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

  @ManyToMany(() => Game, (game) => game.profiles)
  games: Game[];
}

export { Profile };
