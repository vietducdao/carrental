import React, { useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { FaCarSide, FaMapMarkerAlt } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";

import about from "../../assets/about.jpg";
import { useLanguage } from "../../context/LanguageContext";

function About() {
  const { t } = useLanguage();
  const [pickUpDate, setPickUpDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

  return (
    <>
      {/* Banner */}
      <div className="banner-section flex justify-center  text-[#f5b754] items-center">
        <div className="banner-section-content text-center z-10">
          <h6 className="uppercase">{t.about.bannerSub}</h6>
          <h1 className="text-5xl font-semibold font-bricolage text-[#f5b754]">
            <span className="font-bricolage text-white">{t.about.bannerTitle1} </span>{t.about.bannerTitle2}
          </h1>
        </div>
      </div>

      {/* About */}
      <div className="text-white lg:px-[10%] px-[8%] py-[120px]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              {t.about.heading1} <br />
              <span className="text-[#f5b754]">{t.about.heading2}</span>
            </h2>
            <p className="text-gray-400 my-6">{t.about.desc}</p>
          </div>
          <img src={about} className="rounded-3xl shadow-xl" />
        </div>
      </div>

      {/* BOOKING UI */}
      <div className="lg:px-[10%] px-[8%] pb-[120px] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#1f1f1f]/70 backdrop-blur-xl border border-[#333]
          rounded-3xl p-6 shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Car Type */}
            <div className="flex items-center gap-2 border border-[#333] rounded-xl px-4 py-3 focus-within:border-[#f5b754]">
              <FaCarSide className="text-[#f5b754]" />
              <select className="bg-transparent w-full outline-none text-gray-300">
                <option>{t.about.carType}</option>
                <option>{t.about.suv}</option>
                <option>{t.about.luxury}</option>
                <option>{t.about.sedan}</option>
              </select>
            </div>

            {/* Pick Up Location */}
            <div className="flex items-center gap-2 border border-[#333] rounded-xl px-4 py-3 focus-within:border-[#f5b754]">
              <FaMapMarkerAlt className="text-[#f5b754]" />
              <input
                type="text"
                placeholder={t.about.pickLocation}
                className="bg-transparent w-full outline-none text-gray-300 placeholder:text-gray-500"
              />
            </div>

            {/* Drop Location */}
            <div className="flex items-center gap-2 border border-[#333] rounded-xl px-4 py-3 focus-within:border-[#f5b754]">
              <FaMapMarkerAlt className="text-[#f5b754]" />
              <input
                type="text"
                placeholder={t.about.dropLocation}
                className="bg-transparent w-full outline-none text-gray-300 placeholder:text-gray-500"
              />
            </div>

            {/* Pick Date */}
            <div className="flex items-center gap-2 border border-[#333] rounded-xl px-4 py-3 focus-within:border-[#f5b754]">
              <MdDateRange className="text-[#f5b754]" />
              <DatePicker
                selected={pickUpDate}
                onChange={(date) => setPickUpDate(date)}
                placeholderText={t.about.pickDate}
                className="bg-transparent w-full outline-none text-gray-300"
                popperClassName="z-[9999]"
                portalId="root"
                calendarClassName="dark-datepicker"
              />
            </div>

            {/* Return Date */}
            <div className="flex items-center gap-2 border border-[#333] rounded-xl px-4 py-3 focus-within:border-[#f5b754]">
              <MdDateRange className="text-[#f5b754]" />
              <DatePicker
                selected={returnDate}
                onChange={(date) => setReturnDate(date)}
                placeholderText={t.about.returnDate}
                className="bg-transparent w-full outline-none text-gray-300"
                popperClassName="z-[9999]"
                portalId="root"
                calendarClassName="dark-datepicker"
              />
            </div>

            {/* Button */}
            <button
              className="bg-[#f5b754] text-black font-semibold py-3 rounded-xl
              hover:bg-white transition duration-300 hover:scale-105
              shadow-lg shadow-[#f5b754]/20"
            >
              {t.about.bookBtn}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default About;
