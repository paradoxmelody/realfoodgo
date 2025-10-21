import { Box, Chip, Typography } from '@mui/material';
import {
  MdRestaurant,
  MdFastfood,
  MdLocalDrink,
  MdIcecream
} from 'react-icons/md';

const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  // Define main categories only (not specific food types)
  const mainCategories = [
    { 
      name: 'All', 
      icon: <MdRestaurant />, 
      color: '#6b7280',
      bgColor: '#f3f4f6'
    },
    { 
      name: 'Food', 
      icon: <MdFastfood />, 
      color: '#16a34a',
      bgColor: '#dcfce7'
    },
    { 
      name: 'Drinks', 
      icon: <MdLocalDrink />, 
      color: '#2563eb',
      bgColor: '#dbeafe'
    },
    { 
      name: 'Desserts', 
      icon: <MdIcecream />, 
      color: '#ec4899',
      bgColor: '#fce7f3'
    }
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 700, 
          mb: 2,
          color: '#1f2937'
        }}
      >
        Categories
      </Typography>
      
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 1.5, 
          flexWrap: 'wrap',
          pb: 2,
          borderBottom: '2px solid #e5e7eb'
        }}
      >
        {mainCategories.map((category) => {
          const isSelected = selectedCategory === category.name;
          
          return (
            <Chip
              key={category.name}
              icon={category.icon}
              label={category.name}
              onClick={() => setSelectedCategory(category.name)}
              sx={{
                px: 2,
                py: 2.5,
                fontSize: '0.95rem',
                fontWeight: isSelected ? 700 : 600,
                bgcolor: isSelected ? category.color : category.bgColor,
                color: isSelected ? 'white' : category.color,
                border: `2px solid ${isSelected ? category.color : 'transparent'}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: category.color,
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${category.color}40`
                },
                '& .MuiChip-icon': {
                  color: 'inherit',
                  fontSize: '1.3rem'
                }
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default CategoryFilter;