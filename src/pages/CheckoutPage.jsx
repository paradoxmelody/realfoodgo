import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/landing/Navbar';
import PickUp from '../components/checkout/PickUp';
import PaymentMethodSelector from '../components/checkout/PaymentMethodSelector';
import CardDetailsForm from '../components/checkout/CardDetailsForm';
import OrderSummary from '../components/checkout/OrderSummary';
import OrderSuccess from '../components/checkout/OrderSuccess';
import './Checkout.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart =[], clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState('checkout');
  const [processing, setProcessing] = useState(false);

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
    setPickupInfo({
      ...pickupInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePickupTimeChange = (e) => {
    setPickupInfo({
      ...pickupInfo,
      pickupTime: e.target.value
    });
  };

  const handlePaymentSelect = (paymentId) => {
    setSelectedPayment(paymentId);
  };

  const handleCardInputChange = (e) => {
    setCardInfo({
      ...cardInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardInfo({
      ...cardInfo,
      cardNumber: formattedValue
    });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setCardInfo({
      ...cardInfo,
      expiryDate: value
    });
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

    // Simulate payment processing
    setTimeout(() => {
      const orderData = {
        items: cart,
        pickup: pickupInfo,
        payment: {
          method: selectedPayment,
          ...(selectedPayment === 'card' && {
            cardLast4: cardInfo.cardNumber.slice(-4)
          })
        },
        pricing: {
          subtotal,
          serviceFee,
          total
        },
        timestamp: new Date().toISOString()
      };

      console.log('Order placed:', orderData);
      
      clearCart();
      setProcessing(false);
      setCurrentStep('success');
    }, 2000);
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
        <OrderSuccess itemCount={cart.length} />
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