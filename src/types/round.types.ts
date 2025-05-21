export interface WinnerInfo {
    userId: number;
    username: string;
    points: number;
}

export interface RoundDetails {
    round: {
        startAt: string;
        endAt: string;
        id: number;
        totalPoints: number;
        winnerId: number | null;
        createdAt: string;
        updatedAt: string;
    };
    timeUntilStart: number;
    winner: WinnerInfo | null;
    userPoints: number;
} 