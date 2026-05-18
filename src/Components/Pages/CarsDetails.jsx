import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShoppingCart } from "lucide-react";
import api, { BASE_URL } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";

function CarsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const rentalConditions = t.carDetails.conditions;

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pickupDate, setPickupDate] = useState(searchParams.get("pickDate") || "");
  const [returnDate, setReturnDate] = useState(searchParams.get("returnDate") || "");
  const [sameDayReturn, setSameDayReturn] = useState(false);
  const prefillPickLocation = searchParams.get("pickLocation") || "";
  const prefillDropLocation = searchParams.get("dropLocation") || "";

  useEffect(() => {
    api.get(`/api/cars/${id}`)
      .then((r) => setCar(r.data.car))
      .catch(() => toast.error("Không tìm thấy xe"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRentNow = () => {
    if (!isAuthenticated) {
      toast.info(t.carDetails.loginRequired);
      navigate("/login");
      return;
    }
    setShowModal(true);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!pickupDate) return toast.error(t.carDetails.selectDatesError);
    const effectiveReturn = sameDayReturn ? pickupDate : returnDate;
    if (!effectiveReturn) return toast.error(t.carDetails.selectDatesError);
    if (!sameDayReturn) {
      const pickup = new Date(pickupDate);
      const ret = new Date(returnDate);
      if (ret <= pickup) return toast.error(t.carDetails.returnAfterPickup);
    }
    addToCart(car, pickupDate, effectiveReturn, prefillPickLocation, prefillDropLocation, sameDayReturn);
    setShowModal(false);
    toast.success(t.carDetails.addedToCart);
    navigate("/cart");
  };

  if (loading) return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f5b754]" />
    </div>
  );

  if (!car) return <div className="text-white text-center mt-20 bg-[#121212] min-h-screen pt-20">{t.carDetails.carNotFound}</div>;

  const imgSrc = car.image ? `${BASE_URL}/uploads/${car.image}` : null;
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      {/* Banner */}
      <div className="bg-[#121212] text-white">
        <div
          className="relative h-[70vh] bg-cover bg-center flex items-end px-[12%] py-20"
          style={{ backgroundImage: imgSrc ? `url(${imgSrc})` : "none", backgroundColor: imgSrc ? undefined : "#1a1a1a" }}
        >
          <div className="absolute inset-0 cars-det-section" />
          <div className="relative z-10 text-white">
            <h6 className="uppercase text-[#f5b754] font-bold">{car.category || t.carDetails.category}</h6>
            <h1 className="text-4xl font-bold font-bricolage">{car.make} {car.model}</h1>
            <p className="text-gray-300 mt-1">{car.year} • {car.seats} {t.carDetails.seatsUnit}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#121212] flex flex-col lg:flex-row gap-10 px-[12%] py-14 text-white">
        {/* LEFT */}
        <div className="flex-1 space-y-10">
          <section>
            <h2 className="text-xl font-bold mb-4">{t.carDetails.generalInfo}</h2>
            <p className="text-gray-400 text-sm mb-4">{t.carDetails.generalDesc}</p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center hover:text-[#f5b754] transition"><i className="ri-check-line text-[#f5b754] mr-2" />{t.carDetails.support}</li>
              <li className="flex items-center hover:text-[#f5b754] transition"><i className="ri-check-line text-[#f5b754] mr-2" />{t.carDetails.freeCancellation}</li>
              <li className="flex items-center hover:text-[#f5b754] transition"><i className="ri-check-line text-[#f5b754] mr-2" />{t.carDetails.payOnArrival}</li>
            </ul>
          </section>

          {car.description && (
            <section>
              <h2 className="text-xl font-bold mb-4">{t.carDetails.descriptionLabel}</h2>
              <div className="bg-[#1a1a1a] rounded-xl p-5 border border-gray-800">
                <p className="text-gray-300 text-sm leading-relaxed italic">"{car.description}"</p>
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xl font-bold mb-4">{t.carDetails.rentalConditions}</h2>
            <div className="space-y-4">
              {rentalConditions.map((item, index) => (
                <div key={index} className="bg-[#1a1a1a] rounded-xl overflow-hidden">
                  <div
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="cursor-pointer px-6 py-4 flex justify-between items-center hover:bg-[#2a2a2a] transition duration-300"
                  >
                    <span className="font-medium text-white text-sm">{index + 1}. {item.title}</span>
                    <i className={`ri-arrow-${openIndex === index ? "up" : "down"}-s-line text-[#f5b754]`}></i>
                  </div>
                  <div className={`px-6 text-sm text-gray-400 overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? "max-h-[200px] py-3" : "max-h-0"}`}>
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT — Booking card */}
        <div className="w-full lg:w-[300px] bg-[#1a1a1a] p-6 rounded-2xl shadow-lg h-fit space-y-5">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#f5b754]">${car.dailyRate} <span className="text-sm text-white font-normal">{t.carDetails.perDay}</span></p>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${
              car.status === "available" ? "bg-green-900/30 text-green-400 border-green-500/30"
              : car.status === "rented" ? "bg-amber-900/30 text-amber-400 border-amber-500/30"
              : car.status === "maintenance" ? "bg-red-900/30 text-red-400 border-red-500/30"
              : "bg-gray-900/30 text-gray-400 border-gray-500/30"
            }`}>
              {t.carDetails[car.status] || t.carDetails.unavailable}
            </span>
          </div>

          <ul className="text-sm space-y-2 text-gray-300">
            <li className="flex justify-between"><span><i className="ri-user-line text-[#f5b754] mr-2" />{t.carDetails.seatsLabel}</span><span>{car.seats}</span></li>
            <li className="flex justify-between"><span><i className="ri-settings-2-line text-[#f5b754] mr-2" />{t.carDetails.transmissionLabel}</span><span>{car.transmission}</span></li>
            <li className="flex justify-between"><span><i className="ri-gas-station-line text-[#f5b754] mr-2" />{t.carDetails.fuelLabel}</span><span>{car.fuelType}</span></li>
            <li className="flex justify-between"><span><i className="ri-road-map-line text-[#f5b754] mr-2" />{t.carDetails.mileageLabel}</span><span>{car.mileage?.toLocaleString() || "—"} km</span></li>
            {car.color && <li className="flex justify-between"><span><i className="ri-palette-line text-[#f5b754] mr-2" />{t.carDetails.colorLabel}</span><span>{car.color}</span></li>}
            <li className="flex justify-between"><span><i className="ri-snowflake-line text-[#f5b754] mr-2" />{t.carDetails.acLabel}</span><span>{t.carDetails.yes}</span></li>
          </ul>

          <button
            onClick={handleRentNow}
            disabled={car.status !== "available"}
            className="mt-5 w-full bg-[#f5b754] text-black py-3 rounded-xl hover:bg-[#e5a944] hover:scale-105 transition duration-300 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ShoppingCart size={18} />{t.carDetails.rentNow}
          </button>
        </div>
      </div>

      {/* Date picker modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#1a1a1a] border border-[#f5b754]/30 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-[#f5b754] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-black">{t.carDetails.selectDates}</h2>
              <button onClick={() => setShowModal(false)} className="text-black text-2xl hover:scale-110 transition">×</button>
            </div>
            <form onSubmit={handleAddToCart} className="p-6 space-y-4">
              <div className="bg-[#252525] rounded-xl p-4 text-sm text-gray-300">
                <p className="font-bold text-white">{car.make} {car.model} {car.year}</p>
                <p className="text-[#f5b754] font-semibold mt-1">${car.dailyRate}{t.carDetails.perDay}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">{t.carDetails.pickupDate}</label>
                <input type="date" required value={pickupDate} min={today} onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#121212] text-white rounded-xl border border-gray-700 focus:outline-none focus:border-[#f5b754] transition" />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none p-2.5 rounded-xl bg-[#252525] border border-gray-700 hover:border-[#f5b754]/50 transition">
                <input
                  type="checkbox"
                  checked={sameDayReturn}
                  onChange={(e) => setSameDayReturn(e.target.checked)}
                  className="w-4 h-4 accent-[#f5b754] cursor-pointer"
                />
                <span className="text-sm text-white">{t.carDetails.sameDayReturn || "Trả trong ngày"}</span>
                <span className="ml-auto text-xs text-[#f5b754] font-semibold">{t.carDetails.halfPrice || "1/2 giá"}</span>
              </label>

              {!sameDayReturn && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">{t.carDetails.returnDate}</label>
                  <input type="date" required={!sameDayReturn} value={returnDate} min={pickupDate || today} onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full px-4 py-3 bg-[#121212] text-white rounded-xl border border-gray-700 focus:outline-none focus:border-[#f5b754] transition" />
                </div>
              )}

              {pickupDate && (sameDayReturn || (returnDate && new Date(returnDate) > new Date(pickupDate))) && (
                <div className="bg-[#f5b754]/10 border border-[#f5b754]/20 rounded-xl p-3 text-sm text-gray-300">
                  {(() => {
                    const days = sameDayReturn ? 0.5 : Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24));
                    const total = days * car.dailyRate;
                    return (
                      <>
                        {t.carDetails.total} <span className="text-[#f5b754] font-bold">
                          {days} {t.carDetails.days} × ${car.dailyRate} = ${total.toFixed(2)}
                        </span>
                      </>
                    );
                  })()}
                </div>
              )}
              <button type="submit" className="w-full py-3 text-lg font-bold rounded-xl bg-[#f5b754] text-black hover:bg-[#e5a944] transition flex items-center justify-center gap-2">
                <ShoppingCart size={20} />{t.carDetails.addToCart}
              </button>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}

export default CarsDetails;
