import { Column, Entity } from 'typeorm';

import { IEntity } from './base.entity';

@Entity('images')
class File extends IEntity {
  @Column()
  key: string;

  @Column()
  url: string;
}

export { File };
