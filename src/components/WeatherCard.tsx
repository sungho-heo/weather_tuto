import React from "react";
import styled from "styled-components";
import { temp, earlyTime } from "../utils/helpers";
import { getWeatherCode } from "../utils/weatherCode";

const Card = styled.div`
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

// 날씨 다른 정보
const OtherInfo = styled.div`
  font-size: 16px;
`;

interface WeatherCardProps {
  location: string;
  date: string;
  currentTemp: number;
  weatherCode: number;
  maxTemp: number;
  minTemp: number;
  sunrise: string;
  sunset: string;
  uvIndex: number;
  windSpeed: number;
  clothing: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  location,
  date,
  currentTemp,
  weatherCode,
  maxTemp,
  minTemp,
  sunrise,
  sunset,
  uvIndex,
  windSpeed,
  clothing,
}) => {
  return (
    <Card>
      <div>
        <h2>지역: {location}</h2>
        <p>날짜:{date}</p>
      </div>
      <div>
        <p>
          현재 기온:
          <strong>{currentTemp}°</strong>
        </p>
        <p>{getWeatherCode(weatherCode)}</p>
        <p>
          최고:
          {maxTemp}° /최저:
          {minTemp}°
        </p>
      </div>
      <OtherInfo>
        <p>
          일출:{earlyTime(sunrise)} /일몰:
          {earlyTime(sunset)}
        </p>
        <p>
          체감온도:
          {temp(currentTemp, windSpeed)}° 자외선:
          {uvIndex}
        </p>
        <p>
          오늘의 옷차림:
          {clothing}
        </p>
      </OtherInfo>
    </Card>
  );
};

export default WeatherCard;
