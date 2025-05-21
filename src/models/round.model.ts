import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { UserRoundStats } from './user-round-stats.model';

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

    @HasMany(() => UserRoundStats)
    userStats: UserRoundStats[];
}
