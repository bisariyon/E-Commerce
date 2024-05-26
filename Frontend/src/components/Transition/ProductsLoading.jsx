import React from 'react';

function ProductsLoading() {
  return (
    <div className="flex flex-col items-center justify-center m-14">
      <img
        src="https://res.cloudinary.com/deepcloud1/image/upload/v1716664425/wwdtzhxodzhn0rvsdkct.png"
        alt="Loading"
        className="max-w-full h-auto"
      />
      <p className="text-4xl text-gray-800 font-bold">Loading products...</p>
    </div>
  );
}

export default ProductsLoading;
