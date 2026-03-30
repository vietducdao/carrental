import React, { useState } from "react";
import carData from "../../Cars.json";
import { Link } from "react-router-dom";
function Cars() {
  const [visible, setVisible] = useState(4);
  const handleLoadMore = () => {
    setVisible((prev) => prev + 2);
  };
  return (
    <div className="font-sans bg-[#121212] text-white">
      {/* Section banner */}
      <div className="banner-section cars-banner-section flex justify-center items-center">
        <div className="banner-section-content text-center z-10">
          <h6 className="uppercase">- RENT NOW</h6>
          <h1 className="text-5xl font-semibold font-bricolage text-[#f5b754]">
            <span className="font-bricolage text-white">Select </span> Luxury
            Car
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8 px-4 sm:px-6 md:px-8 lg:px-[12%] xl:px-[12%] py-12">
        {/* sidebar */}
        <div className="w-full sticky top-0 md:w-[300px] bg-[#1a1a1a] rounded-2xl p-6 shadow-lg animate-side-left h-full">
          <div className="bg-[#f5b754] rounded-xl p-1 mb-6 flex items-center">
            <input
              type="text"
              placeholder="Type Here..."
              className="bg-gray-900 text-white w-full px-3 py-2 rounded-xl focus:outline-none"
            />
            <span className="ml-2 text-black text-lg">
              <i className="ri-search-line"></i>
            </span>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Categories</h4>
            <ul className="text-sm space-y-1 text-gray-400">
              <li>Sport Cars</li>
              <li>SUV</li>
              <li>Convertible</li>
              <li>Luxury Cars</li>
              <li>Sedan</li>
              <li>Small Cars</li>
            </ul>
          </div>

          {/* Pickup */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Pickup Location</h4>
            <ul className="text-sm space-y-1 text-gray-400">
              <li>A</li>
              <li>B</li>
              <li>C</li>
              <li>D</li>
              <li>E</li>
              <li>F</li>
            </ul>
          </div>

          {/* DropOff */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">DropOff Location</h4>
            <ul className="text-sm space-y-1 text-gray-400">
              <li>A</li>
              <li>B</li>
              <li>C</li>
              <li>D</li>
              <li>E</li>
              <li>F</li>
            </ul>
          </div>
        </div>

        {/* Car Cards */}
        <div className="flex-1 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {carData.slice(0, visible).map((car) => (
              <div
                key={car.id}
                className="bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-md hover:shadow-[#f5b754]/30 transition-shadow duration-300 "
              >
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
                />
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-3">{car.name}</h3>
                  <ul className="text-sm text-gray-400 space-y-1 mb-4 ">
                    <li>
                      <i className="ri-door-line mr-2 text-[#f5b754]"></i>
                      Doors: {car.door}
                    </li>
                    <li>
                      <i className="ri-user-line mr-2 text-[#f5b754]"></i>
                      Passengers: {car.passengers}
                    </li>
                    <li>
                      <i className="ri-settings-2-line mr-2 text-[#f5b754]"></i>
                      Transmission: {car.transmission}
                    </li>
                    <li>
                      <i className="ri-suitcase-line mr-2 text-[#f5b754]"></i>
                      Bags: {car.Bags}
                    </li>
                  </ul>
                  <div className="flex justify-between items-center">
                    <span className="text-[#f5b754] font-semibold text-lg">
                      ${car.price}/day
                    </span>
                    <Link to={`/car/${car.id}`}>
                      <button className="bg-[#f5b754] text-black px-4 py-1 rounded-full text-sm hover:bg-[#f5b754]/90 transition ">
                        Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Load More Button */}
          {visible < carData.length && (
            <div className="text-center mt-10 ">
              <button
                onClick={handleLoadMore}
                className="bg-[#f5b754] hover:bg-[#f5b754]/90 text-black px-6 py-2 rounded-xl font-semibold transition"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Cars;
