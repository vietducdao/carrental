import React from "react";
function Contact() {
  return (
    <>
      <div className="banner-section relative contact-banner flex justify-center items-center">
        <div className="banner-section-content text-center z-10">
          <h6 className="uppercase text-[#f5b754]"> Get In Touch </h6>
          <h1 className="text-5xl font-semibold font-bricolage text-white">
            {" "}
            <span className="text-[#f5b754]  ">Contact</span> Us
          </h1>
        </div>
      </div>

      <div className="contact-wrapper lg:px-[12%] px-[8%] bg-[#1b1b1b] pb-[150px]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <div className="contact-item w-full group overflow-hidden relative bg-[#222] cursor-pointer p-12 text-white rounded-xl">
            <i className="fa-solid fa-envelope text-[#f5b754] text-5xl group-hover:text-black transition-colors duration-300 "></i>
            <h4 className="font-bricolage text-2xl xl:text-4xl font-semibold mt-8 mb-2 ">
              Email Us
            </h4>
            <p className="text-[#999] text-base xl:text-xl group-hover:text-black">
              {" "}
              vietd4220@gmail.com
            </p>
            <i className="fa-solid fa-envelope contact-item-icon"></i>
          </div>
          <div className="contact-item w-full group overflow-hidden relative bg-[#222222] p-12 text-white rounded-xl">
            <i className="fa-solid fa-location-dot text-[#f5b754] text-5xl group-hover:text-black transition-colors duration-300 "></i>

            <h4 className="font-bricolage text-2xl xl:text-4xl font-semibold mt-8 mb-2 ">
              Our Address
            </h4>
            <p className="text-[#999] text-base xl:text-xl group-hover:text-black">
              {" "}
              25b, 61 Alley, Yen Hoa, Hanoi
            </p>
            <i className="fa-solid fa-location-dot contact-item-icon"></i>
          </div>
          <div className="contact-item w-full group overflow-hidden relative bg-[#222222] cursor-pointer p-12 text-white rounded-xl">
            <i className="fa-solid fa-clock text-[#f5b754] text-5xl group-hover:text-black transition-colors duration-300 "></i>
            <h4 className="font-bricolage text-2xl xl:text-4xl font-semibold mt-8 mb-2 ">
              Opening Hours
            </h4>
            <p className="text-[#999] text-base xl:text-xl group-hover:text-black">
              {" "}
              Mon-Sun: 8 AM - 7 PM
            </p>
            <i className="fa-solid fa-clock contact-item-icon"></i>
          </div>
          <div className="contact-item w-full group overflow-hidden relative bg-[#222222] cursor-pointer p-12 text-white rounded-xl">
            <i className="fa-solid fa-phone text-[#f5b754] text-5xl group-hover:text-black transition-colors duration-300 "></i>
            <h4 className="font-bricolage text-2xl xl:text-4xl font-semibold mt-8 mb-2 ">
              Call Us
            </h4>
            <p className="text-[#999] text-base xl:text-xl group-hover:text-black">
              {" "}
              +84786783493
            </p>
            <i className="fa-solid fa-phone contact-item-icon"></i>
          </div>
        </div>
      </div>
      <div className="lg:px-[12%] px-[8%] bg-[#1b1b1b] pt-[120px] pb-[150px]">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-white text-3xl font-semibold mb-8 text-center">
              Get In Touch
            </h2>
            <form className="space-y-5 contact-inputs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name*"
                  className="bg-[#222222] text-white placeholder-gray-400 rounded-md px-6 py-5 w-full outline-none"
                />
                <input
                  type="email"
                  placeholder="Your Email*"
                  className="bg-[#222222] text-white placeholder-gray-400 rounded-md px-6 py-5 w-full outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Number*"
                  className="bg-[#222222] text-white placeholder-gray-400 rounded-md px-6 py-5 w-full outline-none"
                />
                <input
                  type="text"
                  placeholder="Subject*"
                  className="bg-[#222222] text-white placeholder-gray-400 rounded-md px-6 py-5 w-full outline-none"
                />
              </div>
              <textarea
                rows="5"
                placeholder="Messenger*"
                className="bg-[#222222] text-white placeholder-gray-400 rounded-md px-6 py-5 w-full outline-none"
              ></textarea>
              <button
                type="button"
                className="bg-[#f5b754] hover:bg-[#f5b754] hover:bg-[#e2a944] text-black px-14 py-4 text-xl rounded-full font-normal transition duration-300"
              >
                Submit
              </button>
            </form>
          </div>
          <div className="w-full h-[400px] rounded-2xl overflow-hidden">
            <iframe
              className="w-full h-full"
              title="Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2050.397779567293!2d105.79532313441108!3d21.021429572551195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab5b0270ba8d%3A0xec00219baf0eefff!2zxJDDrG5oIEjhuqEgWcOqbiBRdXnhur90!5e0!3m2!1svi!2s!4v1774889445430!5m2!1svi!2s"
              allowFullScreen
              frameborder="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}
export default Contact;
