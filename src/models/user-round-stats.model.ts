import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from './user.model'
import { Round } from './round.model'

@Table
export class UserRoundStats extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number

  @ForeignKey(() => Round)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  roundId: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  tapsCount: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  points: number

  @BelongsTo(() => User)
  user: User

  @BelongsTo(() => Round)
  round: Round
}
