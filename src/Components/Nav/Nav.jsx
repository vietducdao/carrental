import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { User, LogOut, History, ShoppingCart, Shield } from "lucide-react";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { cartItems } = useCart();
  const { lang, switchLang, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  const navItems = [
    { to: "/", label: t.nav.home },
    { to: "/about", label: t.nav.about },
    { to: "/services", label: t.nav.services },
    { to: "/cars", label: t.nav.cars },
    { to: "/promotions", label: t.nav.promotions },
    { to: "/blog", label: t.nav.blog },
    { to: "/teams", label: t.nav.teams },
    { to: "/contact", label: t.nav.contact },
  ];

  const LangToggle = ({ className = "" }) => (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={() => switchLang("vi")}
        className={`text-xs font-semibold px-2 py-0.5 rounded transition ${lang === "vi" ? "bg-[#f5b754] text-black" : "text-gray-400 hover:text-white"}`}
        title="Tiếng Việt"
      >
        VI
      </button>
      <span className="text-gray-600 text-xs">|</span>
      <button
        onClick={() => switchLang("en")}
        className={`text-xs font-semibold px-2 py-0.5 rounded transition ${lang === "en" ? "bg-[#f5b754] text-black" : "text-gray-400 hover:text-white"}`}
        title="English"
      >
        EN
      </button>
    </div>
  );

  return (
    <nav className={`px-[12%] text-white fixed top-0 w-full z-[9999] transition-all duration-300 ${isScrolled ? "bg-[#111]/90 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
      <div className="navbar max-w-7xl py-4 flex items-center justify-between relative">
        <Link to="/" className="text-4xl font-bold logo font-bricolage">
          Car<span className="text-[#f5b754]">shops</span>
        </Link>

        {/* Mobile menu button */}
        <div className="lg:hidden block">
          <button onClick={() => setIsOpen(!isOpen)}>
            <i className={`ri-menu-line text-2xl transition ${isOpen ? "hidden" : "block"}`}></i>
            <i className={`ri-close-line text-2xl transition ${isOpen ? "block" : "hidden"}`}></i>
          </button>
        </div>

        {/* Nav links */}
        <ul className={`menu flex-col lg:flex-row lg:flex absolute lg:static top-full left-0 w-full lg:w-auto bg-black md:pl-5 md:py-4 lg:bg-transparent z-50 ${isOpen ? "flex" : "hidden"} gap-2 text-sm font-medium`}>
          {navItems.map((item) => (
            <li key={item.to}>
              <Link to={item.to} onClick={() => setIsOpen(false)}
                className="text-base opacity-70 hover:opacity-100 md:opacity-100 transition px-4 py-2 lg:px-0 lg:py-0">
                {item.label}
              </Link>
            </li>
          ))}

          {/* Mobile-only auth links */}
          <div className="lg:hidden border-t border-gray-800 mt-2 pt-2 space-y-1">
            <div className="px-4 py-2"><LangToggle /></div>
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 text-base opacity-70 hover:opacity-100 transition">
                  <User size={16} />{t.nav.profile}
                </Link>
                <Link to="/booking-history" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 text-base opacity-70 hover:opacity-100 transition">
                  <History size={16} />{t.nav.bookingHistory}
                </Link>
                <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 text-base opacity-70 hover:opacity-100 transition">
                  <ShoppingCart size={16} />{t.nav.cart}
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 text-[#f5b754] transition">
                    <Shield size={16} />{t.nav.admin}
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-400 transition w-full text-left">
                  <LogOut size={16} />{t.nav.logout}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 text-base opacity-70 hover:opacity-100 transition">
                  {t.nav.login}
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 text-[#f5b754] transition">
                  {t.nav.register}
                </Link>
              </>
            )}
          </div>
        </ul>

        {/* Desktop right section */}
        <div className="hidden lg:flex items-center gap-3">
          <LangToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/booking-history" title={t.nav.bookingHistory} className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-gray-700 flex items-center justify-center text-gray-400 hover:text-[#f5b754] hover:border-[#f5b754] transition">
                <History size={16} />
              </Link>
              <Link to="/cart" title={t.nav.cart} className="relative w-9 h-9 rounded-full bg-[#1a1a1a] border border-gray-700 flex items-center justify-center text-gray-400 hover:text-[#f5b754] hover:border-[#f5b754] transition">
                <ShoppingCart size={16} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#f5b754] text-black text-[10px] font-bold flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1a1a1a] border border-gray-700 hover:border-[#f5b754] transition text-sm text-white">
                <div className="w-6 h-6 rounded-full bg-[#f5b754] flex items-center justify-center text-black font-bold text-xs overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; e.target.parentElement.textContent = user?.name?.charAt(0)?.toUpperCase() || "U"; }} />
                  ) : (
                    user?.name?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>
                <span className="max-w-[80px] truncate">{user?.name}</span>
              </Link>
              <button onClick={handleLogout} title={t.nav.logout} className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-gray-700 flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-400/50 transition">
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-sm text-white hover:text-[#f5b754] transition">{t.nav.login}</Link>
              <Link to="/register" className="px-4 py-2 text-sm bg-[#f5b754] text-black rounded-xl hover:bg-amber-400 transition font-semibold">{t.nav.register}</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
