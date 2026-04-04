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
      {/* Banner */}
      <div className="banner-section cars-banner-section flex justify-center items-center">
        <div className="banner-section-content text-center z-10">
          <h6 className="uppercase text-gray-300">- THUÊ XE NGAY</h6>
          <h1 className="text-5xl font-semibold font-bricolage text-[#f5b754]">
            <span className="text-white">Chọn </span>Xe Cao Cấp
          </h1>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="flex flex-col md:flex-row gap-10 px-4 sm:px-6 md:px-8 lg:px-[12%] py-12">
        {/* Sidebar */}
        <div className="w-full md:w-[280px] bg-[#1a1a1a] rounded-2xl p-6 shadow-lg h-fit">
          {/* Search */}
          <div className="bg-[#f5b754] rounded-xl p-1 mb-6 flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="bg-gray-900 text-white w-full px-3 py-2 rounded-xl focus:outline-none"
            />
            <span className="ml-2 text-black text-lg">
              <i className="ri-search-line"></i>
            </span>
          </div>

          {/* Danh mục */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Danh mục xe</h4>
            <ul className="text-sm space-y-2 text-gray-400">
              <li className="hover:text-[#f5b754] cursor-pointer">
                Xe thể thao
              </li>
              <li className="hover:text-[#f5b754] cursor-pointer">SUV</li>
              <li className="hover:text-[#f5b754] cursor-pointer">Mui trần</li>
              <li className="hover:text-[#f5b754] cursor-pointer">Xe sang</li>
              <li className="hover:text-[#f5b754] cursor-pointer">Sedan</li>
              <li className="hover:text-[#f5b754] cursor-pointer">Xe nhỏ</li>
            </ul>
          </div>

          {/* Điểm nhận xe */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Địa điểm nhận xe</h4>
            <ul className="text-sm space-y-2 text-gray-400">
              <li>Hà Nội</li>
              <li>Đà Nẵng</li>
              <li>Hồ Chí Minh</li>
              <li>Càn Thơ</li>
            </ul>
          </div>

          {/* Điểm trả xe */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Địa điểm trả xe</h4>
            <ul className="text-sm space-y-2 text-gray-400">
              <li>Cần Thơ</li>
              <li>Hồ Chí Minh</li>
              <li>Đà Nẵng</li>
              <li>Hà Nội</li>
            </ul>
          </div>
        </div>

        {/* Danh sách xe */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {carData.slice(0, visible).map((car) => (
              <div
                key={car.id}
                className="bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-md hover:shadow-[#f5b754]/30 transition"
              >
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-48 object-cover hover:scale-105 transition"
                />

                <div className="p-5">
                  <h3 className="text-xl font-bold mb-3">{car.name}</h3>

                  <ul className="text-sm text-gray-400 space-y-2 mb-4">
                    <li>
                      <i className="ri-door-line mr-2 text-[#f5b754]"></i>
                      Số cửa: {car.door}
                    </li>
                    <li>
                      <i className="ri-user-line mr-2 text-[#f5b754]"></i>
                      Số chỗ: {car.passengers}
                    </li>
                    <li>
                      <i className="ri-settings-2-line mr-2 text-[#f5b754]"></i>
                      Hộp số: {car.transmission}
                    </li>
                    <li>
                      <i className="ri-suitcase-line mr-2 text-[#f5b754]"></i>
                      Hành lý: {car.bags}
                    </li>
                  </ul>

                  <div className="flex justify-between items-center">
                    <span className="text-[#f5b754] font-semibold text-lg">
                      ${car.price}/ngày
                    </span>

                    <Link to={`/car/${car.id}`}>
                      <button className="bg-[#f5b754] text-black px-4 py-2 rounded-full text-sm hover:bg-[#e5a944] transition">
                        Xem chi tiết
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Nút load thêm */}
          {visible < carData.length && (
            <div className="text-center mt-10">
              <button
                onClick={handleLoadMore}
                className="bg-[#f5b754] hover:bg-[#e5a944] text-black px-6 py-2 rounded-xl font-semibold transition"
              >
                Xem thêm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cars;
