import React, { useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { Pagination, Autoplay } from "swiper/modules";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import about from "../../assets/about.jpg";
import Cars from "../../Cars.json";
import carType1 from "../../assets/car-1.jpg";
import carType2 from "../../assets/car-2.jpg";
import carType3 from "../../assets/car-3.jpg";
import carType4 from "../../assets/car-4.jpg";
import carType5 from "../../assets/car-5.jpg";
import carType6 from "../../assets/car-6.jpg";

import test1 from "../../assets/test-1.jpg";
import test2 from "../../assets/test-2.jpg";
import test3 from "../../assets/test-3.jpg";

import newscar1 from "../../assets/banner-1.jpg";
import newscar2 from "../../assets/banner-2.jpg";
import newscar3 from "../../assets/banner-car.jpg";
import newscar4 from "../../assets/car-5.jpg";

function Index() {
  const [pickUpDate, setPickUpDate] = useState(null);
  const datePickerRef = useRef(null);

  const openCalender = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setFocus();
    }
  };

  const [returnDate, setReturnDate] = useState(null);
  const returnPickerRef = useRef(null);

  const openreturnCalendar = () => {
    if (returnPickerRef.current) {
      returnPickerRef.current.setFocus();
    }
  };
  return (
    <>
      {/* HERO */}
      <div className="hero w-[100%] h-[100vh] overflow-hidden">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          spaceBetween={0}
          loop={true}
          autoplay={{ delay: 2000 }}
          speed={1500}
          className="hero -swiper w-full h-full"
        >
          {/* slide 1 */}
          <SwiperSlide>
            <div className="hero-slide hero-slide1 w-full h-full flex items-center px-[12%]">
              <div className="hero-content text-white ">
                <span className="font-bricolage text-1xl uppercase tracking-widest">
                  Premium
                </span>
                <h1 className="font-bricolage text-9xl hero-title my-3">
                  Rental car
                </h1>
                <p className="my-2 text-2xl font-bricolage hero-subtitle text-gray-300">
                  You can Rent any og our Luxurious Car.
                </p>
                <p className="my-7 w-[60%] hero-pere text-gray-300">
                  Experience premium car rentals with comfort, style,and
                  affordability-perfect for road trips, business travel, or
                  luxury weekend gateaways.
                </p>
                <div className="hero-btns flex gap-4 mt-8 ">
                  <button className="default-btn bg-[#f5b754] transition-all hover:bg-white hover:text-black px-7 py-5 font-bricolage rounded-full transform hover:-translate-y-1">
                    View more &nbsp;
                    <i className="bi bi-arrow-up-right"></i>
                  </button>
                  <button className="default-btn border px-7 py-5 font-bricolage rounded-full transition-all hover:bg-[#f5b754] hover:border-transparent hover:translate-y-1">
                    Rent Now
                    <i className="bi bi-arrow-up-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
          {/* slide 2 */}
          <SwiperSlide>
            <div className="hero-slide hero-slide2 w-full h-full flex items-center px-[12%]">
              <div className="hero-content text-white ">
                <span className="font-bricolage text-1xl uppercase tracking-widest">
                  Premium
                </span>
                <h1 className="font-bricolage text-9xl hero-title my-3">
                  Rental car
                </h1>
                <p className="my-2 text-2xl font-bricolage hero-subtitle text-gray-300">
                  You can Rent any og our Luxurious Car.
                </p>
                <p className="my-7 w-[60%] hero-pere text-gray-300">
                  Experience premium car rentals with comfort, style,and
                  affordability-perfect for road trips, business travel, or
                  luxury weekend gateaways.
                </p>
                <div className="hero-btns flex gap-4 mt-8 ">
                  <button className="default-btn bg-[#f5b754] transition-all hover:bg-white hover:text-black px-7 py-5 font-bricolage rounded-full transform hover:-translate-y-1">
                    View more &nbsp;
                    <i className="bi bi-arrow-up-right"></i>
                  </button>
                  <button className="default-btn border px-7 py-5 font-bricolage rounded-full transition-all hover:bg-[#f5b754] hover:border-transparent hover:translate-y-1">
                    Rent Now
                    <i className="bi bi-arrow-up-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
          {/* slide 3 */}
          <SwiperSlide>
            <div className="hero-slide hero-slide2 hero-slide3 w-full h-full flex items-center px-[12%]">
              <div className="hero-content text-white ">
                <span className="font-bricolage text-1xl uppercase tracking-widest">
                  Premium
                </span>
                <h1 className="font-bricolage text-9xl hero-title my-3">
                  Rental car
                </h1>
                <p className="my-2 text-2xl font-bricolage hero-subtitle text-gray-300">
                  You can Rent any og our Luxurious Car.
                </p>
                <p className="my-7 w-[60%] hero-pere text-gray-300">
                  Experience premium car rentals with comfort, style,and
                  affordability-perfect for road trips, business travel, or
                  luxury weekend gateaways.
                </p>
                <div className="hero-btns flex gap-4 mt-8 ">
                  <button className="default-btn bg-[#f5b754] transition-all hover:bg-white hover:text-black px-7 py-5 font-bricolage rounded-full transform hover:-translate-y-1">
                    View more &nbsp;
                    <i className="bi bi-arrow-up-right"></i>
                  </button>
                  <button className="default-btn border px-7 py-5 font-bricolage rounded-full transition-all hover:bg-[#f5b754] hover:border-transparent hover:translate-y-1">
                    Rent Now
                    <i className="bi bi-arrow-up-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
        {/* Book Option */}
        <div
          className="book-option bg-[#1f1f1f] text-white w-[90%] max-w-[1200px] mx-auto mt-[-50px] 
        rounded-3xl px-6 py-4 grid grid-cols-1 sm:gird-cols-2 lg:grid-cols-5 gap-4 shadow-lg z-50 absolute bottom-[0%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 "
        >
          {/* Cars Type */}
          <div className="relative w-full lg:w-auto px-4 py-3 group border-gray-600">
            <button className="flex items-center gap-2 w-full justify-between text-gray-400">
              Choose Car Type
              <i className="ri-arrow-down-s-line text-yellow-500"></i>
            </button>
            <div
              className="absolute top-[110%] left-0 w-48 bg-[#1f1f1f] border border-yellow-500 rounded-sm shadow-md
          opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-300 ease-out"
            >
              <ul className="divide-y divide-gray-700">
                <li className="px-4 py-2 hover:bg-[#f5b750] transition cusor-pointer">
                  A
                </li>
                <li className="px-4 py-2 hover:bg-[#f5b750] transition cusor-pointer">
                  B
                </li>
                <li className="px-4 py-2 hover:bg-[#f5b750] transition cusor-pointer">
                  C
                </li>
                <li className="px-4 py-2 hover:bg-[#f5b750] transition cusor-pointer">
                  D
                </li>
              </ul>
            </div>
          </div>
          {/* Pick Location */}
          <div className="relative w-full lg:w-auto px-4 py-3 group border-gray-600">
            <button className="flex items-center gap-2 w-full justify-between text-gray-400">
              Pick Up Location
              <i className="ri-arrow-down-s-line text-yellow-500"></i>
            </button>
            <div
              className="absolute top-[110%] left-0 w-48 bg-[#1f1f1f] border border-yellow-500 rounded-sm shadow-md
          opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-300 ease-out"
            >
              <ul className="divide-y divide-gray-700">
                <li className="px-4 py-2 hover:bg-[#f5b750] transition cusor-pointer">
                  A
                </li>
                <li className="px-4 py-2 hover:bg-[#f5b750] transition cusor-pointer">
                  B
                </li>
                <li className="px-4 py-2 hover:bg-[#f5b750] transition cusor-pointer">
                  C
                </li>
                <li className="px-4 py-2 hover:bg-[#f5b750] transition cusor-pointer">
                  D
                </li>
              </ul>
            </div>
          </div>
          {/* Pick Date */}
          <div
            className="relative w-full lg-w:auto px-4 py-3 flex items-center border-r border-gray-600 cursor-pointer"
            onClick={openCalender}
          >
            <DatePicker
              selected={pickUpDate}
              onChange={(date) => setPickUpDate(date)}
              dateFormat="dd MMM yyyy"
              placeholderText="Pick Up Date"
              ref={datePickerRef}
              className={`bg-[#1f1f1f] text-white outline-none cursor-pointer w-full ${
                !pickUpDate ? "text-gray-400" : ""
              }  `}
              calendarClassName="dark-datepicker"
              popperPlacement="bottom-sttart"
            />
            <i className="ri-calendar-line text-yellow-500 pointer-events-none"></i>
          </div>
          {/* Drop location */}
          <div className="relative w-full lg:w-auto px-4 py-3 group border-gray-600">
            <button className="flex items-center gap-2 w-full justify-between text-gray-400">
              Drop Off Location
              <i className="ri-arrow-down-s-line text-yellow-500"></i>
            </button>
            <div
              className="absolute top-[110%] left-0 w-48 bg-[#1f1f1f] border border-yellow-500 rounded-sm shadow-md
          opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-300 ease-out"
            >
              <ul className="divide-y divide-gray-700">
                <li className="px-4 py-2 hover:bg-[#f5b750] transition cusor-pointer">
                  Drop Off Location
                </li>
                <li className="px-4 py-2 hover:bg-[#f5b750] transition cusor-pointer">
                  A
                </li>
                <li className="px-4 py-2 hover:bg-[#f5b750] transition cusor-pointer">
                  B
                </li>
                <li className="px-4 py-2 hover:bg-[#f5b750] transition cusor-pointer">
                  C
                </li>
                <li className="px-4 py-2 hover:bg-[#f5b750] transition cusor-pointer">
                  D
                </li>
              </ul>
            </div>
          </div>
          {/* Return date */}
          <div
            className="relative w-full lg-w:auto px-4 py-3 flex items-center cursor-pointer"
            onClick={openreturnCalendar}
          >
            <DatePicker
              selected={pickUpDate}
              onChange={(date) => setPickUpDate(date)}
              dateFormat="dd MMM yyyy"
              placeholderText="Return Date"
              ref={returnPickerRef}
              className={`bg-[#1f1f1f] text-white outline-none cursor-pointer w-full ${
                !returnDate ? "text-gray-400" : ""
              }  `}
              calendarClassName="dark-datepicker"
              popperPlacement="bottom-sttart"
            />
            <i className="ri-calendar-line text-yellow-500 pointer-events-none"></i>
          </div>
        </div>
      </div>
      {/* About */}
    </>
  );
}

export default Index;
