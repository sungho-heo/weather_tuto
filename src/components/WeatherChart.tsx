import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface WeatherChartProps {
  data: {
    time: string;
    temperature: number;
  }[];
}

const WeatherChart: React.FC<WeatherChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {/* x축 라벨 개수 조정 */}
        <XAxis
          dataKey="time"
          interval={0}
          ticks={
            data.length > 6
              ? data
                  .filter(
                    (_, index) => index % Math.ceil(data.length / 6) === 0
                  )
                  .map((d) => d.time)
              : data.map((d) => d.time)
          }
        />
        <YAxis />
        <Tooltip
          contentStyle={{ backgroundColor: "rgba(0,0,0, 0.7" }}
          labelStyle={{ color: "#fff" }}
          itemStyle={{ color: "#fff" }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="temperature"
          stroke="#8884d8" //선 색상
          strokeWidth={2} //선 두께
          dot={{ r: 4 }} //점 크기
          activeDot={{ r: 6 }} // 할성화된 점 크기
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeatherChart;
