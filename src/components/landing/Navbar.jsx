import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Badge } from '@mui/material';
import { Home, Store, ShoppingCart, User, Search, HelpCircle } from 'lucide-react';
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

  const user = userDetails || { name: 'User' };

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
        p: '1rem 5%',
        maxWidth: '1600px',
        margin: '0 auto'
      }}>

        {/* Logo + Nav Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src={foodgoLogo} alt="FoodGo" width={200} height={200} />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <button
              onClick={() => navigate('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                background: isActive('/') ? '#f3f4f6' : 'none',
                color: isActive('/') ? '#16a34a' : '#1f2937',
                fontWeight: 500,
                fontSize: '0.95rem'
              }}
            >
              <Home size={18} color={isActive('/') ? '#16a34a' : '#1f2937'} /> Home
            </button>

            <button
              onClick={() => navigate('/vendor')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                background: isActive('/vendor') ? '#f3f4f6' : 'none',
                color: isActive('/vendor') ? '#16a34a' : '#1f2937',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}
            >
              <Store size={18} color={isActive('/vendor') ? '#16a34a' : '#1f2937'} /> Vendors
            </button>
          </Box>
        </Box>

        {/* Search Bar */}
        <Box sx={{ flexGrow: 1, maxWidth: 500, mx: 3 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#f9fafb',
            borderRadius: '2rem',
            px: 2,
            py: 0.5,
            border: '2px solid transparent',
            transition: 'all 0.3s ease',
            '&:focus-within': {
              borderColor: '#16a34a'
            }
          }}>
            <Search size={25} style={{ color: '#9ca3af', marginRight: 8 }} />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                background: 'transparent'
              }}
            />
          </Box>
        </Box>

        {/* Right Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {/* Cart with count */}
          <button
            onClick={() => navigate('/CartPage')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Badge
              badgeContent={cartCount}
              color="error"
            >
              <ShoppingCart
                size={22}
                color={isActive('/CartPage') ? '#16a34a' : '#111827'}
              />
            </Badge>
          </button>

          <button
            onClick={() => alert('Help & Support')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <HelpCircle size={22} color={isActive('/help') ? '#16a34a' : '#111827'} />
          </button>

          <button
            onClick={() => navigate('/ProfilePage')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '2px solid #e5e7eb',
              color: isActive('/ProfilePage') ? '#16a34a' : '#1f2937',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            <User size={20} color={isActive('/ProfilePage') ? '#16a34a' : '#1f2937'} />
            {user?.name?.split(' ')[0] || 'User'}
          </button>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;