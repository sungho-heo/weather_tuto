import axios from "axios";

// 브라우저의 Geolocation API를 통해서 사용자의 위치정보 데이터를 얻어옴.
const getUserLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject(new Error("사용자의 위치정보 값을 받아오지 못했습니다."));
    }
  });
};

const fetchWeatherData = async (lat: number, lon: number) => {
  try {
    const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: lat,
        longitude: lon,
        current_weather: true,
        hourly: "temperature_2m,relative_humidity_2m,wind_speed_10m",
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("날씨 데이터를 받아오지 못했습니다.", error);
  }
};

export const main = async () => {
  try {
    const position = await getUserLocation();
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    console.log(`User location: Latitude ${latitude}, Longitude ${longitude}`);

    // 위치 정보를 기반으로 날씨 데이터 요청
    await fetchWeatherData(latitude, longitude);
  } catch (error) {
    console.error("Error getting user location:", error);
  }
};
export default main;