import { Column, Entity } from 'typeorm';
import { IEntity } from './base.entity';

@Entity('images')
class File extends IEntity {
  @Column()
  url: string;

  @Column()
  key: string;
}

export { File };
