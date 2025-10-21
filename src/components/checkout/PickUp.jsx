import { MapPin, User, Phone, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

const PickupForm = ({ deliveryInfo, onInputChange, onPickupTimeChange }) => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  useEffect(() => {
    generateTimeSlots();
  }, []);

  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const closingHour = 25;
    
    let startHour = currentHour;
    let startMinute = currentMinute + 30;
    
    if (startMinute >= 60) {
      startHour += 1;
      startMinute = startMinute - 60;
    }
    
    if (startMinute > 0 && startMinute <= 30) {
      startMinute = 30;
    } else if (startMinute > 30) {
      startHour += 1;
      startMinute = 0;
    }
    
    if (startHour >= closingHour) {
      slots.push({
        value: 'closed',
        label: 'Store closed - Please come back tomorrow',
        disabled: true
      });
      setAvailableTimeSlots(slots);
      return;
    }
    
    let hour = startHour;
    let minute = startMinute;
    
    while (hour < closingHour || (hour === closingHour && minute === 0)) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const displayTime = formatTime(hour, minute);
      
      slots.push({
        value: timeString,
        label: displayTime,
        disabled: false
      });
      
      minute += 30;
      if (minute >= 60) {
        hour += 1;
        minute = 0;
      }
      
      if (hour >= closingHour) {
        break;
      }
    }
    
    if (slots.length === 0) {
      slots.push({
        value: 'closed',
        label: 'No pickup times available today',
        disabled: true
      });
    }
    
    setAvailableTimeSlots(slots);
  };

  const formatTime = (hour, minute) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
  };

  return (
    <div className="checkout-section">
      <h2>
        <MapPin size={24} />
        Pickup Information
      </h2>
      <div className="form-grid">
        <div className="form-group full-width">
          <label>
            <User size={18} />
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={deliveryInfo.fullName}
            onChange={onInputChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="form-group full-width">
          <label>
            <Phone size={18} />
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={deliveryInfo.phone}
            onChange={onInputChange}
            placeholder="+27 12 345 6789"
            required
          />
        </div>

        <div className="form-group full-width">
          <label>
            <Clock size={18} />
            Pickup Time
          </label>
          <select
            name="pickupTime"
            value={deliveryInfo.pickupTime || ''}
            onChange={onPickupTimeChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              backgroundColor: 'white',
              color: '#1f2937'
            }}
          >
            <option value="" disabled>Select pickup time</option>
            {availableTimeSlots.map((slot, index) => (
              <option 
                key={index} 
                value={slot.value} 
                disabled={slot.disabled}
              >
                {slot.label}
              </option>
            ))}
          </select>
          <p style={{ 
            fontSize: '0.85rem', 
            color: '#6b7280', 
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Clock size={14} />
            Store hours: 8:00 AM - 5:00 PM
          </p>
        </div>

        <div className="form-group full-width">
          <label>Special Instructions (Optional)</label>
          <textarea
            name="instructions"
            value={deliveryInfo.instructions}
            onChange={onInputChange}
            placeholder="Any special requests for your order..."
            rows="3"
          />
        </div>
      </div>
    </div>
  );
};

export default PickupForm;