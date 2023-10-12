import { Column, Entity, OneToOne } from 'typeorm';
import { IEntity } from './base.entity';
import { Profile } from './profile.entity';

@Entity('users')
class User extends IEntity {
  @Column({
    unique: true,
  })
  userId: number;

  @Column({
    unique: true,
  })
  chatId: number;

  @OneToOne(() => Profile, (profile) => profile.user, {
    nullable: true,
  })
  profile: Profile;
}

export { User };
