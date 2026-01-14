import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./Components/Nav/Nav";
import Index from "./Components/Pages";
import CarsDetails from "./Components/Pages/CarsDetails";
function App() {
  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Index />}></Route>
          <Route path="/car/:id" element={<CarsDetails />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
