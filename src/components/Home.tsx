import React, { useState, useEffect } from "react";
import styled from "styled-components";
import WeatherChart from "./WeatherChart";
import { WeatherContainer } from "../styles/CommonStyles";
import { main } from "../api";
import {
  getWeatherCode,
  getWeatherBackgroundImage,
} from "../utils/weatherCode";
import { earlyTime, formatTimeTo12Hour, temp } from "../utils/helpers";
import weatherUv from "../utils/weatherUv";
import weatherClothing from "../utils/weatherClothing";

// css

const WeatherLi = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 20px;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth; /* 부드러운 스크롤 적용하기 */
`;

const WeatherItem = styled.div`
  flex: 0 0 20%; /* 화면에 5개만 보이게 설정 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  scroll-snap-align: start;
`;

const WeatherCard = styled.div`
  background-color: #f9f9f9; /* 배경색으로 가독성 높이기 */
  padding: 20px;
  border: 1px solid black;
  border-radius: 10px; /* 모서리 둥글게 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 약간의 그림자 추가 */
  text-align: center; /* 텍스트 중앙 정렬 */
  width: 300px; /* 적절한 너비 설정 */
  margin: 20px auto; /* 가운데 정렬 */
  h2{
    font-weight: bold;
    font-size: 18px;
  }
    p{
    font-size: 16px;
    }
  }
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

const OtherInfo = styled.div`
  font-size: 16px;
`;

const Home: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [geoData, setgeoData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showWeatherInfo, setShowWeatherInfo] = useState<boolean>(true); // 기본적으로 보여주는 날씨데이터
  const [showChart, setShowChart] = useState<boolean>(false); // 그래프 형태의 날씨데이터.
  const [selectedDate, setSelectedDate] = useState<number>(0);

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

  // 선택한 날짜의 현 온도
  const selectedDayTemperatures = weatherData.hourly.temperature_2m.slice(
    selectedDate * 24,
    (selectedDate + 1) * 24
  );

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
        sunrise: weatherData.daily.sunrise[index],
        sunset: weatherData.daily.sunset[index],
        uv: weatherData.daily.uv_index_max[index],
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

  // 요약 날짜 클릭 시 선택된 날짜 업데이트
  const handleDayClick = (index: number) => {
    setSelectedDate(index);
    setShowWeatherInfo(true);
    setShowChart(false);
  };

  // 해당 날짜 시간대별 습도, 날씨상황, 풍속
  const selectedDayHumidity = weatherData.hourly.relative_humidity_2m.slice(
    selectedDate * 24,
    (selectedDate + 1) * 24
  );

  const selectedDayWeatherCodes = weatherData.hourly.weathercode.slice(
    selectedDate * 24,
    (selectedDate + 1) * 24
  );

  const selectedDayWindspeed = weatherData.hourly.wind_speed_10m.slice(
    selectedDate * 24,
    (selectedDate + 1) * 24
  );

  const todayDay = selectedDayWeather.date.getUTCDate();
  const todayMonth = selectedDayWeather.date.getMonth() + 1;

  // chartData
  const chartData = selectedDayTimes.map((time: string, index: number) => {
    const date = new Date(time);
    return {
      time: `${date.getHours()}:00`, // 시간지정.
      temperature: selectedDayTemperatures[index],
    };
  });

  // 해당 날짜 해당 시간대 온도
  const getCurrentTemperature = () => {
    const now = new Date();
    const currentHour = now.getHours();

    // 현재 선택된 날짜의 시간대와 매칭되는 기온을 찾음
    const timeIndex = selectedDayTimes.findIndex((time: string) => {
      const date = new Date(time);
      return date.getHours() === currentHour;
    });

    // 해당 시간대의 기온을 반환, 없다면 첫 번째 기온을 기본값으로 사용
    return timeIndex !== -1
      ? selectedDayTemperatures[timeIndex]
      : selectedDayTemperatures[0];
  };
  // 현 시간대 선택한날짜 바람속도
  const getCurrentWindspeed = (): number => {
    const now = new Date();
    const currentHour = now.getHours();

    // 현재 선택된 날짜의 시간대와 매칭되는 바람 속도를 찾음
    const timeIndex = selectedDayTimes.findIndex((time: string) => {
      const date = new Date(time);
      return date.getHours() === currentHour;
    });

    // 해당 시간대의 바람 속도를 반환, 없다면 첫 번째 값을 기본값으로 사용
    return timeIndex !== -1
      ? selectedDayWindspeed[timeIndex]
      : selectedDayWindspeed[0];
  };

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
        {weeklyWeatherData.map((day: any, index: number) => (
          <DaySummary
            key={index}
            className={selectedDate === index ? "active" : ""}
            onClick={() => handleDayClick(index)}
          >
            <p>
              {day.date.getMonth() + 1}/{day.date.getDate()}
            </p>
            <p>{getWeatherCode(day.weatherCode)}</p>
            <p>
              최고/최저기온:{day.maxTemp}° / {day.minTemp}°
            </p>
          </DaySummary>
        ))}
      </WeekWeatherSummary>
      {showWeatherInfo && selectedDayWeather && (
        <div>
          <WeatherCard>
            <div>
              <h2>
                지역: {geoData[2]} {geoData[1]}
              </h2>
              <p>
                날짜:{todayMonth}.{todayDay}
              </p>
            </div>
            <div>
              <p>
                현재 기온:
                <strong>{getCurrentTemperature()}°</strong>
              </p>
              <p>{getWeatherCode(selectedDayWeather.weatherCode)}</p>
              <p>
                최고:
                {selectedDayWeather.maxTemp}° /최저:
                {selectedDayWeather.minTemp}°
              </p>
            </div>
            <OtherInfo>
              <p>
                일출:{earlyTime(selectedDayWeather.sunrise)} /일몰:
                {earlyTime(selectedDayWeather.sunset)}
              </p>
              <p>
                체감온도:
                {temp(getCurrentTemperature(), getCurrentWindspeed())}° 자외선:
                {weatherUv(selectedDayWeather.uv)}
              </p>
              <p>
                오늘의 옷차림:
                {weatherClothing(getCurrentTemperature())}
              </p>
            </OtherInfo>
          </WeatherCard>
          <WeatherLi>
            {selectedDayTimes.map((time: string, index: number) => (
              <WeatherItem key={time}>
                <h4>
                  {formatTimeTo12Hour(time)}: {selectedDayTemperatures[index]}°
                </h4>
                <p>
                  체감온도:
                  {temp(
                    selectedDayTemperatures[index],
                    selectedDayWindspeed[index]
                  )}
                  °
                </p>
                <p>날씨: {getWeatherCode(selectedDayWeatherCodes[index])}</p>
                <p>습도:{selectedDayHumidity[index]}%</p>
              </WeatherItem>
            ))}
          </WeatherLi>
        </div>
      )}
      {showChart && <WeatherChart data={chartData} />}
    </WeatherContainer>
  );
};

export default Home;
