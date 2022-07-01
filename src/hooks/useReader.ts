import { proxy, wrap } from "comlink";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PerformanceContext from "../context/performance";
import ReaderWorker, { ReaderWorkerAPI } from "../workers/reader/index.worker";

export const useReader = () => {
  const [workerID, setWorkerID] = useState<string | null>(null);
  const workerInstance = useRef<Worker | null>(null);
  const workerAPI = useRef<ReaderWorkerAPI | null>(null);

  const { logReadRanges, estimatedMessagesAlreadySaved } =
    useContext(PerformanceContext);

  useEffect(() => {
    if (workerAPI.current) return;

    const id = uuidv4();
    workerInstance.current = new ReaderWorker();
    workerAPI.current = wrap(workerInstance.current);
    workerAPI.current.init(id);

    setWorkerID(id);
  }, [setWorkerID]);

  useEffect(() => {
    if (!workerID || !workerAPI.current) return;
    workerAPI.current.handleSetPerformanceLog(
      proxy((start: number, end: number, numMessages: number) => {
        logReadRanges([
          {
            type: "read",
            source: `reader-${workerID}`,
            start,
            end,
            numMessages,
          },
        ]);
      })
    );
  }, [logReadRanges, workerID, estimatedMessagesAlreadySaved]);

  const handleReadAll = useCallback(() => {
    if (!workerAPI.current) return;
    workerAPI.current.readAll(
      proxy((rowData) => {
        console.log("[Reader] Received row data on main thread", rowData);
      })
    );
  }, []);

  return {
    id: workerID,
    readAll: handleReadAll,
  };
};
