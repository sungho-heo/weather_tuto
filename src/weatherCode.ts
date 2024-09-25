export const getWeatherCode = (code: number) => {
  switch (code) {
    case 0:
      return "맑음 ☀️";
    case 1:
    case 2:
    case 3:
      return "흐림 🌥️";
    case 45:
    case 48:
      return "안개 🌫️";
    case 51:
    case 53:
    case 55:
      return "이슬비 🌧️";
    case 61:
    case 63:
    case 65:
      return "비 🌧️";
    case 71:
    case 73:
    case 75:
      return "눈 ❄️";
    case 80:
    case 81:
    case 82:
      return "소나기 🌦️";
    case 95:
      return "천둥번개 ⛈️";
    default:
      return "알 수 없음 🌈"; // 기본 값
  }
};

export const getWeatherBackgroundImage = (code: number): string => {
  switch (code) {
    case 0:
      return "images/맑은날씨.jpeg"; // 맑은 날씨 이미지
    case 1:
    case 2:
    case 3:
      return "images/흐린날씨.jpeg"; // 흐린 날씨 이미지
    case 45:
    case 48:
      return "images/흐린날씨.jpeg"; // 안개 이미지
    case 51:
    case 53:
    case 55:
      return "images/비오는 날씨.gif"; // 이슬비 이미지
    case 61:
    case 63:
    case 65:
      return "images/비오는 날씨.gif"; // 비 이미지
    case 71:
    case 73:
    case 75:
      return "images/눈오는 날씨.jpeg"; // 눈 이미지
    case 80:
    case 81:
    case 82:
      return "images/비오는 날씨.gif"; // 소나기 이미지
    case 95:
      return "images/비오는 날씨.gif"; // 천둥번개 이미지
    default:
      return "images/맑은날씨.jpeg"; // 기본 이미지
  }
};
