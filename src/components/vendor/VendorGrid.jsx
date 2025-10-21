import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Rating,
  Typography
} from '@mui/material';
import { Flame, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VendorGrid = ({ vendors, selectedCategory, favorites, toggleFavorite }) => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#166534' }}>
        {selectedCategory === 'deals' ? '🔥 Hot Deals This Week' :
         selectedCategory === 'All' ? 'All Restaurants' :
         `${selectedCategory} Restaurants`}
      </Typography>

      {vendors.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'white', borderRadius: 3 }}>
          <Typography variant="h6" color="text.secondary">
            No restaurants found. Try a different category!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {vendors.map(vendor => (
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
  );
};

export default VendorGrid;