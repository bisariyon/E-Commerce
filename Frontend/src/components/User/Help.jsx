import React from "react";

function Help() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Help Center
      </h2>
      <div className="space-y-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Frequently Asked Questions
          </h3>
          <p className="text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            eget metus ut mauris mattis rhoncus.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Contact Us
          </h3>
          <p className="text-gray-700">
            For any assistance or queries, feel free to contact our support
            team.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Troubleshooting
          </h3>
          <p className="text-gray-700">
            If you're facing any issues with our service, check out our
            troubleshooting guide.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Help;
