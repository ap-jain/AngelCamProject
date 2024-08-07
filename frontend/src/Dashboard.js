import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import Camera from "./components/Camera";
import "./App.css";

const myWidth = 240;

function Dashboard() {
  return (
    <div className="App">
      <NavBar drawerWidth={myWidth} />
      <div style={{ marginLeft: myWidth }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cameras/:id" element={<Camera />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
