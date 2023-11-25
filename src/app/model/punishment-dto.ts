export interface PunishmentDto {
  id?: number;
  complaint?: string;
  complainReply?: string;
  date?: Date;
  punishmentTypeName?: string;
  employeeId?: number;
  isDeleted?: boolean;
}
