import React, { useCallback, useContext, useEffect, useState } from "react";
import { PerformanceTable } from "./components/performance-table";
import TimelineRangeChart from "./components/performance-viz";
import { StopWatch } from "./components/stopwatch";
import WriterStatus from "./components/writer-status";
import PerformanceContext, {
  PerformanceContextManager,
} from "./context/performance";
import { mainDatabaseOperator } from "./db/mainOperator";
import "./index.css";
import { generateMockRowData, PAYLOAD_SIZE } from "./utils/mock";

const App = () => {
  const { logWriteRanges } = useContext(PerformanceContext);
  const [showPerformance, setShowPerformance] = useState(false);
  const [showWritesTable, setShowWritesTable] = useState(false);

  useEffect(() => {
    mainDatabaseOperator.initDB();
  }, []);

  const handleAddRows = useCallback(
    async (n: number, payloadSize: number) => {
      const start = performance.now();
      const mockData = generateMockRowData(n, payloadSize);
      await mainDatabaseOperator.writeRows(mockData);
      const end = performance.now();
      console.log(`[Writer] Wrote ${n} rows in ${end - start} MS`);

      logWriteRanges([
        {
          type: "write",
          start,
          end,
          source: "manual",
          numMessages: n,
          payloadSize,
        },
      ]);
    },
    [logWriteRanges]
  );

  return (
    <div className="App">
      <h1>Indexed DB + Web Workers Demo</h1>
      <button onClick={() => handleAddRows(1, PAYLOAD_SIZE.SMALL)}>
        Add 1 Small
      </button>
      <button onClick={() => handleAddRows(100, PAYLOAD_SIZE.SMALL)}>
        Add 100 Small
      </button>
      <button onClick={() => handleAddRows(1000, PAYLOAD_SIZE.SMALL)}>
        Add 1000 Small
      </button>

      <hr />

      <button onClick={() => handleAddRows(1, PAYLOAD_SIZE.MEDIUM)}>
        Add 1 Medium
      </button>
      <button onClick={() => handleAddRows(100, PAYLOAD_SIZE.MEDIUM)}>
        Add 100 Medium
      </button>
      <button onClick={() => handleAddRows(1000, PAYLOAD_SIZE.MEDIUM)}>
        Add 1000 Medium
      </button>

      <hr />
      <button onClick={() => handleAddRows(1, PAYLOAD_SIZE.LARGE)}>
        Add 1 Large
      </button>
      <button onClick={() => handleAddRows(100, PAYLOAD_SIZE.LARGE)}>
        Add 100 Large
      </button>
      <button onClick={() => handleAddRows(1000, PAYLOAD_SIZE.LARGE)}>
        Add 1000 Large
      </button>

      <hr />
      <button
        onClick={() =>
          mainDatabaseOperator
            .connectToDB()
            .then((db) => mainDatabaseOperator.wipeDB(db))
            .then(() => {
              alert("Wiped DB");
              window.location.reload();
            })
        }
      >
        Wipe DB
      </button>

      <p>
        Hitch Detector: <StopWatch />
      </p>

      <hr />

      <h2>Writes</h2>
      <button onClick={() => setShowWritesTable((prev) => !prev)}>
        {showWritesTable ? "Hide" : "Show Writes"}
      </button>
      {showWritesTable && <PerformanceTable />}

      <h2>Performance</h2>
      <button onClick={() => setShowPerformance((prev) => !prev)}>
        {showPerformance ? "Hide" : "Show"}
      </button>
      {showPerformance && <TimelineRangeChart />}

      <hr />

      <h2>Web Worker Details</h2>

      <WriterStatus />
      <WriterStatus />
      <WriterStatus />
      <WriterStatus />
    </div>
  );
};

const WrappedApp = () => (
  <PerformanceContextManager>
    <App />
  </PerformanceContextManager>
);

export default WrappedApp;
