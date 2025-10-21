const CardDetailsForm = ({ cardInfo, onInputChange, onCardNumberChange, onExpiryChange }) => {
  return (
    <div className="card-details">
      <div className="form-grid">
        <div className="form-group full-width">
          <label>Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={cardInfo.cardNumber}
            onChange={onCardNumberChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Cardholder Name</label>
          <input
            type="text"
            name="cardName"
            value={cardInfo.cardName}
            onChange={onInputChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="form-group">
          <label>Expiry Date</label>
          <input
            type="text"
            name="expiryDate"
            value={cardInfo.expiryDate}
            onChange={onExpiryChange}
            placeholder="MM/YY"
            maxLength="5"
            required
          />
        </div>

        <div className="form-group">
          <label>CVV</label>
          <input
            type="text"
            name="cvv"
            value={cardInfo.cvv}
            onChange={onInputChange}
            placeholder="123"
            maxLength="3"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default CardDetailsForm;
