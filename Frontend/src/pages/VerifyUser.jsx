import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { patchUser } from "../store/UserSlice";

function VerifyUser() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [show, setShow] = useState(false);


  const dispatch = useDispatch();

  useEffect(() => {
    setShow(true);
    (async () => {
      try {
        const response = await axios.post(
          `http://localhost:8000/v1/users/self-verify/${token}`,
          {},
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setIsVerified(true);
          dispatch(patchUser({verified:true}));
          console.log("User Verified");
        }
      } catch (error) {
        console.log(error);
        setError(error.response?.data?.message || "Verification failed.");
      }
    })();
  }, [token]);

  useEffect(() => {
    if (isVerified || error) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isVerified, error, navigate]);

  return (
    <div className={`container mx-auto p-4 text-center min-h-screen flex flex-col items-center justify-center ${show ? 'opacity-100' : 'opacity-0 transition-opacity duration-1000'}`}>
      {error && (
        <div>
          <h1 className="text-red-500 text-5xl font-bold">{error}</h1>
          <img src="https://res.cloudinary.com/deepcloud1/image/upload/v1716663893/u0ai3d9zbwijrlqmslyt.png" alt="Error" className="mx-auto mt-4" />
        </div>
      )}
      {isVerified && (
        <div>
          <h1 className="text-green-500 text-5xl font-bold">User Verified Successfully!</h1>
          <img src="https://res.cloudinary.com/deepcloud1/image/upload/v1716662086/y7ihf1nqfb38dyqoqpqw.png" alt="Success" className="mx-auto mt-4" />
        </div>
      )}
      {!error && !isVerified && <h1>Verifying User...</h1>}
    </div>
  );
}

export default VerifyUser;
