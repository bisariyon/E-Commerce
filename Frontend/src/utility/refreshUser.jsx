import { useDispatch } from "react-redux";
import { setUser } from "../store/UserSlice";

function refreshUser() {
  const dispatch = useDispatch();

  const refreshUserData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/v1/users/current-user",
        {
          credentials: "include",
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        dispatch(setUser(data.data));
      } else {
        console.error("User not logged in");
      }
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };

  return { refreshUserData };
}

export default refreshUser;
