import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import TextEnhancer from "./components/Enhance/TextEnhancer";
import ImageToTextEnhancer from "./components/ImageEnhance/ImageToTextEnhancer";
import Summarizer from "./components/Summarizer/Summarizer";
import "./App.css";
import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Navbar />
      {/* <Home /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/text-enhancer" element={<TextEnhancer />} />
        <Route path="/image-to-text-enhancer" element={<ImageToTextEnhancer />} />
        <Route path="/summarizer" element={<Summarizer />} />
        {/* <Route path="/speak" element={<h1 className="content">Text-to-Speech</h1>} /> */}
      </Routes>
      
    </Router>
  );
}

export default App;
