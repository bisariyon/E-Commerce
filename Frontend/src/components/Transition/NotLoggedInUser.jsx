import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function NotLoggedInUser() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      navigate("/");
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className={`min-h-screen bg-rose-600 flex flex-col items-center justify-center p-2 ${
        show ? "opacity-100" : "opacity-0 transition-opacity duration-1000"
      }`}
    >
      <img
        src="https://res.cloudinary.com/deepcloud1/image/upload/v1716667710/ct8v6dczie98znx7vhf2.png"
        alt="Success"
        className="-mt-16"
      />
      <div className="text-white text-4xl font-bold mb-4 -mt-8">
        Login to view this page
      </div>
    </div>
  );
}

export default NotLoggedInUser;
