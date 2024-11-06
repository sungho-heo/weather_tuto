import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    base: mode === "production" ? "/weather_tuto/" : "/",
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
  };
});
