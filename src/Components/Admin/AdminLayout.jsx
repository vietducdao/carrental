import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const location = useLocation();
  const { lang, switchLang, t } = useLanguage();
  const { user } = useAuth();
  const userData = user || {};

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin") return t.admin.sidebar.addCar;
    if (path === "/admin/manage-cars") return t.admin.sidebar.manageCars;
    if (path === "/admin/bookings") return t.admin.sidebar.bookings;
    if (path === "/admin/users") return t.admin.sidebar.users;
    if (path === "/admin/categories") return t.admin.sidebar.categories;
    if (path === "/admin/vouchers") return t.admin.sidebar.vouchers;
    if (path === "/admin/financial") return t.admin.sidebar.financial;
    if (path === "/admin/reports") return t.admin.sidebar.reports;
    return t.admin.common.dashboard;
  };

  const LangToggle = () => (
    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
      <button
        onClick={() => switchLang("vi")}
        className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all ${lang === "vi" ? "bg-orange-500 text-white shadow-lg shadow-orange-900/40" : "text-gray-500 hover:text-white"}`}
      >
        VI
      </button>
      <button
        onClick={() => switchLang("en")}
        className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all ${lang === "en" ? "bg-orange-500 text-white shadow-lg shadow-orange-900/40" : "text-gray-500 hover:text-white"}`}
      >
        EN
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-gray-950/50 backdrop-blur-md z-30 ml-0 lg:ml-20 transition-all">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-white">{getPageTitle()}</h1>
            <p className="text-xs text-gray-500">{t.admin.common.welcome}, {userData.name || "Administrator"}</p>
          </div>

          <div className="flex items-center gap-6">
            <LangToggle />
            
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-lg shadow-orange-900/20">
                {userData.name?.charAt(0) || "A"}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-semibold text-white">{userData.name || "Admin"}</span>
                <span className="text-[10px] text-orange-400 font-medium uppercase tracking-widest">{userData.role || "Admin"}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:ml-20 bg-gray-950">
          <div className="max-w-7xl mx-auto pb-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


