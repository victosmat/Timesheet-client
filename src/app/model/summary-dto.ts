import { CheckInDto } from "./check-in-dto";
import { NoteSummaryDto } from "./note-summary-dto";

export interface SummaryDto {
    date: Date,
    checkInDto: CheckInDto | null,
    noteSummaryDto: NoteSummaryDto | null
}
