import { createContext, useEffect, useState } from 'react';

export const StoreContext = createContext();

export const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);

  // fuck hell too late
  useEffect(() => {
    const mockFoodList = [
      { _id: 1, name: "Margherita Pizza", price: 89.99, image: "https://picsum.photos/200/200?food=1" },
      { _id: 2, name: "Chicken Burger", price: 65.50, image: "https://picsum.photos/200/200?food=2" },
      { _id: 3, name: "Caesar Salad", price: 45.00, image: "https://picsum.photos/200/200?food=3" },
      { _id: 4, name: "Coke", price: 18.00, image: "https://picsum.photos/200/200?dessert=1" },
      // fuck yu all fr
    ];
    setFoodList(mockFoodList);

    // 
    setCartItems({
      1: 2, // 2x Pizza
      3: 1, // 1x Salad
      4: 3  // 3x Cokes
    });
  }, []);

  const addToCart = (itemId) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const contextValue = {
    cartItems,
    food_list,
    addToCart,
    removeFromCart
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContext;