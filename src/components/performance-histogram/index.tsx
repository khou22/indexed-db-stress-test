import { useContext, useMemo } from "react";
import PerformanceContext from "../../context/performance";
import { CustomHistogram } from "./histogram";

export const PerformanceHistogram = () => {
  const { writes } = useContext(PerformanceContext);

  const data = useMemo(() => {
    return writes.map((w) => w.end - w.start);
  }, [writes]);

  return <CustomHistogram data={data} />;
};
