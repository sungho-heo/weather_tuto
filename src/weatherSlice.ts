import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { main } from "./api";

// 날씨 데이터 가져오는 비동기 액션.
const fetchWeatherData = createAsyncThunk(
  "weather/fetchWeatherData",
  async () => {
    const data = await main();
    return data;
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    weatherData: null,
    geoData: null as null | string[],
    loading: true,
    selectedDate: 0,
    showWeatherInfo: true,
    showChart: false,
  },
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setShowWeatherInfo: (state) => {
      state.showWeatherInfo = true;
      state.showChart = false;
    },
    setShowChart: (state) => {
      state.showWeatherInfo = false;
      state.showChart = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        if (action.payload) {
          state.weatherData = action.payload.weatherData;
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
