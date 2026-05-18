import React from "react";

import about from "../../assets/about.jpg";
import { useLanguage } from "../../context/LanguageContext";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import BookOption from "../BookOption";

function About() {
  const { t } = useLanguage();
  const { settings } = useSiteSettings();

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
              {settings.aboutTitle1 || t.about.heading1} <br />
              <span className="text-[#f5b754]">{settings.aboutTitle2 || t.about.heading2}</span>
            </h2>
            <p className="text-gray-400 my-6 whitespace-pre-line">{settings.aboutDesc || t.about.desc}</p>
          </div>
          <img src={about} className="rounded-3xl shadow-xl" />
        </div>
      </div>

      {/* BOOKING */}
      <div className="lg:px-[10%] px-[8%] pb-[120px] relative z-10">
        <BookOption />
      </div>
    </>
  );
}

export default About;
