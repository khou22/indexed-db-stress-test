import _ from "lodash";
import React, { RefObject, useCallback, useRef, useState } from "react";
import { RangeType } from "./types";

interface PerformanceContextProps {
  estimatedMessagesAlreadySaved: RefObject<number> | null;
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
  const estimatedMessagesAlreadySaved = useRef(0);

  const logReadRanges = useCallback(
    (ranges: RangeType[]) => {
      setReadRanges((oldRanges) => oldRanges.concat(ranges));
    },
    [setReadRanges]
  );

  const logWriteRanges = useCallback(
    (ranges: RangeType[]) => {
      estimatedMessagesAlreadySaved.current += _.sum(
        ranges.map((r) => (r.type === "write" ? r.numMessages : 0))
      );
      setWriteRanges((oldRanges) => oldRanges.concat(ranges));
    },
    [setWriteRanges]
  );

  return {
    estimatedMessagesAlreadySaved: estimatedMessagesAlreadySaved,
    reads: readRanges,
    logReadRanges,
    writes: writeRanges,
    logWriteRanges,
  };
};

const defaultValue: PerformanceContextProps = {
  estimatedMessagesAlreadySaved: null,
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
