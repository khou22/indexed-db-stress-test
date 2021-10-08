import MaterialTable from "material-table";
import { useContext } from "react";
import PerformanceContext from "../../context/performance";
import { RangeType } from "../../context/performance/types";

export const PerformanceTable = () => {
  const { writes } = useContext(PerformanceContext);

  return (
    <MaterialTable<RangeType>
      columns={[
        { title: "Source", field: "source" },
        {
          title: "Duration",
          customSort: (a, b) => b.end - b.start - (a.end - a.start),
          render: (rowData) => {
            const { start, end } = rowData;
            const duration = end - start;
            return <p>{duration} MS</p>;
          },
        },
      ]}
      data={writes}
      title="Writes"
    />
  );
};
