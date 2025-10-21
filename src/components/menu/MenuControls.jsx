import { Box, Typography } from '@mui/material';

const MenuControls = ({ itemCount, sortBy, setSortBy }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="body1" sx={{ fontWeight: 600, color: '#166534' }}>
        {itemCount} items found
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#6b7280' }}>
          Sort By:
        </Typography>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '8px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
            backgroundColor: 'white',
            color: '#1f2937'
          }}
        >
          <option value="rating">Highest Rating</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </Box>
    </Box>
  );
};

export default MenuControls;