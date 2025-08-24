import { Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar';
import Home from './pages/Home';
import PurchaseStatus from './pages/PurchaseStatus';
import Login from './pages/Login';
import FlashSale from './pages/FlashSale';
import ProtectedRoute from './components/ProtectedRoute';

export function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/flash-sale"
          element={
            <ProtectedRoute>
              <FlashSale />
            </ProtectedRoute>
          }
        />
        <Route
          path="/status/:id"
          element={
            <ProtectedRoute>
              <PurchaseStatus />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
