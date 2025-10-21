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
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase_data/firebase';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';
import Navbar from '../components/landing/Navbar';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState({ name: 'User', email: '', phone: '', avatar: null });
  const [tempUser, setTempUser] = useState(user);
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState([
    { label: 'Orders', value: '0', icon: <ShoppingCart size={20} />, color: '#16a34a' },
    { label: 'Favorite Restaurants', value: '0', icon: <Heart size={20} />, color: '#ff6b35' },
    { label: 'Favorite Foods', value: '0', icon: <Heart size={20} />, color: '#f43f5e' },
    { label: 'Total Spent', value: 'R0.00', icon: <Wallet size={20} />, color: '#f59e0b' }
  ]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch user & orders in real-time
  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    let unsubscribeUser, unsubscribeOrders;

    const setupListeners = async () => {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        unsubscribeUser = onSnapshot(userRef, (userSnap) => {
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUser(userData);
            setTempUser(userData);
            const favoriteRestaurants = userData?.favorites?.restaurants?.length || 0;
            const favoriteFoods = userData?.favorites?.foods?.length || 0;
            setStats(prevStats => {
              const newStats = [...prevStats];
              newStats[1] = { ...newStats[1], value: favoriteRestaurants.toString() };
              newStats[2] = { ...newStats[2], value: favoriteFoods.toString() };
              return newStats;
            });
          }
        });

        const ordersRef = collection(db, 'orders');
        const ordersQuery = query(ordersRef, where('userId', '==', currentUser.uid));
        unsubscribeOrders = onSnapshot(ordersQuery, (querySnapshot) => {
          const userOrders = [];
          let totalSpent = 0;
          querySnapshot.forEach(docSnap => {
            const orderData = docSnap.data();
            userOrders.push({ id: docSnap.id, ...orderData });
            totalSpent += orderData.total || 0;
          });
          userOrders.sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(a.timestamp || 0);
            const dateB = b.createdAt?.toDate?.() || new Date(b.timestamp || 0);
            return dateB - dateA;
          });
          setOrders(userOrders);
          setStats(prevStats => {
            const newStats = [...prevStats];
            newStats[0] = { ...newStats[0], value: userOrders.length.toString() };
            newStats[3] = { ...newStats[3], value: `R${totalSpent.toFixed(2)}` };
            return newStats;
          });
          setLoading(false);
        });
      } catch (error) {
        console.error('Error setting up listeners:', error);
        setLoading(false);
      }
    };

    setupListeners();
    return () => { if (unsubscribeUser) unsubscribeUser(); if (unsubscribeOrders) unsubscribeOrders(); };
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try { await logout(); navigate('/auth'); }
    catch (error) { console.error('Logout error:', error); alert('Failed to logout'); }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const updates = {};
      if (tempUser.name !== user.name) updates.name = tempUser.name;
      if (tempUser.email !== user.email) updates.email = tempUser.email;
      if (tempUser.phone !== user.phone) updates.phone = tempUser.phone;
      if (Object.keys(updates).length > 0) {
        await updateDoc(userRef, updates);
        setEditMode(false);
        alert('Profile updated successfully!');
      } else { setEditMode(false); }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleImageUpload = async (e) => {
    if (!currentUser) return;
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('File size must be less than 5MB'); return; }

    setUploading(true);
    try {
      const fileName = `${currentUser.uid}_${Date.now()}.${file.name.split('.').pop()}`;
      const storageRef = ref(storage, `profile_images/${currentUser.uid}/${fileName}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { avatar: downloadURL });
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally { setUploading(false); }
  };

  const getOrderItemCount = (order) => {
    if (Array.isArray(order.items)) return order.items.reduce((total, item) => total + (item.quantity || 1), 0);
    if (typeof order.items === 'number') return order.items;
    return 0;
  };

  const formatOrderDate = (order) => {
    const date = order.createdAt?.toDate?.() || new Date(order.timestamp || Date.now());
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

  return (
    <div className="profile-container" style={{ overflowX: 'hidden' }}>
      <Navbar />
      <main className="profile-main" style={{ marginTop: '80px', paddingTop: '2rem', minHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}>
        {/* Tabs */}
        <div className="profile-tabs">
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={18} /> Overview
          </button>
          <button className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={18} /> Settings
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Avatar Section */}
            <div className="profile-avatar-section">
              <div className="profile-avatar-wrapper" style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto' }}>
                <div style={{
                  width: '100%', height: '100%', borderRadius: '50%', border: '4px solid #16a34a',
                  background: user.avatar ? `url(${user.avatar})` : '#e5e7eb', backgroundSize: 'cover', backgroundPosition: 'center',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {!user.avatar && <User size={60} color="#9ca3af" />}
                </div>
                <button className="profile-camera-btn" onClick={() => document.getElementById('file-input').click()} title="Change Avatar" disabled={uploading} style={{
                  position: 'absolute', bottom: '10px', right: '10px', background: uploading ? '#9ca3af' : '#16a34a',
                  border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'white', cursor: uploading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)', transition: 'all 0.2s ease'
                }} onMouseEnter={(e) => { if (!uploading) { e.currentTarget.style.background = '#15803d'; e.currentTarget.style.transform = 'scale(1.1)'; } }}
                  onMouseLeave={(e) => { if (!uploading) { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.transform = 'scale(1)'; } }}>
                  <Camera size={18} />
                </button>
                <input id="file-input" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{ display: 'none' }} />
              </div>
              {uploading && <p style={{ textAlign: 'center', color: '#16a34a', marginTop: '0.5rem' }}>Uploading...</p>}
            </div>

            {/* User Info */}
            <div className="profile-user-info">
              <h2 className="profile-username">{user.name}</h2>
              <p className="profile-member-since">
                Member since {user.createdAt ? new Date(user.createdAt.toDate?.() || user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
              </p>
            </div>

            {/* Stats Cards */}
            <div className="profile-stats">
              {stats.map((stat, idx) => (
                <div key={idx} className="stat-card" style={{ borderTopColor: stat.color }}>
                  <div style={{ color: stat.color, display: 'flex', alignItems: 'center' }}>{stat.icon}</div>
                  <div className="stat-content">
                    <p className="stat-value">{stat.value}</p>
                    <p className="stat-label">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Personal Info Section */}
            <div className="profile-section">
              <div className="section-header">
                <h3 className="section-title">Personal Information</h3>
                {!editMode && (<button className="edit-btn" onClick={() => setEditMode(true)}><Edit size={16} /> Edit</button>)}
              </div>
              <div className="info-fields">
                {[{ label: 'Full Name', value: tempUser.name, key: 'name', icon: <User size={18} /> },
                  { label: 'Email Address', value: tempUser.email, key: 'email', icon: <Mail size={18} /> },
                  { label: 'Phone Number', value: tempUser.phone, key: 'phone', icon: <Phone size={18} /> }
                ].map(field => (
                  <div key={field.key} className="info-field">
                    <div className="field-label"><span style={{ color: '#16a34a' }}>{field.icon}</span><label>{field.label}</label></div>
                    {editMode ? (
                      <input type="text" value={tempUser[field.key] || ''} onChange={e => setTempUser({ ...tempUser, [field.key]: e.target.value })} className="field-input" />
                    ) : <p className="field-value">{user[field.key] || 'Not provided'}</p>}
                  </div>
                ))}
              </div>
              {editMode && (
                <div className="edit-actions">
                  <button className="btn-save" onClick={handleSaveProfile}><Save size={16} /> Save Changes</button>
                  <button className="btn-cancel" onClick={() => { setEditMode(false); setTempUser(user); }}><X size={16} /> Cancel</button>
                </div>
              )}
            </div>

            {/* Recent Orders Section */}
            <div className="profile-section">
              <h3 className="section-title">Recent Orders</h3>
              {loading ? <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading orders...</p> :
                orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: '#f9fafb', borderRadius: '12px', border: '2px dashed #e5e7eb' }}>
                    <ShoppingCart size={48} color="#9ca3af" style={{ margin: '0 auto 1rem' }} />
                    <p style={{ color: '#6b7280', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>No orders yet</p>
                    <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>Start ordering now!</p>
                    <button onClick={() => navigate('/vendor')} style={{ backgroundColor: '#16a34a', color: 'white', padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '1rem' }}>Browse Restaurants</button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map(order => (
                      <div key={order.id} className="order-card" onClick={() => setSelectedOrder(order)} style={{ cursor: 'pointer' }}>
                        <div className="order-header">
                          <div>
                            <p className="order-vendor">{order.vendorName || order.vendor || 'Unknown Vendor'}</p>
                            <p className="order-id">Order #{order.id.substring(0, 8)}</p>
                            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem' }}>{formatOrderDate(order)} | Pickup: {order.pickupTime || order.pickup?.pickupTime || 'N/A'}</p>
                          </div>
                          <span className={`order-status status-${(order.status || 'pending').toLowerCase().replace(' ', '-')}`}>{order.status || 'Pending'}</span>
                        </div>
                        <div className="order-footer">
                          <span className="order-items">{getOrderItemCount(order)} items</span>
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
                <button key={idx} className="settings-item" onClick={item.action} style={{ borderLeftColor: item.color }}>
                  <div className="settings-icon" style={{ color: item.color }}>{item.icon}</div>
                  <span className="settings-label">{item.label}</span>
                  <span className="settings-arrow">→</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Order Detail Overlay */}
      {selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            backgroundColor: 'white',
            color: '#111827', // dark text
            borderRadius: '12px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80%',
            overflowY: 'auto',
            padding: '1.5rem',
            position: 'relative'
          }}>
            <button onClick={() => setSelectedOrder(null)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            <h3 style={{ marginBottom: '1rem' }}>Order #{selectedOrder.id.substring(0, 8)}</h3>
            <p style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Vendor: {selectedOrder.vendorName || selectedOrder.vendor}</p>
            <p style={{ marginBottom: '0.5rem' }}>
              Pickup Time: {selectedOrder.pickupTime || selectedOrder.pickup?.pickupTime || 'N/A'}
            </p>
            <p style={{ marginBottom: '1rem' }}>Status: {selectedOrder.status || 'Pending'}</p>
            <div>
              {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '0.75rem' }}>
                  {item.image && <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />}
                  <div>
                    <p style={{ margin: 0, fontWeight: '600' }}>{item.name}</p>
                    <p style={{ margin: 0 }}>Quantity: {item.quantity || 1}</p>
                    <p style={{ margin: 0 }}>R{(item.price || 0).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
