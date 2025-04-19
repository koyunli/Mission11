import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Book } from '../types/Book';

interface CartItem extends Book {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = sessionStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book: Book) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.bookID === book.bookID);
      if (exists) {
        return prev.map((item) =>
          item.bookID === book.bookID ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...book, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (bookId: number) => {
    setCart((prev) => prev.filter((item) => item.bookID !== bookId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};