import {
  BaseEntity,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity('users')
class User extends BaseEntity {
  @PrimaryColumn({
    type: 'bigint',
  })
  id: number;

  @JoinColumn()
  @OneToOne(() => Profile, (profile) => profile.user, {
    nullable: true,
    cascade: true,
  })
  profile: Profile;
}

export { User };
