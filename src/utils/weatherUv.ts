const weatherUv = (uvIndexMax: number) => {
  if (uvIndexMax < 3) {
    return "낮음";
  } else if (uvIndexMax < 6) {
    return "보통";
  } else if (uvIndexMax < 8) {
    return "높음";
  } else if (uvIndexMax < 11) {
    return "매우 높음";
  } else {
    return "위험";
  }
};

export default weatherUv;
