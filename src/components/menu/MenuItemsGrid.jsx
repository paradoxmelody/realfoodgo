import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Rating,
  Typography,
  Fade
} from '@mui/material';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';

const MenuItemsGrid = ({ items, favorites, toggleFavorite, addToCart }) => {
  if (items.length === 0) {
    return (
      <Fade in timeout={500}>
        <Box sx={{ 
          textAlign: 'center', 
          py: 12, 
          bgcolor: 'white', 
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#9ca3af',
              fontWeight: 600,
              mb: 1
            }}
          >
            No menu items found
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Try adjusting your search or filter
          </Typography>
        </Box>
      </Fade>
    );
  }

  return (
    <Grid container spacing={3}>
      {items.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
          <Fade in timeout={300 + (index * 50)}>
            <Card
              sx={{
                height: '550px',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.15)'
                },
                bgcolor: 'white',
                overflow: 'hidden',
                border: '1px solid #f3f4f6'
              }}
            >
              {/* Image Section - Fixed Height */}
              <Box 
                sx={{ 
                  position: 'relative', 
                  width: '100%',
                  height: '250px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  bgcolor: '#f3f4f6'
                }}
              >
                <CardMedia
                  component="img"
                  image={item.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={item.name}
                  sx={{
                    width: '100%',
                    height: '250px',
                    minHeight: '250px',
                    maxHeight: '250px',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
                
                {/* Favorite Button */}
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    bgcolor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    width: 36,
                    height: 36,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'white',
                      transform: 'scale(1.15)'
                    }
                  }}
                >
                  {favorites.includes(item.id) ? (
                    <FaHeart color="#ff6b35" size={16} />
                  ) : (
                    <FaRegHeart color="#6b7280" size={16} />
                  )}
                </IconButton>
              </Box>

              {/* Content Section - Fixed Height */}
              <CardContent
                sx={{
                  height: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 2.5,
                  flexGrow: 0,
                  flexShrink: 0
                }}
              >
                {/* Item Name - Fixed Height */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 0.5,
                    fontSize: '1rem',
                    height: '2.5rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    color: '#166534',
                    flexShrink: 0
                  }}
                >
                  {item.name}
                </Typography>

                {/* Category - Fixed Height */}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#6b7280', 
                    fontSize: '0.8rem', 
                    mb: 1,
                    fontWeight: 500,
                    height: '1.2rem',
                    flexShrink: 0
                  }}
                >
                  {item.category || 'Food'}
                </Typography>

                {/* Rating - Fixed Height */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, height: '1.5rem', flexShrink: 0 }}>
                  <Rating 
                    value={item.rating || 4.5} 
                    readOnly 
                    size="small" 
                    precision={0.1}
                    sx={{ 
                      fontSize: '1rem',
                      '& .MuiRating-iconFilled': {
                        color: '#fbbf24'
                      }
                    }}
                  />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      ml: 1, 
                      color: '#374151',
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}
                  >
                    ({item.rating || 4.5})
                  </Typography>
                </Box>

                {/* Description - Fixed Height */}
                <Box 
                  sx={{ 
                    height: '48px',
                    mb: 1.5,
                    overflow: 'hidden',
                    flexShrink: 0
                  }}
                >
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: '0.85rem',
                      lineHeight: 1.4,
                      color: '#9ca3af'
                    }}
                  >
                    {item.description || 'Delicious menu item'}
                  </Typography>
                </Box>

                {/* Price - Fixed Height */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#ff6b35', 
                    fontSize: '1.3rem',
                    mb: 2,
                    height: '2rem',
                    flexShrink: 0
                  }}
                >
                  {item.price ? `R${item.price.toFixed(2)}` : 'Price not available'}
                </Typography>

                {/* Add to Cart Button - Pushed to Bottom */}
                <Box sx={{ mt: 'auto' }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<FaShoppingCart size={14} />}
                    onClick={() => addToCart(item)}
                    sx={{
                      bgcolor: '#16a34a',
                      color: 'white',
                      fontWeight: 700,
                      py: 1.2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: '#15803d',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(22, 163, 74, 0.35)'
                      }
                    }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      ))}
    </Grid>
  );
};

export default MenuItemsGrid;