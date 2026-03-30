import { useParams } from "react-router-dom";
import { useRef, useState } from "react";
import carData from "../../Cars.json";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
      title: "Contract and Annxes",
      description:
        "In addition to the car rental conatract to be signed at the time. you must have ID, a driver's license, and a deposit.",
    },
    {
      title: "Payments",
      description:
        "The total rental fee is collected at the time of rental. Any additional costs will be added up based on the distance traveled.",
    },
    {
      title: "Delivery",
      description:
        "Delivery is free if you are within the same area. If you are in a different city, the shipping fee will be calculated based on the delivery person's travel expenses.",
    },
    {
      title: "Tracffic Fines",
      description:
        "Traffic fines are the responsibility of the customer. If fined, customers should notify us of the date of the fine and send the fine receipt to our company.",
    },
  ];
  if (!car)
    return <div className="text-white text-center mt-20">Car Not Found</div>;
  const [pickupDate, setPickupDate] = useState(null);
  const datePickerRef = useRef(null);

  const openCalenar = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setFocus();
    }
  };
  const [returnDate, setReturnDate] = useState(null);
  const returnPickerRef = useRef(null);

  const openreturnCalendar = () => {
    if (returnPickerRef.current) {
      returnPickerRef.current.setFocus();
    }
  };
  return (
    <>
      <div className="bg-[#121212] text-white font-sans">
        <div
          className="relative h-[70vh] bg-cover bg-center flex items-end px-[12%] py-20 "
          style={{ backgroundImage: `url(${car.image})` }}
        >
          <div className="absolute inset-0 cars-det-section"></div>
          <div className="relative z-10 text-white">
            <h6 className="uppercase text-1xl font-bold tracking-widest text-[#f5b754]">
              Luxury Cars
            </h6>
            <h1 className="text-4xl font-bold font-bricolage">{car.name}</h1>
          </div>
        </div>
      </div>
      {/* contact */}
      <div className="flex flex-col lg:flex-row gap-10 px-[12%] py-14">
        <div className="flex-1 space-y-12">
          <section>
            <h2 className="text-xl text-white font-bold mb-4">
              General Information
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Enjoy a Premium car rental experience with top-notch services and
              flexible conditions.
            </p>
            <ul className="space-y-2 text-sm text-gray-300 ">
              <li className="flex items-center hover:text-[#f5b754] transition">
                <i className="ri-check-line text-[#f5b754] mr-2 "></i>
                24/7 Roadside Assistance
              </li>

              <li className="flex items-center hover:text-[#f5b754] transition">
                <i className="ri-check-line text-[#f5b754] mr-2 "></i>
                Free Cancellation & Return
              </li>
              <li className="flex items-center hover:text-[#f5b754] transition">
                <i className="ri-check-line text-[#f5b754] mr-2 "></i>
                Pay At Arrival
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl text-white font-bold mb-4">
              Rental Conditions
            </h2>
            <div className="space-y-4">
              {rentalConditions.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#1a1a1a] rounded-xl overflow-hidden"
                >
                  <div
                    onClick={() => toggleAccordion(index)}
                    className="cursor-pointer px-6 py-4 flex justify-between items-center hover:bg-[#2a2a2a] transition duration-300"
                  >
                    <span className="font-medium text-white text-sm">
                      {index + 1}. {item.title}
                    </span>
                    <i
                      className={`ri-arrow-${
                        openIndex === index ? "up" : "down"
                      }-s-line text-[#f5b754]`}
                    ></i>
                  </div>
                  <div
                    className={`px-6 text-sm text-gray-400 overflow-hidden transition-all duration-500 ease-in-out ${
                      openIndex === index ? "max-h-[300px] pb-4" : "max-h-0"
                    }`}
                  >
                    {openIndex === index && <div>{item.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="w-full lg:w-[320px] space-y-6 bg-[#1a1a1a] rounded-2xl p-6 shadow-md h-full ">
          <div className="text-center">
            <p className="text-xl font-bold text-[#f5b754]">
              ${car.price}{" "}
              <span className="text-sm text-white">/Rent Per Day</span>
            </p>
          </div>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex justify-between">
              <span>
                <i className="ri-door-line text-[#f5b754] mr-2" />
                Doors <span>{car.door}</span>
              </span>
            </li>
            <li className="flex justify-between">
              <span>
                <i className="ri-user-line text-[#f5b754] mr-2" />
                Passengers <span>{car.passengers}</span>
              </span>
            </li>
            <li className="flex justify-between">
              <span>
                <i className="ri-settings-2-line text-[#f5b754] mr-2" />
                Transmission <span>{car.transmission}</span>
              </span>
            </li>
            <li className="flex justify-between">
              <span>
                <i className="ri-suitcase-line text-[#f5b754] mr-2" />
                Luaggage <span>{car.Bags}</span>
              </span>
            </li>
            <li className="flex justify-between">
              <span>
                <i className="ri-snowflake-line text-[#f5b754] mr-2" />
                Air Conditions <span>Yes</span>
              </span>
            </li>
            <li className="flex justify-between">
              <span>
                <i className="ri-user-star-line text-[#f5b754] mr-2" />
                Age <span>25</span>
              </span>
            </li>
          </ul>
          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 bg-[#f5b754] text-black text-[20px] rounded-xl py-2 hover:bg-[#f5b754]/90 transititon font-bricolage"
            >
              Rent Now
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 ">
          <div className="bg-[#0d0d0d]/90 border border-[#f5b754]/30 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
            <div className="bg-[#f5b754] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-black font-bricolage ">
                Book Your Dream Car
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-black text-2xl hover:scale-110 transition"
              >
                x
              </button>
            </div>
            <form
              className="p-6 space-y-6 my-2"
              onSubmit={(e) => {
                e.preventDefault();
                setShowModal(false);
                setShowSuccesModal(true);
              }}
            >
              <div className="grid gird-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder=""
                    className="w-full px-4 pt-6 pb-2 bg-[#121212] text-white rounded-md border border-[#f5b754]/20 outline-none focus:ring-2 focus:ring-[#f5b754] transition duration-200"
                  />
                  <label className="absolute left-4 top-2 text-sm text-gray-400 pointer-events-none transition-all">
                    Full Name*
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder=""
                    className="w-full px-4 pt-6 pb-2 bg-[#121212] text-white rounded-md border border-[#f5b754]/20 outline-none focus:ring-2 focus:ring-[#f5b754] transition duration-200"
                  />
                  <label className="absolute left-4 top-2 text-sm text-gray-400 pointer-events-none transition-all">
                    Email*
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder=""
                    className="w-full px-4 pt-6 pb-2 bg-[#121212] text-white rounded-md border border-[#f5b754]/20 outline-none focus:ring-2 focus:ring-[#f5b754] transition duration-200"
                  />
                  <label className="absolute left-4 top-2 text-sm text-gray-400 pointer-events-none transition-all">
                    Phone*
                  </label>
                </div>
                <div className="relative">
                  <select
                    required
                    className="w-full px-4 pt-6 pb-2 pr-10 bg-[#121212] text-white rounded-md border border-[#f5b754]/20 outline-none focus:ring-2 focus:ring-[#f5b754] transition duration-200"
                  >
                    <option hidden>Choose Car Type</option>
                    <option>Lamboghini</option>
                    <option>Roll Royces</option>
                    <option>Bentley</option>
                  </select>
                  <label className="absolute left-4 top-2 text-sm text-gray-400 pointer-events-none transition-all">
                    Car Type*
                  </label>
                </div>
                <div className="relative">
                  <select
                    required
                    className="w-full px-4 pt-6 pb-2 pr-10 bg-[#121212] text-white rounded-md border border-[#f5b754]/20 outline-none focus:ring-2 focus:ring-[#f5b754] transition duration-200"
                  >
                    <option hidden>Pick-Up Location</option>
                    <option>A</option>
                    <option>B</option>
                  </select>
                  <label className="absolute left-4 top-2 text-sm text-gray-400 pointer-events-none transition-all">
                    Pick-Up Location*
                  </label>
                </div>
                <div className="relative pick-date">
                  <input
                    type="date"
                    required
                    placeholder=""
                    className="w-full px-4 pt-6 pb-2 bg-[#121212] text-white rounded-md border border-[#f5b754]/20 outline-none focus:ring-2 focus:ring-[#f5b754] transition duration-200"
                  />
                  <label className="absolute left-4 top-2 text-sm text-gray-400 pointer-events-none transition-all">
                    Pick-Up Date*
                  </label>
                </div>
                <div className="relative">
                  <select
                    required
                    className="w-full px-4 pt-6 pb-2 pr-10 bg-[#121212] text-white rounded-md border border-[#f5b754]/20 outline-none focus:ring-2 focus:ring-[#f5b754] transition duration-200"
                  >
                    <option hidden>Drop-Off Location</option>
                    <option>C</option>
                    <option>D</option>
                  </select>
                  <label className="absolute left-4 top-2 text-sm text-gray-400 pointer-events-none transition-all">
                    Drop-Off Location*
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="date"
                    required
                    placeholder=""
                    className="w-full px-4 pt-6 pb-2 bg-[#121212] text-white rounded-md border border-[#f5b754]/20 outline-none focus:ring-2 focus:ring-[#f5b754] transition duration-200"
                  />
                  <label className="absolute left-4 top-2 text-sm text-gray-400 pointer-events-none transition-all">
                    Drop-Off Date*
                  </label>
                </div>
                <div className="relative">
                  <textarea
                    rows={3}
                    placeholder=""
                    className="w-full px-4 pt-6 pb-2 pr-10 bg-[#121212] text-white rounded-md border border-[#f5b754]/20 outline-none focus:ring-2 focus:ring-[#f5b754] transition duration-200"
                  ></textarea>

                  <label className="absolute left-4 top-2 text-sm text-gray-400 pointer-events-none transition-all">
                    Additonal Notes*
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 text-lg font-bold rounded-full bg-[#f5b754] text-black hover:bg-[#e5a944] transition"
                >
                  Rent Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-[#0d0d0d]/90 border border-green-500/30 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-green-500 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black font-bricolage">
                Success!
              </h2>
              <button
                onClick={() => setShowSuccesModal(false)}
                className="text-black text-2xl hover:scale-110 transition"
              >
                x
              </button>
            </div>
            <div className="p-6 text-center text-white space-y-4">
              <p className="text-lg font-semibold">
                Your car booking was successful.
              </p>
              <p className="text-sm text-gray-300">
                We'll contact you shortly with confirmation details.
              </p>
              <button
                onClick={() => setShowSuccesModal(false)}
                className="mt-4 px-6 py-2 rounded-full bg-green-500 hover:bg-green-600 text-black font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default CarsDetails;
