import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";

function Services() {
  const { t } = useLanguage();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/services?active=true")
      .then((r) => setServices(r.data.services || []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Banner */}
      <div className="banner-section about-banner-section flex justify-center text-[#f5b754] items-center">
        <div className="banner-section-content text-center z-10">
          <h6 className="uppercase">{t.services.bannerSub}</h6>
          <h1 className="text-5xl font-semibold font-bricolage text-[#f5b754]">
            <span className="font-bricolage text-white">{t.services.bannerTitle1} </span>{t.services.bannerTitle2}
          </h1>
        </div>
      </div>

      {/* Service Grid */}
      <div className="service-container lg:px-[12%] px-[8%] py-[150px] bg-[#1b1b1b]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f5b754]" />
          </div>
        ) : services.length === 0 ? (
          <p className="text-center text-gray-500">{t.services.noServices || "Chưa có dịch vụ"}</p>
        ) : (
          <div className="grid w-full gap-12 grid-cols-1 lg:grid-cols-3">
            {services.map((s, idx) => (
              <div key={s._id} className="service-item relative text-white rounded-[30px] bg-[#222222] w-full">
                {s.icon && <div className="text-4xl mb-3">{s.icon}</div>}
                <h5 className="font-semibold text-2xl mb-3 font-bricolage">{s.title}</h5>
                <p className="text-[#999] text-lg whitespace-pre-line">{s.description}</p>
                <div className="curv">
                  <div className="service-item-curv section-item-curv">{idx + 1}.</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Services;
