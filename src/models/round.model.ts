import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { UserRoundStats } from './user-round-stats.model';
import { User } from './user.model';

@Table
export class Round extends Model {
    @Column({ 
        type: DataType.DATE(6), 
        allowNull: false,
        get() {
            const value = this.getDataValue('startAt');
            return value ? new Date(value) : null;
        },
        set(value: Date | string) {
            this.setDataValue('startAt', value ? new Date(value) : null);
        }
    })
    startAt: Date;

    @Column({ 
        type: DataType.DATE(6), 
        allowNull: false,
        get() {
            const value = this.getDataValue('endAt');
            return value ? new Date(value) : null;
        },
        set(value: Date | string) {
            this.setDataValue('endAt', value ? new Date(value) : null);
        }
    })
    endAt: Date;

    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    totalPoints: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    winnerId: number;

    @BelongsTo(() => User)
    winner: User;

    @HasMany(() => UserRoundStats)
    userStats: UserRoundStats[];
}
