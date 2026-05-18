import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Car,
  CalendarCheck,
  Users,
  Tag,
  Ticket,
  DollarSign,
  BarChart3,
  MessageSquare,
  FileText,
  Star,
  Briefcase,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { styles } from "../../assets/adminStyles";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { logout } = useAuth();

  const navLinks = [
    { path: "/admin", icon: PlusCircle, label: t.admin.sidebar.addCar },
    { path: "/admin/manage-cars", icon: Car, label: t.admin.sidebar.manageCars },
    { path: "/admin/bookings", icon: CalendarCheck, label: t.admin.sidebar.bookings },
    { path: "/admin/users", icon: Users, label: t.admin.sidebar.users },
    { path: "/admin/categories", icon: Tag, label: t.admin.sidebar.categories },
    { path: "/admin/vouchers", icon: Ticket, label: t.admin.sidebar.vouchers },
    { path: "/admin/financial", icon: DollarSign, label: t.admin.sidebar.financial },
    { path: "/admin/reports", icon: BarChart3, label: t.admin.sidebar.reports },
    { path: "/admin/chat", icon: MessageSquare, label: t.admin.sidebar.chat },
    { path: "/admin/blog", icon: FileText, label: t.admin.sidebar.blog || "Blog" },
    { path: "/admin/testimonials", icon: Star, label: t.admin.sidebar.testimonials || "Đánh giá" },
    { path: "/admin/team", icon: Users, label: t.admin.sidebar.team || "Đội ngũ" },
    { path: "/admin/services", icon: Briefcase, label: t.admin.sidebar.services || "Dịch vụ" },
    { path: "/admin/settings", icon: Settings, label: t.admin.sidebar.settings || "Thiết lập" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  const isExpanded = isHovered || mobileOpen;

  const NavItem = ({ link }) => (
    <NavLink
      to={link.path}
      end={link.path === "/admin"}
      className={({ isActive }) =>
        `${styles.sidebarItem} ${
          isActive ? styles.sidebarItemActive : styles.sidebarItemInactive
        } ${!isExpanded ? "justify-center px-0" : "px-4"}`
      }
      onClick={() => setMobileOpen(false)}
    >
      <link.icon size={20} className="flex-shrink-0" />
      <span className={`font-medium whitespace-nowrap transition-all duration-300 ${
        isExpanded ? "opacity-100 w-auto ml-3" : "opacity-0 w-0 overflow-hidden ml-0"
      }`}>
        {link.label}
      </span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 bg-orange-600 rounded-lg text-white shadow-lg"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 left-0 h-screen z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          mobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
        } ${isHovered ? "lg:w-64 shadow-2xl shadow-black/80" : "lg:w-20 shadow-none"} bg-gray-950/90 backdrop-blur-xl border-r border-white/5 flex flex-col overflow-x-hidden`}
      >
        {/* Header/Logo */}
        <div className="p-6 flex items-center h-20 border-b border-white/5 overflow-hidden">
          <div className={`flex items-center gap-3 transition-all duration-300 ${isExpanded ? "mx-0" : "mx-auto"}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-900/40 flex-shrink-0">
              <Car size={22} />
            </div>
            <span className={`font-bold text-lg text-white tracking-wider transition-all duration-300 ${
              isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
            }`}>
              CAR<span className="text-orange-500">SHOPS</span>
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-2 overflow-y-auto overflow-x-hidden pt-6 scrollbar-hide">
          {navLinks.map((link) => (
            <div key={link.path} className="group relative">
              <NavItem link={link} />
              {!isExpanded && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap border border-white/10 z-[70] shadow-xl">
                  {link.label}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-white/5 mt-auto">
          <button
            onClick={handleLogout}
            className={`${styles.sidebarItem} text-red-500 hover:bg-red-500/10 w-full transition-all duration-300 ${!isExpanded ? "justify-center px-0" : "px-4"}`}
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className={`font-medium transition-all duration-300 ${
              isExpanded ? "opacity-100 w-auto ml-3" : "opacity-0 w-0 overflow-hidden ml-0"
            }`}>
              {t.admin.sidebar.logout}
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
