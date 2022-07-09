import { Button } from "@material-ui/core";
import { useCallback, useContext, useEffect, useState } from "react";
import "./App.css";
import { PerformanceHistogram } from "./components/performance-histogram";
import { PerformanceTable } from "./components/performance-table";
import TimelineRangeChart from "./components/performance-viz";
import { StopWatch } from "./components/stopwatch";
import WriterStatus from "./components/writer-status";
import PerformanceContext, {
  PerformanceContextManager,
} from "./context/performance";
import { mainDatabaseOperator } from "./db/mainOperator";
import { useReader } from "./hooks/useReader";
import "./index.css";
import { humanFileSize, payloadSize } from "./utils/eval";
import { generateMockRowData, PAYLOAD_SIZE } from "./utils/mock";

const App = () => {
  const { logWriteRanges, estimatedMessagesAlreadySaved } =
    useContext(PerformanceContext);
  const [showPerformance, setShowPerformance] = useState(false);
  const [showWritesTable, setShowWritesTable] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const { readAll } = useReader();

  useEffect(() => {
    mainDatabaseOperator.initDB();
  }, []);

  const handleReadAll = useCallback(() => {
    setIsReading(true);
    readAll((rowData, { readTime, transferTime }) => {
      setIsReading(false);
      console.log(
        `[Reader] ${rowData.length} items, ${humanFileSize(
          payloadSize(rowData)
        )} bytes [read: ${readTime.toFixed(
          1
        )}] [transfer: ${transferTime.toFixed(1)}]`
      );
    });
  }, [readAll]);

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
          estimatedMessagesAlreadySaved:
            estimatedMessagesAlreadySaved?.current || 0,
        },
      ]);
    },
    [logWriteRanges, estimatedMessagesAlreadySaved]
  );

  return (
    <div className="App">
      <h1>Indexed DB + Web Workers Demo</h1>
      <Button variant="outlined" onClick={handleReadAll} disabled={isReading}>
        {isReading ? "Reading..." : "Read All"}
      </Button>
      <hr />
      <Button
        variant="outlined"
        onClick={() => handleAddRows(1, PAYLOAD_SIZE.SMALL)}
      >
        Add 1 Small
      </Button>
      <Button
        variant="outlined"
        onClick={() => handleAddRows(100, PAYLOAD_SIZE.SMALL)}
      >
        Add 100 Small
      </Button>
      <Button
        variant="outlined"
        onClick={() => handleAddRows(1000, PAYLOAD_SIZE.SMALL)}
      >
        Add 1K Small
      </Button>
      <Button
        variant="outlined"
        onClick={() => handleAddRows(10000, PAYLOAD_SIZE.SMALL)}
      >
        Add 10K Small
      </Button>

      <hr />

      <Button
        variant="outlined"
        onClick={() => handleAddRows(1, PAYLOAD_SIZE.MEDIUM)}
      >
        Add 1 Medium
      </Button>
      <Button
        variant="outlined"
        onClick={() => handleAddRows(100, PAYLOAD_SIZE.MEDIUM)}
      >
        Add 100 Medium
      </Button>
      <Button
        variant="outlined"
        onClick={() => handleAddRows(1000, PAYLOAD_SIZE.MEDIUM)}
      >
        Add 1K Medium
      </Button>
      <Button
        variant="outlined"
        onClick={() => handleAddRows(10000, PAYLOAD_SIZE.MEDIUM)}
      >
        Add 10K Medium
      </Button>

      <hr />
      <Button
        variant="outlined"
        onClick={() => handleAddRows(1, PAYLOAD_SIZE.LARGE)}
      >
        Add 1 Large
      </Button>
      <Button
        variant="outlined"
        onClick={() => handleAddRows(100, PAYLOAD_SIZE.LARGE)}
      >
        Add 100 Large
      </Button>
      <Button
        variant="outlined"
        onClick={() => handleAddRows(1000, PAYLOAD_SIZE.LARGE)}
      >
        Add 1K Large
      </Button>
      <Button
        variant="outlined"
        onClick={() => handleAddRows(10000, PAYLOAD_SIZE.LARGE)}
      >
        Add 10K Large
      </Button>

      <hr />
      <Button
        variant="contained"
        color="secondary"
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
      </Button>

      <p>
        Hitch Detector: <StopWatch />
      </p>

      <hr />

      <h2>Writes</h2>
      <Button
        variant="contained"
        onClick={() => setShowWritesTable((prev) => !prev)}
      >
        {showWritesTable ? "Hide" : "Show Writes"}
      </Button>
      {showWritesTable && <PerformanceTable />}

      <h2>Performance</h2>
      <Button
        variant="outlined"
        onClick={() => setShowPerformance((prev) => !prev)}
      >
        {showPerformance ? "Hide" : "Show"}
      </Button>
      {showPerformance && (
        <>
          <PerformanceHistogram />
          <TimelineRangeChart />
        </>
      )}

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
