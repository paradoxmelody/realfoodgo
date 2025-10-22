import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
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
  const [currentStep, setCurrentStep] = useState('pickup'); // pickup, payment, review, success
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    setErrorMessage('');
  };

  const handlePickupTimeChange = (e) => {
    setPickupInfo({ ...pickupInfo, pickupTime: e.target.value });
    setErrorMessage('');
  };

  const handlePaymentSelect = (paymentId) => {
    setSelectedPayment(paymentId);
    setErrorMessage('');
  };

  const handleCardInputChange = (e) => {
    setCardInfo({ ...cardInfo, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardInfo({ ...cardInfo, cardNumber: formattedValue });
    setErrorMessage('');
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
    setCardInfo({ ...cardInfo, expiryDate: value });
    setErrorMessage('');
  };

  const validatePickupInfo = () => {
    if (!pickupInfo.fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return false;
    }
    if (!pickupInfo.phone.trim()) {
      setErrorMessage('Please enter your phone number');
      return false;
    }
    if (!pickupInfo.pickupTime) {
      setErrorMessage('Please select a pickup time');
      return false;
    }
    return true;
  };

  const validatePaymentInfo = () => {
    if (selectedPayment === 'card') {
      if (!cardInfo.cardNumber.trim()) {
        setErrorMessage('Please enter your card number');
        return false;
      }
      if (!cardInfo.cardName.trim()) {
        setErrorMessage('Please enter the cardholder name');
        return false;
      }
      if (!cardInfo.expiryDate.trim()) {
        setErrorMessage('Please enter the card expiry date');
        return false;
      }
      if (!cardInfo.cvv.trim()) {
        setErrorMessage('Please enter the card CVV');
        return false;
      }
    }
    return true;
  };

  const handleContinueToPayment = () => {
    if (validatePickupInfo()) {
      setCurrentStep('payment');
      window.scrollTo(0, 0);
    }
  };

  const handleContinueToReview = () => {
    if (validatePaymentInfo()) {
      setCurrentStep('review');
      window.scrollTo(0, 0);
    }
  };

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      setErrorMessage('Please log in to place an order');
      setTimeout(() => navigate('/auth'), 2000);
      return;
    }

    setProcessing(true);
    setErrorMessage('');

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
      window.scrollTo(0, 0);

    } catch (error) {
      setErrorMessage('Unable to place your order. Please check your connection and try again.');
      setProcessing(false);
    }
  };

  if (cart.length === 0 && currentStep !== 'success') {
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
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        {/* Progress Indicator */}
        <div style={{ marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: currentStep === 'pickup' || currentStep === 'payment' || currentStep === 'review' ? '#16a34a' : '#e5e7eb',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.9rem',
                marginBottom: '0.5rem'
              }}>1</div>
              <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '600', textAlign: 'center' }}>Pickup Info</span>
            </div>

            <div style={{ width: '40px', height: '2px', background: currentStep === 'payment' || currentStep === 'review' ? '#16a34a' : '#e5e7eb', marginBottom: '1.5rem' }} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: currentStep === 'payment' || currentStep === 'review' ? '#16a34a' : '#e5e7eb',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.9rem',
                marginBottom: '0.5rem'
              }}>2</div>
              <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '600', textAlign: 'center' }}>Payment</span>
            </div>

            <div style={{ width: '40px', height: '2px', background: currentStep === 'review' ? '#16a34a' : '#e5e7eb', marginBottom: '1.5rem' }} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: currentStep === 'review' ? '#16a34a' : '#e5e7eb',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.9rem',
                marginBottom: '0.5rem'
              }}>3</div>
              <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '600', textAlign: 'center' }}>Review</span>
            </div>
          </div>
        </div>

        <h1 style={{
          fontSize: '1.5rem',
          color: '#166534',
          marginBottom: '1.5rem',
          fontWeight: '700',
          textAlign: 'center'
        }}>
          {currentStep === 'pickup' && 'Pickup Information'}
          {currentStep === 'payment' && 'Payment Method'}
          {currentStep === 'review' && 'Review Order'}
        </h1>

        {/* Error Message */}
        {errorMessage && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#dc2626',
            fontSize: '0.875rem'
          }}>
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Step 1: Pickup Info */}
        {currentStep === 'pickup' && (
          <div>
            <PickUp
              deliveryInfo={pickupInfo}
              onInputChange={handleInputChange}
              onPickupTimeChange={handlePickupTimeChange}
            />
            <button
              onClick={handleContinueToPayment}
              style={{
                width: '100%',
                display: 'block',
                margin: '1.5rem auto 0',
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                color: 'white',
                border: 'none',
                padding: '0.875rem',
                borderRadius: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              Continue to Payment <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Payment */}
        {currentStep === 'payment' && (
          <div>
            <PaymentMethodSelector
              selectedPayment={selectedPayment}
              onPaymentSelect={handlePaymentSelect}
            />

            {selectedPayment === 'card' && (
              <div style={{ marginTop: '1.5rem' }}>
                <CardDetailsForm
                  cardInfo={cardInfo}
                  onInputChange={handleCardInputChange}
                  onCardNumberChange={handleCardNumberChange}
                  onExpiryChange={handleExpiryChange}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setCurrentStep('pickup')}
                style={{
                  flex: 1,
                  background: 'white',
                  color: '#16a34a',
                  border: '2px solid #16a34a',
                  padding: '0.875rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <ChevronLeft size={18} /> Back
              </button>
              <button
                onClick={handleContinueToReview}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #16a34a, #15803d)',
                  color: 'white',
                  border: 'none',
                  padding: '0.875rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                Review Order <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review Order */}
        {currentStep === 'review' && (
          <div>
            <OrderSummary
              cartItems={cart}
              subtotal={subtotal}
              serviceFee={serviceFee}
              total={total}
              processing={processing}
              onPlaceOrder={handlePlaceOrder}
            />

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setCurrentStep('payment')}
                disabled={processing}
                style={{
                  flex: 1,
                  background: 'white',
                  color: '#16a34a',
                  border: '2px solid #16a34a',
                  padding: '0.875rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  opacity: processing ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <ChevronLeft size={18} /> Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;