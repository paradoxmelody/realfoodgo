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
    {
      text: "Home",
      icon: <Home size={20} />,
      action: () => navigate('/')
    },
    {
      text: "Restaurants",
      icon: <Store size={20} />,
      action: () => navigate('/vendor')
    },
    {
      text: "Cart",
      icon: <ShoppingCart size={20} />,
      action: () => navigate('/CartPage')
    },
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
<<<<<<< HEAD
    <nav>
      <div className="nav-logo-container">
        <img src={Logo} alt="" width={40} height={40}/>
      </div>
      <div className="navbar-links-container">
        <a href="">Home</a>
        <a href="#" onClick={() => navigate('/vendor')}>Restaurants</a>
        <a href="#" onClick={() => navigate('/vendor')}>Menu</a>
        <a href="#">Contact</a>
        <button onClick={() => navigate('/CartPage')} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
          <BsCart2 className="navbar-cart-icon" />
        </button>
        <button className="primary-button" onClick={() => navigate('/auth')}>Login/Sign Up</button>
      </div>
      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
=======
    <>
      <header className="header" style={{
        backgroundColor: '#ffffff',
        padding: '1rem 2%',
        paddingBottom: '1rem'
      }}>
        {/* Logo */}
        <div className="logo" style={{ cursor: 'pointer' }}>
          <img src={Logo} alt="FoodGo" style={{ height: '48px' }} onClick={() => navigate('/')} />
        </div>

        {/* Navigation Links */}
        <nav className="navbar" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <button onClick={() => navigate('/')} style={{
            backgroundColor: location.pathname === '/' ? '#16a34a' : 'transparent',
            color: location.pathname === '/' ? 'white' : '#1f2937',
            fontWeight: location.pathname === '/' ? 600 : 500,
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.95rem'
          }}
          onMouseEnter={(e) => {
            if (location.pathname !== '/') {
              e.currentTarget.style.backgroundColor = '#f0fdf4';
              e.currentTarget.style.color = '#16a34a';
            }
          }}
          onMouseLeave={(e) => {
            if (location.pathname !== '/') {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#1f2937';
            }
          }}>
            <Home size={18} strokeWidth={2.5} />
            Home
          </button>

          <button onClick={() => navigate('/vendor')} style={{
            backgroundColor: location.pathname === '/vendor' ? '#16a34a' : 'transparent',
            color: location.pathname === '/vendor' ? 'white' : '#1f2937',
            fontWeight: location.pathname === '/vendor' ? 600 : 500,
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.95rem'
          }}
          onMouseEnter={(e) => {
            if (location.pathname !== '/vendor') {
              e.currentTarget.style.backgroundColor = '#f0fdf4';
              e.currentTarget.style.color = '#16a34a';
            }
          }}
          onMouseLeave={(e) => {
            if (location.pathname !== '/vendor') {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#1f2937';
            }
          }}>
            <Store size={18} strokeWidth={2.5} />
            Restaurants
          </button>
        </nav>

        {/* Search Bar */}
        <div style={{ flex: 1, maxWidth: '300px', margin: '0 1.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            border: '2px solid transparent',
            transition: 'all 0.3s ease'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = '2px solid #16a34a';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = '2px solid transparent';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Search size={18} style={{ color: '#9ca3af', marginRight: '0.5rem' }} />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                outline: 'none',
                fontSize: '0.9rem',
                width: '100%',
                color: '#1f2937'
              }}
            />
          </div>
        </div>

        {/* Right Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Cart Button with Badge */}
          <button onClick={() => navigate('/CartPage')} style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: location.pathname === '/CartPage' ? '#16a34a' : '#1f2937',
            transition: 'color 0.2s',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
            onMouseEnter={(e) => e.target.style.color = '#16a34a'}
            onMouseLeave={(e) => e.target.style.color = location.pathname === '/CartPage' ? '#16a34a' : '#1f2937'}
            title="Shopping Cart"
          >
            <Badge badgeContent={cartCount} color="error" style={{ fontSize: '0.75rem' }}>
              <ShoppingCart size={22} />
            </Badge>
          </button>

          {/* Account / Login Button */}
          {isLoggedIn ? (
            <button onClick={() => navigate('/ProfilePage')} style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: location.pathname === '/ProfilePage' ? '#16a34a' : '#1f2937',
              transition: 'color 0.2s',
              padding: '0.5rem'
            }}
              onMouseEnter={(e) => e.target.style.color = '#16a34a'}
              onMouseLeave={(e) => e.target.style.color = location.pathname === '/ProfilePage' ? '#16a34a' : '#1f2937'}
              title="Profile"
            >
              <User size={22} />
            </button>
          ) : (
            <button onClick={() => navigate('/auth')} style={{
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1.25rem',
              borderRadius: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#15803d';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#16a34a';
              }}
            >
              <User size={18} />
              Login/Signup
            </button>
          )}
        </div>

        {/* Hamburger Menu - Mobile Only */}
        <button
          onClick={() => setOpenMenu(true)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#1f2937',
            marginLeft: '1rem',
            display: 'none',
            '@media (max-width: 768px)': { display: 'flex' }
          }}
>>>>>>> b7b83dd (Save all local changes before pulling)
        >
          <Menu size={24} />
        </button>
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
                  <ListItemIcon sx={{ minWidth: 40, color: '#16a34a' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ px: 2 }}>
            {isLoggedIn ? (
              <button onClick={() => { navigate('/ProfilePage'); setOpenMenu(false); }} style={{
                width: '100%',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                Profile
              </button>
            ) : (
              <button onClick={() => { navigate('/auth'); setOpenMenu(false); }} style={{
                width: '100%',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                Login / Sign Up
              </button>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Spacer to prevent content from being hidden */}
      <div style={{ height: '70px' }} />
    </>
  );
};

export default Navbar;