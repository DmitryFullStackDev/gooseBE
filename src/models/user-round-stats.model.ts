import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';
import { Round } from './round.model';

@Table
export class UserRoundStats extends Model {
    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => Round)
    @Column
    roundId: number;

    @Column({ defaultValue: 0 })
    tapsCount: number;

    @Column({ defaultValue: 0 })
    points: number;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Round)
    round: Round;
}
