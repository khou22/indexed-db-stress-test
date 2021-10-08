import { expose } from "comlink";
import { DatabaseOperator } from "../../db";
import { generateMockRowData } from "../../utils/mock";

const DEFAULT_WRITE_SIZE = 100;
const DEFAULT_INTERVAL_TIMER = 1000;

interface InternalState {
  id?: string;
  dbWorkerPort?: MessagePort;
  currentTimer?: NodeJS.Timeout;
  dbOperator?: DatabaseOperator;

  // Performance meta
  logWrite?: (start: number, end: number) => void;
}

let state: InternalState = {
  id: undefined,
  currentTimer: undefined,
};

const init = (id: string, dbWorkerPort: MessagePort) => {
  state.id = id;
  state.dbWorkerPort = dbWorkerPort;

  state.dbOperator = new DatabaseOperator();
};

const handleStart = (numMessages?: number, interval?: number) => {
  console.log(`[Writer ${state.id}] Starting`);

  state.currentTimer = setInterval(async () => {
    if (!state.dbOperator) {
      console.log(`[Writer ${state.id}] DB Operator!`);
      return;
    }

    const mockData = generateMockRowData(numMessages || DEFAULT_WRITE_SIZE);

    const start = Date.now();
    state.dbOperator?.writeRows(mockData, () => {
      if (state.logWrite) state.logWrite(start, Date.now());
    });
  }, interval || DEFAULT_INTERVAL_TIMER);
};

const handleStop = () => {
  console.log(`[Writer ${state.id}] Stopping`);

  if (state.currentTimer) {
    clearInterval(state.currentTimer);
  }
};

const handleSetPerformanceLog = (
  logWrite: (start: number, end: number) => void
) => {
  state.logWrite = logWrite;
};

const api = {
  init,
  start: handleStart,
  stop: handleStop,
  handleSetPerformanceLog,
};

export default {} as typeof Worker & { new (): Worker };
export type WriterWorkerAPI = typeof api;

expose(api);
