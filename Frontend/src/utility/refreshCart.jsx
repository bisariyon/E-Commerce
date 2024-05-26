import { useDispatch } from "react-redux";
import { setBasket } from "../store/BasketSlice";
import axios from "axios";

function refreshCart() {
  const dispatch = useDispatch();

  const refreshCartData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/v1/cart-items", {
        withCredentials: true,
      });
      // console.log("Cart Data: ", response.data.data);
      if (response.status === 200) {
        const cartData = response.data.data.map((item) => ({
          productId: item.product._id,
          title: item.product.title,
          productImage: item.product.productImage,
          quantity: item.quantity,
          price: item.product.price,
          brand: item.product.brand,
          category: item.product.category,
        }));
        dispatch(setBasket(cartData));
      }
    } catch (error) {
      console.error("Get Cart failed: ", error);
    }
  };

  return { refreshCartData };
}

export default refreshCart;
