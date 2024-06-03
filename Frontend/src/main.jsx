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
import Categories from "./pages/Categories.jsx";
import AllOffers from "./pages/AllOffers.jsx";

import OrderConfirmation from "./pages/OrderConfirmation.jsx";

import AppSeller from "./AppSeller.jsx";
import Seller from "./sellerPages/Seller.jsx";
import LoginSeller from "./sellerPages/LoginSeller.jsx";
import RegisterSeller from "./sellerPages/RegisterSeller.jsx";
import NewProduct from "./sellerPages/NewProduct.jsx";
import AllProducts from "./sellerPages/AllProducts.jsx";
import Orders from "./sellerPages/Orders.jsx";
import BrandRequest from "./sellerPages/BrandRequest.jsx";
import Offers from "./sellerPages/Offers.jsx";
import AddOffer from "./sellerPages/AddOffer.jsx";
import SellerDashBoard from "./sellerPages/SellerDashBoard.jsx";
import AllReviews from "./sellerPages/AllReviews.jsx";
import UpdateProduct from "./sellerPages/UpdateProduct.jsx";
import SingleProduct from "./sellerPages/SingleProduct.jsx";

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
          <Route path="categories" element={<Categories />} />
          <Route path="offers" element={<AllOffers />} />
        </Route>

        <Route path="products" element={<Product />} />
        <Route path="checkout" element={<CheckOut />} />
      </Route>

      <Route path="seller" element={<AppSeller />}>
        <Route path="" element={<Seller />} />
        <Route path="login" element={<LoginSeller />} />
        <Route path="register" element={<RegisterSeller />} />
        <Route path="new-product" element={<NewProduct />} />
        <Route path="all-products" element={<AllProducts />} />
        <Route path="orders" element={<Orders />} />
        <Route path="brand-request" element={<BrandRequest />} />
        <Route path="offers" element={<Offers />} />
        <Route path="add-offer/:productId" element={<AddOffer />} />
        <Route path="dashboard" element={<SellerDashBoard />} />
        <Route path="all-reviews" element={<AllReviews />} />
        <Route path="update-product/:productId" element={<UpdateProduct />} />
        <Route path="order-item/:orderItemId" element={<SingleProduct />} />
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
