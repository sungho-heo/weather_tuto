import React, { useState, useEffect } from "react";
import styled from "styled-components";
import WeatherChart from "./WeatherChart";
import { WeatherContainer } from "../styles/CommonStyles";
import { main } from "../api";
import { getWeatherCode, getWeatherBackgroundImage } from "../weatherCode";
import weatherUv from "../weatherUv";

// css
const WeatherLi = styled.ul`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  width: 100%;
  justify-content: center;
`;

const TodayMain = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const ToggleButtons = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 0 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #2980b9;
  }
`;

// 일주알 데이터 css
const WeekWeatherSummary = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
`;
const DaySummary = styled.div`
  text-align: center;
  cursor: pointer;
  &.active {
    font-weight: bold;
    color: #3498db;
  }
`;

const Home: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [geoData, setgeoData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showWeatherInfo, setShowWeatherInfo] = useState<boolean>(true); // 기본적으로 보여주는 날씨데이터
  const [showChart, setShowChart] = useState<boolean>(false); // 그래프 형태의 날씨데이터.
  const [selectedDate, setSelectedDate] = useState<number>(0);

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
    const hours = date.getHours();
    const formattedHours = hours % 12 || 12; // 12시간 형식으로 변환
    const period = hours < 12 ? "오전" : "오후";

    return `${period} ${formattedHours}시`;
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await main(); // main 함수 호출
      if (data?.locationData) {
        const listData = data?.locationData.split(",");
        setgeoData(listData);
      }
      setWeatherData(data?.weatherData); // 받아온 데이터 저장
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

  const today = new Date();

  // 일주일치 날씨 요약 데이터 생성
  const weeklyWeatherData = weatherData.daily.temperature_2m_max.map(
    (maxTemp: number, index: number) => {
      const date = new Date(today);
      date.setDate(date.getDate() + index); // 현재 날짜에서 index일 추가
      return {
        date,
        maxTemp,
        minTemp: weatherData.daily.temperature_2m_min[index],
        weatherCode: weatherData.daily.weather_code[index],
      };
    }
  );

  // 선택된 날짜의 상세 데이터 추출
  const selectedDayWeather = weeklyWeatherData[selectedDate];
  const selectedDayTimes = weatherData.hourly.time.filter((time: string) => {
    const date = new Date(time);
    return (
      date.getUTCFullYear() === selectedDayWeather.date.getUTCFullYear() &&
      date.getUTCMonth() === selectedDayWeather.date.getUTCMonth() &&
      date.getUTCDate() === selectedDayWeather.date.getUTCDate()
    );
  });
  const selectedDayTemperatures = weatherData.hourly.temperature_2m.slice(
    selectedDate * 24,
    (selectedDate + 1) * 24
  );

  // 요약 날짜 클릭 시 선택된 날짜 업데이트
  const handleDayClick = (index: number) => {
    setSelectedDate(index);
    setShowWeatherInfo(true);
    setShowChart(false);
  };

  // 시간대별 데이터 필터링 (오늘 날짜만)
  const todayTimes = weatherData.hourly.time.filter((time: string) =>
    isToday(time)
  );
  const todayTemperatures = weatherData.hourly.temperature_2m.slice(
    0,
    todayTimes.length
  );

  const todayWindspeed = weatherData.hourly.wind_speed_10m.slice(
    0,
    todayTimes.length
  );

  const todayHumidity = weatherData.hourly.relative_humidity_2m.slice(
    0,
    todayTimes.length
  );

  const todayWeatherCodes = weatherData.hourly.weathercode.slice(
    0,
    todayTimes.length
  );
  const todayDay = new Date().getUTCDate();
  const todayMonth = new Date().getMonth() + 1;

  // 체감온도 구하기
  const temp = (temperature: number, windSpeed: number): number => {
    if (temperature > 10 || windSpeed < 4.8) {
      // 체감온도 공식은 기온 10°C 이하, 풍속 4.8km/h 이상에서 적용
      return temperature;
    }

    const windChill =
      13.12 +
      0.6215 * temperature -
      11.37 * Math.pow(windSpeed, 0.16) +
      0.3965 * temperature * Math.pow(windSpeed, 0.16);
    return Math.round(windChill * 10) / 10; // 소수점 1자리까지 반올림
  };

  // 일몰 일출
  const earlyTime = (timeStamp: string): string => {
    const date = new Date(timeStamp);
    const hours = date.getHours();
    const formattedHours = hours % 12 || 12; // 12시간 형식으로 변환
    const min = date.getMinutes();
    return `${formattedHours}:${min}`;
  };

  // chartData
  const chartData = todayTimes.map((time: string, index: number) => {
    const date = new Date(time);
    return {
      time: `${date.getHours()}:00`, // 시간지정.
      temperature: todayTemperatures[index],
    };
  });

  return (
    <WeatherContainer
      backgroundImage={getWeatherBackgroundImage(
        weatherData.current_weather.weathercode
      )}
    >
      <ToggleButtons>
        <Button
          onClick={() => {
            setShowWeatherInfo(true);
            setShowChart(false);
          }}
        >
          기본 날씨 데이터
        </Button>
        <Button
          onClick={() => {
            setShowWeatherInfo(false);
            setShowChart(true);
          }}
        >
          그래프 날씨 데이터
        </Button>
      </ToggleButtons>

      {/* 일주일치 요약 */}
      <WeekWeatherSummary>
        {weeklyWeatherData.map((day, index) => (
          <DaySummary
            key={index}
            className={selectedDate === index ? "active" : ""}
            onClick={() => handleDayClick(index)}
          >
            {day.date.getMonth() + 1}/{day.date.getDate()}
            <br />
            {getWeatherCode(day.weatherCode)}
            <br />
            {day.maxTemp}°C / {day.minTemp}°C
          </DaySummary>
        ))}
      </WeekWeatherSummary>

      <TodayMain>
        {geoData[2]} {geoData[1]} 날짜:{todayMonth}.{todayDay}
        &nbsp; 기온:
        {weatherData.current_weather.temperature}°C &nbsp;
        {getWeatherCode(weatherData.current_weather.weathercode)}
        <br></br>
        체감온도:
        {temp(
          weatherData.current_weather.temperature,
          weatherData.current_weather.windSpeed
        )}
        °C &nbsp; 자외선 지수: {weatherUv(weatherData.daily.uv_index_max[0])}
      </TodayMain>
      <TodayMain>
        최고기온:{Math.max(...weatherData.hourly.temperature_2m)}°C &nbsp;
        최저기온:{Math.min(...weatherData.hourly.temperature_2m)}°C
        <br></br>
        일출: 오전 {earlyTime(weatherData.daily.sunrise[0])} &nbsp; 일몰: 오후
        &nbsp;{earlyTime(weatherData.daily.sunset[0])}
      </TodayMain>
      {showWeatherInfo && selectedDayWeather && (
        <div>
          <h3>{selectedDayWeather.date.toLocaleDateString()} 날씨</h3>
          <h4>최고 기온: {selectedDayWeather.maxTemp}°C</h4>
          <h4>최저 기온: {selectedDayWeather.minTemp}°C</h4>
          <h4>날씨: {getWeatherCode(selectedDayWeather.weatherCode)}</h4>
          <WeatherLi>
            {todayTimes.map((time: string, index: number) => (
              <li key={time}>
                <h3>
                  {formatTimeTo12Hour(time)}: {todayTemperatures[index]}°C
                  &nbsp; 체감온도:{" "}
                  {temp(todayTemperatures[index], todayWindspeed[index])}
                  °C
                  <br></br>
                  날씨: {getWeatherCode(todayWeatherCodes[index])}
                  <br></br>
                  습도:{todayHumidity[index]}%
                </h3>
              </li>
            ))}
          </WeatherLi>
        </div>
      )}

      {showChart && <WeatherChart data={chartData} />}
    </WeatherContainer>
  );
};

export default Home;
