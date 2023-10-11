import { Column, Entity, ManyToMany } from 'typeorm';
import { IEntity } from './base.entity';
import { Profile } from './profile.entity';

@Entity('games')
class Game extends IEntity {
  @Column()
  title: string;

  @ManyToMany(() => Profile, (profile) => profile.game)
  profiles: Profile[];
}

export { Game };
