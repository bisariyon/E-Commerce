import React from "react";

function HomePageLoading() {
  return (
    <>
      <div className="flex items-center justify-center ">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1716661818/bhc51simityupcedxep1.png"
          alt="Welcome to BISARIYON E-COM"
          className="max-w-full h-auto"
        />
      </div> 
      <div className="text-4xl text-center mb-12">Hold On we are loading your page...</div>
    </>
  );
}

export default HomePageLoading;
