import { Column, Entity, OneToOne } from 'typeorm';
import { IEntity } from './base.entity';
import { Profile } from './profile.entity';

@Entity('users')
class User extends IEntity {
  @Column()
  userId: string;

  @Column()
  chatId: string;

  @OneToOne(() => Profile, (profile) => profile.user, {
    nullable: true,
  })
  profile: Profile;
}

export { User };
