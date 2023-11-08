import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ReportsChannel extends BaseEntity {
  @PrimaryColumn({
    type: 'bigint',
  })
  id: number;
}
