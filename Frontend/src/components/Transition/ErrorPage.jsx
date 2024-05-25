import React from "react";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center max-h-screen justify-center ">
      <img
        src="https://res.cloudinary.com/deepcloud1/image/upload/v1716663893/u0ai3d9zbwijrlqmslyt.png"
        alt="Error"
        className="max-w-full h-auto"
      />
      <p className="text-3xl text-red-600 font-bold mb-2 -mt-10">
        Oops! Something went wrong.
      </p>
      <p className="text-xl text-gray-700 font-semibold">Please try again later.</p>
    </div>
  );
}

export default Home;
