import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, X, SlidersHorizontal, ArrowUpDown, DollarSign, Settings2, Fuel, Tag, ArrowRight } from "lucide-react";
import api, { BASE_URL } from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";

const TRANSMISSIONS = ["Automatic", "Manual", "CVT"];
const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid"];

function Cars() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  // filters — initialize from URL query string
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [transmission, setTransmission] = useState(searchParams.get("transmission") || "");
  const [fuelType, setFuelType] = useState(searchParams.get("fuelType") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minRate") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxRate") || "");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debounceRef = useRef(null);

  const fetchCars = () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 8, sort });
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (transmission) params.set("transmission", transmission);
    if (fuelType) params.set("fuelType", fuelType);
    if (minPrice) params.set("minRate", minPrice);
    if (maxPrice) params.set("maxRate", maxPrice);
    api.get(`/api/cars?${params}`)
      .then((r) => {
        setCars(r.data.cars || []);
        setTotalPages(r.data.totalPages || 1);
        setTotalResults(r.data.total || 0);
      })
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get("/api/categories")
      .then((r) => setCategories(Array.isArray(r.data) ? r.data : r.data.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => { fetchCars(); }, [page, category, transmission, fuelType, sort, search]);

  // Debounce search input → search state
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (searchInput !== search) {
        setSearch(searchInput);
        setPage(1);
      }
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  const applyPriceFilter = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCars();
  };

  const resetFilters = () => {
    setSearch(""); setSearchInput("");
    setCategory(""); setTransmission(""); setFuelType("");
    setMinPrice(""); setMaxPrice("");
    setSort("newest");
    setPage(1);
  };

  const activeChips = useMemo(() => {
    const chips = [];
    if (search) chips.push({ key: "search", label: `"${search}"`, onRemove: () => { setSearch(""); setSearchInput(""); } });
    if (category) chips.push({ key: "category", label: category, onRemove: () => setCategory("") });
    if (transmission) chips.push({ key: "transmission", label: t.cars[`transmission${transmission === "Automatic" ? "Auto" : transmission}`] || transmission, onRemove: () => setTransmission("") });
    if (fuelType) chips.push({ key: "fuelType", label: t.cars[`fuel${fuelType}`] || fuelType, onRemove: () => setFuelType("") });
    if (minPrice || maxPrice) chips.push({
      key: "price",
      label: `$${minPrice || 0} - $${maxPrice || "∞"}`,
      onRemove: () => { setMinPrice(""); setMaxPrice(""); fetchCars(); },
    });
    return chips;
  }, [search, category, transmission, fuelType, minPrice, maxPrice, t]);

  const hasActiveFilters = activeChips.length > 0 || sort !== "newest";

  // Build query string to carry pickup/return dates and locations to the car detail page
  const carDetailQuery = (() => {
    const p = new URLSearchParams();
    ["pickDate", "returnDate", "pickLocation", "dropLocation"].forEach((k) => {
      const v = searchParams.get(k);
      if (v) p.set(k, v);
    });
    const s = p.toString();
    return s ? `?${s}` : "";
  })();

  return (
    <div className="font-sans bg-[#121212] text-white">
      {/* Banner */}
      <div className="banner-section cars-banner-section flex justify-center items-center">
        <div className="banner-section-content text-center z-10">
          <h6 className="uppercase text-gray-300">{t.cars.bannerSub}</h6>
          <h1 className="text-5xl font-semibold font-bricolage text-[#f5b754]">
            <span className="text-white">{t.cars.bannerTitle1} </span>{t.cars.bannerTitle2}
          </h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 px-4 sm:px-6 md:px-8 lg:px-[12%] py-12">
        {/* Sidebar */}
        <aside className="w-full md:w-[280px] flex-shrink-0">
          <div className="bg-[#1a1a1a] rounded-2xl p-5 shadow-lg sticky top-24 border border-gray-800/60">
            {/* Search */}
            <div className="relative mb-5">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t.cars.searchPlaceholder}
                className="w-full bg-[#0f0f0f] border border-gray-800 rounded-xl py-2.5 pl-10 pr-9 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5b754]/60 focus:ring-2 focus:ring-[#f5b754]/10 transition"
              />
              {searchInput && (
                <button
                  onClick={() => { setSearchInput(""); setSearch(""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-800 hover:bg-[#f5b754] hover:text-black text-gray-400 flex items-center justify-center transition"
                  aria-label={t.cars.clear}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Filters Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-800/60">
              <h4 className="font-semibold text-xs uppercase tracking-widest text-[#f5b754] flex items-center gap-1.5">
                <SlidersHorizontal size={12} />{t.cars.filters}
              </h4>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="text-[10px] uppercase tracking-wider text-gray-500 hover:text-red-400 transition font-bold">
                  {t.cars.resetFilters}
                </button>
              )}
            </div>

            {/* Sort */}
            <FilterGroup icon={<ArrowUpDown size={11} />} label={t.cars.sortBy}>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg py-2 px-3 text-xs text-gray-200 focus:outline-none focus:border-[#f5b754]/60 cursor-pointer"
              >
                <option value="newest">{t.cars.sortNewest}</option>
                <option value="priceAsc">{t.cars.sortPriceAsc}</option>
                <option value="priceDesc">{t.cars.sortPriceDesc}</option>
                <option value="yearDesc">{t.cars.sortYearDesc}</option>
              </select>
            </FilterGroup>

            {/* Categories */}
            <FilterGroup icon={<Tag size={11} />} label={t.cars.categories}>
              <ul className="text-sm space-y-0.5 max-h-48 overflow-y-auto custom-scrollbar -mr-1 pr-1">
                <li>
                  <button
                    onClick={() => { setCategory(""); setPage(1); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${!category ? "text-[#f5b754] bg-[#f5b754]/10 font-semibold" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                    {t.cars.all}
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <button
                      onClick={() => { setCategory(cat.name); setPage(1); }}
                      title={cat.description || ""}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${category === cat.name ? "text-[#f5b754] bg-[#f5b754]/10 font-semibold" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                      {cat.icon && <span className="mr-1">{cat.icon}</span>}{cat.name}
                      {cat.description && category === cat.name && (
                        <p className="text-[10px] text-gray-500 mt-0.5 leading-tight italic font-normal">{cat.description}</p>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </FilterGroup>

            {/* Price Range */}
            <FilterGroup icon={<DollarSign size={11} />} label={t.cars.priceRange}>
              <form onSubmit={applyPriceFilter} className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder={t.cars.minPrice}
                  className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg py-2 px-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5b754]/60 transition"
                />
                <span className="text-gray-600 text-xs">—</span>
                <input
                  type="number"
                  min={0}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder={t.cars.maxPrice}
                  className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg py-2 px-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f5b754]/60 transition"
                />
                <button
                  type="submit"
                  className="px-2 py-2 rounded-lg bg-[#f5b754] text-black hover:bg-amber-400 transition flex-shrink-0"
                  aria-label="Apply"
                >
                  <Search size={12} />
                </button>
              </form>
            </FilterGroup>

            {/* Transmission */}
            <FilterGroup icon={<Settings2 size={11} />} label={t.cars.transmission}>
              <div className="flex flex-wrap gap-1.5">
                <ChipButton active={!transmission} onClick={() => { setTransmission(""); setPage(1); }}>
                  {t.cars.all}
                </ChipButton>
                {TRANSMISSIONS.map((tr) => (
                  <ChipButton key={tr} active={transmission === tr} onClick={() => { setTransmission(tr); setPage(1); }}>
                    {t.cars[`transmission${tr === "Automatic" ? "Auto" : tr}`] || tr}
                  </ChipButton>
                ))}
              </div>
            </FilterGroup>

            {/* Fuel */}
            <FilterGroup icon={<Fuel size={11} />} label={t.cars.fuel}>
              <div className="flex flex-wrap gap-1.5">
                <ChipButton active={!fuelType} onClick={() => { setFuelType(""); setPage(1); }}>
                  {t.cars.all}
                </ChipButton>
                {FUEL_TYPES.map((f) => (
                  <ChipButton key={f} active={fuelType === f} onClick={() => { setFuelType(f); setPage(1); }}>
                    {t.cars[`fuel${f}`] || f}
                  </ChipButton>
                ))}
              </div>
            </FilterGroup>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Results header + active chips */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <p className="text-sm text-gray-400">
              <span className="text-[#f5b754] font-bold text-lg">{totalResults}</span> {t.cars.foundResults}
            </p>
            {activeChips.length > 0 && (
              <>
                <span className="h-4 w-px bg-gray-800" />
                <div className="flex flex-wrap items-center gap-1.5">
                  {activeChips.map((chip) => (
                    <span key={chip.key} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f5b754]/10 border border-[#f5b754]/30 text-[#f5b754] text-[11px] font-semibold">
                      {chip.label}
                      <button onClick={chip.onRemove} className="hover:bg-[#f5b754] hover:text-black rounded-full transition w-4 h-4 flex items-center justify-center">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f5b754]" /></div>
          ) : cars.length === 0 ? (
            <div className="text-center py-20 bg-[#1a1a1a] rounded-2xl border border-gray-800">
              <Search className="mx-auto text-gray-700 mb-4" size={48} />
              <p className="text-gray-500 mb-3">{t.cars.noResults}</p>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="text-xs px-4 py-2 rounded-lg bg-[#f5b754]/10 border border-[#f5b754]/30 text-[#f5b754] hover:bg-[#f5b754]/20 transition font-semibold">
                  {t.cars.resetFilters}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cars.map((car) => {
                const imgSrc = car.image ? `${BASE_URL}/uploads/${car.image}` : null;
                const statusStyle = car.status === "available"
                  ? "bg-green-900/40 text-green-400 border-green-500/30"
                  : car.status === "rented"
                  ? "bg-amber-900/40 text-amber-400 border-amber-500/30"
                  : "bg-red-900/40 text-red-400 border-red-500/30";
                return (
                  <div key={car._id} className="bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-md hover:shadow-[#f5b754]/30 transition">
                    <div className="relative">
                      {imgSrc ? (
                        <img src={imgSrc} alt={`${car.make} ${car.model}`} className="w-full h-48 object-cover hover:scale-105 transition" />
                      ) : (
                        <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-gray-600">{t.cars.noImage}</div>
                      )}
                      <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm ${statusStyle}`}>
                        {t.cars.statusLabel?.[car.status] || car.status}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold mb-1">{car.make} {car.model}</h3>
                      <p className="text-xs text-gray-500 mb-3">{car.year} • {car.category} • {car.seats} {t.cars.seats}</p>
                      <ul className="text-sm text-gray-400 space-y-2 mb-4">
                        <li><i className="ri-settings-2-line mr-2 text-[#f5b754]"></i>{t.cars.transmission}: {car.transmission}</li>
                        <li><i className="ri-gas-station-line mr-2 text-[#f5b754]"></i>{t.cars.fuel}: {car.fuelType}</li>
                        <li><i className="ri-road-map-line mr-2 text-[#f5b754]"></i>{t.cars.mileage}: {car.mileage?.toLocaleString() || "—"} km</li>
                        {car.color && <li><i className="ri-palette-line mr-2 text-[#f5b754]"></i>{t.cars.color}: {car.color}</li>}
                      </ul>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[#f5b754] font-semibold text-lg whitespace-nowrap">${car.dailyRate}{t.cars.perDay}</span>
                        <Link to={`/car/${car._id}${carDetailQuery}`} className="inline-block flex-shrink-0">
                          <button
                            type="button"
                            className="bg-[#f5b754] !text-black font-bold px-5 py-2.5 rounded-full text-sm hover:bg-amber-400 hover:scale-105 active:scale-95 transition whitespace-nowrap inline-flex items-center gap-1.5 shadow-md shadow-[#f5b754]/20"
                          >
                            <span>{t.cars.viewDetails}</span>
                            <ArrowRight size={14} strokeWidth={2.5} />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition ${p === page ? "bg-[#f5b754] text-black" : "bg-[#1a1a1a] text-gray-400 hover:text-white"}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const FilterGroup = ({ icon, label, children }) => (
  <div className="mb-4 pb-4 border-b border-gray-800/40 last:border-0 last:pb-0 last:mb-0">
    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 flex items-center gap-1.5">
      <span className="text-[#f5b754]">{icon}</span>{label}
    </p>
    {children}
  </div>
);

const ChipButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition border ${
      active
        ? "bg-[#f5b754] text-black border-[#f5b754]"
        : "bg-transparent text-gray-400 border-gray-800 hover:border-[#f5b754]/40 hover:text-white"
    }`}
  >
    {children}
  </button>
);

export default Cars;
