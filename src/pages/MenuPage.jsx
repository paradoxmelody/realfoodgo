import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  IconButton,
  Rating,
  TextField,
  Toolbar,
  Typography,
  Badge
} from '@mui/material';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  FaHeart,
  FaRegHeart,
  FaQuestionCircle
} from 'react-icons/fa';
import {
  MdCoffee,
  MdFastfood,
  MdIcecream,
  MdLocalPizza,
  MdLunchDining,
  MdRestaurant
} from 'react-icons/md';
import {
  ShoppingBag,
  Plus,
  Home,
  Store,
  UtensilsCrossed,
  Search,
  User
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { db, auth } from '../firebase_data/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useCart } from '../context/CartContext';
import foodgoLogo from './foodgo.png';

const Menu = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { addToCart: addToCartContext, getTotalItems } = useCart();
  const [vendor, setVendor] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating');
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserData(user.uid);
      } else {
        setCurrentUser(null);
        setUserData(null);
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      fetchVendorAndMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId, currentUser]);

  useEffect(() => {
    filterMenuItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItems, selectedCategory, searchQuery, sortBy]);

  async function fetchUserData(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  async function fetchVendorAndMenu() {
    try {
      const vendorRef = doc(db, 'vendors', vendorId);
      const vendorSnap = await getDoc(vendorRef);

      if (vendorSnap.exists()) {
        setVendor({ id: vendorSnap.id, ...vendorSnap.data() });
      }

      const menuQuery = query(
        collection(db, 'menu_items'),
        where('vendorId', '==', vendorId)
      );
      const menuSnapshot = await getDocs(menuQuery);
      const menuList = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setMenuItems(menuList);
      setFilteredItems(menuList);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterMenuItems() {
    let filtered = menuItems;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    setFilteredItems(filtered);
  }

  function toggleFavorite(itemId) {
    if (favorites.includes(itemId)) {
      setFavorites(favorites.filter(id => id !== itemId));
    } else {
      setFavorites([...favorites, itemId]);
    }
  }

  async function handleAddToCart(item) {
    try {
      await addToCartContext(item);
      alert(`${item.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f0fdf4' }}>
        <Typography variant="h5" sx={{ color: '#166534' }}>Loading menu...</Typography>
      </Box>
    );
  }

  if (!vendor) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f0fdf4' }}>
        <Typography variant="h5" sx={{ color: '#166534' }}>Restaurant not found</Typography>
      </Box>
    );
  }

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];

  const categoryIcons = {
    'Pizza': <MdLocalPizza />,
    'Burgers': <MdFastfood />,
    'Salads': <MdLunchDining />,
    'Coffee': <MdCoffee />,
    'Desserts': <MdIcecream />,
    'Snacks': <MdFastfood />
  };

  const categoryColors = {
    'Pizza': '#f97316',
    'Burgers': '#22c55e',
    'Salads': '#16a34a',
    'Coffee': '#fb923c',
    'Desserts': '#ec4899',
    'Snacks': '#f59e0b'
  };

  const totalCartItems = getTotalItems();

  return (
    <Box sx={{ bgcolor: '#f0fdf4', minHeight: '100vh' }}>
      {/* Navbar matching Cart.jsx */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: 'white',
          color: '#1f2937',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          zIndex: 1100
        }}
      >
        <Toolbar sx={{ gap: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
              <img src={foodgoLogo} width={50} height={40} alt="logo" />
            </Box>

            <Button
              color="inherit"
              startIcon={<Home size={18} />}
              onClick={() => navigate('/')}
              sx={{ color: '#1f2937', textTransform: 'none' }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              startIcon={<Store size={18} />}
              onClick={() => navigate('/vendor')}
              sx={{ color: '#1f2937', textTransform: 'none' }}
            >
              Restaurants
            </Button>
            <Button
              color="inherit"
              startIcon={<UtensilsCrossed size={18} />}
              sx={{
                bgcolor: '#16a34a',
                color: 'white',
                '&:hover': { bgcolor: '#15803d' },
                borderRadius: 2,
                px: 2,
                textTransform: 'none'
              }}
            >
              Menu
            </Button>
          </Box>

          <TextField
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <Search size={18} style={{ marginRight: 8, color: '#9ca3af' }} />
            }}
            sx={{
              flexGrow: 1,
              maxWidth: 500,
              bgcolor: '#f9fafb',
              borderRadius: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                '& fieldset': { border: 'none' }
              }
            }}
          />

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton
              color="inherit"
              onClick={() => navigate('/CartPage')}
              sx={{ color: '#1f2937' }}
            >
              <Badge badgeContent={totalCartItems} color="error">
                <ShoppingBag size={20} />
              </Badge>
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => alert('Help & Support')}
              sx={{ color: '#1f2937' }}
            >
              <FaQuestionCircle size={20} />
            </IconButton>
            <Button
              onClick={() => navigate('/ProfilePage')}
              sx={{
                border: '2px solid #e5e7eb',
                color: '#1f2937',
                borderRadius: 2,
                px: 1.5,
                textTransform: 'none'
              }}
              startIcon={<User size={18} />}
            >
              {userData?.name ? userData.name.split(' ')[0] : 'User'}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Page content offset for fixed navbar */}
      <Toolbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Restaurant Header */}
        <Box sx={{
          mb: 4,
          p: 4,
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%)',
          border: '1px solid #dcfce7'
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#166534' }}>
            {vendor.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              label={vendor.category}
              sx={{ bgcolor: '#16a34a', color: 'white', fontWeight: 600 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating value={vendor.rating || 0} precision={0.1} size="small" readOnly />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#6b7280' }}>
                {vendor.rating || 'N/A'} rating
              </Typography>
            </Box>
            {vendor.deals && vendor.deals.length > 0 && (
              <Chip
                label={`🔥 ${vendor.deals[0]}`}
                sx={{ bgcolor: '#ffedd5', color: '#ff6b35', fontWeight: 600 }}
              />
            )}
          </Box>
        </Box>

        {/* Category Filter Pills */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#166534' }}>
            Filter by Category
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {categories.map(category => (
              <Chip
                key={category}
                label={category}
                icon={categoryIcons[category] || <MdRestaurant />}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  py: 2.5,
                  px: 1,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  bgcolor: selectedCategory === category ? categoryColors[category] || '#16a34a' : 'white',
                  color: selectedCategory === category ? 'white' : '#1f2937',
                  border: selectedCategory === category ? 'none' : '2px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: selectedCategory === category ? categoryColors[category] || '#16a34a' : '#f0fdf4',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Sort and Count */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#166534' }}>
            {filteredItems.length} items found
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#6b7280' }}>Sort By:</Typography>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                backgroundColor: 'white',
                color: '#1f2937'
              }}
            >
              <option value="rating">Highest Rating</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </Box>
        </Box>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12, bgcolor: 'white', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No menu items found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filter
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredItems.map(item => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2.5,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
                    },
                    bgcolor: 'white',
                    overflow: 'hidden',
                    border: '1px solid #f0f0f0'
                  }}
                >
                  <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      image={item.image || 'https://via.placeholder.com/400x300'}
                      alt={item.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        width: 36,
                        height: 36,
                        '&:hover': { bgcolor: 'white', transform: 'scale(1.1)' }
                      }}
                      onClick={() => toggleFavorite(item.id)}
                    >
                      {favorites.includes(item.id) ?
                        <FaHeart color="#ff6b35" size={18} /> :
                        <FaRegHeart color="#6b7280" size={18} />
                      }
                    </IconButton>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        mb: 0.5,
                        color: '#166534',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', mb: 1 }}>
                      {item.category}
                    </Typography>
                    {item.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#9ca3af',
                          fontSize: '0.8rem',
                          mb: 1.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: 1.4,
                          minHeight: '2.8em'
                        }}
                      >
                        {item.description}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      <Rating value={item.rating || 4.5} precision={0.1} size="small" readOnly />
                      <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
                        ({item.rating || 4.5})
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff6b35', fontSize: '1.1rem', mb: 'auto' }}>
                      R{item.price.toFixed(2)}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="medium"
                      sx={{
                        bgcolor: '#16a34a',
                        borderRadius: 2,
                        py: 1,
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#15803d' }
                      }}
                      onClick={() => handleAddToCart(item)}
                      startIcon={<Plus size={16} />}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Menu;