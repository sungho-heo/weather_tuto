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

const WeatherCard = styled.div`
  background-color: #f9f9f9; /* 배경색으로 가독성 높이기 */
  padding: 20px;
  border-radius: 10px; /* 모서리 둥글게 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 약간의 그림자 추가 */
  text-align: center; /* 텍스트 중앙 정렬 */
  width: 300px; /* 적절한 너비 설정 */
  margin: 0 auto; /* 가운데 정렬 */
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
    if (date.getMinutes() < 10) {
      const min = `0${date.getMinutes()}`;
      return `${formattedHours}:${min}`;
    }
    return `${formattedHours}:${min}`;
  };

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
            {day.date.getMonth() + 1}/{day.date.getDate()}
            <br />
            {getWeatherCode(day.weatherCode)}
            <br />
            {day.maxTemp}° / {day.minTemp}°
          </DaySummary>
        ))}
      </WeekWeatherSummary>
      {showWeatherInfo && selectedDayWeather && (
        <div>
          <WeatherCard>
            <div>
              <h2>
                {geoData[2]} {geoData[1]}
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
            <div>
              <p>
                일출:{earlyTime(selectedDayWeather.sunrise)} /일몰:
                {earlyTime(selectedDayWeather.sunset)}
              </p>
              체감온도:
              {temp(getCurrentTemperature(), getCurrentWindspeed())}°<br></br>
              자외선:
              {weatherUv(selectedDayWeather.uv)}
            </div>
          </WeatherCard>
          <WeatherLi>
            {selectedDayTimes.map((time: string, index: number) => (
              <li key={time}>
                <h3>
                  {formatTimeTo12Hour(time)}: {selectedDayTemperatures[index]}°
                  &nbsp; 체감온도:
                  {temp(
                    selectedDayTemperatures[index],
                    selectedDayWindspeed[index]
                  )}
                  °<br></br>
                  날씨: {getWeatherCode(selectedDayWeatherCodes[index])}
                  <br></br>
                  <p>습도:{selectedDayHumidity[index]}%</p>
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
