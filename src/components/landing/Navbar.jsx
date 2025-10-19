import {
  Home,
  Store,
  ShoppingCart,
  User,
  Search,
  Menu
} from 'lucide-react';
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Badge from "@mui/material/Badge";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from '../../assets/images/foodgo.png';
import './Navbar.css';

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = false;
  const cartCount = 0;

  const menuOptions = [
    { text: "Home", icon: <Home size={20} />, action: () => navigate('/') },
    { text: "Restaurants", icon: <Store size={20} />, action: () => navigate('/vendor') },
    { text: "Cart", icon: <ShoppingCart size={20} />, action: () => navigate('/CartPage') },
  ];

  const handleMenuClick = (action) => {
    if (action) action();
    setOpenMenu(false);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/vendor?search=${searchQuery}`);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="header" style={{ backgroundColor: '#ffffff', padding: '1rem 2%', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Logo */}
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src={Logo} alt="FoodGo" style={{ height: '48px' }} />
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: location.pathname === '/' ? '#16a34a' : 'transparent',
              color: location.pathname === '/' ? 'white' : '#1f2937',
              fontWeight: location.pathname === '/' ? 600 : 500,
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.95rem',
            }}
          >
            <Home size={18} strokeWidth={2.5} />
            Home
          </button>

          <button
            onClick={() => navigate('/vendor')}
            style={{
              backgroundColor: location.pathname === '/vendor' ? '#16a34a' : 'transparent',
              color: location.pathname === '/vendor' ? 'white' : '#1f2937',
              fontWeight: location.pathname === '/vendor' ? 600 : 500,
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.95rem',
            }}
          >
            <Store size={18} strokeWidth={2.5} />
            Restaurants
          </button>
        </nav>

        {/* Search Bar */}
        <div style={{ flex: 1, maxWidth: '300px', margin: '0 1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem',
              padding: '0.5rem 1rem',
              border: '2px solid transparent',
              transition: 'all 0.3s ease',
            }}
          >
            <Search size={18} style={{ color: '#9ca3af', marginRight: '0.5rem' }} />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '0.9rem', width: '100%', color: '#1f2937' }}
            />
          </div>
        </div>

        {/* Right Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Cart */}
          <button onClick={() => navigate('/CartPage')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', position: 'relative' }}>
            <Badge badgeContent={cartCount} color="error" style={{ fontSize: '0.75rem' }}>
              <ShoppingCart size={22} />
            </Badge>
          </button>

          {/* Login/Profile */}
          {isLoggedIn ? (
            <button onClick={() => navigate('/ProfilePage')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
              <User size={22} />
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <User size={18} /> Login/Signup
            </button>
          )}

          {/* Hamburger for Mobile */}
          <button onClick={() => setOpenMenu(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        <Box sx={{ width: 280 }} role="presentation">
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <img src={Logo} alt="FoodGo" style={{ height: '30px' }} />
          </Box>
          <Divider />
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => handleMenuClick(item.action)}>
                  <ListItemIcon sx={{ minWidth: 40, color: '#16a34a' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ px: 2 }}>
            {isLoggedIn ? (
              <button
                onClick={() => { navigate('/ProfilePage'); setOpenMenu(false); }}
                style={{ width: '100%', backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Profile
              </button>
            ) : (
              <button
                onClick={() => { navigate('/auth'); setOpenMenu(false); }}
                style={{ width: '100%', backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Login / Sign Up
              </button>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Spacer */}
      <div style={{ height: '70px' }} />
    </>
  );
};

export default Navbar;
