const weatherClothing = (temp: number) => {
  if (temp >= 30 && temp > 25) {
    return "반팔 티셔츠, 반바지";
  } else if (temp < 25 && temp >= 20) {
    return "얇은 긴팔 티셔츠, 블라우스";
  } else if (temp < 20 && temp >= 15) {
    return "얇은 스웨터, 가벼운 자켓";
  } else if (temp < 15 && temp >= 10) {
    return "두꺼운 스웨터, 가벼운 코트";
  } else if (temp < 10 && temp >= 5) {
    return "코트,패딩,스카프,장갑";
  } else if (temp < 5 && temp >= 0) {
    return "두꺼운 패딩, 방한 모자, 장갑";
  } else {
    return "두꺼운 패딩, 털모자, 목도리, 장갑";
  }
};

export default weatherClothing;
