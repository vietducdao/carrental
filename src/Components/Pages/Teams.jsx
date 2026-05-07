import React, { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination, Autoplay } from "swiper/modules";

import teams1 from "../../assets/test-1.jpg";
import teams2 from "../../assets/test-2.jpg";
import teams3 from "../../assets/test-4.jpg";
import teams4 from "../../assets/test-5.jpg";
import { useLanguage } from "../../context/LanguageContext";

function Teams() {
  const { t } = useLanguage();
  const [activeTabIdx, setActiveTabIdx] = useState(0);

  const tabs = [t.teams.tab1, t.teams.tab2, t.teams.tab3];
  const content = [t.teams.bio, t.teams.edu, t.teams.achievement];

  return (
    <>
      {/* Banner */}
      <div className="banner-section relative teams-section flex justify-center items-center">
        <div className="banner-section-content text-center z-10">
          <h6 className="uppercase text-[#f5b754]">{t.teams.bannerSub}</h6>
          <h1 className="text-5xl font-semibold font-bricolage text-white">
            {t.teams.bannerTitle}
          </h1>
        </div>
      </div>

      <div className="teams-container px-[8%] 2xl:px-[18%] py-[80px] bg-[#121212] text-white">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Hình ảnh */}
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
              Email:
              <a href="#" className="text-white underline"> vietd4220@gmail.com</a>
            </p>
          </div>

          {/* Nội dung */}
          <div className="teams-content w-full lg:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 font-bricolage">
              {t.teams.greeting}
            </h2>

            <p className="text-[#999] text-lg mb-8 ">{t.teams.memberDesc}</p>

            <ul className="mb-9 space-y-3">
              <li className="flex items-center gap-3 text-[#999]">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1e1e1e]">
                  <i className="fa-solid fa-check text-[#f5b754] text-sm"></i>
                </div>
                {t.teams.license}
              </li>

              <li className="flex items-center gap-3 text-[#999]">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1e1e1e]">
                  <i className="fa-solid fa-check text-[#f5b754] text-sm"></i>
                </div>
                {t.teams.education}
              </li>

              <li className="flex items-center gap-3 text-[#999]">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1e1e1e]">
                  <i className="fa-solid fa-check text-[#f5b754] text-sm"></i>
                </div>
                {t.teams.communication}
              </li>
            </ul>

            {/* Tabs */}
            <div className="flex border-b border-[#f5b754] mb-4 space-x-8">
              {tabs.map((tab, idx) => (
                <button
                  key={idx}
                  className={`text-xl pb-4 font-semibold transition duration-300 ${
                    activeTabIdx === idx
                      ? "text-[#f5b754]"
                      : "text-white hover:text-[#f5b754]"
                  }`}
                  onClick={() => setActiveTabIdx(idx)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <p className="text-[#999] leading-relaxed text-lg ">{content[activeTabIdx]}</p>
          </div>
        </div>
      </div>

      {/* Danh sách team */}
      <div className="lg:px-[12%] px-[8%] py-[150px] section-effect">
        <div className="text-center">
          <p className="uppercase text-sm tracking-[5px] text-[#f5b754] mb-2">
            {t.teams.teamSub}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-white font-bricolage">
            <span className="text-[#f5b754]"> {t.teams.teamTitle1} </span>
            <span className="text-white">{t.teams.teamTitle2}</span>
          </h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          spaceBetween={40}
          autoplay={{ delay: 3000 }}
          pagination={true}
          breakpoints={{
            1400: { slidesPerView: 3 },
            1179: { slidesPerView: 2 },
            767: { slidesPerView: 1.5 },
            0: { slidesPerView: 1 },
          }}
          className="mt-[70px]"
        >
          <SwiperSlide>
            <div className="our-team">
              <img src={teams1} className="w-full h-72 object-cover" />
              <div className="team-info">
                <h4>Nguyễn Thị A</h4>
                <h6>{t.teams.dept}</h6>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="our-team">
              <img src={teams3} className="w-full h-72 object-cover" />
              <div className="team-info">
                <h4>Trần Văn B</h4>
                <h6>{t.teams.dept}</h6>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="our-team">
              <img src={teams2} className="w-full h-72 object-cover" />
              <div className="team-info">
                <h4>Lê Thị C</h4>
                <h6>{t.teams.dept}</h6>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="our-team">
              <img src={teams4} className="w-full h-72 object-cover" />
              <div className="team-info">
                <h4>Phạm Văn D</h4>
                <h6>{t.teams.dept}</h6>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
}

export default Teams;
