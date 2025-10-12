import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import { auth } from './firebase_data/firebase';
import LandingPage from './pages/LandingPage';
import MenuPage from './pages/MenuPage';
import SignupLogin from './pages/SignupLogin';
import VendorPage from './pages/VendorPage';
//import MenuPage from '.pages/MenuPage';
function App(){

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage user={user} />}/>
        <Route path="/auth" element={<SignupLogin/>} />
        <Route path="/vendor" element={<VendorPage/>} />
        <Route path="/menu/:vendorId" element={<MenuPage /> }/>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;