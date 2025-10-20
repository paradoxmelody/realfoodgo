import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  User,
  Heart,
  Wallet,
  Edit,
  Camera,
  Mail,
  Phone,
  Save,
  X,
  Settings,
  HelpCircle,
  CreditCard,
  MapPin,
  Bell,
  Lock,
  LogOut,
  FileText,
  MessageSquare,
  Home,
  Store,
  Search,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase_data/firebase';
import { useAuth } from '../context/AuthContext';
import foodgoLogo from './foodgo.png';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, userDetails, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(userDetails || {
    name: 'User',
    email: '',
    phone: '',
    avatar: null
  });
  const [tempUser, setTempUser] = useState(user);
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState([
    { label: 'Orders', value: '0', icon: <ShoppingCart size={20} />, color: '#16a34a' },
    { label: 'Favorites', value: '0', icon: <Heart size={20} />, color: '#ff6b35' },
    { label: 'Total Spent', value: 'R0.00', icon: <Wallet size={20} />, color: '#f59e0b' }
  ]);
  const [loading, setLoading] = useState(true);

  // Fetch user orders and calculate stats
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);

        // Fetch orders from Firestore
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);

        const userOrders = [];
        let totalSpent = 0;

        querySnapshot.forEach((doc) => {
          const orderData = doc.data();
          userOrders.push({
            id: doc.id,
            ...orderData
          });
          totalSpent += orderData.total || 0;
        });

        setOrders(userOrders);

        // Update stats with real data
        setStats([
          { label: 'Orders', value: userOrders.length.toString(), icon: <ShoppingCart size={20} />, color: '#16a34a' },
          { label: 'Favorites', value: '0', icon: <Heart size={20} />, color: '#ff6b35' },
          { label: 'Total Spent', value: `R${totalSpent.toFixed(2)}`, icon: <Wallet size={20} />, color: '#f59e0b' }
        ]);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Update user when userDetails changes
  useEffect(() => {
    if (userDetails) {
      setUser(userDetails);
      setTempUser(userDetails);
    }
  }, [userDetails]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout');
    }
  };

  const settingsMenu = [
    { label: 'Personal Settings', icon: <User size={20} />, color: '#16a34a', action: () => alert('Personal Settings') },
    { label: 'Payment Methods', icon: <CreditCard size={20} />, color: '#3b82f6', action: () => alert('Payment Methods') },
    { label: 'Saved Addresses', icon: <MapPin size={20} />, color: '#f59e0b', action: () => alert('Saved Addresses') },
    { label: 'Notifications', icon: <Bell size={20} />, color: '#ec4899', action: () => alert('Notifications') },
    { label: 'Security & Privacy', icon: <Lock size={20} />, color: '#8b5cf6', action: () => alert('Security & Privacy') },
    { label: 'Help & Support', icon: <HelpCircle size={20} />, color: '#06b6d4', action: () => alert('Help & Support') },
    { label: 'Contact Us', icon: <MessageSquare size={20} />, color: '#f97316', action: () => alert('Contact Us') },
    { label: 'Terms & Conditions', icon: <FileText size={20} />, color: '#64748b', action: () => alert('Terms & Conditions') },
    { label: 'Logout', icon: <LogOut size={20} />, color: '#ef4444', action: handleLogout }
  ];

  const handleSaveProfile = async () => {
    if (!currentUser) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        name: tempUser.name,
        email: tempUser.email,
        phone: tempUser.phone
      });
      setUser(tempUser);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleImageUpload = async (e) => {
    if (!currentUser) return;

    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const fileName = `${currentUser.uid}_${Date.now()}`;
      const storageRef = ref(storage, `profile_images/${currentUser.uid}/${fileName}`);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update Firestore with new avatar URL
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { avatar: downloadURL });

      // Update local state
      setUser((prev) => ({ ...prev, avatar: downloadURL }));
      setTempUser((prev) => ({ ...prev, avatar: downloadURL }));

      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-container" style={{ overflowX: 'hidden' }}>
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
              onClick={() => navigate('/vendor')}
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
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.95rem',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            <ShoppingCart size={20} />
            Cart
          </button>

          <button
            onClick={() => alert('Help & Support')}
            style={{
              background: 'none',
              border: 'none',
              color: '#1f2937',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.95rem',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            <HelpCircle size={20} />
            Help
          </button>

          <button
            style={{
              background: '#16a34a',
              border: 'none',
              color: 'white',
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
            onMouseEnter={(e) => e.target.style.background = '#15803d'}
            onMouseLeave={(e) => e.target.style.background = '#16a34a'}
          >
            <User size={20} />
            {user.name ? user.name.split(' ')[0] : 'Profile'}
          </button>
        </div>
      </nav>

      <main className="profile-main" style={{
        marginTop: '80px',
        paddingTop: '2rem',
        minHeight: 'calc(100vh - 80px)',
        overflowY: 'auto'
      }}>
        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Eye size={18} />
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Settings size={18} />
            Settings
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Avatar Section */}
            <div className="profile-avatar-section">
              <div className="profile-avatar-wrapper" style={{
                position: 'relative',
                width: '150px',
                height: '150px',
                margin: '0 auto'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '4px solid #16a34a',
                  background: user.avatar ? `url(${user.avatar})` : '#e5e7eb',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {!user.avatar && (
                    <User size={60} color="#9ca3af" />
                  )}
                </div>
                <button
                  className="profile-camera-btn"
                  onClick={() => document.getElementById('file-input').click()}
                  title="Change Avatar"
                  disabled={uploading}
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    background: uploading ? '#9ca3af' : '#16a34a',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!uploading) {
                      e.currentTarget.style.background = '#15803d';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!uploading) {
                      e.currentTarget.style.background = '#16a34a';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <Camera size={18} />
                </button>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  style={{ display: 'none' }}
                />
              </div>
              {uploading && <p style={{ textAlign: 'center', color: '#16a34a', marginTop: '0.5rem' }}>Uploading...</p>}
            </div>

            {/* User Info */}
            <div className="profile-user-info">
              <h2 className="profile-username">{user.name}</h2>
              <p className="profile-member-since">Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}</p>
            </div>

            {/* Stats Cards */}
            <div className="profile-stats">
              {stats.map((stat, idx) => (
                <div key={idx} className="stat-card" style={{ borderTopColor: stat.color }}>
                  <div style={{ color: stat.color, display: 'flex', alignItems: 'center' }}>
                    {stat.icon}
                  </div>
                  <div className="stat-content">
                    <p className="stat-value">{stat.value}</p>
                    <p className="stat-label">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Personal Information Section */}
            <div className="profile-section">
              <div className="section-header">
                <h3 className="section-title">Personal Information</h3>
                {!editMode && (
                  <button
                    className="edit-btn"
                    onClick={() => setEditMode(true)}
                  >
                    <Edit size={16} /> Edit
                  </button>
                )}
              </div>

              <div className="info-fields">
                {[
                  { label: 'Full Name', value: tempUser.name, key: 'name', icon: <User size={18} /> },
                  { label: 'Email Address', value: tempUser.email, key: 'email', icon: <Mail size={18} /> },
                  { label: 'Phone Number', value: tempUser.phone, key: 'phone', icon: <Phone size={18} /> }
                ].map((field) => (
                  <div key={field.key} className="info-field">
                    <div className="field-label">
                      <span style={{ color: '#16a34a' }}>{field.icon}</span>
                      <label>{field.label}</label>
                    </div>
                    {editMode ? (
                      <input
                        type="text"
                        value={tempUser[field.key] || ''}
                        onChange={(e) => setTempUser({ ...tempUser, [field.key]: e.target.value })}
                        className="field-input"
                      />
                    ) : (
                      <p className="field-value">{user[field.key] || 'Not provided'}</p>
                    )}
                  </div>
                ))}
              </div>

              {editMode && (
                <div className="edit-actions">
                  <button className="btn-save" onClick={handleSaveProfile}>
                    <Save size={16} /> Save Changes
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => { setEditMode(false); setTempUser(user); }}
                  >
                    <X size={16} /> Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Recent Orders Section */}
            <div className="profile-section">
              <h3 className="section-title">Recent Orders</h3>
              {loading ? (
                <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading orders...</p>
              ) : orders.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6b7280' }}>No orders yet. Start ordering now!</p>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div>
                          <p className="order-vendor">{order.vendor || 'Unknown Vendor'}</p>
                          <p className="order-id">Order #{order.id}</p>
                        </div>
                        <span className={`order-status status-${(order.status || 'pending').toLowerCase()}`}>
                          {order.status || 'Pending'}
                        </span>
                      </div>
                      <div className="order-footer">
                        <span className="order-items">{order.items || 0} items</span>
                        <span className="order-total">R{(order.total || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="settings-section">
            <h2 className="settings-title">Settings</h2>
            <div className="settings-menu">
              {settingsMenu.map((item, idx) => (
                <button
                  key={idx}
                  className="settings-item"
                  onClick={item.action}
                  style={{ borderLeftColor: item.color }}
                >
                  <div className="settings-icon" style={{ color: item.color }}>
                    {item.icon}
                  </div>
                  <span className="settings-label">{item.label}</span>
                  <span className="settings-arrow">›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Spacer */}
        <div style={{ height: '2rem' }}></div>
      </main>
    </div>
  );
};

export default ProfilePage;