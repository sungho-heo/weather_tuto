import React from "react";
import { Provider } from "react-redux";
import { createGlobalStyle } from "styled-components";
import { BrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import { store } from "./store";

const App: React.FC = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Provider store={store}>
        <div>
          <GlobalStyle />
          <Home />
        </div>
      </Provider>
    </BrowserRouter>
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
