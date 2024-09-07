import React from "react";
import { createGlobalStyle } from "styled-components";
import Home from "./components/Home";

const App: React.FC = () => {
  return (
    <div>
      <GlobalStyle />
      <Home />
    </div>
  );
};

const GlobalStyle = createGlobalStyle`
  body {
      font-family: 'Noto Sans', 'Noto Sans KR', 'Apple SD Gothic Neo', '맑은 고딕', sans-serif;
      margin: 0;
  }
  li{
    list-style: none;
  }
`;

export default App;
