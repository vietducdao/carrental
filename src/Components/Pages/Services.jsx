import React from "react";

function Services() {
  return (
    <>
      {/* Page Section */}
      <div className="banner-section about-banner-section flex justify-center  text-[#f5b754] items-center">
        <div className="banner-section-content text-center z-10">
          <h6 className="uppercase">- Chúng Tôi Làm Gì</h6>
          <h1 className="text-5xl font-semibold font-bricolage text-[#f5b754]">
            <span className="font-bricolage text-white">Để </span> Phục Vụ Bạn
          </h1>
        </div>
      </div>
      {/* Service Container */}

      <div className="service-container lg:px-[12%] px-[8%] py-[150px] bg-[#1b1b1b]">
        <div className="grid w-full gap-12 grid-cols-1 lg:grid-cols-3">
          {/* card 1 */}
          <div className="service-item relative text-white rounded-[30px] bg-[#222222] w-full ">
            <h5 className="font-semibold text-2xl mb-3 font-bricolage">
              Dịch vụ thuê xe doanh nghiệp{" "}
            </h5>
            <p className="text-[#999] text-lg">
              Tthuê xe doanh nghiệp hỗ trợ các tổ chức, công ty thuê phương tiện
              theo nhu cầu sử dụng dài hạn hoặc theo hợp đồng, giúp tối ưu chi
              phí và quản lý hiệu quả.
            </p>
            <div className="curv">
              <div className="service-item-curv section-item-curv">1.</div>
            </div>
          </div>

          {/* card 2 */}
          <div className="service-item relative text-white rounded-[30px] bg-[#222222] w-full ">
            <h5 className="font-semibold text-2xl mb-3 font-bricolage">
              Dịch Vụ Thuê Xe Có Tài Xế
            </h5>
            <p className="text-[#999] text-lg">
              Thuê xe có tài xế cho phép khách hàng lựa chọn phương tiện kèm
              theo tài xế, phù hợp với nhu cầu di chuyển an toàn, tiện lợi và
              không cần tự lái.
            </p>
            <div className="curv">
              <div className="service-item-curv section-item-curv"> 2.</div>
            </div>
          </div>

          {/* card 3 */}
          <div className="service-item relative text-white rounded-[30px] bg-[#222222] w-full ">
            <h5 className="font-semibold text-2xl mb-3 font-bricolage">
              Dịch Vụ Đưa Đón Tại Sân Bay
            </h5>
            <p className="text-[#999] text-lg">
              Đưa đón sân bay cho phép khách hàng đặt xe di chuyển giữa sân bay
              và các địa điểm theo yêu cầu, đảm bảo đúng giờ, thuận tiện và an
              toàn.
            </p>
            <div className="curv">
              <div className="service-item-curv section-item-curv"> 3.</div>
            </div>
          </div>

          {/* card 4 */}
          <div className="service-item relative text-white rounded-[30px] bg-[#222222] w-full ">
            <h5 className="font-semibold text-2xl mb-3 font-bricolage">
              Đặt Thuê Nhiều Xe Cùng Lúc
            </h5>
            <p className="text-[#999] text-lg">
              Cho phép khách hàng (cá nhân hoặc doanh nghiệp) đặt nhiều phương
              tiện cùng lúc, đáp ứng nhu cầu tổ chức sự kiện, du lịch hoặc vận
              chuyển quy mô lớn.
            </p>
            <div className="curv">
              <div className="service-item-curv section-item-curv"> 4.</div>
            </div>
          </div>

          {/* card 5 */}
          <div className="service-item relative text-white rounded-[30px] bg-[#222222] w-full ">
            <h5 className="font-semibold text-2xl mb-3 font-bricolage">
              Dành Cho Khách VIP (comming soon!)
            </h5>
            <p className="text-[#999] text-lg">
              Chức năng dành cho khách VIP cung cấp các dịch vụ cao cấp với ưu
              đãi đặc biệt, hỗ trợ riêng và trải nghiệm tốt hơn cho người dùng
              có nhu cầu cao.
            </p>
            <div className="curv">
              <div className="service-item-curv section-item-curv"> 5.</div>
            </div>
          </div>

          {/* card 6 */}
          <div className="service-item relative text-white rounded-[30px] bg-[#222222] w-full ">
            <h5 className="font-semibold text-2xl mb-3 font-bricolage">
              Cho Thuê Xe Doanh Nghiệp
            </h5>
            <p className="text-[#999] text-lg">
              Dịch vụ cho thuê xe doanh nghiệp hỗ trợ các tổ chức, công ty thuê
              phương tiện theo nhu cầu dài hạn hoặc theo hợp đồng, giúp tối ưu
              chi phí và nâng cao hiệu quả quản lý.
            </p>
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
            Chúng Tôi Làm Gì
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 font-bricolage">
            Để Phục Vụ Khách Hàng
          </h2>
        </div>
        <div className="our-service-wrapper">
          <div className="grid w-full gap-12 grid-cols-1 lg:grid-cols-3">
            <div className="service-item relative text-white rounded-[30px] bg-[#222222] w-full ">
              <h5 className="font-semibold text-2xl mb-3 font-bricolage">
                Thuê Xe Theo Ngày
              </h5>
              <p className="text-[#999] text-lg">
                Cho thuê xe theo ngày cho phép khách hàng lựa chọn phương tiện
                và thời gian thuê cụ thể theo ngày, phù hợp với nhu cầu di
                chuyển ngắn hạn.
              </p>
              <div className="curv">
                <div className="service-item-curv section-item-curv">1.</div>
              </div>
            </div>

            <div className="service-item relative text-white rounded-[30px] bg-[#222222] w-full">
              <h5 className="font-semibold text-2xl mb-3 font-bricolage">
                Thuê Xe Theo Tháng
              </h5>
              <p className="text-[#999] text-lg">
                Dịch vụ thuê xe với thời gian trên 1 tháng được chúng tôi xếp
                vào nhóm dịch vụ cho thuê xe dài hạn. Đây là dịch vụ chủ lực của
                chúng tôi, được cung cấp cho cả khách hàng cá nhân và khách hàng
                doanh nghiệp.
              </p>
              <div className="curv">
                <div className="service-item-curv section-item-curv">2.</div>
              </div>
            </div>

            <div className="service-item relative text-white rounded-[30px] bg-[#222222] w-full">
              <h5 className="font-semibold text-2xl mb-3 font-bricolage">
                Cho Thuê Xe Cưới
              </h5>
              <p className="text-[#999] text-lg">
                Xe cưới cũng là yếu tố quan trọng giúp đám cưới của bạn thêm
                phần hoàn hảo hơn. Là phương tiện cực kì quan trọng trong ngày
                cưới, chính vì thế xe cưới được rất nhiều cô dâu, chú rể quan
                tâm và đầu tư nhiều hơn(Công ty chúng tôi không nhận trang trí
                xe cưới).
              </p>
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
