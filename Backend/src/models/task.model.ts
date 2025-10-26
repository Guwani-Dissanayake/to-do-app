import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

@Table({
  tableName: "tasks",
  timestamps: false,
})
export class Task extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description!: string | null;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: 0,
  })
  completed!: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: "created_at",
    defaultValue: DataType.NOW,
  })
  created_at!: Date;
}
