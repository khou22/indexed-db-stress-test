import React, { useCallback, useState } from "react";
import { RangeType } from "./types";

interface PerformanceContextProps {
  reads: RangeType[];
  logReadRanges: (ranges: RangeType[]) => void;
  writes: RangeType[];
  logWriteRanges: (ranges: RangeType[]) => void;
}

type PublicProps = {
  children: any;
};

const useContextValue = (): PerformanceContextProps => {
  const [readRanges, setReadRanges] = useState<RangeType[]>([]);
  const [writeRanges, setWriteRanges] = useState<RangeType[]>([]);

  const logReadRanges = useCallback(
    (ranges: RangeType[]) => {
      setReadRanges((oldRanges) => oldRanges.concat(ranges));
    },
    [setReadRanges]
  );

  const logWriteRanges = useCallback(
    (ranges: RangeType[]) => {
      setWriteRanges((oldRanges) => oldRanges.concat(ranges));
    },
    [setWriteRanges]
  );

  return {
    reads: readRanges,
    logReadRanges,
    writes: writeRanges,
    logWriteRanges,
  };
};

const defaultValue: PerformanceContextProps = {
  reads: [],
  logReadRanges: () => console.log("logReadRanges not set"),
  writes: [],
  logWriteRanges: () => console.log("logWriteRanges not set"),
};

const PerformanceContext = React.createContext(defaultValue);

export const PerformanceContextManager = (props: PublicProps) => {
  const value = useContextValue();
  return (
    <PerformanceContext.Provider value={value}>
      {props.children}
    </PerformanceContext.Provider>
  );
};

export default PerformanceContext;
