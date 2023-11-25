import { Time } from "@angular/common";

export interface CheckinPunishmentDto{
    id?: number,
    date?: Date,
    timeCheckin?: Time,
    timeCheckout?: Time,
    status?: string,
    punishmentTypeDes?: string,
    punishmentMoney?: string,
    complain?: string,
    complainReply?: string,
    deleted?: boolean,
}