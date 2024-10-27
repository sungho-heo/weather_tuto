import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { main } from "./api";

// type

interface WeatherDataType {
  hourly: {
    temperature_2m: number[];
    relative_humidity_2m: number[];
    weathercode: number[];
    wind_speed_10m: number[];
    time: string[];
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
  current_weather: {
    weathercode: number;
  };
}

// 날씨 데이터 가져오는 비동기 액션.
export const fetchWeatherData = createAsyncThunk(
  "weather/fetchWeatherData",
  async () => {
    const data = await main();
    return data;
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    weatherData: null as WeatherDataType | null,
    geoData: [] as string[],
    loading: true,
    selectedDate: 0,
    showWeatherInfo: true,
    showChart: false,
  },
  reducers: {
    setSelectedDate: (state, action: PayloadAction<number>) => {
      state.selectedDate = action.payload;
    },
    setShowWeatherInfo: (state, action: PayloadAction<boolean>) => {
      state.showWeatherInfo = action.payload;
      state.showChart = !action.payload; // showWeatherInfo와 showChart를 toggle
    },
    setShowChart: (state, action: PayloadAction<boolean>) => {
      state.showChart = action.payload;
      state.showWeatherInfo = !action.payload; // showWeatherInfo와 showChart를 toggle
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        if (action.payload) {
          state.weatherData = action.payload.weatherData as WeatherDataType;
          state.geoData = action.payload.locationData
            ? action.payload.locationData.split(",")
            : [];
        }
        state.loading = false;
      })
      .addCase(fetchWeatherData.rejected, (state) => {
        state.loading = false;
        state.weatherData = null;
      });
  },
});

export const { setSelectedDate, setShowWeatherInfo, setShowChart } =
  weatherSlice.actions;
export default weatherSlice.reducer;
