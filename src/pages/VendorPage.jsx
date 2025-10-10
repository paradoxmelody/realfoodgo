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
    ListItemText,
    Rating,
    TextField,
    Toolbar,
    Typography
} from '@mui/material';
import { useState } from 'react';
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

// Mock data - replace with Firebase data
const mockVendors = [
  { id: 1, name: 'The Barn', category: 'Fast Food', rating: 4.5, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', deals: ['Free Pizza Friday'] },
  { id: 2, name: 'Brewdubs', category: 'Bar', rating: 4.2, image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400', deals: [] },
  { id: 3, name: 'Dreshaan Home Of Bruwelas', category: 'Cafe', rating: 4.8, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', deals: [] },
  { id: 4, name: 'Melody Kitchen', category: 'Restaurant', rating: 4.6, image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400', deals: [] },
  { id: 5, name: "Kwa Eyethu", category: 'Street Food', rating: 4.9, image: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=400', deals: [] },
  { id: 6, name: 'Vida e cafe', category: 'Snacks', rating: 4.3, image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400', deals: [] },
  { id: 7, name: 'The Chinese House', category: 'Asian', rating: 4.7, image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400', deals: [] },
  { id: 8, name: 'Starbucks', category: 'Traditional', rating: 5.0, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400', deals: [] },
];

const hotDeals = [
  { id: 1, name: 'Buy 1 Get 1 FREE Pizza', vendor: 'The Barn', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500', price: 'R245.00', originalPrice: 'R490.00' },
  { id: 2, name: 'Burger Combo - 20% off', vendor: 'Brewskis', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', price: 'R150.00', originalPrice: 'R187.50' },
  { id: 3, name: 'Breakfast Box Deal - Half Price!', vendor: 'Cavendish', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500', price: 'R80.00', originalPrice: 'R160.00' },
  { id: 4, name: 'Sushi & Dessert', vendor: 'The Chinese House', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500', price: 'R125.00', originalPrice: 'R200.00' },
];

const VendorsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categories = ['All', 'Fast Food', 'Cafe', 'Restaurant', 'Street Food', 'Asian', 'Traditional', 'Halal', 'Vegan'];

  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (vendorId) => {
    if (favorites.includes(vendorId)) {
      setFavorites(favorites.filter(id => id !== vendorId));
    } else {
      setFavorites([...favorites, vendorId]);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Top Navigation */}
      <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'black', boxShadow: 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#ff6b35' }}>
            FoodGo
          </Typography>
          <Button color="inherit" startIcon={<FaHome />}>Home</Button>
          <Button color="inherit" startIcon={<FaStore />} sx={{ bgcolor: '#ff6b35', color: 'white', mx: 1 }}>Vendors</Button>
          <Button color="inherit" startIcon={<FaUtensils />}>Menu</Button>
          <IconButton color="inherit">
            <FaShoppingCart />
          </IconButton>
          <IconButton color="inherit">
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
            sx={{ bgcolor: 'white', borderRadius: 2 }}
          />
        </Box>

        {/* Hot Deals Section */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <MdLocalOffer color="#ff6b35" /> Hot Deals This Week!
          </Typography>
          <Grid container spacing={3}>
            {hotDeals.map(deal => (
              <Grid item xs={12} sm={6} md={3} key={deal.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 3, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-8px)' } }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={deal.image}
                    alt={deal.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Chip label="HOT DEAL" size="small" sx={{ bgcolor: '#ff6b35', color: 'white', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {deal.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {deal.vendor}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff6b35' }}>
                        {deal.price}
                      </Typography>
                      <Typography variant="body2" sx={{ textDecoration: 'line-through', color: '#999' }}>
                        {deal.originalPrice}
                      </Typography>
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2 }}>
                    <Button fullWidth variant="contained" sx={{ bgcolor: '#1a1a1a', '&:hover': { bgcolor: '#333' } }}>
                      Order Now
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Sidebar Categories */}
          <Box sx={{ width: 250, bgcolor: 'white', p: 3, borderRadius: 2, height: 'fit-content', position: 'sticky', top: 80 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Categories
            </Typography>
            <List>
              {categories.map(category => (
                <ListItem
                  button
                  key={category}
                  selected={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    '&.Mui-selected': {
                      bgcolor: '#ff6b35',
                      color: 'white',
                      '&:hover': { bgcolor: '#ff8555' }
                    }
                  }}
                >
                  <ListItemText primary={category} />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Vendors Grid */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
              Explore Campus Vendors
            </Typography>
            <Grid container spacing={3}>
              {filteredVendors.map(vendor => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={vendor.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 2, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 5 } }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={vendor.image}
                      alt={vendor.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {vendor.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {vendor.category}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={vendor.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {vendor.rating}
                        </Typography>
                      </Box>
                    </CardContent>
                    <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{ bgcolor: '#1a1a1a', '&:hover': { bgcolor: '#333' } }}
                        onClick={() => navigate(`/menu/${vendor.id}`)}
                      >
                        View Menu
                      </Button>
                      <IconButton
                        onClick={() => toggleFavorite(vendor.id)}
                        sx={{ color: favorites.includes(vendor.id) ? '#ff6b35' : '#ccc' }}
                      >
                        {favorites.includes(vendor.id) ? <FaHeart /> : <FaRegHeart />}
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default VendorsPage;