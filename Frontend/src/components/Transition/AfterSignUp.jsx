import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AfterSignUp() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={`min-h-screen bg-purple-600 flex flex-col items-center justify-center p-2 ${show ? 'opacity-100' : 'opacity-0 transition-opacity duration-1000'}`}>
      <img
        src="https://res.cloudinary.com/deepcloud1/image/upload/v1716662086/y7ihf1nqfb38dyqoqpqw.png"
        alt="Success"
        className="-mt-16"
      />
      <div className="text-white text-4xl font-bold mb-4 -mt-8">
        Congratulations! Your sign-up was successful.
      </div>
      <div className="text-2xl text-zinc-600">
        Verify Your Account to place Order and use Cart
      </div>
    </div>
  );
}

export default AfterSignUp;
