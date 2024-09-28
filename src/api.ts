import axios from "axios";

// type
interface NominatimResult {
  display_name: string;
}

const BaseUrl = "https://api.open-meteo.com/v1/forecast";

// OpenStreetMap 역지오코딩 api
const getLocationFromCoordinates = async (
  lat: number,
  lon: number
): Promise<string | null> => {
  try {
    const response = await axios.get<NominatimResult>(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat: lat,
          lon: lon,
          format: "json",
        },
      }
    );

    if (response.data) {
      return response.data.display_name;
    } else {
      console.error("No location data found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching location data:", error);
    return null;
  }
};

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

// 자외선 데이터도 받아오기
const fetchWeatherData = async (lat: number, lon: number) => {
  try {
    const response = await axios.get(BaseUrl, {
      params: {
        latitude: lat,
        longitude: lon,
        current_weather: true,
        daily: [
          "uv_index_max",
          "sunrise",
          "sunset",
          "temperature_2m_max",
          "temperature_2m_min",
          "weather_code",
        ],
        timezone: "auto",
        hourly:
          "temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode",
      },
    });

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

    // 위치 정보를 기반으로 날씨 데이터 요청
    const weatherData = await fetchWeatherData(latitude, longitude);
    const locationData = await getLocationFromCoordinates(latitude, longitude);
    return { weatherData, locationData };
  } catch (error) {
    console.error("Error getting user location:", error);
  }
};
export default main;
