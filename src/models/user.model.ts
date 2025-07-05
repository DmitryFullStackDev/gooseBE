import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import { UserRoundStats } from './user-round-stats.model'

@Table
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  username: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role: string // admin, nikita, survivor

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  passwordHash: string

  @HasMany(() => UserRoundStats)
  stats: UserRoundStats[]
}
