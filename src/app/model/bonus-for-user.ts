export interface BonusForUserDto {
    id?: number;
    bonusId?: number;
    name?: string;
    description?: string;
    dateBonus: number[];
    reason?: string;
    gratuity?: number;
}