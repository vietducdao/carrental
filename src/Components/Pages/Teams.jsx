import React, { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination, Autoplay } from "swiper/modules";

import teams1 from "../../assets/test-1.jpg";
import teams2 from "../../assets/test-2.jpg";
import teams3 from "../../assets/test-4.jpg";
import teams4 from "../../assets/test-5.jpg";

function Teams() {
  const [activeTab, setActiveTab] = useState("Tiểu sử");

  const tabs = ["Tiểu sử", "Học vấn", "Thành tựu"];

  const content = {
    "Tiểu sử": `Chuyên viên tư vấn dịch vụ thuê xe với kinh nghiệm trong lĩnh vực chăm sóc khách hàng và hỗ trợ lựa chọn phương tiện phù hợp. Có khả năng tư vấn nhanh chóng, chính xác và mang lại trải nghiệm tốt nhất cho khách hàng.`,

    "Học vấn": `Tốt nghiệp chuyên ngành Công nghệ thông tin / Quản trị kinh doanh. Được đào tạo về kỹ năng giao tiếp, quản lý dịch vụ và vận hành hệ thống hỗ trợ khách hàng trong môi trường số.`,

    "Thành tựu": `Đạt danh hiệu nhân viên xuất sắc trong quá trình làm việc, có nhiều đóng góp trong việc nâng cao chất lượng dịch vụ và cải thiện trải nghiệm người dùng trên hệ thống thuê xe trực tuyến.`,
  };

  return (
    <>
      {/* Banner */}
      <div className="banner-section relative teams-section flex justify-center items-center">
        <div className="banner-section-content text-center z-10">
          <h6 className="uppercase text-[#f5b754]">TƯ VẤN VIÊN</h6>
          <h1 className="text-5xl font-semibold font-bricolage text-white">
            Olivia Brown (Dữ Liệu Mẫu)
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
              <a href="#" className="text-white underline">
                {" "}
                vietd4220@gmail.com
              </a>
            </p>
          </div>

          {/* Nội dung */}
          <div className="teams-content w-full lg:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 font-bricolage">
              Xin chào, tôi là Olivia Brown – chuyên viên tư vấn tại hệ thống
              thuê xe cao cấp.
            </h2>

            <p className="text-[#999] text-lg mb-8 ">
              Hỗ trợ khách hàng lựa chọn xe phù hợp, tư vấn dịch vụ và đảm bảo
              trải nghiệm thuê xe thuận tiện, nhanh chóng.
            </p>

            <ul className="mb-9 space-y-3">
              <li className="flex items-center gap-3 text-[#999]">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1e1e1e]">
                  <i className="fa-solid fa-check text-[#f5b754] text-sm"></i>
                </div>
                Bằng lái xe hạng B
              </li>

              <li className="flex items-center gap-3 text-[#999]">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1e1e1e]">
                  <i className="fa-solid fa-check text-[#f5b754] text-sm"></i>
                </div>
                Tốt nghiệp đại học
              </li>

              <li className="flex items-center gap-3 text-[#999]">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1e1e1e]">
                  <i className="fa-solid fa-check text-[#f5b754] text-sm"></i>
                </div>
                Kỹ năng giao tiếp tốt
              </li>
            </ul>

            {/* Tabs */}
            <div className="flex border-b border-[#f5b754] mb-4 space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`text-xl pb-4 font-semibold transition duration-300 ${
                    activeTab === tab
                      ? "text-[#f5b754]"
                      : "text-white hover:text-[#f5b754]"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <p className="text-[#999] leading-relaxed text-lg ">
              {content[activeTab]}
            </p>
          </div>
        </div>
      </div>

      {/* Danh sách team */}
      <div className="lg:px-[12%] px-[8%] py-[150px] section-effect">
        <div className="text-center">
          <p className="uppercase text-sm tracking-[5px] text-[#f5b754] mb-2">
            - Đội ngũ chuyên nghiệp
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-white font-bricolage">
            <span className="text-[#f5b754]"> Đội ngũ </span>
            <span className="text-white">Chuyên gia</span>
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
                <h6>Phòng kinh doanh</h6>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="our-team">
              <img src={teams3} className="w-full h-72 object-cover" />
              <div className="team-info">
                <h4>Trần Văn B</h4>
                <h6>Phòng kinh doanh</h6>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="our-team">
              <img src={teams2} className="w-full h-72 object-cover" />
              <div className="team-info">
                <h4>Lê Thị C</h4>
                <h6>Phòng kinh doanh</h6>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="our-team">
              <img src={teams4} className="w-full h-72 object-cover" />
              <div className="team-info">
                <h4>Phạm Văn D</h4>
                <h6>Phòng kinh doanh</h6>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
}

export default Teams;
