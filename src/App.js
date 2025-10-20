import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import MenuPage from './pages/MenuPage';
import SignupLogin from './pages/SignupLogin';
import VendorPage from './pages/VendorPage';
import CartApp from "./pages/CartPage";
import ProfilePage from './pages/ProfilePage';

function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />}/>
          <Route path="/auth" element={<SignupLogin/>} />

          {/* Protected Routes */}
          <Route path="/vendor" element={
            <ProtectedRoute>
              <VendorPage/>
            </ProtectedRoute>
          } />

          <Route path="/menu/:vendorId" element={
            <ProtectedRoute>
              <MenuPage />
            </ProtectedRoute>
          }/>

          <Route path="/ProfilePage" element={
            <ProtectedRoute>
              <ProfilePage/>
            </ProtectedRoute>
          }/>

          <Route path="/CartPage" element={
            <ProtectedRoute>
              <CartApp/>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;