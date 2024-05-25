import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Carousal.css";

function Banner() {
  return (
    <div className="relative max-w-full overflow-hidden shadow-lg">
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showIndicators={true}
        showThumbs={false}
        interval={2500}
      >
        <div className="relative">
          <img
            loading="lazy"
            className="w-full h-[550px] object-cover   transform transition-transform duration-500 hover:scale-105"
            src="https://res.cloudinary.com/deepcloud1/image/upload/v1716371590/ygfcff7pprtqimscjd5c.jpg"
            alt="Bisariyon"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/30 to-white/10   z-10"></div>
          <div className="absolute bottom-5 left-5 text-cyan-500 text-4xl font-bold z-20 drop-shadow-lg ">
            Welcome to Bisariyon E-Com
            <h2 className="text-left text-2xl">Coming soon...</h2>
          </div>
        </div>
        <div className="relative">
          <img
            loading="lazy"
            className="w-full h-[550px] object-cover   transform transition-transform duration-500 hover:scale-105"
            src="https://res.cloudinary.com/deepcloud1/image/upload/v1716372793/h7kclnaneoxn6m4utn8p.png"
            alt="Sale"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/30 to-black/70   z-10"></div>
          <div className="absolute bottom-5 left-5 text-cyan-500 text-4xl font-bold z-20 drop-shadow-lg">
            New Arrivals Just for You
          </div>
        </div>
        <div className="relative">
          <img
            loading="lazy"
            className="w-full h-[550px] object-cover   transform transition-transform duration-500 hover:scale-105"
            src="https://res.cloudinary.com/deepcloud1/image/upload/v1716371589/kibzgi05kvrryistjj9k.jpg"
            alt="Sale"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/30 to-black/70   z-10"></div>
          <div className="absolute bottom-5 left-5 text-cyan-500 text-4xl font-bold z-20 drop-shadow-lg">
            Limited Time Offers
          </div>
        </div>
        <div className="relative">
          <img
            loading="lazy"
            className="w-full h-[550px] object-cover   transform transition-transform duration-500 hover:scale-105"
            src="https://res.cloudinary.com/deepcloud1/image/upload/v1716371588/txjbr0yop0bd6wxfwryf.png"
            alt="Amazon Prime"
            style={{
              maskImage: "linear-gradient(to top, white 15%, white 85%)",
            }}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/30 to-black/70   z-10"></div>
          <div className="absolute bottom-5 left-5 text-cyan-500 text-4xl font-bold z-20 drop-shadow-lg">
            Get Free Shipping
          </div>
        </div>
        <div className="relative">
          <img
            loading="lazy"
            className="w-full h-[550px] object-cover   transform transition-transform duration-500 hover:scale-105"
            src="https://res.cloudinary.com/deepcloud1/image/upload/v1716371589/zkgej6uzzsolra0uyi2b.jpg"
            alt="Sale"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/30 to-black/70   z-10"></div>
          <div className="absolute bottom-5 left-5 text-cyan-500 text-4xl font-bold z-20 drop-shadow-lg">
            Exclusive Discounts
          </div>
        </div>
      </Carousel>
    </div>
  );
}

export default Banner;
