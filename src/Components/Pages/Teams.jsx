import React, { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination, Autoplay } from "swiper/modules";

import teams1 from "../../assets/test-1.jpg";
import teams2 from "../../assets/test-2.jpg";
import teams3 from "../../assets/test-4.jpg";
import teams4 from "../../assets/test-5.jpg";

function Teams() {
  const [activeTab, setActiveTab] = useState("Biography");
  const tabs = ["Biography", "Education", "Awards"];
  const content = {
    Biography: `Biographies are non-fiction accounts of a person's life, typically written in the third-person using past tense to chronicle events in chronological order. Key grammatical features include formal tone, objective facts, fronted adverbials for time/place, and relative clauses to provide detailed, accurate information about a subject.`,
    Education: `Education are non-fiction accounts of a person's life, typically written in the third-person using past tense to chronicle events in chronological order. Key grammatical features include formal tone, objective facts, fronted adverbials for time/place, and relative clauses to provide detailed, accurate information about a subject.`,
    Awards: `Awards are non-fiction accounts of a person's life, typically written in the third-person using past tense to chronicle events in chronological order. Key grammatical features include formal tone, objective facts, fronted adverbials for time/place, and relative clauses to provide detailed, accurate information about a subject.`,
  };
  return (
    <>
      {/* Page Section */}
      <div className="banner-section relative teams-section flex justify-center items-center">
        <div className="banner-section-content text-center z-10">
          <h6 className="uppercase text-[#f5b754]"> SALES CONSULTANT</h6>
          <h1 className="text-5xl font-semibold font-bricolage text-white">
            Olivia Brown
          </h1>
        </div>
      </div>
      <div className="teams-container px-[8%] 2xl:px-[18%] py-[80px] bg-[#121212] text-white">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="teams-images w-full h-full lg:w-1/2 relative">
            <div className="teams-image mb-10">
              <img src={teams1} alt="teams" />
            </div>
            <div className="teams-icons flex gap-4 mt-4">
              <i className="fa-brands fa-facebook-f hover:bg-[#f5b754] transition-colors cursor-pointer border border-[#f5b754] h-14 w-14 text-2xl flex justify-center items-center rounded-full"></i>
              <i className="fa-brands fa-x-twitter hover:bg-[#f5b754] transition-colors cursor-pointer border border-[#f5b754] h-14 w-14 text-2xl flex justify-center items-center rounded-full"></i>
              <i className="fa-brands fa-instagram hover:bg-[#f5b754] transition-colors cursor-pointer border border-[#f5b754] h-14 w-14 text-2xl flex justify-center items-center rounded-full"></i>
              <i className="fa-brands fa-tiktok hover:bg-[#f5b754] transition-colors cursor-pointer border border-[#f5b754] h-14 w-14 text-2xl flex justify-center items-center rounded-full"></i>
            </div>
            <p className="mt-4 text-[#999] text-lg">
              My Email Addrres:
              <a href="#" className="text-white underline">
                {" "}
                vietd4220@gmail.com
              </a>
            </p>
          </div>
          {/* Text Content */}
          <div className="teams-content w-full lg:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 font-bricolage">
              Hello, I'm Olivia Brown. I work as your Sales consultant at
              Carshops Luxury Car Rental
            </h2>
            <p className="text-[#999] text-lg mb-8 ">
              Need a reliable car for your trip? Carshops offers a wide range of
              new vehicles at unbeatable prices.
            </p>
            <ul className="mb-9 space-y-3">
              <li className="flex items-center gap-3 text-[#999]">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1e1e1e]">
                  <i className="fa-solid fa-check text-[#f5b754] text-sm"></i>
                </div>
                B Driver License
              </li>
              <li className="flex items-center gap-3 text-[#999]">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1e1e1e]">
                  <i className="fa-solid fa-check text-[#f5b754] text-sm"></i>
                </div>
                Bacherlor's Degree
              </li>
              <li className="flex items-center gap-3 text-[#999]">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1e1e1e]">
                  <i className="fa-solid fa-check text-[#f5b754] text-sm"></i>
                </div>
                Good English
              </li>
            </ul>
            <div className="flex border-b border-[#f5b754] mb-4 space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`text-xl pb-4 font-semibold transition duration-300 ${activeTab === tab ? "text-[#f5b754]" : "text-white hover:text-[#f5b754]"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <p className="text-[#999] leadin-relaxed text-lg ">
              {content[activeTab]}
            </p>
          </div>
        </div>
      </div>
      {/* Teams */}
      <div className="lg:px-[12%] px-[8%] py-[150px] section-effect">
        <div className="text-center">
          <p className="uppercase text-sm tracking-[5px] text-[#f5b754] mb-2">
            - Certified Teams
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-white font-bricolage">
            <span className="text-[#f5b754] font-bricolage"> our </span>

            <span className="text-[#f5b754] font-bricolage">
              {" "}
              <span className="text-white">Experts</span> Team
            </span>
          </h2>
        </div>
        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          spaceBetween={40}
          autoplay={{
            delay: 3000,
          }}
          pagination={true}
          breakpoints={{
            1400: { slidesPerView: 3 },
            1179: { slidesPerView: 2 },
            767: { slidesPerView: 1.5 },
            0: { slidesPerView: 1 },
          }}
          className="mt-[70px]"
        >
          {/* slide 1 */}
          <SwiperSlide>
            <div className="our-team relative rounded-2xl overflow-hidden group shadow-md cursor-pointer">
              <img
                src={teams1}
                className="w-full h-72 object-cover z-[5]"
                alt=""
              />
              <div className="absolute z-[5]">
                <div className="curv">
                  <div className="section-item-curv our-team-curv">
                    <i className="fa-solid fa-info"></i>
                  </div>
                </div>
              </div>
              <div className="team-info">
                <h4 className="text-xl lg:text-2xl mb-1 font-semibold font-bricolage">
                  Magaret Nancy
                </h4>
                <h6 className="text-[#f2f2f2] xl:text-lg text-sm">
                  Sales Department
                </h6>
              </div>
            </div>
          </SwiperSlide>

          {/* slide 3 */}
          <SwiperSlide>
            <div className="our-team relative rounded-2xl overflow-hidden group shadow-md cursor-pointer">
              <img
                src={teams3}
                className="w-full h-72 object-cover z-[5]"
                alt=""
              />
              <div className="absolute z-[5]">
                <div className="curv">
                  <div className="section-item-curv our-team-curv">
                    <i className="fa-solid fa-info"></i>
                  </div>
                </div>
              </div>
              <div className="team-info">
                <h4 className="text-xl lg:text-2xl mb-1 font-semibold font-bricolage">
                  Dan Martin
                </h4>
                <h6 className="text-[#f2f2f2] xl:text-lg text-sm">
                  Sales Department
                </h6>
              </div>
            </div>
          </SwiperSlide>

          {/* slide 2 */}
          <SwiperSlide>
            <div className="our-team relative rounded-2xl overflow-hidden group shadow-md cursor-pointer">
              <img
                src={teams2}
                className="w-full h-72 object-cover z-[5]"
                alt=""
              />
              <div className="absolute z-[5]">
                <div className="curv">
                  <div className="section-item-curv our-team-curv">
                    <i className="fa-solid fa-info"></i>
                  </div>
                </div>
              </div>
              <div className="team-info">
                <h4 className="text-xl lg:text-2xl mb-1 font-semibold font-bricolage">
                  Mia Jane
                </h4>
                <h6 className="text-[#f2f2f2] xl:text-lg text-sm">
                  Sales Department
                </h6>
              </div>
            </div>
          </SwiperSlide>

          {/* slide 4 */}
          <SwiperSlide>
            <div className="our-team relative rounded-2xl overflow-hidden group shadow-md cursor-pointer">
              <img
                src={teams4}
                className="w-full h-72 object-cover z-[5]"
                alt=""
              />
              <div className="absolute z-[5]">
                <div className="curv">
                  <div className="section-item-curv our-team-curv">
                    <i className="fa-solid fa-info"></i>
                  </div>
                </div>
              </div>
              <div className="team-info">
                <h4 className="text-xl lg:text-2xl mb-1 font-semibold font-bricolage">
                  Micheal Brown
                </h4>
                <h6 className="text-[#f2f2f2] xl:text-lg text-sm">
                  Sales Department
                </h6>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
}

export default Teams;
