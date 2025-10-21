import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase_data/firebase';
import Navbar from '../components/landing/Navbar';
import PickUp from '../components/checkout/PickUp';
import PaymentMethodSelector from '../components/checkout/PaymentMethodSelector';
import CardDetailsForm from '../components/checkout/CardDetailsForm';
import OrderSummary from '../components/checkout/OrderSummary';
import OrderSuccess from '../components/checkout/OrderSuccess';
import './Checkout.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartItemsArray, clearCart, getTotalPrice } = useCart();
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState('checkout');
  const [processing, setProcessing] = useState(false);

  const cart = getCartItemsArray();

  const vendorName = location.state?.vendorName ||
                     (cart.length > 0 ? cart[0].vendorName : null) ||
                     'Unknown Vendor';

  const [pickupInfo, setPickupInfo] = useState({
    fullName: '',
    phone: '',
    pickupTime: '',
    instructions: ''
  });

  const [selectedPayment, setSelectedPayment] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const subtotal = getTotalPrice();
  const serviceFee = subtotal * 0.10;
  const total = subtotal + serviceFee;

  const handleInputChange = (e) => {
    setPickupInfo({ ...pickupInfo, [e.target.name]: e.target.value });
  };

  const handlePickupTimeChange = (e) => {
    setPickupInfo({ ...pickupInfo, pickupTime: e.target.value });
  };

  const handlePaymentSelect = (paymentId) => {
    setSelectedPayment(paymentId);
  };

  const handleCardInputChange = (e) => {
    setCardInfo({ ...cardInfo, [e.target.name]: e.target.value });
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardInfo({ ...cardInfo, cardNumber: formattedValue });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
    setCardInfo({ ...cardInfo, expiryDate: value });
  };

  const validateForm = () => {
    if (!pickupInfo.fullName || !pickupInfo.phone || !pickupInfo.pickupTime) {
      alert('Please fill in all required pickup information');
      return false;
    }
    if (selectedPayment === 'card') {
      if (!cardInfo.cardNumber || !cardInfo.cardName || !cardInfo.expiryDate || !cardInfo.cvv) {
        alert('Please fill in all card details');
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      alert('Please log in to place an order');
      navigate('/auth');
      return;
    }

    if (!validateForm()) return;

    setProcessing(true);

    try {
      const orderData = {
        userId: currentUser.uid,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        pickup: pickupInfo,
        vendorName,
        payment: {
          method: selectedPayment,
          ...(selectedPayment === 'card' && { cardLast4: cardInfo.cardNumber.slice(-4) })
        },
        subtotal,
        serviceFee,
        total,
        status: 'Pending',
        createdAt: new Date(),
        timestamp: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        orders: arrayUnion({
          orderId: docRef.id,
          total: total,
          status: 'Pending',
          paymentMethod: selectedPayment,
          ...(selectedPayment === 'card' && { cardLast4: cardInfo.cardNumber.slice(-4) }),
          date: new Date().toISOString(),
          vendor: orderData.vendorName,
        })
      });

      await clearCart();
      setProcessing(false);
      setCurrentStep('success');

    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
      setProcessing(false);
    }
  };

  if (cart.length === 0 && currentStep === 'checkout') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }}>
        <Navbar />
        <div style={{ height: '80px' }} />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 80px)',
          flexDirection: 'column',
          gap: '1rem',
          padding: '2rem'
        }}>
          <ShoppingBag size={64} color="#16a34a" />
          <h2 style={{ color: '#166534', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Your cart is empty
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            Add some delicious items to get started!
          </p>
          <button
            onClick={() => navigate('/vendor')}
            style={{
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'success') {
    return (
      <div>
        <Navbar />
        <OrderSuccess />
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ height: '80px' }} />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{
          fontSize: '2rem',
          color: '#166534',
          marginBottom: '2rem',
          fontWeight: '700'
        }}>
          Checkout
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Left Column - Forms */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <PickUp
              deliveryInfo={pickupInfo}
              onInputChange={handleInputChange}
              onPickupTimeChange={handlePickupTimeChange}
            />

            <PaymentMethodSelector
              selectedPayment={selectedPayment}
              onPaymentSelect={handlePaymentSelect}
            />

            {selectedPayment === 'card' && (
              <CardDetailsForm
                cardInfo={cardInfo}
                onInputChange={handleCardInputChange}
                onCardNumberChange={handleCardNumberChange}
                onExpiryChange={handleExpiryChange}
              />
            )}
          </div>

          {/* Right Column - Order Summary (Sticky) */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <OrderSummary
              cartItems={cart}
              subtotal={subtotal}
              serviceFee={serviceFee}
              total={total}
              processing={processing}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;