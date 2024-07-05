import { EntitySchema } from 'typeorm';
import { BaseSchema } from './base.schema';
import { UserScoreEntity } from '../entity';
import { TableNames } from '../enum/database.enum';

export const UserScoreSchema = new EntitySchema<UserScoreEntity>({
  name: UserScoreEntity.name,
  tableName: TableNames.DOC_QUEUE,
  target: UserScoreEntity,
  columns: {
    id: {
      type: String,
      primary: true,
      length: 100,
      name: 'id',
    },
    ...BaseSchema,
  },
  indices: [
    {
      name: 'UserScore_idx',
      columns: ['id'],
    },
  ],
});
