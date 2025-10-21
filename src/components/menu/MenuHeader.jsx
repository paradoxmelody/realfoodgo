import { Box, Chip, Rating, Typography } from '@mui/material';

const MenuHeader = ({ vendor }) => {
  return (
    <Box sx={{
      mb: 4,
      p: 4,
      bgcolor: 'white',
      borderRadius: 3,
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%)',
      border: '1px solid #dcfce7'
    }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#166534' }}>
        {vendor.name}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Chip
          label={vendor.category}
          sx={{ bgcolor: '#16a34a', color: 'white', fontWeight: 600 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating value={vendor.rating || 0} precision={0.1} size="small" readOnly />
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#6b7280' }}>
            {vendor.rating || 'N/A'} rating
          </Typography>
        </Box>
        {vendor.deals && vendor.deals.length > 0 && (
          <Chip
            label={`🔥 ${vendor.deals[0]}`}
            sx={{ bgcolor: '#ffedd5', color: '#ff6b35', fontWeight: 600 }}
          />
        )}
      </Box>
    </Box>
  );
};

export default MenuHeader;