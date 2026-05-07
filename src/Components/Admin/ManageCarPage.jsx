import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Filter,
  Edit3,
  Trash2,
  Car as CarIcon,
  Search,
  ChevronDown,
  Users,
  Fuel,
  Activity,
  Calendar,
  Settings2,
  Palette,
  Info,
  X,
  DollarSign,
  CheckCircle2,
  Wrench,
  KeyRound,
  UploadCloud,
  Loader2,
} from "lucide-react";
import { styles } from "../../assets/adminStyles";
import api, { BASE_URL as BASE } from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";
import Pagination from "./Pagination";

const makeImageUrl = (img) => {
  if (!img) return "";
  const s = String(img).trim();
  return /^https?:\/\//i.test(s)
    ? s
    : `${BASE}/uploads/${s.replace(/^\/+/, "").replace(/^uploads\//, "")}`;
};

const buildSafeCar = (raw = {}, idx = 0) => {
  const _id = raw._id || raw.id || null;
  return {
    _id,
    id: _id || raw.id || raw.localId || `local-${idx + 1}`,
    make: raw.make || "",
    model: raw.model || "",
    year: raw.year ?? "",
    category: raw.category || "Sedan",
    seats: raw.seats ?? 4,
    transmission: raw.transmission || "Automatic",
    fuelType: raw.fuelType || raw.fuel || "Petrol",
    mileage: raw.mileage ?? 0,
    dailyRate: raw.dailyRate ?? raw.price ?? 0,
    status: raw.status || "available",
    image: raw.image ? makeImageUrl(raw.image) : "",
    color: raw.color || "",
    description: raw.description || "",
    _rawImage: raw.image ?? "",
  };
};

const STATUS_OPTIONS = ["all", "available", "rented", "maintenance"];

const ManageCarPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { lang, t } = useLanguage();

  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/cars", { params: { limit: 1000 } });
      const raw = Array.isArray(res.data) ? res.data : res.data.data || res.data.cars || [];
      setCars(raw.map((c, i) => buildSafeCar(c, i)));
    } catch (err) {
      toast.error(t.admin.common.loadingError || (lang === "vi" ? "Lỗi tải dữ liệu" : "Failed to load fleet data."));
    } finally {
      setLoading(false);
    }
  }, [t, lang]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get("/api/categories");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    fetchCars();
    fetchCategories();
  }, [fetchCars, fetchCategories]);

  const handleDelete = async (identifier) => {
    if (!window.confirm(t.admin.cars.modal.deleteConfirm)) return;
    try {
      setDeletingId(identifier);
      await api.delete(`/api/cars/${identifier}`);
      setCars((prev) => prev.filter((c) => c._id !== identifier && c.id !== identifier));
      toast.success(lang === "vi" ? "Xóa thành công" : "Deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || (lang === "vi" ? "Xóa thất bại" : "Failed to delete"));
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (car) => {
    setEditingCar({ ...car });
    setEditImageFile(null);
    setEditImagePreview("");
    setShowEditModal(true);
  };

  const closeEdit = () => {
    setShowEditModal(false);
    setEditingCar(null);
    setEditImageFile(null);
    setEditImagePreview("");
  };

  const openDetail = (car) => {
    setSelectedCar(car);
    setShowDetailModal(true);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(lang === "vi" ? "Vui lòng chọn tệp ảnh hợp lệ" : "Please select a valid image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error(lang === "vi" ? "Ảnh tối đa 10MB" : "Image must be under 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => setEditImagePreview(evt.target.result);
    reader.readAsDataURL(file);
    setEditImageFile(file);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingCar?._id) return;
    if (!editingCar.make?.trim()) {
      toast.warning(lang === "vi" ? "Tên xe là bắt buộc" : "Make is required");
      return;
    }
    if (!editingCar.year || Number.isNaN(Number(editingCar.year))) {
      toast.warning(lang === "vi" ? "Năm sản xuất không hợp lệ" : "Invalid year");
      return;
    }
    if (Number(editingCar.dailyRate) <= 0) {
      toast.warning(lang === "vi" ? "Giá thuê không hợp lệ" : "Invalid daily rate");
      return;
    }
    try {
      setIsSaving(true);
      const fd = new FormData();
      fd.append("make", editingCar.make.trim());
      fd.append("model", (editingCar.model || "").trim());
      fd.append("year", String(Number(editingCar.year)));
      fd.append("dailyRate", String(Number(editingCar.dailyRate)));
      fd.append("category", editingCar.category || "Sedan");
      fd.append("seats", String(Number(editingCar.seats) || 4));
      fd.append("transmission", editingCar.transmission || "Automatic");
      fd.append("fuelType", editingCar.fuelType || "Petrol");
      fd.append("mileage", String(Number(editingCar.mileage) || 0));
      fd.append("color", editingCar.color || "");
      fd.append("description", editingCar.description || "");
      fd.append("status", editingCar.status || "available");
      if (editImageFile) fd.append("image", editImageFile);

      await api.patch(`/api/cars/${editingCar._id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchCars();
      closeEdit();
      toast.success(t.admin.common.saveSuccess || (lang === "vi" ? "Cập nhật thành công" : "Updated successfully"));
    } catch (err) {
      toast.error(err.response?.data?.message || (lang === "vi" ? "Cập nhật thất bại" : "Update failed"));
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCars = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return cars.filter((c) => {
      const matchesCategory = categoryFilter === "all" || c.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesSearch =
        !q ||
        c.make.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        String(c.year).includes(q);
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [cars, categoryFilter, statusFilter, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, statusFilter, searchQuery, pageSize]);

  const paginatedCars = useMemo(
    () => filteredCars.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredCars, currentPage, pageSize]
  );

  const stats = useMemo(() => ({
    total: cars.length,
    available: cars.filter((c) => c.status === "available").length,
    rented: cars.filter((c) => c.status === "rented").length,
    maintenance: cars.filter((c) => c.status === "maintenance").length,
  }), [cars]);

  const categoryOptions = useMemo(() => {
    if (categories.length > 0) return ["all", ...categories.map((c) => c.name)];
    return ["all", "Sedan", "SUV", "Sports", "Coupe", "Hatchback", "Luxury"];
  }, [categories]);

  const getStatusColor = (status) => {
    switch (status) {
      case "available": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "rented": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "maintenance": return "text-red-400 bg-red-500/10 border-red-500/20";
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const statusLabel = (s) => t.carDetails[s] || s;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<CarIcon size={22} />}
          label={t.admin.cars.stats.total}
          value={stats.total}
          unit={t.admin.cars.stats.unit}
          tone="orange"
        />
        <StatCard
          icon={<CheckCircle2 size={22} />}
          label={t.admin.cars.stats.available}
          value={stats.available}
          unit={t.admin.cars.stats.unit}
          tone="green"
        />
        <StatCard
          icon={<KeyRound size={22} />}
          label={t.admin.cars.stats.rented}
          value={stats.rented}
          unit={t.admin.cars.stats.unit}
          tone="amber"
        />
        <StatCard
          icon={<Wrench size={22} />}
          label={t.admin.cars.stats.maintenance}
          value={stats.maintenance}
          unit={t.admin.cars.stats.unit}
          tone="red"
        />
      </div>

      {/* Filters row */}
      <div className={`${styles.glassDark} p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-stretch md:items-center border border-white/5 shadow-2xl shadow-black/20`}>
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-3.5 text-gray-600" />
          <input
            type="text"
            placeholder={t.admin.common.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all font-medium placeholder:text-gray-600"
          />
        </div>

        <div className="relative w-full md:w-56">
          <Filter size={16} className="absolute left-4 top-3.5 text-gray-600" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-10 text-sm text-gray-200 focus:outline-none focus:border-orange-500/50 appearance-none transition-all font-medium cursor-pointer"
          >
            {categoryOptions.map((c) => (
              <option key={c} value={c} className="bg-gray-950">
                {c === "all" ? t.cars.all : (t.about?.[c.toLowerCase?.()] || c)}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-4 top-4 text-gray-600 pointer-events-none" />
        </div>

        <div className="relative w-full md:w-56">
          <Activity size={16} className="absolute left-4 top-3.5 text-gray-600" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-10 text-sm text-gray-200 focus:outline-none focus:border-orange-500/50 appearance-none transition-all font-medium cursor-pointer"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-gray-950">
                {s === "all" ? t.admin.cars.filters.allStatus : statusLabel(s)}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-4 top-4 text-gray-600 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className={`${styles.glassDark} rounded-[32px] overflow-hidden border border-white/5 shadow-[0_32px_128px_rgba(0,0,0,0.5)]`}>
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-600 gap-4">
            <Search size={64} className="opacity-10" />
            <p className="text-xs font-black uppercase tracking-[0.2em]">{t.admin.common.noResults}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className={styles.tableHeader + " pl-10"}>{t.admin.cars.table.identity}</th>
                  <th className={styles.tableHeader}>{t.admin.cars.table.specs}</th>
                  <th className={styles.tableHeader}>{t.admin.cars.table.rate}</th>
                  <th className={styles.tableHeader}>{t.admin.common.status}</th>
                  <th className={`${styles.tableHeader} text-right pr-10`}>{t.admin.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {paginatedCars.map((car) => (
                  <tr
                    key={car.id}
                    onClick={() => openDetail(car)}
                    className={styles.tableRow + " cursor-pointer group hover:bg-white/[0.03] transition-all duration-300"}
                  >
                    <td className={styles.tableCell + " pl-10 py-6"}>
                      <div className="flex items-center gap-5">
                        <div className="w-24 h-14 rounded-2xl bg-gray-950 overflow-hidden border border-white/10 shadow-lg flex-shrink-0 group-hover:scale-105 group-hover:border-orange-500/30 transition-all duration-500 relative">
                          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          {car.image ? (
                            <img src={car.image} alt={car.make} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/5"><CarIcon size={24} /></div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-white text-lg uppercase tracking-tighter leading-none group-hover:text-orange-500 transition-colors">{car.make} {car.model}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[9px] px-2 py-0.5 rounded-md bg-white/5 text-gray-500 font-black uppercase tracking-widest">{car.year}</span>
                            <span className="text-[9px] px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-500 font-black uppercase tracking-widest">{t.about?.[car.category.toLowerCase?.()] || car.category}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1.5 rounded-xl bg-white/5 text-[9px] text-gray-500 font-black uppercase tracking-widest border border-white/[0.02]">{t.cars[car.transmission.toLowerCase()] || car.transmission}</span>
                        <span className="px-2.5 py-1.5 rounded-xl bg-white/5 text-[9px] text-gray-500 font-black uppercase tracking-widest border border-white/[0.02]">{t.cars[car.fuelType.toLowerCase()] || car.fuelType}</span>
                        <span className="px-2.5 py-1.5 rounded-xl bg-white/5 text-[9px] text-gray-500 font-black uppercase tracking-widest border border-white/[0.02]">{car.seats} {t.carDetails.seatsUnit}</span>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white tracking-tighter group-hover:text-orange-400 transition-colors">${car.dailyRate}</span>
                        <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">/ {t.cars.perDay}</span>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-xl backdrop-blur-sm ${getStatusColor(car.status)}`}>
                        {statusLabel(car.status)}
                      </span>
                    </td>
                    <td className={styles.tableCell + " pr-10"}>
                      <div className="flex items-center justify-end gap-3 px-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEdit(car); }}
                          className="w-11 h-11 rounded-2xl bg-white/5 text-gray-500 hover:text-orange-400 hover:bg-orange-500/10 border border-white/5 hover:border-orange-500/20 transition-all flex items-center justify-center group/btn shadow-lg"
                          title={t.admin.common.actions}
                        >
                          <Edit3 size={18} className="group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-all" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(car._id || car.id); }}
                          disabled={deletingId === (car._id || car.id)}
                          className="w-11 h-11 rounded-2xl bg-white/5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 transition-all flex items-center justify-center group/btn shadow-lg disabled:opacity-50"
                        >
                          {deletingId === (car._id || car.id)
                            ? <Loader2 size={18} className="animate-spin" />
                            : <Trash2 size={18} className="group-hover/btn:scale-110 group-hover/btn:-rotate-12 transition-all" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalItems={filteredCars.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </div>

      {/* Car Detail Modal */}
      {showDetailModal && selectedCar && (
        <div className={styles.modalOverlay + " backdrop-blur-2xl z-[100] p-6 lg:p-0"}>
          <div className={`${styles.glassDark} rounded-[48px] w-full max-w-5xl overflow-hidden shadow-[0_64px_256px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-10 duration-500 border border-white/10 relative`}>
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-8 right-8 w-14 h-14 rounded-[24px] bg-black/60 text-white hover:bg-red-600 transition-all flex items-center justify-center z-50 border border-white/10 group shadow-2xl"
            >
              <X size={28} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
              <div className="lg:col-span-5 relative h-80 lg:h-auto bg-gray-950 group overflow-hidden border-r border-white/5">
                {selectedCar.image ? (
                  <img src={selectedCar.image} alt="VehicleLarge" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950 text-white/5 gap-6">
                    <CarIcon size={160} />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">No HD Image Preview</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-black/20" />

                <div className="absolute bottom-12 left-12 right-12 space-y-4">
                  <div className="flex gap-2">
                    <span className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-2xl backdrop-blur-md ${getStatusColor(selectedCar.status)}`}>
                      {statusLabel(selectedCar.status)}
                    </span>
                  </div>
                  <div className="p-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/5 shadow-2xl flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Rental Cost</p>
                      <p className="text-3xl font-black text-white tracking-tighter">${selectedCar.dailyRate}<span className="text-xs text-gray-500 ml-1 font-bold">/DAY</span></p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-500/20 flex items-center justify-center text-orange-500">
                      <DollarSign size={24} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 p-10 lg:p-16 space-y-12 custom-scrollbar max-h-[90vh] overflow-y-auto bg-white/[0.01]">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] px-4 py-2 rounded-2xl bg-orange-600 text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-950/40">
                      {t.about?.[selectedCar.category.toLowerCase?.()] || selectedCar.category}
                    </span>
                    <span className="text-[10px] px-4 py-2 rounded-2xl bg-white/5 text-gray-500 font-black uppercase tracking-[0.2em] shadow-inner border border-white/5">
                      REF-ID: {String(selectedCar.id).slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-[0.85]">
                    {selectedCar.make} <br />
                    <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">{selectedCar.model || "—"}</span>
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { icon: Settings2, label: t.admin.cars.modal.trans, val: t.cars[selectedCar.transmission.toLowerCase()] || selectedCar.transmission },
                    { icon: Fuel, label: t.admin.cars.modal.fuel, val: t.cars[selectedCar.fuelType.toLowerCase()] || selectedCar.fuelType },
                    { icon: Users, label: t.admin.cars.modal.seats, val: `${selectedCar.seats} ${t.carDetails.seatsUnit}` },
                    { icon: Activity, label: t.admin.cars.modal.mileage, val: `${selectedCar.mileage} MPG` },
                    { icon: Calendar, label: t.admin.cars.modal.year, val: selectedCar.year },
                    { icon: Palette, label: t.admin.cars.modal.color, val: selectedCar.color || "—" },
                  ].map((spec, i) => (
                    <div key={i} className="flex flex-col gap-3 p-6 rounded-[32px] bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-500 group/spec">
                      <div className="w-10 h-10 rounded-2xl bg-black/40 flex items-center justify-center text-orange-500 group-hover/spec:scale-110 transition-transform">
                        <spec.icon size={18} />
                      </div>
                      <div>
                        <div className="text-gray-500 uppercase tracking-widest font-black text-[9px] mb-1">{spec.label}</div>
                        <div className="text-white font-bold text-sm tracking-tight">{spec.val}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedCar.description && (
                  <div className="bg-white/5 rounded-[40px] p-10 border border-white/5 shadow-inner">
                    <div className="flex items-center gap-3 text-[10px] text-gray-400 font-black uppercase tracking-widest mb-6">
                      <div className="w-8 h-8 rounded-xl bg-orange-600/10 flex items-center justify-center text-orange-600">
                        <Info size={16} />
                      </div>
                      {t.admin.cars.modal.description}
                    </div>
                    <p className="text-gray-400 text-lg leading-relaxed italic font-serif">
                      "{selectedCar.description}"
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
                  <button
                    onClick={() => { setShowDetailModal(false); openEdit(selectedCar); }}
                    className="flex-1 py-6 rounded-[24px] bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] text-xs transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 border border-white/10"
                  >
                    <Edit3 size={18} className="text-orange-500" /> {t.admin.cars.modal.title}
                  </button>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 py-6 rounded-[24px] bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black uppercase tracking-[0.2em] text-xs transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-orange-950/40"
                  >
                    {t.admin.common.discard}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingCar && (
        <div className={styles.modalOverlay + " z-[110]"}>
          <div className={`${styles.glassDark} rounded-[32px] w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border border-white/10`}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Edit3 size={20} />
                </div>
                <h2 className="text-2xl font-black tracking-tighter uppercase">{t.admin.cars.modal.title}</h2>
              </div>
              <button
                onClick={closeEdit}
                className="w-10 h-10 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all flex items-center justify-center group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label={t.admin.cars.modal.make} required>
                  <input type="text" value={editingCar.make} onChange={(e) => setEditingCar({ ...editingCar, make: e.target.value })} className={styles.inputField} required />
                </Field>
                <Field label={t.admin.cars.modal.model}>
                  <input type="text" value={editingCar.model} onChange={(e) => setEditingCar({ ...editingCar, model: e.target.value })} className={styles.inputField} />
                </Field>
                <Field label={t.admin.cars.modal.year} required>
                  <input type="number" value={editingCar.year} onChange={(e) => setEditingCar({ ...editingCar, year: e.target.value })} className={styles.inputField} required />
                </Field>
                <Field label={t.admin.cars.modal.rate} required>
                  <input type="number" step="0.01" value={editingCar.dailyRate} onChange={(e) => setEditingCar({ ...editingCar, dailyRate: e.target.value })} className={styles.inputField} required />
                </Field>
                <Field label={t.admin.cars.modal.category}>
                  <select value={editingCar.category} onChange={(e) => setEditingCar({ ...editingCar, category: e.target.value })} className={styles.inputField}>
                    {(categories.length > 0 ? categories.map((c) => c.name) : ["Sedan", "SUV", "Sports", "Coupe", "Hatchback", "Luxury"]).map((c) => (
                      <option key={c} value={c} className="bg-gray-950">{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label={t.admin.common.status}>
                  <select value={editingCar.status} onChange={(e) => setEditingCar({ ...editingCar, status: e.target.value })} className={styles.inputField}>
                    <option value="available" className="bg-gray-950">{statusLabel("available")}</option>
                    <option value="rented" className="bg-gray-950">{statusLabel("rented")}</option>
                    <option value="maintenance" className="bg-gray-950">{statusLabel("maintenance")}</option>
                  </select>
                </Field>
                <Field label={t.admin.cars.modal.seats}>
                  <select value={editingCar.seats} onChange={(e) => setEditingCar({ ...editingCar, seats: e.target.value })} className={styles.inputField}>
                    {[2, 4, 5, 7, 8].map((n) => <option key={n} value={n} className="bg-gray-950">{n} {t.carDetails.seatsUnit}</option>)}
                  </select>
                </Field>
                <Field label={t.admin.cars.modal.fuel}>
                  <select value={editingCar.fuelType} onChange={(e) => setEditingCar({ ...editingCar, fuelType: e.target.value })} className={styles.inputField}>
                    {["Petrol", "Diesel", "Electric", "Hybrid"].map((f) => (
                      <option key={f} value={f} className="bg-gray-950">{t.cars[f.toLowerCase()] || f}</option>
                    ))}
                  </select>
                </Field>
                <Field label={t.admin.cars.modal.trans}>
                  <select value={editingCar.transmission} onChange={(e) => setEditingCar({ ...editingCar, transmission: e.target.value })} className={styles.inputField}>
                    <option value="Automatic" className="bg-gray-950">{t.cars.transmission_auto || "Automatic"}</option>
                    <option value="Manual" className="bg-gray-950">{t.cars.transmission_manual || "Manual"}</option>
                    <option value="CVT" className="bg-gray-950">CVT</option>
                  </select>
                </Field>
                <Field label={t.admin.cars.modal.mileage}>
                  <input type="number" value={editingCar.mileage} onChange={(e) => setEditingCar({ ...editingCar, mileage: e.target.value })} className={styles.inputField} />
                </Field>
                <Field label={t.admin.cars.modal.color}>
                  <input type="text" value={editingCar.color} onChange={(e) => setEditingCar({ ...editingCar, color: e.target.value })} className={styles.inputField} />
                </Field>
              </div>

              <Field label={t.admin.cars.modal.description}>
                <textarea
                  rows={3}
                  value={editingCar.description}
                  onChange={(e) => setEditingCar({ ...editingCar, description: e.target.value })}
                  className={styles.inputField + " resize-none"}
                />
              </Field>

              {/* Image upload */}
              <Field label={t.admin.cars.modal.image}>
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-start">
                  <div className="w-32 h-24 rounded-2xl bg-gray-950 overflow-hidden border border-white/10 shadow-lg flex-shrink-0">
                    {editImagePreview ? (
                      <img src={editImagePreview} alt="new" className="w-full h-full object-cover" />
                    ) : editingCar.image ? (
                      <img src={editingCar.image} alt="current" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10"><CarIcon size={28} /></div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label
                      htmlFor="edit-car-image"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-dashed border-white/10 hover:border-orange-500/40 hover:bg-white/10 cursor-pointer transition-all text-sm text-gray-300"
                    >
                      <UploadCloud size={18} className="text-orange-500" />
                      <span className="font-bold">
                        {editImageFile ? editImageFile.name : t.admin.cars.modal.uploadNew}
                      </span>
                    </label>
                    <input
                      id="edit-car-image"
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="hidden"
                    />
                    <p className="text-[10px] text-gray-600 font-mono">
                      {editImageFile
                        ? (lang === "vi" ? "Sẽ thay thế ảnh hiện tại khi lưu" : "Will replace current image on save")
                        : t.admin.cars.modal.keepCurrent}
                    </p>
                  </div>
                </div>
              </Field>

              <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                <button type="button" onClick={closeEdit} className={styles.buttonSecondary + " px-10"} disabled={isSaving}>
                  {t.admin.common.discard}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={styles.buttonPrimary + " px-12 shadow-xl shadow-orange-950/20 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"}
                >
                  {isSaving && <Loader2 size={16} className="animate-spin" />}
                  {t.admin.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

const StatCard = ({ icon, label, value, unit, tone }) => {
  const toneMap = {
    orange: "bg-orange-500/20 text-orange-500 shadow-orange-950/20",
    green: "bg-green-500/20 text-green-400 shadow-green-950/20",
    amber: "bg-amber-500/20 text-amber-400 shadow-amber-950/20",
    red: "bg-red-500/20 text-red-400 shadow-red-950/20",
  };
  return (
    <div className={`${styles.glassDark} p-5 rounded-2xl flex items-center gap-4 border border-white/5 shadow-2xl`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:rotate-12 duration-500 ${toneMap[tone] || toneMap.orange}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black leading-none mb-1">{label}</p>
        <p className="text-2xl font-black text-white leading-none tracking-tighter">
          {value} <span className="text-xs font-normal text-gray-500 tracking-normal ml-0.5">{unit}</span>
        </p>
      </div>
    </div>
  );
};

const Field = ({ label, required, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block ml-1">
      {label}{required && <span className="text-orange-500 ml-1">*</span>}
    </label>
    {children}
  </div>
);

export default ManageCarPage;
