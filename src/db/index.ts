import { RowData } from "../models";

export class DatabaseOperator {
  writeRows = (rows: RowData[], onComplete?: (totalRows: number) => void) => {};
}
