import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useSiteSettings } from "../../context/SiteSettingsContext";

function Contact() {
  const { t } = useLanguage();
  const { settings } = useSiteSettings();

  return (
    <>
      {/* Banner */}
      <div className="banner-section relative contact-banner flex justify-center items-center">
        <div className="banner-section-content text-center z-10">
          <h6 className="uppercase text-[#f5b754]">{t.contact.bannerSub}</h6>
          <h1 className="text-5xl font-semibold font-bricolage text-white">
            <span className="text-[#f5b754]">{t.contact.bannerTitle1}</span> {t.contact.bannerTitle2}
          </h1>
        </div>
      </div>

      {/* Info */}
      <div className="contact-wrapper lg:px-[12%] px-[8%] bg-[#1b1b1b] pb-[150px]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {/* Email */}
          <div className="contact-item group bg-[#222] p-12 text-white rounded-xl">
            <i className="fa-solid fa-envelope text-[#f5b754] text-5xl group-hover:text-black transition"></i>
            <h4 className="text-2xl xl:text-4xl mt-8 mb-2 font-semibold">Email</h4>
            <p className="text-[#999] group-hover:text-black break-all">{settings.email || "—"}</p>
          </div>

          {/* Address */}
          <div className="contact-item group bg-[#222] p-12 text-white rounded-xl">
            <i className="fa-solid fa-location-dot text-[#f5b754] text-5xl group-hover:text-black transition"></i>
            <h4 className="text-2xl xl:text-4xl mt-8 mb-2 font-semibold">{t.contact.addressLabel}</h4>
            <p className="text-[#999] group-hover:text-black">{settings.address || "—"}</p>
          </div>

          {/* Time */}
          <div className="contact-item group bg-[#222] p-12 text-white rounded-xl">
            <i className="fa-solid fa-clock text-[#f5b754] text-5xl group-hover:text-black transition"></i>
            <h4 className="text-2xl xl:text-4xl mt-8 mb-2 font-semibold">{t.contact.hoursLabel}</h4>
            <p className="text-[#999] group-hover:text-black">{settings.hours || t.contact.hoursValue}</p>
          </div>

          {/* Phone */}
          <div className="contact-item group bg-[#222] p-12 text-white rounded-xl">
            <i className="fa-solid fa-phone text-[#f5b754] text-5xl group-hover:text-black transition"></i>
            <h4 className="text-2xl xl:text-4xl mt-8 mb-2 font-semibold">{t.contact.phoneLabel}</h4>
            <p className="text-[#999] group-hover:text-black">{settings.phone || "—"}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="lg:px-[12%] px-[8%] bg-[#1b1b1b] pt-[120px] pb-[150px]">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-white text-3xl font-semibold mb-8 text-center">
              {t.contact.formTitle}
            </h2>

            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={t.contact.namePlaceholder}
                  className="bg-[#222] text-white px-6 py-5 rounded-md outline-none"
                />
                <input
                  type="email"
                  placeholder="Email*"
                  className="bg-[#222] text-white px-6 py-5 rounded-md outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={t.contact.phonePlaceholder}
                  className="bg-[#222] text-white px-6 py-5 rounded-md outline-none"
                />
                <input
                  type="text"
                  placeholder={t.contact.subjectPlaceholder}
                  className="bg-[#222] text-white px-6 py-5 rounded-md outline-none"
                />
              </div>

              <textarea
                rows="5"
                placeholder={t.contact.messagePlaceholder}
                className="bg-[#222] text-white px-6 py-5 rounded-md w-full outline-none"
              ></textarea>

              <button
                type="button"
                className="bg-[#f5b754] hover:bg-[#e2a944] text-black px-14 py-4 text-xl rounded-full transition"
              >
                {t.contact.sendBtn}
              </button>
            </form>
          </div>

          {/* Map */}
          {settings.mapEmbedSrc && (
            <div className="w-full h-[400px] rounded-2xl overflow-hidden">
              <iframe
                className="w-full h-full"
                title="Map"
                src={settings.mapEmbedSrc}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Contact;
