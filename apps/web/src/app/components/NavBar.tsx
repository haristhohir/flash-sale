import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth(); // get user and logout from context

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          FlashSale
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/flash-sale" className="hover:text-blue-600">Flash Sale</Link>
          <Link to="/status" className="hover:text-blue-600">My Orders</Link>

          {/* If user exists (logged in), show Logout; else show Login */}
          {user ? (
            <button
              onClick={logout}
              className="text-red-600 font-semibold hover:text-red-800 transition"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="hover:text-blue-600">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

