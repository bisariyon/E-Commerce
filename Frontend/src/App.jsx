import Banner from "./components/Carousal/Carousal";
import { Header } from "./index.js";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
