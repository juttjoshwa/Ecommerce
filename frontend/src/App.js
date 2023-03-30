import React from "react";
import Header from "./componet/layout/Headers/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import webFont from "webfontloader";
import { useEffect } from "react";
import Footer from "./componet/layout/Footer/Footer";
import Home from "./componet/Home/Home.js";

function App() {
  useEffect(() => {
    webFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
