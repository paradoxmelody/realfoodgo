import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Rating,
  Typography
} from '@mui/material';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Home,
  Search,
  ShoppingCart,
  User,
  Store,
  Flame,
  Pizza,
  Coffee,
  IceCream2,
  Fish,
  Heart,
  Salad,
  HelpCircle
} from 'lucide-react';
import { GiNoodles, GiTacos } from 'react-icons/gi';
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
  const [user, setUser] = useState({
    name: 'User'
  });

  const categoryIcons = [
    { name: 'Hot Deals', icon: <Flame />, color: '#ff6b35', value: 'deals' },
    { name: 'Pizza', icon: <Pizza />, color: '#f7931e', value: 'Pizza' },
    { name: 'Burgers', icon: <Salad />, color: '#22c55e', value: 'Fast Food' },
    { name: 'Asian', icon: <GiNoodles />, color: '#16a34a', value: 'Asian' },
    { name: 'Coffee', icon: <Coffee />, color: '#fb923c', value: 'Coffee' },
    { name: 'Mexican', icon: <GiTacos />, color: '#ec4899', value: 'Mexican' },
    { name: 'Japanese', icon: <Fish />, color: '#8b5cf6', value: 'Japanese' },
    { name: 'Desserts', icon: <IceCream2 />, color: '#f59e0b', value: 'Italian' }
  ];

  useEffect(() => {
    fetchVendors();
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      const userId = 'MoWabG5a62fsUosBOW2a1UtLJYo1';
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

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
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === 'deals') {
      return matchesSearch && vendor.deals && vendor.deals.length > 0;
    }

    const matchesCategory = selectedCategory === 'All' ||
      vendor.category?.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

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
        <Typography variant="h5">Loading restaurants...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f0fdf4', minHeight: '100vh' }}>
      {/* Custom Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: '1rem 5%',
        background: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src={foodgoLogo} width={50} height={40} alt="logo" />
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: '#1f2937',
                fontSize: '0.95rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              <Home size={20} />
              Home
            </button>

            <button
              style={{
                background: '#16a34a',
                border: 'none',
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#15803d'}
              onMouseLeave={(e) => e.target.style.background = '#16a34a'}
            >
              <Store size={20} />
              Vendors
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{
          flexGrow: 1,
          maxWidth: '500px',
          margin: '0 2rem'
        }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: '#f9fafb',
            borderRadius: '1.5rem',
            padding: '0.6rem 1rem',
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
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.9rem',
                width: '100%',
                color: '#1f2937'
              }}
              onFocus={(e) => {
                e.target.parentElement.style.border = '2px solid #16a34a';
                e.target.parentElement.style.boxShadow = '0 0 0 4px rgba(22, 163, 74, 0.2)';
                e.target.parentElement.style.background = 'white';
              }}
              onBlur={(e) => {
                e.target.parentElement.style.border = '2px solid transparent';
                e.target.parentElement.style.boxShadow = 'none';
                e.target.parentElement.style.background = '#f9fafb';
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/CartPage')}
            style={{
              background: 'none',
              border: 'none',
              color: '#1f2937',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            <ShoppingCart size={22} />
          </button>

          <button
            onClick={() => alert('Help & Support')}
            style={{
              background: 'none',
              border: 'none',
              color: '#1f2937',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            <HelpCircle size={22} />
          </button>

          <button
            onClick={() => navigate('/ProfilePage')}
            style={{
              background: 'none',
              border: '2px solid #e5e7eb',
              color: '#1f2937',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#16a34a';
              e.target.style.color = '#16a34a';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.color = '#1f2937';
            }}
          >
            <User size={20} />
            {user.name.split(' ')[0]}
          </button>
        </div>
      </nav>

      <Container maxWidth="xl" sx={{ py: 4, mt: '80px' }}>
        {/* Category Icons Section */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#166534' }}>
            Browse by Category
          </Typography>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(4, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(8, 1fr)' },
            gap: 2,
            maxWidth: 1200
          }}>
            {categoryIcons.map((category, index) => (
              <Box
                key={index}
                onClick={() => setSelectedCategory(category.value)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  p: 2,
                  bgcolor: 'white',
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: selectedCategory === category.value ? `2px solid ${category.color}` : '2px solid transparent',
                  boxShadow: selectedCategory === category.value ? '0 8px 16px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.05)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.12)'
                  }
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: category.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.8rem',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1) rotate(5deg)'
                    }
                  }}
                >
                  {category.icon}
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: selectedCategory === category.value ? 'bold' : 600,
                    color: selectedCategory === category.value ? category.color : '#1f2937',
                    fontSize: '0.85rem',
                    textAlign: 'center'
                  }}
                >
                  {category.name}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Clear Filter Button */}
          {selectedCategory !== 'All' && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setSelectedCategory('All')}
                sx={{
                  borderColor: '#16a34a',
                  color: '#16a34a',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#15803d',
                    bgcolor: '#f0fdf4'
                  }
                }}
              >
                Clear Filter
              </Button>
            </Box>
          )}
        </Box>

        {/* Vendors Grid */}
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#166534' }}>
            {selectedCategory === 'deals' ? '🔥 Hot Deals This Week' :
             selectedCategory === 'All' ? 'All Restaurants' :
             `${selectedCategory} Restaurants`}
          </Typography>

          {filteredVendors.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'white', borderRadius: 3 }}>
              <Typography variant="h6" color="text.secondary">
                No restaurants found. Try a different category!
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2.5}>
              {filteredVendors.map(vendor => (
                <Grid item xs={6} sm={4} md={3} key={vendor.id}>
                  <Card sx={{
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
                  }}>
                    <Box sx={{ position: 'relative', paddingTop: '75%', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        image={vendor.image || 'https://via.placeholder.com/400x300'}
                        alt={vendor.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      {vendor.deals && vendor.deals.length > 0 && (
                        <Box sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: '#ff6b35',
                          color: 'white',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1.5,
                          fontSize: '0.65rem',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}>
                          <Flame size={12} /> DEAL
                        </Box>
                      )}
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 1.5, display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          mb: 0.5,
                          fontSize: '0.9rem',
                          color: '#166534',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {vendor.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          fontSize: '0.75rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {vendor.category}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <Rating
                          value={vendor.rating || 0}
                          precision={0.1}
                          size="small"
                          readOnly
                          sx={{ fontSize: '0.85rem' }}
                        />
                        <Typography variant="body2" sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600 }}>
                          ({vendor.rating || 'N/A'})
                        </Typography>
                      </Box>
                      {vendor.deals && vendor.deals.length > 0 && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#ff6b35',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            mb: 'auto'
                          }}
                        >
                          🎉 {vendor.deals[0]}
                        </Typography>
                      )}
                    </CardContent>
                    <Box sx={{ p: 1.5, pt: 0, display: 'flex', gap: 0.75 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: '#16a34a',
                          borderRadius: 1.5,
                          py: 0.6,
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          textTransform: 'none',
                          '&:hover': { bgcolor: '#15803d' }
                        }}
                        onClick={() => navigate(`/menu/${vendor.id}`)}
                      >
                        View Menu
                      </Button>
                      <IconButton
                        onClick={() => toggleFavorite(vendor.id)}
                        size="small"
                        sx={{
                          color: favorites.includes(vendor.id) ? '#ff6b35' : '#d1d5db',
                          border: '1.5px solid',
                          borderColor: favorites.includes(vendor.id) ? '#ff6b35' : '#e5e7eb',
                          borderRadius: 1.5,
                          width: 30,
                          height: 30,
                          flexShrink: 0,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.15)',
                            borderColor: '#ff6b35',
                            bgcolor: favorites.includes(vendor.id) ? '#fff7ed' : 'transparent'
                          }
                        }}
                      >
                        <Heart size={14} fill={favorites.includes(vendor.id) ? '#ff6b35' : 'none'} />
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default VendorsPage;