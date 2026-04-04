import React from "react";

function Contact() {
  return (
    <>
      {/* Banner */}
      <div className="banner-section relative contact-banner flex justify-center items-center">
        <div className="banner-section-content text-center z-10">
          <h6 className="uppercase text-[#f5b754]">Liên Hệ Ngay</h6>
          <h1 className="text-5xl font-semibold font-bricolage text-white">
            <span className="text-[#f5b754]">Với</span> Chúng Tôi
          </h1>
        </div>
      </div>

      {/* Info */}
      <div className="contact-wrapper lg:px-[12%] px-[8%] bg-[#1b1b1b] pb-[150px]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {/* Email */}
          <div className="contact-item group bg-[#222] p-12 text-white rounded-xl">
            <i className="fa-solid fa-envelope text-[#f5b754] text-5xl group-hover:text-black transition"></i>
            <h4 className="text-2xl xl:text-4xl mt-8 mb-2 font-semibold">
              Email
            </h4>
            <p className="text-[#999] group-hover:text-black">
              vietd4220@gmail.com
            </p>
          </div>

          {/* Address */}
          <div className="contact-item group bg-[#222] p-12 text-white rounded-xl">
            <i className="fa-solid fa-location-dot text-[#f5b754] text-5xl group-hover:text-black transition"></i>
            <h4 className="text-2xl xl:text-4xl mt-8 mb-2 font-semibold">
              Địa chỉ
            </h4>
            <p className="text-[#999] group-hover:text-black">
              Yên Hòa, Cầu Giấy, Hà Nội
            </p>
          </div>

          {/* Time */}
          <div className="contact-item group bg-[#222] p-12 text-white rounded-xl">
            <i className="fa-solid fa-clock text-[#f5b754] text-5xl group-hover:text-black transition"></i>
            <h4 className="text-2xl xl:text-4xl mt-8 mb-2 font-semibold">
              Giờ làm việc
            </h4>
            <p className="text-[#999] group-hover:text-black">
              Thứ 2 - Chủ nhật: 8:00 - 19:00
            </p>
          </div>

          {/* Phone */}
          <div className="contact-item group bg-[#222] p-12 text-white rounded-xl">
            <i className="fa-solid fa-phone text-[#f5b754] text-5xl group-hover:text-black transition"></i>
            <h4 className="text-2xl xl:text-4xl mt-8 mb-2 font-semibold">
              Điện thoại
            </h4>
            <p className="text-[#999] group-hover:text-black">0786783493</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="lg:px-[12%] px-[8%] bg-[#1b1b1b] pt-[120px] pb-[150px]">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-white text-3xl font-semibold mb-8 text-center">
              Gửi thông tin liên hệ
            </h2>

            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Họ và tên*"
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
                  placeholder="Số điện thoại*"
                  className="bg-[#222] text-white px-6 py-5 rounded-md outline-none"
                />
                <input
                  type="text"
                  placeholder="Tiêu đề*"
                  className="bg-[#222] text-white px-6 py-5 rounded-md outline-none"
                />
              </div>

              <textarea
                rows="5"
                placeholder="Nội dung*"
                className="bg-[#222] text-white px-6 py-5 rounded-md w-full outline-none"
              ></textarea>

              <button
                type="button"
                className="bg-[#f5b754] hover:bg-[#e2a944] text-black px-14 py-4 text-xl rounded-full transition"
              >
                Gửi liên hệ
              </button>
            </form>
          </div>

          {/* Map */}
          <div className="w-full h-[400px] rounded-2xl overflow-hidden">
            <iframe
              className="w-full h-full"
              title="Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2050.397779567293!2d105.79532313441108!3d21.021429572551195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab5b0270ba8d%3A0xec00219baf0eefff!2zxJDDrG5oIEjhuqEgWcOqbiBRdXnhur90!5e0!3m2!1svi!2s!4v1774889445430!5m2!1svi!2s"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
