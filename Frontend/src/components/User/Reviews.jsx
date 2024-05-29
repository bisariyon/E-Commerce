import React from 'react'

function Reviews() {
  return (
    <div>Reviews</div>
  )
}

export default Reviews

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
// import { Link } from "react-router-dom";

// function Reviews() {
//   const fetchReviews = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8000/v1/reviews/getUserReviews`,
//         {
//           withCredentials: true,
//         }
//       );
//       return response.data.data.docs;
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
//     queryKey: ["reviews"],
//     queryFn: fetchReviews,
//   });

//   const queryClient = new QueryClient();
//   const updatedReviewBackend = async (reviewId) => {
//     const response = await axios.put(
//       `http://localhost:8000/v1/reviews/updateReview/${reviewId}`,
//       {
//         comment: editReview.comment,
//         rating: editReview.rating,
//         deleteImages : 
//         newIm
//       },
//       { withCredentials: true }
//     );
//   };

//   const { mutate: updateReview } = useMutation({
//     mutationFn: updatedReviewBackend,
//     onSuccess: () => {
//       queryClient.invalidateQueries("reviews");
//     },
//   });

//   const [reviews, setReviews] = useState([]);
//   const [editReview, setEditReview] = useState({
//     id: null,
//     rating: null,
//     comment: "",
//     images: [],
//   });

//   useEffect(() => {
//     if (reviewsData) {
//       setReviews(reviewsData);
//     }
//   }, [reviewsData]);

//   const handleEditReview = (id, rating, comment, images) => {
//     setEditReview({ id, rating, comment, images });
//   };

//   const handleSaveReview = () => {
//     const updatedReviews = reviews.map((review) =>
//       review._id === editReview.id
//         ? {
//             ...review,
//             rating: editReview.rating,
//             comment: editReview.comment,
//             images: editReview.images,
//           }
//         : review
//     );
//     setReviews(updatedReviews);
//     setEditReview({ id: null, rating: null, comment: "", images: [] });
//   };

//   const handleCancelEdit = () => {
//     setEditReview({ id: null, rating: null, comment: "", images: [] });
//   };

//   const handleAddImage = (event) => {
//     const files = Array.from(event.target.files);
//     const newImages = files.map((file) => URL.createObjectURL(file));
//     setEditReview({
//       ...editReview,
//       images: [...editReview.images, ...newImages],
//     });
//   };

//   const handleDeleteImage = (image) => {
//     const filteredImages = editReview.images.filter((img) => img !== image);
//     setEditReview({ ...editReview, images: filteredImages });
//   };

//   if (reviewsLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-xl">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
//         My Reviews
//       </h2>
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {reviews.map((review) => (
//           <div key={review._id} className="bg-white shadow-md rounded-lg p-6">
//             {/* <Link to={`/products/${review.product._id}`}> */}
//             {/* <h3 className="text-lg font-semibold mb-2 text-gray-800">
//               {review.product.title}
//             </h3> */}
//             {/* </Link> */}
//             <img
//               src={review.product.productImage}
//               alt={review.product.title}
//               className="w-full h-48 object-cover mb-4 rounded-md"
//             />
//             <div className="flex flex-col mb-4">
//               <span className="font-semibold">Rating:</span>
//               {editReview.id === review._id ? (
//                 <div className="flex items-center">
//                   {[1, 2, 3, 4, 5].map((ratingValue) => (
//                     <button
//                       key={ratingValue}
//                       className={`mr-2 py-2 px-4 rounded ${
//                         editReview.rating === ratingValue
//                           ? "bg-blue-500 text-white"
//                           : "bg-gray-300 text-gray-700"
//                       }`}
//                       onClick={() =>
//                         setEditReview({
//                           ...editReview,
//                           rating: ratingValue,
//                         })
//                       }
//                     >
//                       {ratingValue}
//                     </button>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="rounded-md border bg-purple-200 border-gray-300 py-2 px-4 w-full">
//                   <div className="text-md text-gray-700 font-semibold">
//                     {review.rating}
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div className="flex flex-col mb-4">
//               <span className="font-semibold">Comment:</span>
//               {editReview.id === review._id ? (
//                 <input
//                   type="text"
//                   value={editReview.comment}
//                   onChange={(e) =>
//                     setEditReview({
//                       ...editReview,
//                       comment: e.target.value,
//                     })
//                   }
//                   className="rounded-md border bg-purple-200 border-gray-300 py-3 px-4 text-gray-700 focus:outline-none focus:border-purple-500"
//                 />
//               ) : (
//                 <div className="rounded-md border bg-purple-200 border-gray-300 py-2 px-4 w-full">
//                   <p className="text-md text-gray-700 font-semibold">
//                     {review.comment}
//                   </p>
//                 </div>
//               )}
//             </div>
//             <div className="flex flex-col mb-4">
//               <span className="font-semibold">Images:</span>
//               {editReview.id === review._id ? (
//                 <>
//                   <div className="flex flex-wrap">
//                     {editReview.images.map((image, index) => (
//                       <div
//                         key={index}
//                         className="relative w-full md:w-1/2 lg:w-1/3 p-2"
//                       >
//                         <img
//                           src={image}
//                           alt={`Review image ${index + 1}`}
//                           className="w-full h-48 object-cover mb-4 rounded-md"
//                         />
//                         <button
//                           onClick={() => handleDeleteImage(image)}
//                           className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 text-white rounded-full p-1"
//                         >
//                           &times;
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                   <input
//                     type="file"
//                     multiple
//                     onChange={handleAddImage}
//                     className="mt-2"
//                   />
//                 </>
//               ) : (
//                 <div className="rounded-md border bg-purple-200 border-gray-300 py-2 px-4 w-full">
//                   {review.images.map((image, index) => (
//                     <img
//                       key={index}
//                       src={image}
//                       alt={`Review image ${index + 1}`}
//                       className="w-full h-48 object-cover mb-4 rounded-md"
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//             <div className="flex justify-end">
//               {editReview.id === review._id ? (
//                 <>
//                   <button
//                     onClick={handleSaveReview}
//                     className="text-sm font-semibold text-blue-600 hover:text-blue-800 mr-2"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={handleCancelEdit}
//                     className="text-sm font-semibold text-gray-600 hover:text-gray-800"
//                   >
//                     Cancel
//                   </button>
//                 </>
//               ) : (
//                 <button
//                   onClick={() =>
//                     handleEditReview(
//                       review._id,
//                       review.rating,
//                       review.comment,
//                       review.images
//                     )
//                   }
//                   className="text-sm font-semibold text-gray-600 hover:text-gray-800"
//                 >
//                   Edit
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Reviews;
