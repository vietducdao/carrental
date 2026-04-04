import { useParams } from "react-router-dom";
import { useState } from "react";
import carData from "../../Cars.json";

function CarsDetails() {
  const { id } = useParams();
  const car = carData.find((c) => c.id === id);

  const [openIndex, setOpenindex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccesModal] = useState(false);

  const toggleAccordion = (index) => {
    setOpenindex(openIndex === index ? null : index);
  };

  const rentalConditions = [
    {
      title: "Hợp đồng và giấy tờ",
      description:
        "Cần CMND/CCCD, bằng lái xe và tiền đặt cọc khi ký hợp đồng thuê xe.",
    },
    {
      title: "Thanh toán",
      description:
        "Thanh toán toàn bộ khi thuê, các chi phí phát sinh sẽ được tính thêm.",
    },
    {
      title: "Giao xe",
      description:
        "Miễn phí giao xe trong khu vực, ngoài khu vực sẽ tính phí vận chuyển.",
    },
    {
      title: "Vi phạm giao thông",
      description:
        "Người thuê chịu trách nhiệm với các lỗi vi phạm giao thông.",
    },
  ];

  if (!car)
    return (
      <div className="text-white text-center mt-20">Không tìm thấy xe</div>
    );

  return (
    <>
      {/* Banner */}
      <div className="bg-[#121212] text-white">
        <div
          className="relative h-[70vh] bg-cover bg-center flex items-end px-[12%] py-20"
          style={{ backgroundImage: `url(${car.image})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10">
            <h6 className="uppercase text-[#f5b754] font-bold">XE CAO CẤP</h6>
            <h1 className="text-4xl font-bold">{car.name}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-10 px-[12%] py-14 bg-[#121212] text-white">
        {/* LEFT */}
        <div className="flex-1 space-y-10">
          <section>
            <h2 className="text-xl font-bold mb-4">Thông tin chung</h2>
            <p className="text-gray-400 text-sm mb-4">
              Trải nghiệm dịch vụ thuê xe cao cấp với chất lượng hàng đầu.
            </p>

            <ul className="space-y-2 text-sm text-gray-300">
              <li className="hover:text-[#f5b754] transition">✔ Hỗ trợ 24/7</li>
              <li className="hover:text-[#f5b754] transition">
                ✔ Hủy miễn phí
              </li>
              <li className="hover:text-[#f5b754] transition">
                ✔ Thanh toán khi nhận xe
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Điều kiện thuê xe</h2>

            {rentalConditions.map((item, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] rounded-xl overflow-hidden"
              >
                <div
                  onClick={() => toggleAccordion(index)}
                  className="cursor-pointer px-4 py-3 flex justify-between items-center
                             hover:bg-[#2a2a2a] transition"
                >
                  <span>
                    {index + 1}. {item.title}
                  </span>
                  <span className="text-[#f5b754]">
                    {openIndex === index ? "▲" : "▼"}
                  </span>
                </div>

                <div
                  className={`px-4 text-sm text-gray-400 transition-all duration-300 ${
                    openIndex === index
                      ? "max-h-[200px] py-3"
                      : "max-h-0 overflow-hidden"
                  }`}
                >
                  {item.description}
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-[300px] bg-[#1a1a1a] p-6 rounded-xl shadow-lg">
          <p className="text-xl text-[#f5b754] font-bold text-center">
            ${car.price} / ngày
          </p>

          <ul className="mt-4 text-sm space-y-2 text-gray-300">
            <li>Số cửa: {car.door}</li>
            <li>Số chỗ: {car.passengers}</li>
            <li>Hộp số: {car.transmission}</li>
            <li>Hành lý: {car.bags}</li>
            <li>Điều hòa: Có</li>
            <li>Tuổi: 25+</li>
          </ul>

          <button
            onClick={() => setShowModal(true)}
            className="mt-5 w-full bg-[#f5b754] text-black py-2 rounded
                       hover:bg-[#e5a944] hover:scale-105
                       transition duration-300 font-bold"
          >
            Thuê ngay
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#121212] p-6 rounded-xl w-[400px] text-white shadow-xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Đặt xe</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl hover:text-red-500 transition"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowModal(false);
                setShowSuccesModal(true);
              }}
              className="space-y-3"
            >
              <input
                placeholder="Họ và tên"
                className="w-full p-2 bg-black text-white rounded border border-gray-600 focus:outline-none focus:border-[#f5b754]"
                required
              />
              <input
                placeholder="Email"
                className="w-full p-2 bg-black text-white rounded border border-gray-600"
                required
              />
              <input
                placeholder="Số điện thoại"
                className="w-full p-2 bg-black text-white rounded border border-gray-600"
                required
              />

              <button className="w-full bg-[#f5b754] py-2 rounded text-black font-bold hover:bg-[#e5a944] transition">
                Xác nhận đặt xe
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm">
          <div className="bg-green-500 p-6 rounded-xl text-black text-center shadow-lg">
            <h2 className="text-xl font-bold">Thành công!</h2>
            <p className="mt-2">Bạn đã đặt xe thành công.</p>

            <button
              onClick={() => setShowSuccesModal(false)}
              className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CarsDetails;
