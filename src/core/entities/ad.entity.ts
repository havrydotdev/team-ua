import { Column, Entity } from 'typeorm';

import { IEntity } from './base.entity';

@Entity('ads')
export class Ad extends IEntity {
  @Column()
  description: string;

  @Column()
  fileId: string;

  @Column()
  url: string;
}
