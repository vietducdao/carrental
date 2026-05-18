import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../utils/api";
import { useLanguage } from "../context/LanguageContext";

const LOCATIONS = ["Hà Nội", "Đà Nẵng", "Hồ Chí Minh", "Cần Thơ"];

export default function BookOption({ floating = false }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [carType, setCarType] = useState("");
  const [pickLocation, setPickLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [pickUpDate, setPickUpDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [categories, setCategories] = useState([]);
  const pickRef = useRef(null);
  const returnRef = useRef(null);

  useEffect(() => {
    api.get("/api/categories")
      .then((r) => setCategories(Array.isArray(r.data) ? r.data : r.data.categories || []))
      .catch(() => {});
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (carType) params.set("category", carType);
    if (pickLocation) params.set("pickLocation", pickLocation);
    if (dropLocation) params.set("dropLocation", dropLocation);
    if (pickUpDate) params.set("pickDate", pickUpDate.toISOString().split("T")[0]);
    if (returnDate) params.set("returnDate", returnDate.toISOString().split("T")[0]);
    navigate(`/cars${params.toString() ? `?${params}` : ""}`);
  };

  const floatingClasses = floating
    ? "mt-[-50px] absolute bottom-[0%] left-[50%] transform -translate-x-1/2 -translate-y-1/2"
    : "relative";

  return (
    <div className={`book-option bg-[#1f1f1f] text-white w-[90%] max-w-[1200px] mx-auto rounded-3xl px-4 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_auto] items-center gap-2 shadow-lg z-50 ${floatingClasses}`}>
      {/* Cars Type */}
      <div className="relative px-3 py-3 group border-r border-gray-700/60">
        <button type="button" className="flex items-center gap-2 w-full justify-between text-gray-400 text-sm whitespace-nowrap">
          <span className="truncate">{carType || t.index.selectCarType}</span>
          <i className="ri-arrow-down-s-line text-yellow-500 flex-shrink-0"></i>
        </button>
        <div className="absolute top-[110%] left-0 w-48 bg-[#1f1f1f] border border-yellow-500 rounded-sm shadow-md opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-300 ease-out z-50">
          <ul className="divide-y divide-gray-700 max-h-60 overflow-y-auto">
            <li className="px-4 py-2 hover:bg-[#f5b750] hover:text-black transition cursor-pointer" onClick={() => setCarType("")}>{t.index.selectCarType}</li>
            {categories.map((c) => (
              <li key={c._id} className="px-4 py-2 hover:bg-[#f5b750] hover:text-black transition cursor-pointer" onClick={() => setCarType(c.name)}>{c.name}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pick Location */}
      <div className="relative px-3 py-3 group border-r border-gray-700/60">
        <button type="button" className="flex items-center gap-2 w-full justify-between text-gray-400 text-sm whitespace-nowrap">
          <span className="truncate">{pickLocation || t.index.pickLocation}</span>
          <i className="ri-arrow-down-s-line text-yellow-500 flex-shrink-0"></i>
        </button>
        <div className="absolute top-[110%] left-0 w-48 bg-[#1f1f1f] border border-yellow-500 rounded-sm shadow-md opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-300 ease-out z-50">
          <ul className="divide-y divide-gray-700">
            {LOCATIONS.map((loc) => (
              <li key={loc} className="px-4 py-2 hover:bg-[#f5b750] hover:text-black transition cursor-pointer" onClick={() => setPickLocation(loc)}>{loc}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pick Date */}
      <div className="relative px-3 py-3 flex items-center border-r border-gray-700/60 cursor-pointer" onClick={() => pickRef.current?.setFocus()}>
        <DatePicker
          selected={pickUpDate}
          onChange={(date) => setPickUpDate(date)}
          dateFormat="dd MMM yyyy"
          placeholderText={t.index.pickDate}
          minDate={new Date()}
          ref={pickRef}
          className={`bg-[#1f1f1f] text-white outline-none cursor-pointer w-full text-sm ${!pickUpDate ? "text-gray-400" : ""}`}
          calendarClassName="dark-datepicker"
          popperPlacement="bottom-start"
        />
        <i className="ri-calendar-line text-yellow-500 pointer-events-none flex-shrink-0"></i>
      </div>

      {/* Drop location */}
      <div className="relative px-3 py-3 group border-r border-gray-700/60">
        <button type="button" className="flex items-center gap-2 w-full justify-between text-gray-400 text-sm whitespace-nowrap">
          <span className="truncate">{dropLocation || t.index.dropLocation}</span>
          <i className="ri-arrow-down-s-line text-yellow-500 flex-shrink-0"></i>
        </button>
        <div className="absolute top-[110%] left-0 w-48 bg-[#1f1f1f] border border-yellow-500 rounded-sm shadow-md opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-300 ease-out z-50">
          <ul className="divide-y divide-gray-700">
            {LOCATIONS.map((loc) => (
              <li key={loc} className="px-4 py-2 hover:bg-[#f5b750] hover:text-black transition cursor-pointer" onClick={() => setDropLocation(loc)}>{loc}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Return date */}
      <div className="relative px-3 py-3 flex items-center cursor-pointer" onClick={() => returnRef.current?.setFocus()}>
        <DatePicker
          selected={returnDate}
          onChange={(date) => setReturnDate(date)}
          dateFormat="dd MMM yyyy"
          placeholderText={t.index.returnDate}
          minDate={pickUpDate || new Date()}
          ref={returnRef}
          className={`bg-[#1f1f1f] text-white outline-none cursor-pointer w-full text-sm ${!returnDate ? "text-gray-400" : ""}`}
          calendarClassName="dark-datepicker"
          popperPlacement="bottom-start"
        />
        <i className="ri-calendar-line text-yellow-500 pointer-events-none flex-shrink-0"></i>
      </div>

      {/* Search button */}
      <button
        type="button"
        onClick={handleSearch}
        className="px-5 py-3 bg-[#f5b754] text-black rounded-2xl font-semibold hover:bg-amber-400 transition flex items-center justify-center gap-2 whitespace-nowrap text-sm"
      >
        <i className="ri-search-line"></i>
        {t.index.heroViewNow || "Tìm xe"}
      </button>
    </div>
  );
}
