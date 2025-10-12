import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CampaignList from "./components/CampaignList";
import CampaignForm from "./components/CampaignForm";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/campaigns" element={<CampaignList />} />
        <Route path="/add" element={<CampaignForm />} />
      </Routes>
    </Router>
  );
}

export default App;
