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
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase_data/firebase';
import foodgoLogo from './foodgo.png';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState({
    name: 'Moloti Kgaphola',
    email: '4356470@myuwc.ac.za',
    phone: '087 346 2234',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
  });
  const [tempUser, setTempUser] = useState(user);
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);

  const orders = [
    { id: 'FG001001', date: '2023-11-20', vendor: 'Campus Grill', total: 'R24.50', status: 'Delivered', items: 3 },
    { id: 'FG001002', date: '2023-11-18', vendor: 'Pizza Place', total: 'R30.00', status: 'Delivered', items: 2 },
    { id: 'FG001003', date: '2023-11-15', vendor: 'Sushi Express', total: 'R18.75', status: 'Processing', items: 1 },
  ];

  const stats = [
    { label: 'Orders', value: '6', icon: <ShoppingCart size={20} />, color: '#16a34a' },
    { label: 'Favorites', value: '12', icon: <Heart size={20} />, color: '#ff6b35' },
    { label: 'Total Spent', value: 'R125.50', icon: <Wallet size={20} />, color: '#f59e0b' }
  ];

  const settingsMenu = [
    { label: 'Personal Settings', icon: <User size={20} />, color: '#16a34a', action: () => alert('Personal Settings') },
    { label: 'Payment Methods', icon: <CreditCard size={20} />, color: '#3b82f6', action: () => alert('Payment Methods') },
    { label: 'Saved Addresses', icon: <MapPin size={20} />, color: '#f59e0b', action: () => alert('Saved Addresses') },
    { label: 'Notifications', icon: <Bell size={20} />, color: '#ec4899', action: () => alert('Notifications') },
    { label: 'Security & Privacy', icon: <Lock size={20} />, color: '#8b5cf6', action: () => alert('Security & Privacy') },
    { label: 'Help & Support', icon: <HelpCircle size={20} />, color: '#06b6d4', action: () => alert('Help & Support') },
    { label: 'Contact Us', icon: <MessageSquare size={20} />, color: '#f97316', action: () => alert('Contact Us') },
    { label: 'Terms & Conditions', icon: <FileText size={20} />, color: '#64748b', action: () => alert('Terms & Conditions') },
    { label: 'Logout', icon: <LogOut size={20} />, color: '#ef4444', action: () => navigate('/auth') }
  ];

  useEffect(() => {
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
    fetchUserData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const userId = 'MoWabG5a62fsUosBOW2a1UtLJYo1';
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { ...tempUser });
      setUser(tempUser);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const userId = 'MoWabG5a62fsUosBOW2a1UtLJYo1';
      const storageRef = ref(storage, `profile_images/${userId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { avatar: downloadURL });
      setUser((prev) => ({ ...prev, avatar: downloadURL }));
    } catch (error) {
      console.error(error);
      alert('Failed to upload image');
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
              onClick={() => navigate('/vendors')}
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
          onFocus={(e) => {
            e.currentTarget.style.border = '2px solid #16a34a';
            e.currentTarget.style.boxShadow = '0 0 0 4px rgba(22, 163, 74, 0.2)';
            e.currentTarget.style.background = 'white';
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = '2px solid transparent';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.background = '#f9fafb';
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
            {user.name.split(' ')[0]}
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
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="profile-avatar"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    border: '4px solid #16a34a'
                  }}
                />
                <button
                  className="profile-camera-btn"
                  onClick={() => document.getElementById('file-input').click()}
                  title="Change Avatar"
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    background: '#16a34a',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#15803d';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#16a34a';
                    e.currentTarget.style.transform = 'scale(1)';
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
            </div>

            {/* User Info */}
            <div className="profile-user-info">
              <h2 className="profile-username">{user.name}</h2>
              <p className="profile-member-since">Member since November 2023</p>
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
                        value={tempUser[field.key]}
                        onChange={(e) => setTempUser({ ...tempUser, [field.key]: e.target.value })}
                        className="field-input"
                      />
                    ) : (
                      <p className="field-value">{user[field.key]}</p>
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
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <p className="order-vendor">{order.vendor}</p>
                        <p className="order-id">Order #{order.id}</p>
                      </div>
                      <span className={`order-status status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-footer">
                      <span className="order-items">{order.items} items</span>
                      <span className="order-total">{order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
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