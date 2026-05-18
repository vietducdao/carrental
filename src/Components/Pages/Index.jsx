import React, { useState, useEffect } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { Pagination, Autoplay } from "swiper/modules";

import about from "../../assets/about.jpg";
import api, { BASE_URL } from "../../utils/api";
import carType1 from "../../assets/car-1.jpg";
import carType2 from "../../assets/car-2.jpg";
import carType3 from "../../assets/car-3.jpg";
import carType4 from "../../assets/car-4.jpg";
import carType5 from "../../assets/car-5.jpg";
import carType6 from "../../assets/car-6.jpg";

import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import BookOption from "../BookOption";

function Index() {
  const { t } = useLanguage();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [services, setServices] = useState([]);
  useEffect(() => {
    api.get("/api/cars?limit=8&sort=newest")
      .then((r) => setCars(r.data.cars || []))
      .catch(() => setCars([]));
    api.get("/api/blog?limit=6&published=true")
      .then((r) => setBlogPosts(r.data.posts || []))
      .catch(() => setBlogPosts([]));
    api.get("/api/testimonials?active=true")
      .then((r) => setTestimonials(r.data.testimonials || []))
      .catch(() => setTestimonials([]));
    api.get("/api/services?active=true&home=true")
      .then((r) => setServices(r.data.services || []))
      .catch(() => setServices([]));
  }, []);

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
                  {settings.heroPremium || t.index.heroPremium}
                </span>
                <h1 className="font-bricolage text-9xl hero-title my-3">
                  {settings.heroTitle || t.index.heroTitle}
                </h1>
                <p className="my-2 text-2xl font-bricolage hero-subtitle text-gray-300">
                  {settings.heroSubtitle || t.index.heroSubtitle}
                </p>
                <p className="my-7 w-[60%] hero-pere text-gray-300">
                  {settings.heroDesc || t.index.heroDesc}
                </p>
                <div className="hero-btns flex gap-4 mt-8 ">
                  <button onClick={() => navigate("/cars")} className="default-btn bg-[#f5b754] transition-all hover:bg-white hover:text-black px-7 py-5 font-bricolage rounded-full transform hover:-translate-y-1">
                    {t.index.heroViewNow} &nbsp;
                    <i className="bi bi-arrow-up-right"></i>
                  </button>
                  <button onClick={() => navigate("/register")} className="default-btn border px-7 py-5 font-bricolage rounded-full transition-all hover:bg-[#f5b754] hover:border-transparent hover:translate-y-1">
                    {t.index.heroRegister}
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
                  {settings.heroPremium || t.index.heroPremium}
                </span>
                <h1 className="font-bricolage text-9xl hero-title my-3">
                  {settings.heroTitle || t.index.heroTitle}
                </h1>
                <p className="my-2 text-2xl font-bricolage hero-subtitle text-gray-300">
                  {settings.heroSubtitle || t.index.heroSubtitle}
                </p>
                <p className="my-7 w-[60%] hero-pere text-gray-300">
                  {settings.heroDesc || t.index.heroDesc}
                </p>
                <div className="hero-btns flex gap-4 mt-8 ">
                  <button onClick={() => navigate("/cars")} className="default-btn bg-[#f5b754] transition-all hover:bg-white hover:text-black px-7 py-5 font-bricolage rounded-full transform hover:-translate-y-1">
                    {t.index.heroViewNow} &nbsp;
                    <i className="bi bi-arrow-up-right"></i>
                  </button>
                  <button onClick={() => navigate("/register")} className="default-btn border px-7 py-5 font-bricolage rounded-full transition-all hover:bg-[#f5b754] hover:border-transparent hover:translate-y-1">
                    {t.index.heroRegister}
                    <i className="bi bi-arrow-up-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
          {/* slide 3 */}
          <SwiperSlide>
            <div className="hero-slide hero-slide2 w-full h-full flex items-center px-[12%]">
              <div className="hero-content text-white ">
                <span className="font-bricolage text-1xl uppercase tracking-widest">
                  {settings.heroPremium || t.index.heroPremium}
                </span>
                <h1 className="font-bricolage text-9xl hero-title my-3">
                  {settings.heroTitle || t.index.heroTitle}
                </h1>
                <p className="my-2 text-2xl font-bricolage hero-subtitle text-gray-300">
                  {settings.heroSubtitle || t.index.heroSubtitle}
                </p>
                <p className="my-7 w-[60%] hero-pere text-gray-300">
                  {settings.heroDesc || t.index.heroDesc}
                </p>
                <div className="hero-btns flex gap-4 mt-8 ">
                  <button onClick={() => navigate("/cars")} className="default-btn bg-[#f5b754] transition-all hover:bg-white hover:text-black px-7 py-5 font-bricolage rounded-full transform hover:-translate-y-1">
                    {t.index.heroViewNow} &nbsp;
                    <i className="bi bi-arrow-up-right"></i>
                  </button>
                  <button onClick={() => navigate("/register")} className="default-btn border px-7 py-5 font-bricolage rounded-full transition-all hover:bg-[#f5b754] hover:border-transparent hover:translate-y-1">
                    {t.index.heroRegister}
                    <i className="bi bi-arrow-up-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
        {/* Book Option */}
        <BookOption floating />
      </div>

      {/* About */}
      <div className="about text-white lg:px-[10%] px-[8%] py-[150px]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="uppercase test-sm tracking-widest text-[#f5b754] mb-2">
              {t.index.aboutSub}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-3 font-bricolage ">
              {settings.aboutTitle1 || t.index.aboutTitle1} <br />
              <span className="text-[#f5b754] text-bricolage">
                {settings.aboutTitle2 || t.index.aboutTitle2}
              </span>
            </h2>
            <p className="text-gray-400 leading-realaxed my-6 whitespace-pre-line">
              {settings.aboutDesc || t.index.aboutDesc}
            </p>
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-[#f5b754] ">
                  <i className="ri-check-double-line"></i>
                </div>
                <span className="text-white">{settings.aboutFeature1 || t.index.aboutFeature1}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-[#f5b754] ">
                  <i className="ri-check-double-line"></i>
                </div>
                <span className="text-white">{settings.aboutFeature2 || t.index.aboutFeature2}</span>
              </div>
            </div>

            <button onClick={() => navigate("/about")} className="bg-[#f5b754] text-black px-8 py-4 rounded-full font-medium flex items-center gap-2 hover:bg-white transition">
              {t.index.aboutReadMore} <i className="ri-arrow-right-line"></i>
            </button>
          </div>
          <div className="relative">
            <img src={about} alt="" className="rounded-3xl" />
            <div className="curv">
              <div className="about-item-curv section-item-curv">
                <i className="ri-play-line text-xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="banner text-white lg:px-[10%] px-[8%] py-[150px] ">
        <div className="banner-content text-center">
          <p className="uppercase test-sm tracking-widest text-[#f5b754] mb-2">
            {t.index.bookBannerSub}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 font-bricolage ">
            {t.index.bookBannerTitle}
          </h2>

          {/* Book Option */}
          <BookOption floating />
        </div>
      </div>

      {/* Luxury Cars */}
      <div className="luxury-cars py-[150px]">
        <div className="text-center">
          <p className="uppercase test-sm tracking-widest text-[#f5b754] mb-2">
            {t.index.luxurySub}
          </p>
          <h2 className="text-4xl text-white md:text-5xl font-bold mb-3 font-bricolage ">
            {t.index.luxuryTitle1}
            <span className="text-[#f5b754] text-bricolage">
              {" "}
              {t.index.luxuryTitle2}
            </span>
          </h2>
        </div>
        <Swiper
          modules={[Autoplay]}
          slidesPerView={2}
          spaceBetween={20}
          loop={true}
          centeredSlides={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          speed={1500}
          className="mt-[60px] custome-swiper"
        >
          {cars.map((car) => {
            const imgSrc = car.image ? `${BASE_URL}/uploads/${car.image}` : null;
            return (
              <SwiperSlide
                key={car._id}
                className="transition-opacity duration-500"
              >
                <div className="bg-[#292929] rounded-2xl overflow-hidden">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-[280px] object-cover"
                    />
                  ) : (
                    <div className="w-full h-[280px] bg-gray-800 flex items-center justify-center text-gray-600">
                      No image
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-2xl font-semibold text-white font-bricolage">
                      {car.make} {car.model}
                    </h3>
                    <div className="flex items-center gap-4 text-sm mt-3 text-gray-300">
                      <span><i className="text-[#f5b750] bi bi-calendar2 mr-1"></i>{car.year}</span>
                      <span><i className="text-[#f5b750] bi bi-person-gear mr-1"></i>{car.seats}</span>
                      <span><i className="text-[#f5b750] bi bi-diagram-3 mr-1"></i>{car.transmission}</span>
                      <span><i className="text-[#f5b750] bi bi-fuel-pump mr-1"></i>{car.fuelType}</span>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <Link to={`/car/${car._id}`}>
                        <button className="bg-[#f5b754] text-black px-4 py-2 rounded-full text-sm hover:bg-[#f5b754]/90 transition">
                          {t.index.carDescBtn}
                        </button>
                      </Link>
                      <p className="text-[#f5b754] font-bold text-lg">
                        ${car.dailyRate}
                        <span className="text-sm text-white">{t.index.carTypeSub === "Choose Your Car" ? "/Day" : "/Ngày"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Car Type */}
      <div className="car-type lg:px-[12%] px-[8%] py-[150px] section-effect">
        <div className="text-center">
          <p className="uppercase test-sm tracking-widest text-[#f5b754] mb-2">
            {t.index.carTypeSub}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 font-bricolage ">
            {t.index.carTypeTitle1}
            <span className="text-[#f5b754] text-bricolage">
              {" "}
              {t.index.carTypeTitle2}
            </span>
          </h2>
        </div>
        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          spaceBetween={20}
          autoplay={{ delay: 3000 }}
          pagination={true}
          breakpoints={{
            0: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="mt-[70px]"
        >
          <SwiperSlide>
            <div onClick={() => navigate("/cars?category=SUV")} className="car-type relative rounded-2xl overflow-hidden group shadow-md cursor-pointer">
              <img src={carType1} alt="" className="w-full h-72 object-cover z-[5]" />
              <h3 className="absolute top-4 left-4 text-white text-2xl font-semibold drop-shadow-md z-[5]">SUVs</h3>
              <div className="absolute z-[5]">
                <div className="curv">
                  <div className="section-item-curv car-type-curv">
                    <i className="bi bi-arrow-up-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div onClick={() => navigate("/cars?category=Convertible")} className="car-type relative rounded-2xl overflow-hidden group shadow-md cursor-pointer">
              <img src={carType2} alt="" className="w-full h-72 object-cover z-[5]" />
              <h3 className="absolute top-4 left-4 text-white text-2xl font-semibold drop-shadow-md z-[5]">{t.index.carTypeConvertible}</h3>
              <div className="absolute z-[5]">
                <div className="curv">
                  <div className="section-item-curv car-type-curv">
                    <i className="bi bi-arrow-up-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div onClick={() => navigate("/cars?category=Sport")} className="car-type relative rounded-2xl overflow-hidden group shadow-md cursor-pointer">
              <img src={carType3} alt="" className="w-full h-72 object-cover z-[5]" />
              <h3 className="absolute top-4 left-4 text-white text-2xl font-semibold drop-shadow-md z-[5]">{t.index.carTypeSport}</h3>
              <div className="absolute z-[5]">
                <div className="curv">
                  <div className="section-item-curv car-type-curv">
                    <i className="bi bi-arrow-up-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div onClick={() => navigate("/cars?category=Luxury")} className="car-type relative rounded-2xl overflow-hidden group shadow-md cursor-pointer">
              <img src={carType4} alt="" className="w-full h-72 object-cover z-[5]" />
              <h3 className="absolute top-4 left-4 text-white text-2xl font-semibold drop-shadow-md z-[5]">{t.index.carTypeLuxury}</h3>
              <div className="absolute z-[5]">
                <div className="curv">
                  <div className="section-item-curv car-type-curv">
                    <i className="bi bi-arrow-up-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div onClick={() => navigate("/cars?category=Sedan")} className="car-type relative rounded-2xl overflow-hidden group shadow-md cursor-pointer">
              <img src={carType5} alt="" className="w-full h-72 object-cover z-[5]" />
              <h3 className="absolute top-4 left-4 text-white text-2xl font-semibold drop-shadow-md z-[5]">Sedan</h3>
              <div className="absolute z-[5]">
                <div className="curv">
                  <div className="section-item-curv car-type-curv">
                    <i className="bi bi-arrow-up-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div onClick={() => navigate("/cars?category=Hatchback")} className="car-type relative rounded-2xl overflow-hidden group shadow-md cursor-pointer">
              <img src={carType6} alt="" className="w-full h-72 object-cover z-[5]" />
              <h3 className="absolute top-4 left-4 text-white text-2xl font-semibold drop-shadow-md z-[5]">{t.index.carTypeSmall}</h3>
              <div className="absolute z-[5]">
                <div className="curv">
                  <div className="section-item-curv car-type-curv">
                    <i className="bi bi-arrow-up-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Service */}
      <div className="our-service lg:px-[12%] px-[8%] py-[150px] bg-[#1b1b1b] section-effect">
        <div className="our-service-content mb-20 text-center text-white">
          <p className="uppercase text-sm tracking-[5px] text-[#f5b754] mb-2 ">
            {t.index.serviceSub}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 font-bricolage">
            {t.index.serviceTitle}
          </h2>
        </div>
        {services.length > 0 && (
          <div className="our-service-wrapper">
            <div className="grid w-full gap-12 grid-cols-1 lg:grid-cols-3">
              {services.slice(0, 3).map((s, idx) => (
                <div key={s._id} className="service-item relative text-white rounded-[30px] bg-[#222222] w-full">
                  {s.icon && <div className="text-3xl mb-3">{s.icon}</div>}
                  <h5 className="font-semibold text-2xl mb-3 font-bricolage">{s.title}</h5>
                  <p className="text-[#999] text-lg whitespace-pre-line">{s.description}</p>
                  <div className="curv">
                    <div className="service-item-curv section-item-curv">{idx + 1}.</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Testimonials */}
      <div className="Testimonials lg:px-[12%] px-[8%] py-[150px] bg-[#1b1b1b] section-effect">
        <div className="our-service-content mb-20 text-center text-white">
          <p className="uppercase text-sm tracking-[5px] text-[#f5b754] mb-2 ">
            {t.index.testSub}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 font-bricolage">
            {t.index.testTitle1}
            <span className="text-[#f5b754] font-bricolage"> {t.index.testTitle2}</span>
          </h2>
        </div>
        {testimonials.length > 0 && (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            pagination={{ clickable: true }}
            loop={testimonials.length > 2}
            autoplay={{ delay: 3000 }}
            breakpoints={{
              0: { slidesPerView: 1 },
              1024: { slidesPerView: Math.min(testimonials.length, 2) },
              1400: { slidesPerView: Math.min(testimonials.length, 3) },
            }}
          >
            {testimonials.map((item) => {
              const avatarSrc = item.avatar ? `${BASE_URL}/uploads/${item.avatar}` : null;
              return (
                <SwiperSlide key={item._id}>
                  <div className="rounded-[30px] bg-[#222] text-left p-8 shadow-md h-full flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-7xl text-[#f4a950] mr-4">"</span>
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < (item.rating || 5) ? "text-[#f4a950]" : "text-gray-600"}>★</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-[#ccc] text-lg mb-6">{item.review}</div>
                    <div className="flex items-center mt-6">
                      <div className="curv">
                        <div className="section-item-curv test-curv">
                          {avatarSrc ? (
                            <img src={avatarSrc} alt={item.name} className="rounded-full mr-4 w-16 h-16 object-cover" />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f5b754] to-amber-600 flex items-center justify-center text-black font-bold text-xl mr-4">
                              {item.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ps-[100px]">
                        <p className="semi-bold font-bricolage text-[#f5b754]">{item.name}</p>
                        <p className="text-[#999] text-sm">{item.role || t.index.testRole}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>

      {/* Blogs */}
      <div className="blog lg:px-[12%] px-[8%] py-[150px] bg-[#1b1b1b] section-effect">
        <div className="blog-content mb-20 text-center text-white">
          <p className="uppercase text-sm tracking-[5px] text-[#f5b754] mb-2 ">
            {t.index.blogSub}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 font-bricolage">
            {t.index.blogTitle1}
            <span className="text-[#f5b754] font-bricolage"> {t.index.blogTitle2}</span>
          </h2>
        </div>
        {blogPosts.length > 0 && (
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            loop={blogPosts.length > 2}
            pagination={{ clickable: true }}
            breakpoints={{
              0: { slidesPerView: Math.min(blogPosts.length, 2) },
              1280: { slidesPerView: Math.min(blogPosts.length, 3) },
            }}
          >
            {blogPosts.map((post) => {
              const imgSrc = post.image ? `${BASE_URL}/uploads/${post.image}` : null;
              const date = new Date(post.createdAt).toLocaleDateString("vi-VN");
              return (
                <SwiperSlide key={post._id}>
                  <div className="group rounded-2xl overflow-hidden bg-transparent transition-all duration-300">
                    {imgSrc ? (
                      <img src={imgSrc} alt={post.title} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-104" />
                    ) : (
                      <div className="w-full h-64 bg-[#1d1d1d] flex items-center justify-center text-gray-600">
                        <i className="ri-image-line text-3xl"></i>
                      </div>
                    )}
                    <div className="-mt-8 px-5">
                      <div className="relative bg-[#1d1d1d] text-white p-5 rounded-2xl shadow-md z-10 transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl flex flex-col justify-between">
                        <span className="absolute -top-4 left-5 bg-[#f4a950] text-black text-xs font-semibold px-3 py-1 rounded-md shadow-md">{date}</span>
                        <div className="text-xs text-[#f4a950] mb-2 mt-2 flex gap-4 items-center">
                          <span className="flex items-center gap-1"><i className="ri-user-line text-sm"></i> {post.author}</span>
                          <span className="flex items-center gap-1"><i className="ri-folder-line text-sm"></i> {post.category}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-white leading-snug mb-3">
                          <Link to="/blog" className="hover:text-[#f4a950] transition-colors duration-300">{post.title}</Link>
                        </h3>
                        <Link to="/blog" className="w-10 h-10 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 rounded-full border border-[#f4a950] flex items-center justify-center transition-all duration-500 hover:bg-[#f4a950]">
                          <i className="ri-arrow-right-up-line text-[#f5b754] transition duration-300"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </>
  );
}

export default Index;
