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
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Rating,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  FaClock,
  FaHeart,
  FaRegHeart,
  FaSearch,
  FaShoppingCart,
  FaUser
} from 'react-icons/fa';
import {
  MdCoffee,
  MdFastfood,
  MdIcecream,
  MdLocalPizza,
  MdLunchDining,
  MdRestaurant
} from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase_data/firebase';
import foodgoLogo from './foodgo.png';
//import './Menu.css';

const Menu = () => {
  const { vendorId } = useParams(); 
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Explore Restaurants');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating');

  // Fetch vendor and menu items
  useEffect(() => {
    fetchVendorAndMenu();
  }, [vendorId]);

  // Filter items when category or search changes
  useEffect(() => {
    filterMenuItems();
  }, [menuItems, selectedCategory, searchQuery, sortBy]);

  async function fetchVendorAndMenu() {
    try {
      // Fetch vendor info
      const vendorRef = doc(db, 'vendors', vendorId);
      const vendorSnap = await getDoc(vendorRef);

      if (vendorSnap.exists()) {
        setVendor({ id: vendorSnap.id, ...vendorSnap.data() });
      }

      // Fetch menu items for this vendor
      const menuQuery = query(
        collection(db, 'menu_items'),
        where('vendorId', '==', vendorId)
      );
      const menuSnapshot = await getDocs(menuQuery);
      const menuList = menuSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

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

    // Filter by category
    if (selectedCategory !== 'Explore Restaurants') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort items
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

  function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }

    // ama make ts look sexy fr

    alert(`${item.name} added to cart!`);
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h5">Loading menu...</Typography>
      </Box>
    );
  }

  if (!vendor) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h5">Restaurant not found</Typography>
      </Box>
    );
  }

  // Get unique categories from menu items
  const categories = ['Explore Restaurants', ...new Set(menuItems.map(item => item.category))];

  // Category icons mapping
  const categoryIcons = {
    'Pizza': <MdLocalPizza />,
    'Burgers': <MdFastfood />,
    'Salads': <MdLunchDining />,
    'Coffee': <MdCoffee />,
    'Desserts': <MdIcecream />,
    'Snacks': <MdFastfood />
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Top Navigation */}
      <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'blue', boxShadow: '0 2px 4px rgba(3, 2, 26, 0.1)' }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 'bold', color: '#ff6b35', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <img src={foodgoLogo} width={50} height={40} alt='rocky'></img>
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>
            Home
          </Button>
          <Button color="inherit" onClick={() => navigate('/vendor')}>
            Restaurants
          </Button>
          <Button color="inherit" sx={{ fontWeight: 'bold' }}>
            Menu
          </Button>
          <Button
            color="inherit"
            startIcon={<FaShoppingCart />}
            onClick={() => navigate('/CartPage')}
          >
            Cart
          </Button>
          <IconButton color="inherit" onClick={() => navigate('/ProfilePage')}>
            <FaUser />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search for food or restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <FaSearch style={{ marginRight: 8, color: '#999' }} />
            }}
            sx={{ bgcolor: 'white', borderRadius: 2 }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Sidebar - Categories */}
          <Box
            sx={{
              width: 240,
              bgcolor: 'white',
              borderRadius: 2,
              p: 2,
              height: 'fit-content',
              position: 'sticky',
              top: 80,
              boxShadow: '0 2px 8px rgba(4, 3, 31, 0.08)'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textTransform: 'uppercase', fontSize: '0.9rem' }}>
              Categories
            </Typography>
            <List disablePadding>
              {categories.map(category => (
                <ListItem key={category} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={selectedCategory === category}
                    onClick={() => setSelectedCategory(category)}
                    sx={{
                      borderRadius: 1,
                      '&.Mui-selected': {
                        bgcolor: '#f0f0f0',
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: '#e8e8e8' }
                      }
                    }}
                  >
                    {category !== 'Explore Restaurants' && (
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {categoryIcons[category] || <MdRestaurant />}
                      </ListItemIcon>
                    )}
                    <ListItemText
                      primary={category}
                      primaryTypographyProps={{ fontSize: '0.9rem' }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 2, textTransform: 'uppercase', fontSize: '0.9rem' }}>
              Quick Actions
            </Typography>
            <List disablePadding>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton sx={{ borderRadius: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <FaHeart color="#ff6b35" />
                  </ListItemIcon>
                  <ListItemText primary="Favorites" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton sx={{ borderRadius: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <FaClock color="#ff6b35" />
                  </ListItemIcon>
                  <ListItemText primary="Order History" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>

          {/* Main Content - Menu Items */}
          <Box sx={{ flexGrow: 1 }}>
            {/* Vendor Header */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {vendor.name} Menu
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip label={vendor.category} size="small" />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={vendor.rating || 0} precision={0.1} size="small" readOnly />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {vendor.rating || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Sort By */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {filteredItems.length} items found
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">Sort By:</Typography>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="rating">Rating</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </Box>
            </Box>

            {/* Menu Items Grid */}
            {filteredItems.length === 0 ? (
              <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
                No menu items found
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {filteredItems.map(item => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(3, 2, 22, 0.08)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 4px 12px rgba(3, 3, 24, 0.15)'
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="180"
                          image={item.image || 'https://via.placeholder.com/400x300'}
                          alt={item.name}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'white',
                            '&:hover': { bgcolor: '#f5f5f5' }
                          }}
                          onClick={() => toggleFavorite(item.id)}
                        >
                          {favorites.includes(item.id) ? (
                            <FaHeart color="#ff6b35" />
                          ) : (
                            <FaRegHeart />
                          )}
                        </IconButton>
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem', mb: 0.5 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                          {item.category}
                        </Typography>
                        {item.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.85rem' }}>
                            {item.description.length > 50
                              ? `${item.description.substring(0, 50)}...`
                              : item.description}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={item.rating || 4.5} precision={0.1} size="small" readOnly />
                          <Typography variant="caption" sx={{ ml: 0.5 }}>
                            {item.rating || 4.5} ({item.reviews || Math.floor(Math.random() * 500) + 50} reviews)
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff6b35', mb: 1 }}>
                          R{item.price.toFixed(2)}
                        </Typography>
                      </CardContent>
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          sx={{
                            bgcolor: '#060624ff',
                            color: 'white',
                            '&:hover': { bgcolor: '#040b1fff' },
                            textTransform: 'none',
                            fontWeight: 'bold'
                          }}
                          onClick={() => addToCart(item)}
                        >
                          Add to Cart
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Menu;