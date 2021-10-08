import MaterialTable from "material-table";
import { useContext } from "react";
import PerformanceContext from "../../context/performance";
import { RangeType } from "../../context/performance/types";
import { tableIcons } from "./icons";

export const PerformanceTable = () => {
  const { writes } = useContext(PerformanceContext);

  return (
    <MaterialTable<RangeType>
      columns={[
        {
          title: "Duration (MS)",
          customSort: (a, b) => a.end - a.start - (b.end - b.start),
          render: (rowData) => {
            const { start, end } = rowData;
            const duration = end - start;
            return duration.toFixed(0);
          },
          defaultSort: "desc",
        },
        { title: "Num Messages", field: "numMessages", sorting: true },
        { title: "Payload Size", field: "payloadSize", sorting: true },
        {
          title: "Estimated Existing",
          field: "estimatedMessagesAlreadySaved",
          sorting: true,
        },
        { title: "Source", field: "source" },
      ]}
      icons={tableIcons}
      options={{
        grouping: true,
        pageSize: 20,
        exportButton: true,
      }}
      data={writes}
      title="Writes"
    />
  );
};
