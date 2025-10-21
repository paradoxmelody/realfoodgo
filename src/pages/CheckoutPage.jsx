import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, storage } from '../firebase_data/firebase';
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
  const { cart = [], clearCart } = useCart();
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState('checkout');
  const [processing, setProcessing] = useState(false);

  // Get vendorName from navigation state
  const vendorName = location.state?.vendorName || 'Unknown Vendor';

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

  const subtotal = (cart || []).reduce((sum, item) => sum + item.price * item.quantity, 0);
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
    if (!validateForm()) return;

    setProcessing(true);

    try {
      const orderData = {
        userId: currentUser.uid,
        items: cart,
        pickup: pickupInfo,
        vendorName, // dynamic vendor name
        payment: {
          method: selectedPayment,
          ...(selectedPayment === 'card' && { cardLast4: cardInfo.cardNumber.slice(-4) })
        },
        subtotal,
        serviceFee,
        total,
        status: 'Pending',
        timestamp: new Date().toISOString()
      };

      // ✅ Save full order to Firestore
      const docRef = await addDoc(collection(db, 'orders'), orderData);

      // ✅ Also save a lightweight version in the user profile document
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

      clearCart();
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
      <div>
        <Navbar />
        <div className="checkout-container">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <button onClick={() => navigate('/vendor')} className="continue-shopping-btn">
              Continue Shopping
            </button>
          </div>
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
    <div>
      <Navbar />
      <div className="checkout-container">
        <div className="checkout-content">
          <div className="checkout-main">
            <h1 className="checkout-title">Checkout</h1>

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
  );
};

export default CheckoutPage;
