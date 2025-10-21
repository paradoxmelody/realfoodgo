import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import OrderComplete from './components/checkout/OrderComplete';
import TrackOrder from './components/checkout/TrackOrder';

import LandingPage from './pages/LandingPage';
import MenuPage from './pages/MenuPage';
import SignupLogin from './pages/SignupLogin';
import VendorPage from './pages/VendorPage';
import CartApp from "./pages/CartPage";
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<SignupLogin />} />

            {/* Protected Routes */}
            <Route
              path="/vendor"
              element={
                <ProtectedRoute>
                  <VendorPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/menu/:vendorId"
              element={
                <ProtectedRoute>
                  <MenuPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ProfilePage"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/CartPage"
              element={
                <ProtectedRoute>
                  <CartApp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route path="/OrderComplete" element={
              <ProtectedRoute>
                <OrderComplete />
              </ProtectedRoute>
            } />
            <Route path="/TrackOrder" element={
              <ProtectedRoute>
                <TrackOrder />
              </ProtectedRoute>
            } />

          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
