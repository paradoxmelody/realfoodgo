import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { FaCamera, FaHeart, FaShoppingCart, FaUser } from 'react-icons/fa';
import { IoFastFood } from 'react-icons/io5';
import { MdHistory, MdSearch, MdSettings } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import BlobCursor from '../components/blobcursor/BlobCursor';
import { db, storage } from '../firebase_data/firebase';
import FoodGoLogo from './foodgo.png';


console.log("Blob cursor come on" , BlobCursor);
const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Moloti Kgaphola',
    email: '4356470@myuwc.ac.za',
    phone: '087 346 2234',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
  });
  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState(user);
  const [imageUploadOpen, setImageUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const orders = [
    { id: 'FG001001', date: '2023-11-20', vendor: 'Campus Grill', total: 'R24.50', status: 'Delivered' },
    { id: 'FG001002', date: '2023-11-18', vendor: 'Pizza Place', total: 'R30.00', status: 'Delivered' },
    { id: 'FG001003', date: '2023-11-15', vendor: 'Sushi Express', total: 'R18.75', status: 'Processing' },
    { id: 'FG001004', date: '2023-11-12', vendor: 'The Salad Bar', total: 'R15.00', status: 'Delivered' },
    { id: 'FG001005', date: '2023-11-09', vendor: 'Coffee & Bites', total: 'R9.25', status: 'Cancelled' },
    { id: 'FG001006', date: '2023-11-05', vendor: 'Burger Junction', total: 'R28.00', status: 'Delivered' }
  ];

  const categories = [
    { name: 'Pizza', icon: '🍕' },
    { name: 'Burgers', icon: '🍔' },
    { name: 'Salads', icon: '🥗' },
    { name: 'Desserts', icon: '🍰' }
  ];

  // Fetch user data from Firebase
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = 'MoWabG5a62fsUosBOW2a1UtLJYo1'; 
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUser(userData);
        setTempUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Handle image upload to Firebase Storage
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const userId = 'MoWabG5a62fsUosBOW2a1UtLJYo1'; 
      const storageRef = ref(storage, `profile_images/${userId}/${file.name}`);
      
      // Upload to Firebase Storage
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update Firestore with new image URL
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { avatar: downloadURL });

      // Update local state
      setUser(prev => ({ ...prev, avatar: downloadURL }));
      setImageUploadOpen(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Handle profile update
  const handleSaveProfile = async () => {
    try {
      const userId = 'MoWabG5a62fsUosBOW2a1UtLJYo1'; 
      const userRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, {
        name: tempUser.name,
        phone: tempUser.phone,
        email: tempUser.email
      });

      setUser(tempUser);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#FF6B35';
      case 'Processing': return '#666';
      case 'Cancelled': return '#F44336';
      default: return '#2196F3';
    }
  };

  return (
  <>
    <BlobCursor/>

    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'darkblue', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            >
              <img src={FoodGoLogo} width={40} height={50} alt='unfair'></img>
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <Button 
                color="inherit" 
                sx={{ textTransform: 'none', fontWeight: 500 }}
                onClick={() => navigate('/')}
              >
                Home
              </Button>
              <Button 
                color="inherit" 
                sx={{ textTransform: 'none', fontWeight: 500 }}
                onClick={() => navigate('/vendors')}
              >
                Restaurants
              </Button>
              <Button 
                color="inherit" 
                sx={{ textTransform: 'none', fontWeight: 500 }}
                onClick={() => navigate('/menu')}
              >
                Menu
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                placeholder="Search for food or restaurants..."
                size="small"
                sx={{ 
                  width: 250,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f5f5f5'
                  }
                }}
                InputProps={{
                  startAdornment: <MdSearch style={{ marginRight: 8, color: '#666' }} />
                }}
              />
              <IconButton onClick={() => navigate('/cart')}>
                <FaShoppingCart />
              </IconButton>
              <Button 
                variant="text" 
                sx={{ textTransform: 'none', color: 'darkblue', fontWeight: 500 }}
                startIcon={<FaUser />}
                onClick={() => navigate('/profile')}
              >
                Profile
              </Button>
            </Box>
          </Box>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Sidebar */}
          <Paper sx={{ width: 250, height: 'fit-content', p: 2, position: 'relative', minHeight: 400 }}>
            <Typography variant="subtitle2" sx={{ color: '#666', mb: 2, fontWeight: 600 }}>
              CATEGORIES
            </Typography>
            
            {categories.map((category) => (
              <Box 
                key={category.name}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5, 
                  py: 1.5,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f5f5f5' },
                  borderRadius: 1,
                  px: 1
                }}
                onClick={() => navigate(`/category/${category.name.toLowerCase()}`)}
              >
                <IoFastFood style={{ color: '#666' }} />
                <Typography variant="body2">{category.name}</Typography>
              </Box>
            ))}

            <Typography variant="subtitle2" sx={{ color: '#666', mb: 2, mt: 4, fontWeight: 600 }}>
              QUICK ACTIONS
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                py: 1.5,
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f5f5f5' },
                borderRadius: 1,
                px: 1
              }}
              onClick={() => navigate('/favorites')}
            >
              <FaHeart style={{ color: '#666' }} />
              <Typography variant="body2">Favorites</Typography>
            </Box>

            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                py: 1.5,
                cursor: 'pointer',
                color: '#FF6B35',
                borderRadius: 1,
                px: 1,
                bgcolor: '#fff5f2'
              }}
            >
              <MdHistory style={{ color: '#FF6B35' }} />
              <Typography variant="body2" sx={{ color: '#FF6B35', fontWeight: 600 }}>Order History</Typography>
            </Box>

            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                py: 1.5,
                cursor: 'pointer',
                borderRadius: 1,
                px: 1,
                position: 'absolute',
                bottom: 20,
                width: 'calc(100% - 16px)',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
              onClick={() => navigate('/settings')}
            >
              <MdSettings style={{ color: '#666' }} />
              <Typography variant="body2">Settings</Typography>
            </Box>
          </Paper>

          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
              User Profile & Order History
            </Typography>

            {/* User Profile Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar 
                    src={user.avatar}
                    sx={{ width: 80, height: 80, cursor: 'pointer' }}
                    onClick={() => setImageUploadOpen(true)}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 2,
                      right: 2,
                      width: 24,
                      height: 24,
                      bgcolor: '#FF6B35',
                      color: 'white',
                      '&:hover': { bgcolor: '#e55a2b' }
                    }}
                    onClick={() => setImageUploadOpen(true)}
                  >
                    <FaCamera size={12} />
                  </IconButton>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {editMode ? (
                          <TextField
                            value={tempUser.name}
                            onChange={(e) => setTempUser({...tempUser, name: e.target.value})}
                            size="small"
                            sx={{ width: 300 }}
                          />
                        ) : (
                          user.name
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                    <Button 
                      variant="outlined" 
                      sx={{ 
                        textTransform: 'none',
                        borderColor: '#ddd',
                        color: 'black',
                        '&:hover': {
                          borderColor: '#ccc',
                          bgcolor: '#f5f5f5'
                        }
                      }}
                      onClick={() => {
                        if (editMode) {
                          handleSaveProfile();
                        } else {
                          setEditMode(true);
                        }
                      }}
                    >
                      {editMode ? 'Save Profile' : 'Edit Profile'}
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 4, mt: 3 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Name
                      </Typography>
                      <TextField 
                        value={editMode ? tempUser.name : user.name}
                        onChange={(e) => setTempUser({...tempUser, name: e.target.value})}
                        size="small"
                        sx={{ mt: 0.5, width: 220 }}
                        InputProps={{
                          sx: { borderRadius: 1 },
                          readOnly: !editMode
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Email
                      </Typography>
                      <TextField 
                        value={editMode ? tempUser.email : user.email}
                        onChange={(e) => setTempUser({...tempUser, email: e.target.value})}
                        size="small"
                        sx={{ mt: 0.5, width: 220 }}
                        InputProps={{
                          sx: { borderRadius: 1 },
                          readOnly: !editMode
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Phone
                      </Typography>
                      <TextField 
                        value={editMode ? tempUser.phone : user.phone}
                        onChange={(e) => setTempUser({...tempUser, phone: e.target.value})}
                        size="small"
                        sx={{ mt: 0.5, width: 220 }}
                        InputProps={{
                          sx: { borderRadius: 1 },
                          readOnly: !editMode
                        }}
                      />
                    </Box>
                  </Box>

                  {editMode && (
                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                      <Button
                        variant="contained"
                        onClick={handleSaveProfile}
                        sx={{
                          bgcolor: '#FF6B35',
                          '&:hover': { bgcolor: '#e55a2b' }
                        }}
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setEditMode(false);
                          setTempUser(user);
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>

            {/* Order History Section */}
            <Paper>
              <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Order History
                </Typography>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#fafafa' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#666' }}>Order ID</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#666' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#666' }}>Vendor</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#666' }}>Total</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#666' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#666' }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                        <TableCell sx={{ fontWeight: 600 }}>{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.vendor}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{order.total}</TableCell>
                        <TableCell>
                          <Chip 
                            label={order.status} 
                            size="small"
                            sx={{ 
                              bgcolor: order.status === 'Processing' ? '#f5f5f5' : getStatusColor(order.status),
                              color: order.status === 'Processing' ? '#666' : 'white',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              borderRadius: 1.5
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="text" 
                            size="small"
                            sx={{ 
                              color: '#FF6B35',
                              textTransform: 'none',
                              minWidth: 'auto',
                              fontWeight: 600,
                              '&:hover': {
                                bgcolor: '#fff5f2'
                              }
                            }}
                          >
                            Reorder
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 3, pb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
            Company
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
            Resources
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
            Legal
          </Typography>
        </Box>
      </Container>

      {/* Image Upload Dialog */}
      <Dialog open={imageUploadOpen} onClose={() => setImageUploadOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Upload Profile Picture
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-image-upload"
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="profile-image-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<FaCamera />}
                disabled={uploading}
                sx={{
                  bgcolor: '#FF6B35',
                  '&:hover': { bgcolor: '#e55a2b' }
                }}
              >
                {uploading ? 'Uploading...' : 'Choose Image'}
              </Button>
            </label>
            <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
              JPG, PNG, GIF • Max 5MB
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageUploadOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
    </>
  );
};

export default ProfilePage;