import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { UserRoundStats } from './user-round-stats.model';

@Table
export class Round extends Model {
    @Column({ allowNull: false })
    title: string;

    @Column({ type: DataType.DATE, allowNull: false })
    startAt: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    endAt: Date;

    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    totalPoints: number;

    @HasMany(() => UserRoundStats)
    userStats: UserRoundStats[];
}
