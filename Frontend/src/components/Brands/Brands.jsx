import React, { useState } from "react";
import { motion } from "framer-motion";

function Brands({ brandID, brandName, description, logo }) {
  const [expanded, setExpanded] = useState(false);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
    setTimeout(() => {
      setExpanded(false);
    }, 1000);
  };

  return (
    <motion.div
      className="relative group overflow-hidden rounded-lg shadow-lg bg-white "
      layout
      onClick={handleToggleExpand}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img
        src={logo}
        alt={brandName}
        className="object-fill w-full h-48 transition-transform duration-200 transform scale-100 group-hover:scale-105 "
      />
      {expanded && (
        <motion.div
          className="absolute inset-0 bg-slate-700 bg-opacity-100 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center text-red p-4">
            <h3 className="text-xl md:text-xl lg:text-2xl font-bold text-white">
              {brandName}
            </h3>
            <p className="mt-1 text-md text-white">{description}</p>
          </div>
        </motion.div>
      )}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-400 to-transparent text-white ${expanded ? "hidden" : "visible"}`}
      >
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold">
          {brandName}
        </h3>
      </div>
    </motion.div>
  );
}

export default Brands;
