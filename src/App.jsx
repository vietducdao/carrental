import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ChatProvider } from "./context/ChatContext";
import { LanguageProvider } from "./context/LanguageContext";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";

import Nav from "./Components/Nav/Nav";
import Footer from "./Components/Footer/Footer";
import AdminLayout from "./Components/Admin/AdminLayout";
import AdminLogin from "./Components/Admin/AdminLogin";
import RequireAdminAuth from "./Components/Admin/RequireAdminAuth";
import RequireAuth from "./Components/Admin/RequireAuth";
import ScrollToTop from "./Components/Scroll/ScrollToTop";
import ChatbotWidget from "./Components/Chatbot/ChatbotWidget";

// Pages
import Index from "./Components/Pages";
import CarsDetails from "./Components/Pages/CarsDetails";
import About from "./Components/Pages/About";
import Services from "./Components/Pages/Services";
import Cars from "./Components/Pages/Cars";
import Blog from "./Components/Pages/Blog";
import Teams from "./Components/Pages/Teams";
import Contact from "./Components/Pages/Contact";
import Login from "./Components/Pages/Login";
import Register from "./Components/Pages/Register";
import Profile from "./Components/Pages/Profile";
import BookingHistory from "./Components/Pages/BookingHistory";
import Cart from "./Components/Pages/Cart";
import PaymentPage from "./Components/Pages/PaymentPage";

// Admin pages
import AddCarPage from "./Components/Admin/AddCarPage";
import ManageCarPage from "./Components/Admin/ManageCarPage";
import BookingPage from "./Components/Admin/BookingPage";
import ManageUsersPage from "./Components/Admin/ManageUsersPage";
import ManageCategoriesPage from "./Components/Admin/ManageCategoriesPage";
import ManageVouchersPage from "./Components/Admin/ManageVouchersPage";
import FinancialPage from "./Components/Admin/FinancialPage";
import ReportsPage from "./Components/Admin/ReportsPage";
import AdminChatPage from "./Components/Admin/AdminChatPage";
import ManageBlogPage from "./Components/Admin/ManageBlogPage";
import ManageTestimonialsPage from "./Components/Admin/ManageTestimonialsPage";
import ManageTeamPage from "./Components/Admin/ManageTeamPage";
import ManageServicesPage from "./Components/Admin/ManageServicesPage";
import SiteSettingsPage from "./Components/Admin/SiteSettingsPage";
import Promotions from "./Components/Pages/Promotions";

// Customer shell: separate AuthProvider (scope="user") + Cart + Chat + SiteSettings + layout
const CustomerShell = () => (
  <AuthProvider scope="user">
    <SiteSettingsProvider>
      <CartProvider>
        <ChatProvider>
          <Nav />
          <Outlet />
          <Footer />
          <ChatbotWidget />
        </ChatProvider>
      </CartProvider>
    </SiteSettingsProvider>
  </AuthProvider>
);

// Admin shell: separate AuthProvider (scope="admin"), no cart/chat
const AdminShell = () => (
  <AuthProvider scope="admin">
    <Outlet />
  </AuthProvider>
);

function App() {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public customer routes — scoped user session */}
          <Route element={<CustomerShell />}>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/car/:id" element={<CarsDetails />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/promotions" element={<Promotions />} />

            {/* Protected customer routes */}
            <Route element={<RequireAuth />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/booking-history" element={<BookingHistory />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/payment/:bookingId" element={<PaymentPage />} />
            </Route>
          </Route>

          {/* Admin routes — scoped admin session */}
          <Route element={<AdminShell />}>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<RequireAdminAuth />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AddCarPage />} />
                <Route path="manage-cars" element={<ManageCarPage />} />
                <Route path="bookings" element={<BookingPage />} />
                <Route path="users" element={<ManageUsersPage />} />
                <Route path="categories" element={<ManageCategoriesPage />} />
                <Route path="vouchers" element={<ManageVouchersPage />} />
                <Route path="financial" element={<FinancialPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="chat" element={<AdminChatPage />} />
                <Route path="blog" element={<ManageBlogPage />} />
                <Route path="testimonials" element={<ManageTestimonialsPage />} />
                <Route path="team" element={<ManageTeamPage />} />
                <Route path="services" element={<ManageServicesPage />} />
                <Route path="settings" element={<SiteSettingsPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
