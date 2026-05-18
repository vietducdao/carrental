import React, { useState, useEffect } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination, Autoplay } from "swiper/modules";

import api, { BASE_URL } from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";

function Teams() {
  const { t } = useLanguage();
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/team?active=true")
      .then((r) => setMembers(r.data.members || []))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  const featured = members.find((m) => m.isFeatured) || members[0] || null;
  const others = featured ? members.filter((m) => m._id !== featured._id) : members;

  const tabs = [t.teams.tab1, t.teams.tab2, t.teams.tab3];
  const featuredContent = featured
    ? [featured.bio || t.teams.bio, featured.education || t.teams.edu, featured.achievement || t.teams.achievement]
    : [t.teams.bio, t.teams.edu, t.teams.achievement];

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

      {/* Featured member */}
      {featured && (
        <div className="teams-container px-[8%] 2xl:px-[18%] py-[80px] bg-[#121212] text-white">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="teams-images w-full h-full lg:w-1/2 relative">
              <div className="teams-image mb-10">
                {featured.image ? (
                  <img src={`${BASE_URL}/uploads/${featured.image}`} alt={featured.name} />
                ) : (
                  <div className="w-full aspect-[4/5] bg-gradient-to-br from-[#222] to-[#111] flex items-center justify-center text-gray-700 text-6xl font-bold">
                    {featured.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="teams-icons flex gap-4 mt-4">
                {featured.socials?.facebook && (
                  <a href={featured.socials.facebook} target="_blank" rel="noreferrer" className="hover:bg-[#f5b754] transition-colors cursor-pointer border border-[#f5b754] h-14 w-14 text-2xl flex justify-center items-center rounded-full">
                    <i className="fa-brands fa-facebook-f"></i>
                  </a>
                )}
                {featured.socials?.twitter && (
                  <a href={featured.socials.twitter} target="_blank" rel="noreferrer" className="hover:bg-[#f5b754] transition-colors cursor-pointer border border-[#f5b754] h-14 w-14 text-2xl flex justify-center items-center rounded-full">
                    <i className="fa-brands fa-x-twitter"></i>
                  </a>
                )}
                {featured.socials?.instagram && (
                  <a href={featured.socials.instagram} target="_blank" rel="noreferrer" className="hover:bg-[#f5b754] transition-colors cursor-pointer border border-[#f5b754] h-14 w-14 text-2xl flex justify-center items-center rounded-full">
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                )}
                {featured.socials?.tiktok && (
                  <a href={featured.socials.tiktok} target="_blank" rel="noreferrer" className="hover:bg-[#f5b754] transition-colors cursor-pointer border border-[#f5b754] h-14 w-14 text-2xl flex justify-center items-center rounded-full">
                    <i className="fa-brands fa-tiktok"></i>
                  </a>
                )}
              </div>

              {featured.email && (
                <p className="mt-4 text-[#999] text-lg">
                  Email:
                  <a href={`mailto:${featured.email}`} className="text-white underline"> {featured.email}</a>
                </p>
              )}
            </div>

            <div className="teams-content w-full lg:w-1/2">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 font-bricolage">
                {featured.name}
              </h2>
              <p className="text-orange-400 font-semibold mb-2">{featured.role} {featured.department && `• ${featured.department}`}</p>

              {featured.bio && <p className="text-[#999] text-lg mb-8">{featured.bio}</p>}

              <div className="flex border-b border-[#f5b754] mb-4 space-x-8">
                {tabs.map((tab, idx) => (
                  <button
                    key={idx}
                    className={`text-xl pb-4 font-semibold transition duration-300 ${
                      activeTabIdx === idx ? "text-[#f5b754]" : "text-white hover:text-[#f5b754]"
                    }`}
                    onClick={() => setActiveTabIdx(idx)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <p className="text-[#999] leading-relaxed text-lg whitespace-pre-line">{featuredContent[activeTabIdx]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Other team members */}
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

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f5b754]" />
          </div>
        ) : others.length === 0 ? (
          <p className="text-center text-gray-500 mt-12">{t.teams.noMembers || "Chưa có thành viên"}</p>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            loop={others.length > 2}
            spaceBetween={40}
            autoplay={{ delay: 3000 }}
            pagination={true}
            breakpoints={{
              1400: { slidesPerView: Math.min(others.length, 3) },
              1179: { slidesPerView: Math.min(others.length, 2) },
              767: { slidesPerView: 1.5 },
              0: { slidesPerView: 1 },
            }}
            className="mt-[70px]"
          >
            {others.map((m) => (
              <SwiperSlide key={m._id}>
                <div className="our-team">
                  {m.image ? (
                    <img src={`${BASE_URL}/uploads/${m.image}`} className="w-full h-72 object-cover" alt={m.name} />
                  ) : (
                    <div className="w-full h-72 bg-gradient-to-br from-[#222] to-[#111] flex items-center justify-center text-gray-700 text-5xl font-bold">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="team-info">
                    <h4>{m.name}</h4>
                    <h6>{m.role}{m.department && ` • ${m.department}`}</h6>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </>
  );
}

export default Teams;
