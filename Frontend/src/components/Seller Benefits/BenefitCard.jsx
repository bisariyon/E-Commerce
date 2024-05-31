import React from 'react';

function BenefitCard({ imageSrc, imageAlt, title, description }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <img src={imageSrc} alt={imageAlt} className="mb-4 rounded-lg" />
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default BenefitCard;
