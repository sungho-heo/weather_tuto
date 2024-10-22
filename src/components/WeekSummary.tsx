import React from "react";
import styled from "styled-components";
import { getWeatherCode } from "../utils/weatherCode";

const Summary = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
`;

const Day = styled.div`
  text-align: center;
  cursor: pointer;
  &.active {
    font-weight: bold;
    color: #3498db;
  }
`;

interface WeekSummaryProps {
  weeklyWeatherData: any[];
  selectedDate: number;
  handleDayClick: (index: number) => void;
}

const WeekSummary: React.FC<WeekSummaryProps> = ({
  weeklyWeatherData,
  selectedDate,
  handleDayClick,
}) => {
  return (
    <Summary>
      {weeklyWeatherData.map((day, index) => (
        <Day
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
        </Day>
      ))}
    </Summary>
  );
};

export default WeekSummary;
