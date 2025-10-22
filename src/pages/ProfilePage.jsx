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
  CreditCard,
  Lock,
  LogOut,
  FileText,
  MessageSquare,
  Eye,
  ChevronRight,
  Package,
  HelpCircle,
  Trash2,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, collection, query, where, onSnapshot, getDoc } from 'firebase/firestore';
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState({ cardNumber: '', cardHolder: '', expiry: '', cvv: '' });
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

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
            setPaymentMethods(userData.paymentMethods || []);
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
        unsubscribeOrders = onSnapshot(ordersQuery, async (querySnapshot) => {
          const userOrders = [];
          let totalSpent = 0;

          for (const docSnap of querySnapshot.docs) {
            const orderData = docSnap.data();
            let vendorName = orderData.vendorName || orderData.vendor || 'Unknown Vendor';
            if (orderData.vendorId) {
              try {
                const vendorRef = doc(db, 'vendors', orderData.vendorId);
                const vendorSnap = await getDoc(vendorRef);
                if (vendorSnap.exists()) {
                  vendorName = vendorSnap.data().name || vendorName;
                }
              } catch (err) {
                // Silent error handling
              }
            }

            userOrders.push({
              id: docSnap.id,
              ...orderData,
              vendorName
            });
            totalSpent += orderData.total || 0;
          }

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
        showNotification('Unable to load your profile. Please refresh the page.', 'error');
        setLoading(false);
      }
    };

    setupListeners();
    return () => {
      if (unsubscribeUser) unsubscribeUser();
      if (unsubscribeOrders) unsubscribeOrders();
    };
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      showNotification('You have been logged out successfully!');
      navigate('/auth');
    } catch (error) {
      showNotification('Unable to logout. Please try again.', 'error');
      setLoggingOut(false);
    }
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
        showNotification('Profile updated successfully!');
      } else {
        setEditMode(false);
      }
    } catch (error) {
      showNotification('Unable to update profile. Please try again.', 'error');
    }
  };

  const handleImageUpload = async (e) => {
    if (!currentUser) return;
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotification('Please select an image file', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showNotification('File size must be less than 5MB', 'error');
      return;
    }

    setUploading(true);
    try {
      const fileName = `${currentUser.uid}_${Date.now()}.${file.name.split('.').pop()}`;
      const storageRef = ref(storage, `profile_images/${currentUser.uid}/${fileName}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { avatar: downloadURL });
      showNotification('Profile picture updated successfully!');
    } catch (error) {
      showNotification('Unable to upload image. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    if (!currentUser) return;
    if (!newPaymentMethod.cardNumber || !newPaymentMethod.cardHolder || !newPaymentMethod.expiry || !newPaymentMethod.cvv) {
      showNotification('Please fill in all payment details', 'error');
      return;
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const updatedMethods = [...paymentMethods, { ...newPaymentMethod, id: Date.now().toString() }];
      await updateDoc(userRef, { paymentMethods: updatedMethods });
      setNewPaymentMethod({ cardNumber: '', cardHolder: '', expiry: '', cvv: '' });
      showNotification('Payment method added successfully!');
    } catch (error) {
      showNotification('Unable to add payment method. Please try again.', 'error');
    }
  };

  const handleDeletePaymentMethod = async (methodId) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const updatedMethods = paymentMethods.filter(m => m.id !== methodId);
      await updateDoc(userRef, { paymentMethods: updatedMethods });
      showNotification('Payment method removed successfully!');
    } catch (error) {
      showNotification('Unable to remove payment method. Please try again.', 'error');
    }
  };

  const getOrderItemCount = (order) => {
    if (Array.isArray(order.items)) {
      return order.items.reduce((total, item) => total + (item.quantity || 1), 0);
    }
    if (typeof order.items === 'number') return order.items;
    return 0;
  };

  const formatOrderDate = (order) => {
    const date = order.createdAt?.toDate?.() || new Date(order.timestamp || Date.now());
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const settingsMenu = [
    {
      label: 'Payment Methods',
      icon: <CreditCard size={20} />,
      color: '#3b82f6',
      action: () => setShowPaymentModal(true)
    },
    {
      label: 'Security & Privacy',
      icon: <Lock size={20} />,
      color: '#8b5cf6',
      action: () => showNotification('Security & Privacy settings coming soon!', 'info')
    },
    {
      label: 'Help & Support',
      icon: <HelpCircle size={20} />,
      color: '#06b6d4',
      action: () => setShowHelpModal(true)
    },
    {
      label: 'Terms & Conditions',
      icon: <FileText size={20} />,
      color: '#64748b',
      action: () => showNotification('Terms & Conditions will be displayed here', 'info')
    },
    {
      label: 'Logout',
      icon: <LogOut size={20} />,
      color: '#ef4444',
      action: () => setShowLogoutModal(true)
    }
  ];

  return (
    <div className="profile-container" style={{ overflowX: 'hidden' }}>
      <Navbar />
      <div style={{ height: '80px' }} />

      {/* Notification Toast */}
      {notification.show && (
        <div style={{
          position: 'fixed',
          top: '100px',
          right: '20px',
          zIndex: 3000,
          backgroundColor: notification.type === 'error' ? '#ef4444' : notification.type === 'info' ? '#3b82f6' : '#16a34a',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          maxWidth: '400px'
        }}>
          {notification.message}
        </div>
      )}

      <main className="profile-main" style={{
        padding: '2rem 5%',
        minHeight: 'calc(100vh - 80px)',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Eye size={18} /> Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Settings size={18} /> Settings
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
                  background: user.avatar ? `url(${user.avatar})` : 'linear-gradient(135deg, #16a34a, #15803d)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {!user.avatar && <User size={60} color="white" />}
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
              {uploading && (
                <p style={{ textAlign: 'center', color: '#16a34a', marginTop: '0.5rem' }}>
                  Uploading...
                </p>
              )}
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

            {/* Personal Info Section */}
            <div className="profile-section">
              <div className="section-header">
                <h3 className="section-title">Personal Information</h3>
                {!editMode && (
                  <button className="edit-btn" onClick={() => setEditMode(true)}>
                    <Edit size={16} /> Edit
                  </button>
                )}
              </div>
              <div className="info-fields">
                {[
                  { label: 'Full Name', value: tempUser.name, key: 'name', icon: <User size={18} /> },
                  { label: 'Email Address', value: tempUser.email, key: 'email', icon: <Mail size={18} /> },
                  { label: 'Phone Number', value: tempUser.phone, key: 'phone', icon: <Phone size={18} /> }
                ].map(field => (
                  <div key={field.key} className="info-field">
                    <div className="field-label">
                      <span style={{ color: '#16a34a' }}>{field.icon}</span>
                      <label>{field.label}</label>
                    </div>
                    {editMode ? (
                      <input
                        type="text"
                        value={tempUser[field.key] || ''}
                        onChange={e => setTempUser({ ...tempUser, [field.key]: e.target.value })}
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
                <div style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  border: '2px dashed #e5e7eb'
                }}>
                  <ShoppingCart size={48} color="#9ca3af" style={{ margin: '0 auto 1rem' }} />
                  <p style={{
                    color: '#6b7280',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                  }}>
                    No orders yet
                  </p>
                  <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
                    Start ordering now!
                  </p>
                  <button
                    onClick={() => navigate('/vendor')}
                    style={{
                      backgroundColor: '#16a34a',
                      color: 'white',
                      padding: '0.75rem 2rem',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    Browse Restaurants
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {orders.map(order => (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <h4 style={{
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            color: '#111827',
                            margin: '0 0 0.25rem 0'
                          }}>
                            {order.vendorName}
                          </h4>
                          <p style={{
                            fontSize: '0.85rem',
                            color: '#6b7280',
                            margin: '0 0 0.25rem 0'
                          }}>
                            {formatOrderDate(order)}
                          </p>
                          <p style={{
                            fontSize: '0.85rem',
                            color: '#9ca3af',
                            margin: 0
                          }}>
                            Order #{order.id.substring(0, 8)}
                          </p>
                        </div>
                        <span style={{
                          padding: '0.4rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          backgroundColor: order.status === 'Completed' ? '#dcfce7' :
                                          order.status === 'Pending' ? '#fef3c7' : '#fee2e2',
                          color: order.status === 'Completed' ? '#166534' :
                                 order.status === 'Pending' ? '#92400e' : '#991b1b'
                        }}>
                          {order.status || 'Pending'}
                        </span>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid #f3f4f6'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Package size={16} color="#6b7280" />
                          <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                            {getOrderItemCount(order)} items
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            color: '#16a34a'
                          }}>
                            R{(order.total || 0).toFixed(2)}
                          </span>
                          <ChevronRight size={20} color="#9ca3af" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Settings Tab - FIXED COLORS */}
        {activeTab === 'settings' && (
          <div className="settings-section">
            <h2 className="settings-title" style={{ color: '#111827', marginBottom: '2rem', fontSize: '1.8rem' }}>Settings</h2>
            <div className="settings-menu" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {settingsMenu.map((item, idx) => (
                <button
                  key={idx}
                  className="settings-item"
                  onClick={item.action}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.25rem',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderLeft: `4px solid ${item.color}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div className="settings-icon" style={{ color: item.color }}>
                    {item.icon}
                  </div>
                  <span className="settings-label" style={{
                    flex: 1,
                    fontSize: '1.05rem',
                    fontWeight: '600',
                    color: '#111827',
                    textAlign: 'left'
                  }}>
                    {item.label}
                  </span>
                  <span className="settings-arrow">
                    <ChevronRight size={20} color="#9ca3af" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Payment Methods Modal - SIMPLE VERSION */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem'
        }} onClick={() => setShowPaymentModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowPaymentModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={20} color="#111827" />
            </button>

            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>
              Payment Methods
            </h3>

            {/* Saved Payment Methods */}
            <div style={{ marginBottom: '2rem' }}>
              {paymentMethods.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center' }}>No payment methods saved yet</p>
              ) : (
                paymentMethods.map(method => (
                  <div key={method.id} style={{
                    background: '#f9fafb',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', color: '#111827' }}>{method.cardHolder}</p>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
                        •••• {method.cardNumber.slice(-4)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeletePaymentMethod(method.id)}
                      style={{
                        background: '#fee2e2',
                        color: '#ef4444',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add New Payment Method */}
            <h4 style={{ marginBottom: '1rem', color: '#111827' }}>Add New Card</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Card Number"
                value={newPaymentMethod.cardNumber}
                onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cardNumber: e.target.value })}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  color: '#111827'
                }}
              />
              <input
                type="text"
                placeholder="Card Holder Name"
                value={newPaymentMethod.cardHolder}
                onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cardHolder: e.target.value })}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  color: '#111827'
                }}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={newPaymentMethod.expiry}
                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, expiry: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    flex: 1,
                    color: '#111827'
                  }}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={newPaymentMethod.cvv}
                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cvv: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    flex: 1,
                    color: '#111827'
                  }}
                />
              </div>
              <button
                onClick={handleAddPaymentMethod}
                style={{
                  background: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Plus size={20} /> Add Payment Method
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      {showHelpModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem'
        }} onClick={() => setShowHelpModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowHelpModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={20} color="#111827" />
            </button>

            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#111827' }}>
              <HelpCircle size={24} color="#16a34a" /> Help & Support
            </h3>

            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#16a34a' }}>Contact Us</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#111827' }}>
                  <Mail size={18} color="#6b7280" />
                  <span>Email: support@foodgo.co.za</span>
                </p>
                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#111827' }}>
                  <Phone size={18} color="#6b7280" />
                  <span>Phone: +27 123 456 789</span>
                </p>
                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#111827' }}>
                  <MessageSquare size={18} color="#6b7280" />
                  <span>Live Chat: Available 24/7</span>
                </p>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#16a34a' }}>Frequently Asked Questions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <details style={{
                  background: '#f9fafb',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  <summary style={{ fontWeight: '600', color: '#111827' }}>How do I place an order?</summary>
                  <p style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
                    Browse restaurants, select items, add to cart, and proceed to checkout. Choose your payment method and confirm your order.
                  </p>
                </details>

                <details style={{
                  background: '#f9fafb',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  <summary style={{ fontWeight: '600', color: '#111827' }}>What payment methods are accepted?</summary>
                  <p style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
                    We accept all major credit cards, debit cards, and digital wallets. You can save your payment methods for faster checkout.
                  </p>
                </details>

                <details style={{
                  background: '#f9fafb',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  <summary style={{ fontWeight: '600', color: '#111827' }}>How do I track my order?</summary>
                  <p style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
                    You can track your order in real-time from your profile page under "Recent Orders". You'll receive updates via email and SMS.
                  </p>
                </details>

                <details style={{
                  background: '#f9fafb',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  <summary style={{ fontWeight: '600', color: '#111827' }}>Can I cancel or modify my order?</summary>
                  <p style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
                    You can cancel or modify your order within 5 minutes of placing it. After that, please contact the restaurant directly.
                  </p>
                </details>

                <details style={{
                  background: '#f9fafb',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  <summary style={{ fontWeight: '600', color: '#111827' }}>What if there's an issue with my order?</summary>
                  <p style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
                    Contact our support team immediately via email, phone, or live chat. We'll resolve the issue and ensure your satisfaction.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem'
        }} onClick={() => !loggingOut && setShowLogoutModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '400px',
            padding: '2rem',
            textAlign: 'center'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <LogOut size={32} color="#ef4444" />
            </div>

            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>
              {loggingOut ? 'Logging Out...' : 'Confirm Logout'}
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              {loggingOut ? 'Please wait while we log you out' : 'Are you sure you want to logout?'}
            </p>

            {!loggingOut && (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#f3f4f6',
                    color: '#111827',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Yes, Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem'
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '0',
              position: 'relative',
              color: '#111827'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #e5e7eb',
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
              borderRadius: '16px 16px 0 0',
              zIndex: 10
            }}>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} color="#111827" />
              </button>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>
                Order Details
              </h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                Order #{selectedOrder.id.substring(0, 8)}
              </p>
            </div>

            {/* Order Info */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '1.25rem',
                borderRadius: '12px',
                marginBottom: '1.5rem'
              }}>
                <h4 style={{
                  margin: '0 0 1rem 0',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: '#111827'
                }}>
                  {selectedOrder.vendorName}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>Status:</span>
                    <span style={{ fontWeight: '600', color: '#111827', fontSize: '0.95rem' }}>
                      {selectedOrder.status || 'Pending'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>Date:</span>
                    <span style={{ fontWeight: '600', color: '#111827', fontSize: '0.95rem' }}>
                      {formatOrderDate(selectedOrder)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>Pickup Time:</span>
                    <span style={{ fontWeight: '600', color: '#111827', fontSize: '0.95rem' }}>
                      {selectedOrder.pickup?.pickupTime || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>
                Items
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      padding: '1rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '12px',
                      alignItems: 'center'
                    }}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          flexShrink: 0
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '8px',
                        backgroundColor: '#16a34a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <ShoppingCart size={28} color="white" />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <h5 style={{ margin: '0 0 0.25rem 0', fontWeight: '600', fontSize: '1rem', color: '#111827' }}>
                        {item.name}
                      </h5>
                      <p style={{ margin: '0', color: '#6b7280', fontSize: '0.85rem' }}>
                        Qty: {item.quantity || 1}
                      </p>
                    </div>
                    <p style={{ margin: 0, fontWeight: '700', color: '#111827', fontSize: '1rem' }}>
                      R{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div style={{
                borderTop: '2px solid #e5e7eb',
                paddingTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>Subtotal:</span>
                  <span style={{ fontWeight: '600', color: '#111827', fontSize: '0.95rem' }}>
                    R{(selectedOrder.subtotal || 0).toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>Service Fee:</span>
                  <span style={{ fontWeight: '600', color: '#111827', fontSize: '0.95rem' }}>
                    R{(selectedOrder.serviceFee || 0).toFixed(2)}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #e5e7eb',
                  marginTop: '0.5rem'
                }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>Total:</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: '700', color: '#16a34a' }}>
                    R{(selectedOrder.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;