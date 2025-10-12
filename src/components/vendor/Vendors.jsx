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

// Mock data 
const mockVendors = [
  { id: 1, name: 'The Barn', category: 'Italian, Pizza', rating: 4.8, reviews: 1250, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
  { id: 2, name: 'Brewdubs', category: 'American, Burgers', rating: 4.5, reviews: 980, image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400' },
  { id: 3, name: 'Zasembo', category: 'Japanese, Sushi', rating: 4.7, reviews: 720, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400' },
  { id: 4, name: "Melody's Kitchen", category: 'Coffee, Pastries, Sandwiches', rating: 4.6, reviews: 1100, image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400' },
  { id: 5, name: "Malebaleba's Truck", category: 'Mexican, Tacos', rating: 4.4, reviews: 650, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
  { id: 6, name: 'Starbucks', category: 'Healthy, Salads', rating: 4.9, reviews: 880, image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400' },
  { id: 7, name: 'The Chinese House', category: 'Asian, Noodles', rating: 4.3, reviews: 520, image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400' },
  { id: 8, name: 'Braai and Pap', category: 'Grill, BBQ', rating: 4.6, reviews: 780, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400' },
];

const hotDeals = [
  { 
    id: 1, 
    name: 'Pizza Palace', 
    description: '2-for-1 Large Pizzas!',
    price: 'R105.99',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500' 
  },
  { 
    id: 2, 
    name: 'Burger Haven', 
    description: 'Mega Burger Combo - 20% Off!',
    price: 'R199.99',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500' 
  },
  { 
    id: 3, 
    name: 'Sushi Spot', 
    description: 'Sushi Platter for Two - Half Price!',
    price: 'R240.99',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500' 
  },
  { 
    id: 4, 
    name: 'Campus Cafe', 
    description: 'Coffee & Pastry',
    price: 'R55.00',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500' 
  },
];

const VendorsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);

  const categories = ['All', 'Student Meals', '', 'Healthy', 'Combo Deals', 'Asian', 'Coffee', 'Grill'];

  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || vendor.category.includes(selectedCategory);
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
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1.1rem' }}>
                      {deal.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                      {deal.description}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff6b35', mb: 2 }}>
                      {deal.price}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      sx={{ 
                        bgcolor: '#1a1a1a', 
                        borderRadius: 2,
                        py: 1,
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: '#333' } 
                      }}
                    >
                      Order Now
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Sidebar Categories  */}
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
            <Grid container spacing={2}> 
              {filteredVendors.map(vendor => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={vendor.id}>
                  <Card sx={{ 
                    height: '80%', 
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
                      image={vendor.image}
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
                          value={vendor.rating} 
                          precision={0.1} 
                          size="small" 
                          readOnly 
                          sx={{ fontSize: '0.9rem' }}
                        />
                        <Typography variant="body2" sx={{ ml: 1, fontSize: '0.75rem' }}>
                          {vendor.rating} ({vendor.reviews.toLocaleString()})
                        </Typography>
                      </Box>
                    </CardContent>
                    <Box sx={{ p: 1.5, display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        sx={{ 
                          bgcolor: '#1a1a1a', 
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
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default VendorsPage;