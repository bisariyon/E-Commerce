import { SellerHeader as Header, Footer } from "./index";
import { Outlet } from "react-router-dom";

function AppSeller() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default AppSeller;
