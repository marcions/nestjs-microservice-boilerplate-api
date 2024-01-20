import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ timestamps: true, tableName: 'cats' })
export class CatsSchema extends Model {
  @Column({ primaryKey: true, type: DataType.UUID })
  id: string;

  @Column({ allowNull: false, type: DataType.STRING })
  name: string;

  @Column(DataType.INTEGER)
  age: number;

  @Column(DataType.STRING)
  breed: string;

  @Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: true })
  status: boolean;

  @Column({ allowNull: true, type: DataType.BOOLEAN })
  deleted: boolean;

  @Column({ allowNull: false, type: DataType.UUID })
  userId: string;

  @Column({ allowNull: false, type: DataType.UUID })
  createdBy: string;

  @Column({ allowNull: true, type: DataType.UUID })
  updatedBy: string;

  @Column({ allowNull: true, type: DataType.DATE })
  deletedAt?: Date;

  @Column({ allowNull: true, type: DataType.UUID })
  deletedBy: string;
}
