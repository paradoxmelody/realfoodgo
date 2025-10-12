import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Rating,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  FaHeart,
  FaHome,
  FaRegHeart,
  FaSearch,
  FaShoppingCart,
  FaStore,
  FaUser,
  FaUtensils
} from 'react-icons/fa';
import { MdLocalOffer } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase_data/firebase';
import foodgoLogo from './foodgo.png';

const VendorsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Student meals', 'Fast Food', 'Japanese', 'Student budget', 'Asian', 'Coffee', 'Pizza', 'Italian', 'Mexican', 'Bar', 'Restaurant'];

  useEffect(() => {
    fetchVendors();
  }, []);

  async function fetchVendors() {
    try {
      setLoading(true);
      const vendorsCollection = collection(db, 'vendors');
      const vendorSnapshot = await getDocs(vendorsCollection);
      const vendorList = vendorSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVendors(vendorList);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || vendor.category?.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const hotDeals = vendors.filter(v => v.deals && v.deals.length > 0).slice(0, 4);

  const toggleFavorite = (vendorId) => {
    if (favorites.includes(vendorId)) {
      setFavorites(favorites.filter(id => id !== vendorId));
    } else {
      setFavorites([...favorites, vendorId]);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h5">Loading vendors...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Top Navigation */}
      <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'rgba(14, 10, 73, 1)', boxShadow: 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#ff6b35', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src={foodgoLogo} width={50} height={40} alt="logo" />
          </Typography>
          <Button color="inherit" startIcon={<FaHome />} onClick={() => navigate('/')}>Home</Button>
          <Button color="inherit" startIcon={<FaStore />} sx={{ bgcolor: '#ff6b35', color: 'white', mx: 1 }}>Vendors</Button>
          <Button color="inherit" startIcon={<FaUtensils />} onClick={() => navigate('/vendors')}>Menu</Button>
          <IconButton color="inherit" onClick={() => navigate('/cart')}>
            <FaShoppingCart />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate('/profile')}>
            <FaUser />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Search Bar */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Search for vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <FaSearch style={{ marginRight: 8, color: '#999' }} />
            }}
            sx={{ 
              bgcolor: 'white', 
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </Box>

        {/* Hot Deals Section */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <MdLocalOffer color="#ff6b35" /> Hot Deals This Week!
          </Typography>
          
          {hotDeals.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No hot deals available right now. Check back soon!
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {hotDeals.map(deal => (
                <Grid item xs={12} sm={6} md={3} key={deal.id}>
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    borderRadius: 3, 
                    boxShadow: 3, 
                    transition: 'transform 0.2s', 
                    '&:hover': { transform: 'translateY(-8px)' },
                    bgcolor: 'white'
                  }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={deal.image || 'https://via.placeholder.com/400x300'}
                      alt={deal.name}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1.1rem' }}>
                        {deal.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                        {deal.deals[0]}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                        {deal.category}
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button 
                        fullWidth 
                        variant="contained" 
                        sx={{ 
                          bgcolor: '#03032eff', 
                          borderRadius: 2,
                          py: 1,
                          fontWeight: 'bold',
                          '&:hover': { bgcolor: '#333' } 
                        }}
                        onClick={() => navigate(`/menu/${deal.id}`)}
                      >
                        Order Now
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Sidebar Categories */}
          <Box sx={{ 
            width: 280, 
            flexShrink: 0,
            bgcolor: 'white', 
            p: 3, 
            borderRadius: 2, 
            height: 'fit-content', 
            position: 'sticky', 
            top: 80,
            boxShadow: 1
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Categories
            </Typography>
            <List sx={{ py: 0 }}>
              {categories.map(category => (
                <ListItem
                  button
                  key={category}
                  selected={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    py: 1,
                    '&.Mui-selected': {
                      bgcolor: '#ff6b35',
                      color: 'white',
                      '&:hover': { bgcolor: '#ff8555' }
                    }
                  }}
                >
                  <ListItemText 
                    primary={category} 
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: selectedCategory === category ? 'bold' : 'normal'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Vendors Grid */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>  
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
              Explore Campus Vendors
            </Typography>
            
            {filteredVendors.length === 0 ? (
              <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
                No vendors found. Try a different search or category.
              </Typography>
            ) : (
              <Grid container spacing={2}>  
                {filteredVendors.map(vendor => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={vendor.id}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      borderRadius: 2, 
                      boxShadow: 1, 
                      transition: 'transform 0.2s', 
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 },
                      bgcolor: 'white',
                      overflow: 'hidden'
                    }}>
                      <CardMedia
                        component="img"
                        height="120" 
                        image={vendor.image || 'https://via.placeholder.com/400x300'}
                        alt={vendor.name}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 2, pb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '0.95rem' }}>
                          {vendor.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem' }}>
                          {vendor.category}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Rating 
                            value={vendor.rating || 0} 
                            precision={0.1} 
                            size="small" 
                            readOnly 
                            sx={{ fontSize: '0.9rem' }}
                          />
                          <Typography variant="body2" sx={{ ml: 1, fontSize: '0.75rem' }}>
                            {vendor.rating || 'N/A'}
                          </Typography>
                        </Box>
                      </CardContent>
                      <Box sx={{ p: 1.5, display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Button
                          fullWidth
                          variant="contained"
                          size="small"
                          sx={{ 
                            bgcolor: '#030227ff', 
                            borderRadius: 1.5,
                            py: 0.75,
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            minWidth: 'auto',
                            '&:hover': { bgcolor: '#333' } 
                          }}
                          onClick={() => navigate(`/menu/${vendor.id}`)}
                        >
                          View Menu
                        </Button>
                        <IconButton
                          onClick={() => toggleFavorite(vendor.id)}
                          sx={{ 
                            color: favorites.includes(vendor.id) ? '#ff6b35' : '#ccc',
                            border: '1px solid #eee',
                            borderRadius: 1.5,
                            width: 32,
                            height: 32
                          }}
                          size="small"
                        >
                          {favorites.includes(vendor.id) ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
                        </IconButton>
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

export default VendorsPage;