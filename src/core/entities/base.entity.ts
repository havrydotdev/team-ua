import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

abstract class IEntity extends BaseEntity {
  @CreateDateColumn()
  created_at: Date;

  @PrimaryGeneratedColumn()
  id: number;

  @UpdateDateColumn()
  updated_at: Date;
}

export { IEntity };
