import { Navigate, Route, Routes } from "react-router-dom";

import { CompanyPage } from "../pages/Company/CompanyPage";
import { HomePage } from "../pages/Home/HomePage";
import { WatchlistPage } from "../pages/Watchlist/WatchlistPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/watchlist" element={<WatchlistPage />} />
      <Route path="/company/:ticker" element={<CompanyPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
