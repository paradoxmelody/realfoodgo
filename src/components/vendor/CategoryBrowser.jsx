import { Box, Button, Typography, Chip } from '@mui/material';
import {
  Flame,
  Pizza,
  Coffee,
  IceCream2,
  Fish,
  Salad
} from 'lucide-react';
import { GiNoodles, GiTacos } from 'react-icons/gi';

const CategoryBrowser = ({ selectedCategory, setSelectedCategory }) => {
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

  return (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: '#166534',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          Browse by Category
        </Typography>
        {selectedCategory !== 'All' && (
          <Chip
            label={`Filtering: ${categoryIcons.find(c => c.value === selectedCategory)?.name || selectedCategory}`}
            onDelete={() => setSelectedCategory('All')}
            sx={{
              bgcolor: '#dcfce7',
              color: '#166534',
              fontWeight: 600,
              '& .MuiChip-deleteIcon': {
                color: '#166534'
              }
            }}
          />
        )}
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { 
          xs: 'repeat(2, 1fr)', 
          sm: 'repeat(4, 1fr)', 
          md: 'repeat(8, 1fr)' 
        },
        gap: { xs: 1.5, sm: 2 },
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
              p: { xs: 1.5, sm: 2 },
              bgcolor: selectedCategory === category.value ? '#f0fdf4' : 'white',
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: selectedCategory === category.value 
                ? `3px solid ${category.color}` 
                : '2px solid #f3f4f6',
              boxShadow: selectedCategory === category.value 
                ? `0 8px 20px ${category.color}25` 
                : '0 2px 8px rgba(0,0,0,0.04)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 12px 28px ${category.color}30`,
                borderColor: category.color,
                bgcolor: selectedCategory === category.value ? '#f0fdf4' : '#fafafa'
              },
              '&:active': {
                transform: 'translateY(-4px)',
              }
            }}
          >
            <Box
              sx={{
                width: { xs: 50, sm: 60 },
                height: { xs: 50, sm: 60 },
                borderRadius: '50%',
                bgcolor: category.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: { xs: '1.4rem', sm: '1.8rem' },
                transition: 'transform 0.3s ease',
                boxShadow: `0 4px 12px ${category.color}40`,
                '&:hover': {
                  transform: 'scale(1.15) rotate(8deg)'
                }
              }}
            >
              {category.icon}
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: selectedCategory === category.value ? 700 : 600,
                color: selectedCategory === category.value ? category.color : '#374151',
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                textAlign: 'center',
                letterSpacing: '0.3px'
              }}
            >
              {category.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CategoryBrowser;