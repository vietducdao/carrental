import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Nav from "./Components/Nav/Nav";
import Footer from "./Components/Footer/Footer";

import Index from "./Components/Pages";
import CarsDetails from "./Components/Pages/CarsDetails";
import About from "./Components/Pages/About";
import Services from "./Components/Pages/Services";
import Cars from "./Components/Pages/Cars";
import Blog from "./Components/Pages/Blog";
import Teams from "./Components/Pages/Teams";
import Contact from "./Components/Pages/Contact";
import ScrollToTop from "./Components/Scroll/ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/car/:id" element={<CarsDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
