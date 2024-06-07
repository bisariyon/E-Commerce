import { useDispatch } from "react-redux";
import { setSeller } from "../store/SellerSlice";

function refreshSeller() {
  const dispatch = useDispatch();

  const refreshSellerData = async () => {
    try {
      const response = await fetch(
        "/v1/sellers/current-seller",
        {
          credentials: "include",
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        dispatch(setSeller(data.data));
      } else {
        console.error("Seller not logged in");
      }
    } catch (error) {
      console.error("Failed to fetch seller data", error);
    }
  };

  return { refreshSellerData };
}

export default refreshSeller;
