import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  Rating,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { db, auth } from '../firebase_data/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useCart } from '../context/CartContext';
import Navbar from '../components/landing/Navbar';
import {
  MdCoffee,
  MdFastfood,
  MdIcecream,
  MdLocalPizza,
  MdLunchDining,
  MdRestaurant,
} from 'react-icons/md';

const Menu = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { addToCart: addToCartContext } = useCart();

  const [vendor, setVendor] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [addingItem, setAddingItem] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserData(user.uid);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (currentUser && vendorId) {
      fetchVendorAndMenu();
    }
  }, [vendorId, currentUser]);

  useEffect(() => {
    filterMenuItems();
  }, [menuItems, selectedCategory, searchQuery, sortBy]);

  async function fetchUserData(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    } catch (err) {
      setError('Unable to load your profile. Please refresh the page.');
    }
  }

  async function fetchVendorAndMenu() {
    setLoading(true);
    setError('');
    try {
      const vendorRef = doc(db, 'vendors', vendorId);
      const vendorSnap = await getDoc(vendorRef);

      if (vendorSnap.exists()) {
        setVendor({ id: vendorSnap.id, ...vendorSnap.data() });
      } else {
        setError('Restaurant not found');
        setLoading(false);
        return;
      }

      const menuQuery = query(collection(db, 'menu_items'), where('vendorId', '==', vendorId));
      const menuSnapshot = await getDocs(menuQuery);
      const menuList = menuSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setMenuItems(menuList);
      setFilteredItems(menuList);
      setLoading(false);
    } catch (err) {
      setError('Unable to load menu. Please check your connection and try again.');
      setLoading(false);
    }
  }

  function filterMenuItems() {
    let filtered = [...menuItems];
    if (selectedCategory !== 'All')
      filtered = filtered.filter((item) => item.category === selectedCategory);
    if (searchQuery)
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    if (sortBy === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
    setFilteredItems(filtered);
  }

  async function handleAddToCart(item) {
    if (addingItem) return;
    setAddingItem(true);
    try {
      await addToCartContext(item);
      setSnackbarMessage(`${item.name} added to your cart!`);
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage('Failed to add item. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setAddingItem(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ bgcolor: '#f0fdf4', minHeight: '100vh' }}>
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} userData={userData} activePage="Vendors" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <Typography variant="h5" sx={{ color: '#166534' }}>Loading menu...</Typography>
        </Box>
      </Box>
    );
  }

  if (error || !vendor) {
    return (
      <Box sx={{ bgcolor: '#f0fdf4', minHeight: '100vh' }}>
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} userData={userData} activePage="Vendors" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h5" sx={{ color: '#dc2626' }}>{error || 'Restaurant not found'}</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/vendor')}
            sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' } }}
          >
            Back to Vendors
          </Button>
        </Box>
      </Box>
    );
  }

  const categories = ['All', ...new Set(menuItems.map((item) => item.category))];
  const categoryIcons = {
    Pizza: <MdLocalPizza />,
    Burgers: <MdFastfood />,
    Salads: <MdLunchDining />,
    Coffee: <MdCoffee />,
    Desserts: <MdIcecream />,
    Snacks: <MdFastfood />,
  };
  const categoryColors = {
    Pizza: '#f97316',
    Burgers: '#22c55e',
    Salads: '#16a34a',
    Coffee: '#fb923c',
    Desserts: '#ec4899',
    Snacks: '#f59e0b',
  };

  return (
    <Box sx={{ bgcolor: '#f0fdf4', minHeight: '100vh' }}>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} userData={userData} activePage="Vendors" />
      <Box sx={{ height: '80px' }} />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Vendor Info - Uber Eats Style */}
        <Box
          sx={{
            mb: 4,
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Vendor Cover Image */}
          {vendor.image && (
            <Box
              component="img"
              src={vendor.image}
              alt={vendor.name}
              sx={{
                width: '100%',
                height: { xs: '180px', sm: '220px', md: '280px' },
                objectFit: 'cover',
              }}
            />
          )}

          {/* Vendor Details */}
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#166534', fontSize: { xs: '1.5rem', sm: '2rem' }, mb: 1 }}>
              {vendor.name}
            </Typography>

            {vendor.rating && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                <Rating value={vendor.rating} precision={0.1} readOnly size="small" />
                <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 600 }}>
                  {vendor.rating}
                </Typography>
              </Box>
            )}

            {vendor.description && (
              <Typography variant="body1" sx={{ color: '#6b7280', mb: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                {vendor.description}
              </Typography>
            )}
            {vendor.address && (
              <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                📍 {vendor.address}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Category Chips */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#166534', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Filter by Category
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label="Rating"
                onClick={() => setSortBy('rating')}
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  bgcolor: sortBy === 'rating' ? '#16a34a' : 'white',
                  color: sortBy === 'rating' ? 'white' : '#1f2937',
                  border: sortBy === 'rating' ? 'none' : '2px solid #e5e7eb',
                  '&:hover': { bgcolor: sortBy === 'rating' ? '#15803d' : '#f0fdf4' },
                }}
              />
              <Chip
                label="Price: Low"
                onClick={() => setSortBy('price-low')}
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  bgcolor: sortBy === 'price-low' ? '#16a34a' : 'white',
                  color: sortBy === 'price-low' ? 'white' : '#1f2937',
                  border: sortBy === 'price-low' ? 'none' : '2px solid #e5e7eb',
                  '&:hover': { bgcolor: sortBy === 'price-low' ? '#15803d' : '#f0fdf4' },
                }}
              />
              <Chip
                label="Price: High"
                onClick={() => setSortBy('price-high')}
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  bgcolor: sortBy === 'price-high' ? '#16a34a' : 'white',
                  color: sortBy === 'price-high' ? 'white' : '#1f2937',
                  border: sortBy === 'price-high' ? 'none' : '2px solid #e5e7eb',
                  '&:hover': { bgcolor: sortBy === 'price-high' ? '#15803d' : '#f0fdf4' },
                }}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                icon={categoryIcons[category] || <MdRestaurant />}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  py: 2.5,
                  px: 1,
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  bgcolor: selectedCategory === category ? categoryColors[category] || '#16a34a' : 'white',
                  color: selectedCategory === category ? 'white' : '#1f2937',
                  border: selectedCategory === category ? 'none' : '2px solid #e5e7eb',
                  '&:hover': { bgcolor: selectedCategory === category ? categoryColors[category] : '#f0fdf4' },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* No Items Message */}
        {filteredItems.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: '#6b7280' }}>
              No items found
            </Typography>
          </Box>
        )}

        {/* Menu Items */}
        <Grid container spacing={3}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                }}
              >
                <CardMedia
                  component="img"
                  image={item.image || 'https://via.placeholder.com/400x300'}
                  alt={item.name}
                  sx={{
                    height: 200,
                    width: '100%',
                    objectFit: 'cover',
                  }}
                />

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#166534', mb: 0.5 }}>
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      flexGrow: 1,
                      mb: 1,
                      minHeight: '2.4em',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.description}
                  </Typography>

                  <Rating value={item.rating || 4.5} size="small" readOnly sx={{ mt: 'auto' }} />

                  <Typography variant="h6" sx={{ color: '#f97316', fontWeight: 'bold', mt: 1 }}>
                    R{item.price.toFixed(2)}
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    disabled={addingItem}
                    sx={{
                      bgcolor: '#16a34a',
                      mt: 2,
                      borderRadius: 2,
                      '&:hover': { bgcolor: '#15803d' },
                      '&:disabled': { bgcolor: '#d1d5db' },
                    }}
                    onClick={() => handleAddToCart(item)}
                    startIcon={<Plus size={16} />}
                  >
                    {addingItem ? 'Adding...' : 'Add to Cart'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{
            width: '100%',
            bgcolor: '#f97316',
            color: 'white',
            fontWeight: 600,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Menu;