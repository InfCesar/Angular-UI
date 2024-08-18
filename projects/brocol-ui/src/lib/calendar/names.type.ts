import { Tuple } from "../shared/tuple.type";

type WeekName = {
    short: string;
    long: string;
}
export type WeekNames = Tuple<WeekName, 7>;
export type MonthsNames = Tuple<string, 12>;