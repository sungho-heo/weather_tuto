// 일몰 일출
export const earlyTime = (timeStamp: string): string => {
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

// 시간을 "오전/오후 몇 시" 형식으로 변환하는 함수
export const formatTimeTo12Hour = (timestamp: string): string => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const formattedHours = hours % 12 || 12; // 12시간 형식으로 변환
  const period = hours < 12 ? "오전" : "오후";

  return `${period} ${formattedHours}시`;
};

// 체감온도 구하기
export const temp = (temperature: number, windSpeed: number): number => {
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
