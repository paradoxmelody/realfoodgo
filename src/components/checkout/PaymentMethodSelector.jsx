import { CreditCard, Wallet } from 'lucide-react';

const PaymentMethodSelector = ({ selectedPayment, onPaymentSelect }) => {
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, Amex' },
    { id: 'ewallet', name: 'E-Wallet', icon: Wallet, description: 'PayPal, Stripe' },
  ];

  return (
    <div className="checkout-section">
      <h2>
        <CreditCard size={24} />
        Payment Method
      </h2>
      <div className="payment-methods">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`payment-method ${selectedPayment === method.id ? 'selected' : ''}`}
            onClick={() => onPaymentSelect(method.id)}
          >
            <div className="payment-icon">
              <method.icon size={24} />
            </div>
            <div className="payment-details">
              <h3>{method.name}</h3>
              <p>{method.description}</p>
            </div>
            <div className="payment-radio">
              <input
                type="radio"
                checked={selectedPayment === method.id}
                onChange={() => onPaymentSelect(method.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
