import React, { useState, useCallback, useMemo, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Plus, 
  Car, 
  DollarSign, 
  Users, 
  Fuel, 
  Activity, 
  Calendar, 
  Info, 
  Settings2, 
  Image as ImageIcon, 
  ChevronRight,
  Eye,
  Trash2,
  UploadCloud,
  CheckCircle2,
  Hash,
  Palette,
  Loader2,
  Lock
} from "lucide-react";
import api from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";
import { styles } from "../../assets/adminStyles";

const initialFormData = {
  carName: "",
  dailyPrice: "",
  seats: "4",
  fuelType: "Petrol",
  mileage: "",
  transmission: "Automatic",
  year: new Date().getFullYear().toString(),
  model: "",
  color: "",
  description: "",
  category: "Sedan",
  image: null,
  imagePreview: null,
};

const FormField = ({ label, icon: Icon, children, required }) => (
  <div className="space-y-3">
    <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
      {Icon && <Icon size={14} className="text-orange-500" />}
      {label} {required && <span className="text-orange-500">*</span>}
    </label>
    {children}
  </div>
);

const AddCarPage = () => {
  const [data, setData] = useState(initialFormData);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("info");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { lang, t } = useLanguage();

  // Fetch dynamic categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/categories");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const resetForm = useCallback(() => setData(initialFormData), []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const processFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error(lang === "vi" ? "Vui lòng chọn tệp ảnh hợp lệ" : "Please select a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) =>
      setData((prev) => ({
        ...prev,
        image: file,
        imagePreview: evt.target.result,
      }));
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => processFile(e.target.files?.[0]);
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  // Validation logic per tab
  const validateTab = (tabId) => {
    if (tabId === "info") {
      if (!data.carName || !data.dailyPrice || !data.category || !data.year) {
        toast.warning(lang === "vi" ? "Vui lòng hoàn thành Thông tin cơ bản trước khi tiếp tục" : "Please complete General Info before continuing", { theme: "dark" });
        return false;
      }
    }
    if (tabId === "specs") {
      if (!data.seats || !data.fuelType || !data.transmission || !data.mileage) {
        toast.warning(lang === "vi" ? "Vui lòng hoàn thành Thông số kỹ thuật trước khi tiếp tục" : "Please complete Technical Specs before continuing", { theme: "dark" });
        return false;
      }
    }
    return true;
  };

  const handlesNextStep = (e) => {
    if (e) e.preventDefault();
    if (validateTab(activeTab)) {
      const currentIdx = tabs.findIndex(t => t.id === activeTab);
      if (currentIdx < tabs.length - 1) {
        setActiveTab(tabs[currentIdx + 1].id);
      }
    }
  };

  const isTabAccessible = (targetTabId) => {
    const tabIndices = { "info": 0, "specs": 1, "media": 2 };
    const targetIndex = tabIndices[targetTabId];
    
    if (targetIndex === 0) return true; // Always can go back to info
    if (targetIndex === 1) return data.carName && data.dailyPrice && data.category && data.year;
    if (targetIndex === 2) return data.carName && data.dailyPrice && data.category && data.year && data.seats && data.fuelType && data.transmission && data.mileage;
    return false;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Safety check: Only submit if on the final tab
    if (activeTab !== "media") return;

    if (!data.image) {
      toast.error(lang === "vi" ? "Vui lòng tải lên ít nhất một hình ảnh của xe" : "Please upload at least one vehicle image", { theme: "dark" });
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      const fieldMappings = {
        make: data.carName,
        dailyRate: Number(data.dailyPrice),
        seats: Number(data.seats),
        fuelType: data.fuelType,
        mileage: Number(data.mileage),
        transmission: data.transmission,
        year: Number(data.year),
        model: data.model,
        color: data.color || "",
        description: data.description || "",
        category: data.category,
      };
      Object.entries(fieldMappings).forEach(([key, value]) => formData.append(key, value));
      if (data.image) formData.append("image", data.image);

      await api.post("/api/cars", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(t.admin.addCar.success.title + "! " + t.admin.addCar.success.message, { theme: "dark" });
      resetForm();
      setActiveTab("info");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || t.admin.common.error, { theme: "dark" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "info", label: t.admin.addCar.sections.info, icon: Info },
    { id: "specs", label: t.admin.addCar.sections.specs, icon: Settings2 },
    { id: "media", label: t.admin.addCar.sections.media, icon: ImageIcon },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Form Interface */}
        <div className="lg:col-span-7 space-y-6">
          <div className={styles.glassDark + " rounded-3xl p-2 flex gap-1 border border-white/5 shadow-2xl overflow-x-auto scrollbar-hide"}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              const accessible = isTabAccessible(tab.id);
              
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => accessible && setActiveTab(tab.id)}
                  className={`flex-1 min-w-[120px] flex items-center gap-3 py-4 px-6 rounded-2xl transition-all duration-500 relative ${
                    active 
                      ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xl shadow-orange-900/30 justify-start" 
                      : accessible 
                        ? "text-gray-500 hover:text-gray-300 hover:bg-white/5 justify-center" 
                        : "text-gray-700 opacity-40 cursor-not-allowed justify-center"
                  }`}
                >
                  {accessible || active ? <Icon size={18} className={active ? "animate-pulse" : ""} /> : <Lock size={16} />}
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider whitespace-nowrap">{tab.label}</span>
                  {active && <ChevronRight size={14} className="ml-auto block opacity-50 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className={styles.glassDark + " rounded-3xl border border-white/5 p-8 shadow-2xl relative overflow-hidden"}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
            
            <form 
              onSubmit={handleSubmit} 
              onKeyDown={(e) => { if (e.key === 'Enter' && activeTab !== 'media') e.preventDefault(); }}
              className="relative z-10 space-y-8"
            >
              {activeTab === "info" && (
                <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                  <FormField label={t.admin.addCar.labels.name} icon={Car} required>
                    <input name="carName" value={data.carName} onChange={handleChange} placeholder={t.admin.addCar.placeholders.name} className={styles.inputField} required />
                  </FormField>
                  <div className="grid grid-cols-2 gap-6">
                    <FormField label={t.admin.addCar.labels.price} icon={DollarSign} required>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                        <input name="dailyPrice" type="number" value={data.dailyPrice} onChange={handleChange} placeholder={t.admin.addCar.placeholders.price} className={styles.inputField + " pl-8"} required />
                      </div>
                    </FormField>
                    <FormField label={t.admin.addCar.labels.category} icon={Activity} required>
                      <select name="category" value={data.category} onChange={handleChange} className={styles.inputField}>
                        {categories.length > 0 ? (
                          categories.map(c => (
                            <option key={c._id} value={c.name} className="bg-gray-950">{c.name}</option>
                          ))
                        ) : (
                          ["Sedan", "SUV", "Sports", "Luxury"].map(c => (
                            <option key={c} value={c} className="bg-gray-950">{c}</option>
                          ))
                        )}
                      </select>
                    </FormField>
                  </div>
                  <FormField label={t.admin.addCar.labels.year} icon={Calendar} required>
                    <input name="year" type="number" value={data.year} onChange={handleChange} placeholder={t.admin.addCar.placeholders.year} className={styles.inputField} required />
                  </FormField>
                </div>
              )}

              {activeTab === "specs" && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField label={t.admin.addCar.labels.seats} icon={Users} required>
                      <select name="seats" value={data.seats} onChange={handleChange} className={styles.inputField}>
                        {[2, 4, 5, 7, 8].map(n => <option key={n} value={n} className="bg-gray-950">{n} {t.carDetails.seatsUnit}</option>)}
                      </select>
                    </FormField>
                    <FormField label={t.admin.addCar.labels.fuel} icon={Fuel} required>
                      <select name="fuelType" value={data.fuelType} onChange={handleChange} className={styles.inputField}>
                        {["Petrol", "Diesel", "Electric", "Hybrid"].map(f => (<option key={f} value={f} className="bg-gray-950">{t.cars[f.toLowerCase()] || f}</option>))}
                      </select>
                    </FormField>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <FormField label={t.admin.addCar.labels.transmission} icon={Settings2} required>
                      <select name="transmission" value={data.transmission} onChange={handleChange} className={styles.inputField}>
                        <option value="Automatic" className="bg-gray-950">{t.cars.transmission_auto}</option>
                        <option value="Manual" className="bg-gray-950">{t.cars.transmission_manual}</option>
                        <option value="CVT" className="bg-gray-950">CVT</option>
                      </select>
                    </FormField>
                    <FormField label={t.admin.addCar.labels.mileage} icon={Activity} required>
                    <div className="relative">
                        <input name="mileage" type="number" value={data.mileage} onChange={handleChange} placeholder={t.admin.addCar.placeholders.mileage} className={styles.inputField + " pr-12"} required />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 font-bold uppercase">MPG</span>
                      </div>
                    </FormField>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <FormField label={t.admin.addCar.labels.model} icon={Hash}>
                      <input name="model" value={data.model} onChange={handleChange} placeholder={t.admin.addCar.placeholders.model} className={styles.inputField} />
                    </FormField>
                    <FormField label={t.admin.addCar.labels.color} icon={Palette}>
                      <input name="color" value={data.color} onChange={handleChange} placeholder="vd: Đen huyền ảo" className={styles.inputField} />
                    </FormField>
                  </div>
                </div>
              )}

              {activeTab === "media" && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                  <FormField label={t.admin.addCar.labels.description} icon={Info}>
                    <textarea name="description" value={data.description} onChange={handleChange} rows={4} placeholder={t.admin.addCar.placeholders.description} className={styles.inputField + " resize-none"} />
                  </FormField>
                  
                  <FormField label={t.admin.addCar.labels.image} icon={ImageIcon} required>
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('car-image-upload').click()}
                      className={`relative min-h-[220px] rounded-3xl border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center p-6 cursor-pointer overflow-hidden ${
                        isDragging ? "bg-orange-500/10 border-orange-500 scale-[1.02] shadow-2xl shadow-orange-900/20" : "bg-white/5 border-white/10 hover:border-orange-500/50 hover:bg-white/10 shadow-inner"
                      }`}
                    >
                      <input id="car-image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      
                      {data.imagePreview ? (
                        <>
                          <img src={data.imagePreview} alt="Preview" className="w-full h-full object-cover absolute inset-0 opacity-40 blur-sm pointer-events-none" />
                          <div className="relative z-10 flex flex-col items-center gap-4">
                            <div className="w-20 h-20 rounded-2xl bg-white shadow-2xl overflow-hidden border-4 border-white">
                              <img src={data.imagePreview} alt="Thumb" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex gap-3">
                              <button onClick={(e) => {e.stopPropagation(); document.getElementById('car-image-upload').click();}} className="px-4 py-2 rounded-xl bg-orange-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">Change</button>
                              <button onClick={(e) => {e.stopPropagation(); setData(p => ({...p, image: null, imagePreview: null}));}} className="px-4 py-2 rounded-xl bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/20 transition-colors"><Trash2 size={14} /></button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-4 transition-transform duration-500 ${isDragging ? "scale-125 rotate-12" : ""}`}>
                            <UploadCloud className="text-orange-500" size={32} />
                          </div>
                          <p className="text-white font-bold mb-1">{t.admin.addCar.placeholders.upload}</p>
                          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{t.admin.addCar.placeholders.drop}</p>
                          <p className="text-[10px] text-gray-700 mt-4 font-mono">{t.admin.addCar.placeholders.imageTypes}</p>
                        </div>
                      )}
                    </div>
                  </FormField>
                </div>
              )}

              <div className="flex items-center justify-between pt-8 border-t border-white/5">
                <div className="flex gap-1.5">
                  {tabs.map(t => (
                    <div key={t.id} className={`w-2 h-2 rounded-full transition-all duration-500 ${activeTab === t.id ? "bg-orange-500 w-8 shadow-lg shadow-orange-500/50" : "bg-white/10"}`} />
                  ))}
                </div>
                <div className="flex gap-4">
                  {activeTab !== "info" && (
                    <button type="button" onClick={() => setActiveTab(tabs[tabs.findIndex(t => t.id === activeTab) - 1].id)} className={styles.buttonSecondary + " px-8"}>
                      {lang === "vi" ? "Quay lại" : "Back"}
                    </button>
                  )}
                  {activeTab !== "media" ? (
                    <button type="button" onClick={(e) => handlesNextStep(e)} className={styles.buttonPrimary + " px-8 flex items-center gap-2"}>
                      {lang === "vi" ? "Tiếp tục" : "Next"} <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className={styles.buttonPrimary + " px-12 font-black shadow-xl shadow-orange-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"}
                    >
                      {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : t.admin.addCar.submit}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Live Preview Card */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="flex items-center gap-3 mb-2 px-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Eye size={16} className="text-orange-500" />
            </div>
            <h2 className="text-lg font-black text-white uppercase tracking-tighter italic">{t.admin.addCar.sections.preview}</h2>
          </div>

          <div className={styles.glassDark + " rounded-3xl border border-white/10 overflow-hidden shadow-2xl group transition-all duration-700 hover:shadow-orange-900/10"}>
            <div className="relative h-64 bg-gray-900 overflow-hidden">
              {data.imagePreview ? (
                <img src={data.imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 bg-gray-950/50">
                  <Car size={64} className="mb-4 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest">{lang === "vi" ? "Chưa có ảnh xe" : "No vehicle image"}</p>
                </div>
              )}
              <div className="absolute top-4 right-4 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white font-black text-sm tracking-tighter">
                ${data.dailyPrice || "0"} <span className="text-[10px] text-gray-400 font-bold uppercase ml-1">/{t.carDetails.perDay || "day"}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60" />
            </div>

            <div className="p-8 space-y-6">
              <div>
                <span className="text-[10px] px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-400 font-black uppercase tracking-widest mb-2 inline-block shadow-inner">
                  {data.category}
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight leading-tight group-hover:text-orange-400 transition-colors">
                  {data.carName || (lang === "vi" ? "Tên phương tiện" : "Vehicle Name")}
                </h3>
                <p className="text-gray-500 text-xs font-bold font-mono mt-1 opacity-60">MODEL: {data.model || "—"} | YEAR: {data.year || "—"}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Settings2, value: t.cars[`transmission_${data.transmission.toLowerCase()}`] || data.transmission },
                  { icon: Fuel, value: t.cars[data.fuelType.toLowerCase()] || data.fuelType },
                  { icon: Activity, value: `${data.mileage || 0} MPG` }
                ].map((spec, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/5 transition-all hover:bg-white/10">
                    <spec.icon size={16} className="text-orange-500" />
                    <span className="text-[10px] font-bold text-gray-300 whitespace-nowrap">{spec.value}</span>
                  </div>
                ))}
              </div>

              {data.description && (
                <p className="text-sm text-gray-500 line-clamp-2 italic leading-relaxed pt-2 border-t border-white/5">
                  "{data.description}"
                </p>
              )}

              <div className="flex gap-3 pt-6">
                <div className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 text-xs font-bold uppercase tracking-widest cursor-not-allowed">
                  {lang === "vi" ? "Chi tiết" : "Details"}
                </div>
                <div className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 flex items-center justify-center text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-orange-900/20 cursor-not-allowed">
                  {lang === "vi" ? "Thuê ngay" : "Rent Now"}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex gap-4 items-start shadow-inner">
            <CheckCircle2 size={24} className="text-blue-400 flex-shrink-0" />
            <p className="text-xs text-blue-300 leading-relaxed font-medium">
              {lang === "vi" 
                ? "Giao diện này mô phỏng cách khách hàng sẽ nhìn thấy xe của bạn trên ứng dụng. Hãy đảm bảo thông tin và hình ảnh thật bắt mắt để tăng tỷ lệ thuê!" 
                : "This simulates how customers will see your vehicle. Ensure the info and images are eye-catching to increase rental rates!"}
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default AddCarPage;
