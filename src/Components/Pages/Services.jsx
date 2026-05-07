import React from "react";
import { useLanguage } from "../../context/LanguageContext";

function Services() {
  const { t } = useLanguage();

  return (
    <>
      {/* Page Section */}
      <div className="banner-section about-banner-section flex justify-center  text-[#f5b754] items-center">
        <div className="banner-section-content text-center z-10">
          <h6 className="uppercase">{t.services.bannerSub}</h6>
          <h1 className="text-5xl font-semibold font-bricolage text-[#f5b754]">
            <span className="font-bricolage text-white">{t.services.bannerTitle1} </span>{t.services.bannerTitle2}
          </h1>
        </div>
      </div>

      {/* Service Container */}
      <div className="service-container lg:px-[12%] px-[8%] py-[150px] bg-[#1b1b1b]">
        <div className="grid w-full gap-12 grid-cols-1 lg:grid-cols-3">
          <div className="service-item relative text-white rounded-[30px] bg-[#222222] w-full ">
            <h5 className="font-semibold text-2xl mb-3 font-bricolage">{t.services.card1Title}</h5>
            <p className="text-[#999] text-lg">{t.services.card1Desc}</p>
            <div className="curv">
              <div className="service-item-curv section-item-curv">1.</div>
            </div>
          </div>

          <div className="service-item relative text-white rounded-[30px] bg-[#222222] w-full ">
            <h5 className="font-semibold text-2xl mb-3 font-bricolage">{t.services.card2Title}</h5>
            <p className="text-[#999] text-lg">{t.services.card2Desc}</p>
            <div className="curv">
              <div className="service-item-curv section-item-curv"> 2.</div>
            </div>
          </div>

          <div className="service-item relative text-white rounded-[30px] bg-[#222222] w-full ">
            <h5 className="font-semibold text-2xl mb-3 font-bricolage">{t.services.card3Title}</h5>
            <p className="text-[#999] text-lg">{t.services.card3Desc}</p>
            <div className="curv">
              <div className="service-item-curv section-item-curv"> 3.</div>
            </div>
          </div>

          <div className="service-item relative text-white rounded-[30px] bg-[#222222] w-full ">
            <h5 className="font-semibold text-2xl mb-3 font-bricolage">{t.services.card4Title}</h5>
            <p className="text-[#999] text-lg">{t.services.card4Desc}</p>
            <div className="curv">
              <div className="service-item-curv section-item-curv"> 4.</div>
            </div>
          </div>

          <div className="service-item relative text-white rounded-[30px] bg-[#222222] w-full ">
            <h5 className="font-semibold text-2xl mb-3 font-bricolage">{t.services.card5Title}</h5>
            <p className="text-[#999] text-lg">{t.services.card5Desc}</p>
            <div className="curv">
              <div className="service-item-curv section-item-curv"> 5.</div>
            </div>
          </div>

          <div className="service-item relative text-white rounded-[30px] bg-[#222222] w-full ">
            <h5 className="font-semibold text-2xl mb-3 font-bricolage">{t.services.card6Title}</h5>
            <p className="text-[#999] text-lg">{t.services.card6Desc}</p>
            <div className="curv">
              <div className="service-item-curv section-item-curv"> 6.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Service */}
      <div className="our-service lg:px-[12%] px-[8%] py-[150px] bg-[#1b1b1b] section-effect">
        <div className="our-service-content mb-20 text-center text-white">
          <p className="uppercase text-sm tracking-[5px] text-[#f5b754] mb-2 ">
            {t.services.servicesSub}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 font-bricolage">
            {t.services.servicesTitle}
          </h2>
        </div>
        <div className="our-service-wrapper">
          <div className="grid w-full gap-12 grid-cols-1 lg:grid-cols-3">
            <div className="service-item relative text-white rounded-[30px] bg-[#222222] w-full ">
              <h5 className="font-semibold text-2xl mb-3 font-bricolage">{t.services.dailyTitle}</h5>
              <p className="text-[#999] text-lg">{t.services.dailyDesc}</p>
              <div className="curv">
                <div className="service-item-curv section-item-curv">1.</div>
              </div>
            </div>

            <div className="service-item relative text-white rounded-[30px] bg-[#222222] w-full">
              <h5 className="font-semibold text-2xl mb-3 font-bricolage">{t.services.monthlyTitle}</h5>
              <p className="text-[#999] text-lg">{t.services.monthlyDesc}</p>
              <div className="curv">
                <div className="service-item-curv section-item-curv">2.</div>
              </div>
            </div>

            <div className="service-item relative text-white rounded-[30px] bg-[#222222] w-full">
              <h5 className="font-semibold text-2xl mb-3 font-bricolage">{t.services.weddingTitle}</h5>
              <p className="text-[#999] text-lg">{t.services.weddingDesc}</p>
              <div className="curv">
                <div className="service-item-curv section-item-curv">3. </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Services;
