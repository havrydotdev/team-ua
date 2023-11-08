import { Column, Entity, ManyToMany } from 'typeorm';

import { IEntity } from './base.entity';
import { Profile } from './profile.entity';

@Entity('games')
class Game extends IEntity {
  @Column()
  description: string;

  @Column()
  image: string;

  @ManyToMany(() => Profile, (profile) => profile.games)
  profiles: Profile[];

  @Column()
  title: string;
}

export { Game };
