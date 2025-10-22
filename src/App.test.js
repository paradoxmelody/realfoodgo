import { render, screen } from '@testing-library/react';
import Cart from './components/cart/Cart';
import { CartProvider } from './context/CartContext';
import { BrowserRouter } from 'react-router-dom';

test('renders shopping cart title', () => {
  render(
    <BrowserRouter>
      <CartProvider>
        <Cart />
      </CartProvider>
    </BrowserRouter>
  );
  const titleElement = screen.getByText(/shopping cart/i);
  expect(titleElement).toBeInTheDocument();
});
