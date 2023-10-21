import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
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

  @JoinColumn()
  @OneToOne(() => Profile, (profile) => profile.user, {
    nullable: true,
    cascade: true,
  })
  profile: Profile;
}

export { User };
