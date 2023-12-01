import { Language } from 'src/types';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { Profile } from './profile.entity';
import { Report } from './report.entity';

@Entity('users')
class User extends BaseEntity {
  @PrimaryColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    default: 'ua',
    enum: Language,
  })
  lang: Language;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
    nullable: true,
  })
  profile: Profile;

  @OneToMany(() => Report, (report) => report.reporter)
  reported: Report[];

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @Column({
    default: 'user',
    enum: ['user', 'admin'],
  })
  role: 'admin' | 'user';
}

export { User };
