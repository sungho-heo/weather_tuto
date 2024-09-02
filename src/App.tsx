import React from "react";
import { main } from "./api";
const App: React.FC = () => {
  const data = main();
  console.log(data);
  return (
    <div>
      <h1>Welcome to js</h1>
    </div>
  );
};

export default App;
