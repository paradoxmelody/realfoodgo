import Cart from '../components/cart/Cart';
import Galaxy from '../components/cart/galaxy';
import Navbar from '../components/landing/Navbar';

function CartApp() {
  return (
    <div className="CartApp">
      <Navbar />
      <Galaxy />
      <Cart />
    </div>
  );
}

export default CartApp;