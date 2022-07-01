import ApexCharts from "apexcharts";
import moment from "moment";
import { useContext, useMemo } from "react";
import Chart from "react-apexcharts";
import PerformanceContext from "../../context/performance";

const ChartOptions: ApexCharts.ApexOptions = {
  chart: {
    height: 450,
    type: "rangeBar",
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: "80%",
    },
  },
  xaxis: {
    type: "datetime",
  },
  stroke: {
    width: 1,
  },
  fill: {
    type: "solid",
    opacity: 0.15,
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
  },
};

const TimelineRangeChart: React.FC = () => {
  const { reads, writes } = useContext(PerformanceContext);

  const data = useMemo(() => {
    return [
      {
        name: "reads",
        data: reads
          .filter((r) => r.type === "read")
          .map((readRange) => ({
            x: readRange.source,
            y: [readRange.start, readRange.end],
          })),
      },
      {
        name: "writes",
        data: writes.map((writeRange) => ({
          x: writeRange.source,
          y: [writeRange.start, writeRange.end],
        })),
      },
    ];
  }, [reads, writes]);

  const writeRows = useMemo(
    () =>
      writes.map((writeRange) => {
        const start = moment(writeRange.start);
        const end = moment(writeRange.end);
        const duration = writeRange.end - writeRange.start;
        return (
          <tr>
            <td>{writeRange.source}</td>
            <td>{start.format("HH:mm:ss.SSSS")}</td>
            <td>{end.format("HH:mm:ss.SSSS")}</td>
            <td>{duration}</td>
          </tr>
        );
      }),
    [writes]
  );

  const readRows = useMemo(
    () =>
      reads.map((readRange) => {
        const start = moment(readRange.start);
        const end = moment(readRange.end);
        const duration = readRange.end - readRange.start;
        return (
          <tr>
            <td>{readRange.source}</td>
            <td>{start.format("HH:mm:ss.SSSS")}</td>
            <td>{end.format("HH:mm:ss.SSSS")}</td>
            <td>{duration}</td>
            <td>{readRange.numMessages}</td>
          </tr>
        );
      }),
    [reads]
  );

  return (
    <div id="chart">
      <Chart
        options={ChartOptions}
        series={data}
        type="rangeBar"
        height={450}
      />

      <table>
        <th>
          <td>Source</td>
          <td>Start</td>
          <td>End</td>
          <td>Duration</td>
        </th>
        {writeRows}
      </table>

      <table>
        <th>
          <td>Source</td>
          <td>Start</td>
          <td>End</td>
          <td>Duration</td>
          <td>Num Messages</td>
        </th>
        {readRows}
      </table>
    </div>
  );
};

export default TimelineRangeChart;
