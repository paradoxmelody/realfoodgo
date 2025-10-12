import './Cart.css';

const Cart = () => {
  // DEMO DATA 
  const cartItems = {
    1: 2, // 2x Pizza
    3: 1, // 1x Salad
    4: 3  // 3x Cokes
  };

  const food_list = [
    { _id: 1, name: "Margherita Pizza", price: 89.99, image: "https://picsum.photos/200/200?pizza" },
    { _id: 2, name: "Chicken Burger", price: 65.50, image: "https://picsum.photos/200/200?burger" },
    { _id: 3, name: "Caesar Salad", price: 45.00, image: "https://picsum.photos/200/200?salad" },
    { _id: 4, name: "Coke", price: 18.00, image: "https://picsum.photos/200/200?coke" },
  ];

  // Calculate subtotal
  const subtotal = food_list.reduce((acc, item) => {
    const quantity = cartItems[item._id] || 0;
    return acc + item.price * quantity;
  }, 0);

  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id} className="cart-items-title cart-items-item">
                <img src={item.image} alt="" />
                <p>{item.name}</p>
                <p>R{item.price}</p>
                <p>{cartItems[item._id]}</p>
                <p>R{item.price * cartItems[item._id]}</p>
                <p className="cross">×</p>
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-button">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>R{subtotal.toFixed(2)}</p>
            </div>
            <div className="cart-total-details">
              <p>Service Fee (10%)</p>
              <p>R{serviceFee.toFixed(2)}</p>
            </div>
            <div className="cart-total-details">
              <b>Total</b>
              <b>R{total.toFixed(2)}</b>
            </div>
            <button>Proceed To Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;