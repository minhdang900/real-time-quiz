import { EntitySchemaColumnOptions } from 'typeorm';

export const BaseSchema = {
  createdBy: {
    name: 'created_by',
    type: String,
    nullable: true,
  } as EntitySchemaColumnOptions,
  updatedBy: {
    name: 'updated_by',
    type: String,
    nullable: true,
  } as EntitySchemaColumnOptions,
  createdAt: {
    name: 'created_at',
    type: 'timestamp with time zone',
    createDate: true,
  } as EntitySchemaColumnOptions,
  updatedAt: {
    name: 'updated_at',
    type: 'timestamp with time zone',
    updateDate: true,
  } as EntitySchemaColumnOptions,
};
