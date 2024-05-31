import React from "react";
import ReactDOM from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store.js";

import Home from "./pages/Home.jsx";
import LoginUser from "./pages/LoginUser.jsx";
import RegisterUser from "./pages/RegsiterUser.jsx";
import Product from "./pages/Product.jsx";
import CheckOut from "./pages/CheckOut.jsx";
import { AfterSignUp, NotLoggedInUser, SellerSignUp } from "./index.js";
import UserDashboard from "./pages/UserDashboard.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import NewPassword from "./pages/NewPassword.jsx";
import VerifyUser from "./pages/VerifyUser.jsx";

import OrderConfirmation from "./pages/OrderConfirmation.jsx";

import AppSeller from "./AppSeller.jsx";
import Seller from "./pages/Seller.jsx";
import LoginSeller from "./pages/LoginSeller.jsx";
import RegisterSeller from "./pages/RegisterSeller.jsx";

import PaymentSuccess from "./pages/Payments/PaymentSuccess.jsx";
import PaymentFailure from "./pages/Payments/PaymentFailure.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path="" element={<Home />} />

        <Route path="user">
          <Route path="" element={<UserDashboard />} />
          <Route path="profile" element={<UserDashboard />} />
          <Route path="login" element={<LoginUser />} />
          <Route path="register" element={<RegisterUser />} />
          <Route path="forgot-password" element={<ForgetPassword />} />
          <Route path="new-password/:token" element={<NewPassword />} />
          <Route path="verify/:token" element={<VerifyUser />} />
          <Route path="order-confirmation" element={<OrderConfirmation />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="payment-failure" element={<PaymentFailure />} />
        </Route>

        <Route path="products" element={<Product />} />
        <Route path="checkout" element={<CheckOut />} />
      </Route>

      <Route path="seller" element={<AppSeller />}>
        <Route path="" element={<Seller />} />
        <Route path="login" element={<LoginSeller />} />
        <Route path="register" element={<RegisterSeller />} />
      </Route>

      {/* Without Header Footer */}
      <Route path="seller/success/registration" element={<SellerSignUp />} />
      <Route path="user/succes/registration" element={<AfterSignUp />} />
      <Route path="redirect/home" element={<NotLoggedInUser />} />
    </>
  )
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </Provider>
  // </React.StrictMode>
);
