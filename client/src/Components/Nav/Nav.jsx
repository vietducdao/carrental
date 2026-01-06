import { is } from "date-fns/locale";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <nav
        className={`px-[12%] text-white fixed top-0 left-0 w-full z-[9999] transition-all duration-300 ${
          isScrolled ? "bg-[#111111] shadow-md" : "bg-transparent"
        } `}
      >
        <div className="navbar max-w-7xl py-4 flex items-center justify-between relative">
          <Link to="/" className="text-4xl font-bold logo font-bricolage">
            Car <span>shops</span>
          </Link>
          {/* Mobile Menu Button */}
          <div className="lg:hidden block">
            <button onClick={() => setIsOpen(!isOpen)}>
              <i
                className={`ri-menu-line text-2xl transition ${
                  isOpen ? "hidden" : "block"
                }`}
              ></i>
              <i
                className={`ri-close-line text-2xl transition ${
                  isOpen ? "block" : "hidden"
                }`}
              ></i>
            </button>
          </div>
          <ul
            className={`menu flex-col lg:flex-row lg:flex absolute lg:static top-full left-0 w-full lg:w-auto bg-black md:pl-5 md:py-4 lg:bg-transparent z-50
              ${isOpen ? "flex" : "hidden"} gap-2 text-sm font-medium
              `}
          >
            <li>
              <Link
                to="/"
                className="text-base opacity-70 hover:opacity-100 md:opacity-100 transition px-4 py-2 lg:px-0 lg:py-0"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-base opacity-70 hover:opacity-100 md:opacity-100 transition px-4 py-2 lg:px-0 lg:py-0"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="text-base opacity-70 hover:opacity-100 md:opacity-100 transition px-4 py-2 lg:px-0 lg:py-0"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/cars"
                className="text-base opacity-70 hover:opacity-100 md:opacity-100 transition px-4 py-2 lg:px-0 lg:py-0"
              >
                Cars
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className="text-base opacity-70 hover:opacity-100 md:opacity-100 transition px-4 py-2 lg:px-0 lg:py-0"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/teams"
                className="text-base opacity-70 hover:opacity-100 md:opacity-100 transition px-4 py-2 lg:px-0 lg:py-0"
              >
                Teams
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-base opacity-70 hover:opacity-100 md:opacity-100 transition px-4 py-2 lg:px-0 lg:py-0"
              >
                Contact
              </Link>
            </li>
          </ul>
          <div className="hidden lg:flex items-center gap-4">
            <i className="bi bi-telephone flex items-center justify-center border border-yellow-500 rounded-full text-2xl w-[45px] h-[45px]"></i>
            <div>
              <p className="text-xs text-white opacity-70">Need help?</p>
              <p className="font-semibold">0786-783-493</p>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
export default Nav;
