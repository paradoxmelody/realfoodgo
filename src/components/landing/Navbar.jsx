import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Badge } from '@mui/material';
import {Home, Store, ShoppingCart, User, Search, HelpCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import foodgoLogo from '../../assets/images/foodgo.png';

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems } = useCart();
  const { userDetails } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const count = getTotalItems();
    setCartCount(count);
  }, [getTotalItems]);

  const user = userDetails || { name: 'Login' };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.includes(path);
  };

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1100,
      bgcolor: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: { xs: '0.5rem 2%', sm: '0.75rem 3%', md: '1rem 5%' },
        maxWidth: '1600px',
        margin: '0 auto'
      }}>

        {/* Logo + Nav Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5, md: 3 } }}>
          <Box sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img
              src={foodgoLogo}
              alt="FoodGo"
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '80px',
                maxHeight: '50px'
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1, md: 2 } }}>
            <button
              onClick={() => navigate('/vendor')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: window.innerWidth < 640 ? '0.4rem 0.6rem' : '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                background: isActive('/vendor') ? '#f3f4f6' : 'none',
                color: isActive('/vendor') ? '#16a34a' : '#1f2937',
                fontWeight: 600,
                fontSize: window.innerWidth < 640 ? '0.8rem' : '0.95rem',
                whiteSpace: 'nowrap'
              }}
            >
              <Home size={window.innerWidth < 640 ? 16 : 18} color={isActive('/vendor') ? '#16a34a' : '#1f2937'} />
              {window.innerWidth < 640 ? 'Home' : 'Home'}
            </button>
          </Box>
        </Box>

        {/* Search Bar */}
        <Box sx={{
          flexGrow: 1,
          maxWidth: { xs: '120px', sm: '250px', md: '500px' },
          mx: { xs: 0.5, sm: 1.5, md: 3 }
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#f9fafb',
            borderRadius: '2rem',
            px: { xs: 1, sm: 1.5, md: 2 },
            py: { xs: 0.3, sm: 0.4, md: 0.5 },
            border: '2px solid transparent',
            transition: 'all 0.3s ease',
            '&:focus-within': {
              borderColor: '#16a34a'
            }
          }}>
            <Search
              size={window.innerWidth < 640 ? 16 : window.innerWidth < 900 ? 20 : 25}
              style={{ color: '#9ca3af', marginRight: window.innerWidth < 640 ? 4 : 8, flexShrink: 0 }}
            />
            <input
              type="text"
              placeholder={window.innerWidth < 640 ? "Search..." : "Search restaurants..."}
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                background: 'transparent',
                fontSize: window.innerWidth < 640 ? '0.8rem' : '1rem'
              }}
            />
          </Box>
        </Box>

        {/* Right Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5, md: 3 } }}>
          {/* Cart with count */}
          <button
            onClick={() => navigate('/CartPage')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            <Badge
              badgeContent={cartCount}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: window.innerWidth < 640 ? '0.65rem' : '0.75rem',
                  minWidth: window.innerWidth < 640 ? '16px' : '20px',
                  height: window.innerWidth < 640 ? '16px' : '20px'
                }
              }}
            >
              <ShoppingCart
                size={window.innerWidth < 640 ? 18 : 22}
                color={isActive('/CartPage') ? '#16a34a' : '#111827'}
              />
            </Badge>
          </button>

          <button
            onClick={() => alert('Help & Support')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            <HelpCircle
              size={window.innerWidth < 640 ? 18 : 22}
              color={isActive('/help') ? '#16a34a' : '#111827'}
            />
          </button>

          <button
            onClick={() => navigate('/ProfilePage')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: window.innerWidth < 640 ? '0.4rem 0.6rem' : '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '2px solid #e5e7eb',
              color: isActive('/ProfilePage') ? '#16a34a' : '#1f2937',
              fontWeight: 600,
              fontSize: window.innerWidth < 640 ? '0.8rem' : '0.95rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <User size={window.innerWidth < 640 ? 16 : 20} color={isActive('/ProfilePage') ? '#16a34a' : '#1f2937'} />
            {user?.name?.split(' ')[0] || 'User'}
          </button>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;