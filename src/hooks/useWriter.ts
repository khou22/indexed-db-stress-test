import { proxy, wrap } from "comlink";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PerformanceContext from "../context/performance";
import WriterWorker, { WriterWorkerAPI } from "../workers/writer/index.worker";

export const useWriter = () => {
  const [isWriting, setIsWriting] = useState(false);

  const [workerID, setWorkerID] = useState<string | null>(null);
  const [intervalTime, setIntervalTime] = useState<number | null>(null);
  const [numMessages, setNumMessages] = useState<number | null>(null);
  const workerInstance = useRef<Worker | null>(null);
  const workerAPI = useRef<WriterWorkerAPI | null>(null);

  const { logWriteRanges } = useContext(PerformanceContext);

  useEffect(() => {
    if (workerAPI.current) return;

    const id = uuidv4();
    workerInstance.current = new WriterWorker();
    workerAPI.current = wrap(workerInstance.current);

    setWorkerID(id);
  }, [setWorkerID]);

  useEffect(() => {
    if (!workerID || !workerAPI.current) return;
    workerAPI.current.handleSetPerformanceLog(
      proxy((start: number, end: number) => {
        logWriteRanges([{ source: `writer-${workerID}`, start, end }]);
      })
    );
  }, [logWriteRanges, workerID]);

  const handleStart = useCallback(
    (numMessages?: number, interval?: number) => {
      setIsWriting(true);
      setNumMessages(numMessages || null);
      setIntervalTime(interval || null);
      workerAPI.current?.start(numMessages, interval);
    },
    [setIsWriting]
  );

  const handleStop = useCallback(() => {
    setIsWriting(false);
    setNumMessages(null);
    setIntervalTime(null);
    workerAPI.current?.stop();
  }, [setIsWriting]);

  return {
    id: workerID,
    numMessages,
    intervalTime,
    isWriting,
    start: handleStart,
    stop: handleStop,
  };
};
