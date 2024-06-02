//Here
import React, { useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import refreshSeller from "../utility/refreshSeller";

function Orders() {
  const { refreshSellerData } = refreshSeller();

  useEffect(() => {
    refreshSellerData();
  }, []);
  const getOrders = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/v1/order-items/seller",
        {},
        {
          withCredentials: true,
        }
      );

      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: "Seller-orders",
    queryFn: getOrders,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-14">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1717078915/crmi2yw34sh7sldgmxo9.png"
          alt="Loading"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-gray-700">Loading seller orders</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 my-14">
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1716663893/u0ai3d9zbwijrlqmslyt.png"
          alt="Error"
          className="w-64 h-auto"
        />
        <div className="text-3xl text-gray-700">
          Error loading seller orders. Retry again later.
        </div>
      </div>
    );
  }

  //   console.log(data);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Seller Orders
      </h1>
      <div className="grid gap-x-16 gap-y-12 md:grid-cols-2 lg:grid-cols-2 py-10 px-12 bg-green-200 mx-4">
        {data.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Order ID: {item.orderID}
              </h2>
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-gray-700">
                    <strong>Amount:</strong> ₹{item.amount}
                  </p>
                  <p className="text-gray-700">
                    <strong>Order Date:</strong>{" "}
                    {new Date(item.order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    <strong>Status:</strong> {item.status}
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  Product Details
                </h3>

                <div className="flex mb-2">
                  <div className="mr-8">
                    <p className="text-gray-700">
                      <strong>Product ID:</strong> {item.product._id}
                    </p>
                    <p className="text-gray-700">
                      <strong>Title:</strong> {item.product.title}
                    </p>
                    <p className="text-gray-700">
                      <strong>Price:</strong> ${item.product.price}
                    </p>
                    <p className="text-gray-700">
                      <strong>Quantity:</strong> {item.quantity}
                    </p>
                  </div>
                  <img
                    src={item.product.productImage}
                    alt={item.product.title}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                </div>
              </div>
              <div className="border-t border-gray-200 pt-2 pb-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  User Details
                </h3>
                <p className="text-gray-700">{item.user.fullName}</p>
                <p className="text-gray-700">{item.user.phone}</p>
                <p className="text-gray-700">{item.user.email}</p>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Address Details
                </h3>
                <p className="text-gray-700">
                  {item.address.addressLine1}, {item.address.addressLine2}
                </p>
                <p className="text-gray-700">
                  {item.address.city}, {item.address.state}
                </p>
                <p className="text-gray-700">{item.address.pincode}</p>
                <p className="text-gray-700">{item.address.country}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;

//completed design 2

// import React from "react";
// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";

// function Orders() {
//   const getOrders = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:8000/v1/order-items/seller",
//         {},
//         {
//           withCredentials: true,
//         }
//       );

//       console.log(response.data.data);
//       return response.data.data;
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   };

//   const { data, isLoading, isError } = useQuery({
//     queryKey: "Seller-orders",
//     queryFn: getOrders,
//   });

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen p-4">
//         <img
//           src="https://res.cloudinary.com/deepcloud1/image/upload/v1717078915/crmi2yw34sh7sldgmxo9.png"
//           alt="Loading"
//           className="w-64 h-auto"
//         />
//         <div className="text-3xl text-gray-700">Loading seller orders...</div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen p-4">
//         <img
//           src="https://res.cloudinary.com/deepcloud1/image/upload/v1716663893/u0ai3d9zbwijrlqmslyt.png"
//           alt="Error"
//           className="w-64 h-auto"
//         />
//         <div className="text-3xl text-gray-700">
//           Error loading seller orders. Please try again later.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="py-8 px-10 space-y-8">
//       {data.map((item) => (
//         <div key={item._id} className="shadow-md rounded-lg p-6 mb-6 bg-gray-200">
//           <div className="border-b-2 pb-4 mb-2 border-white">
//             <h2 className="text-2xl font-bold text-gray-700 mb-1">
//               Order ID: {item.orderID}
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-700 mb-1">
//                   Order Details
//                 </h3>
//                 <p className="text-gray-700">
//                   <strong>Amount:</strong> ${item.amount}
//                 </p>
//                 <p className="text-gray-700">
//                   <strong>Order Date:</strong>{" "}
//                   {new Date(item.order.createdAt).toLocaleDateString()}
//                 </p>
//               </div>

//               <div className="flex items-center">
//                 <img
//                   src={item.product.productImage}
//                   alt={item.product.title}
//                   className="w-24 h-24 object-cover rounded-md border-2 border-gray-200 mr-4"
//                 />
//                 <div>
//                   <h3 className="text-xl font-semibold text-gray-700 mb-1">
//                     Product Details
//                   </h3>
//                   <p className="text-gray-700">
//                     <strong>Product ID:</strong> {item.product._id}
//                   </p>
//                   <p className="text-gray-700">
//                     <strong>Title:</strong> {item.product.title}
//                   </p>
//                   <p className="text-gray-700">
//                     <strong>Price:</strong> ${item.product.price}
//                   </p>
//                   <p className="text-gray-700">
//                     <strong>Quantity:</strong> {item.quantity}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="pb-4 mb-2">
//             <h3 className="text-xl font-semibold text-gray-700 mb-1">
//               User Details
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <p className="text-gray-700">
//                   <strong>Name:</strong> {item.user.fullName}
//                 </p>
//                 <p className="text-gray-700">
//                   <strong>Contact:</strong> {item.user.phone}
//                 </p>
//                 <p className="text-gray-700">
//                   <strong>Email:</strong> {item.user.email}
//                 </p>
//               </div>
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-700 mb-1">
//                   Address Details
//                 </h3>
//                 <p className="text-gray-700">
//                   <strong>Address Line 1:</strong> {item.address.addressLine1}
//                 </p>
//                 <p className="text-gray-700">
//                   <strong>Address Line 2:</strong> {item.address.addressLine2}
//                 </p>
//                 <p className="text-gray-700">
//                   <strong>City:</strong> {item.address.city}
//                 </p>
//                 <p className="text-gray-700">
//                   <strong>State:</strong> {item.address.state}
//                 </p>
//                 <p className="text-gray-700">
//                   <strong>Pincode:</strong> {item.address.pincode}
//                 </p>
//                 <p className="text-gray-700">
//                   <strong>Country:</strong> {item.address.country}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Orders;
