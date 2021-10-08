//@ts-nocheck
import {
  BarSeries,
  DensitySeries,
  Histogram,
  PatternLines,
  XAxis,
  YAxis,
} from "@data-ui/histogram";

export type CustomHistogramProps = {
  data: number[];
};

export const CustomHistogram: React.FC<CustomHistogramProps> = ({ data }) => {
  return (
    <Histogram
      width={900}
      height={500}
      ariaLabel="My histogram of ..."
      orientation="vertical"
      cumulative={false}
      normalized={true}
      binCount={25}
      valueAccessor={(datum) => datum}
      binType="numeric"
      renderTooltip={({ event, datum, data, color }) => (
        <div>
          <strong style={{ color }}>
            {datum.bin0} to {datum.bin1}
          </strong>
          <div>
            <strong>count </strong>
            {datum.count}
          </div>
          <div>
            <strong>cumulative </strong>
            {datum.cumulative}
          </div>
          <div>
            <strong>density </strong>
            {datum.density}
          </div>
        </div>
      )}
    >
      <PatternLines
        id="normal"
        height={8}
        width={8}
        stroke="#fff"
        background="#e64980"
        strokeWidth={1}
        orientation={["horizontal", "vertical"]}
      />
      <BarSeries
        stroke="#e64980"
        fillOpacity={0.15}
        fill="url(#normal)"
        rawData={data}
      />
      <DensitySeries
        stroke="#e64980"
        showArea={false}
        smoothing={0.01}
        kernel="parabolic"
        rawData={data}
      />
      <XAxis />
      <YAxis />
    </Histogram>
  );
};
