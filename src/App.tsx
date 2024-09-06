import React, { useEffect, useState } from "react";
import { main } from "./api";
import getWeatherCode from "./weatherCode";
const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 특정 날짜인지 확인하는 함수
  const isToday = (timestamp: string): boolean => {
    const date = new Date(timestamp);
    const today = new Date();

    return (
      date.getUTCFullYear() === today.getUTCFullYear() &&
      date.getUTCMonth() === today.getUTCMonth() &&
      date.getUTCDate() === today.getUTCDate()
    );
  };

  // 시간을 "오전/오후 몇 시" 형식으로 변환하는 함수
  const formatTimeTo12Hour = (timestamp: string): string => {
    const date = new Date(timestamp);
    const hours = date.getUTCHours();
    const formattedHours = hours % 12 || 12; // 12시간 형식으로 변환
    const period = hours < 12 ? "오전" : "오후";

    return `${period} ${formattedHours}시`;
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await main(); // main 함수 호출
      setWeatherData(data); // 받아온 데이터 저장
      setLoading(false);
    };

    fetchData();
  }, []);
  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (!weatherData) {
    return <h1> 날씨 데이터를 가져오지 못했습니다.</h1>;
  }

  // 시간대별 데이터 필터링 (오늘 날짜만)
  const todayTimes = weatherData.hourly.time.filter((time: string) =>
    isToday(time)
  );
  const todayTemperatures = weatherData.hourly.temperature_2m.slice(
    0,
    todayTimes.length
  );

  const todayWeatherCodes = weatherData.hourly.weathercode.slice(
    0,
    todayTimes.length
  );

  return (
    <div>
      <h2>
        오늘의 날씨 {getWeatherCode(weatherData.current_weather.weathercode)}
      </h2>
      <ul>
        {todayTimes.map((time: string, index: number) => (
          <li key={time}>
            {formatTimeTo12Hour(time)}: {todayTemperatures[index]}°C
            <br></br>
            {getWeatherCode(todayWeatherCodes[index])}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
