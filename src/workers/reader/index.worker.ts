import { expose } from "comlink";
import { DatabaseOperator } from "../../db";
import { RowData } from "../../models";

interface InternalState {
  id?: string;
  currentTimer?: NodeJS.Timeout;
  dbOperator?: DatabaseOperator;

  // Performance meta
  logRead?: (start: number, end: number, numMessages: number) => void;
}

let state: InternalState = {
  id: undefined,
  currentTimer: undefined,
};

const init = (id: string) => {
  state.id = id;

  state.dbOperator = new DatabaseOperator();
};

const handleReadAll = (onComplete: (rowData: RowData[]) => void) => {
  if (!state.dbOperator) return;

  const start = performance.now();
  state.dbOperator.getRows().then((rows) => {
    const end = performance.now();
    console.log(
      `[Reader ${state.id}] Read ${rows.length} in ${(end - start).toFixed(
        0
      )}MS on worker thread.`
    );
    if (state.logRead) state.logRead(start, end, rows.length);
    onComplete(rows);
  });
};

const handleSetPerformanceLog = (
  logRead: (start: number, end: number, numMessages: number) => void
) => {
  state.logRead = logRead;
};

const api = {
  init,
  readAll: handleReadAll,
  handleSetPerformanceLog,
};

export default {} as typeof Worker & { new (): Worker };
export type ReaderWorkerAPI = typeof api;

expose(api);
