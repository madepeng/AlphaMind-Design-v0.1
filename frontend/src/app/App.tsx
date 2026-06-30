import { Navigate, Route, Routes } from "react-router-dom";

import { HomePage } from "../pages/Home/HomePage";
import { WatchlistPage } from "../pages/Watchlist/WatchlistPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/watchlist" element={<WatchlistPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
