import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mt-4">
      <h2>🛒 Your Cart</h2>
      {cart.length === 0 ? <p>Your cart is empty.</p> : (
        <ul className="list-group mb-3">
          {cart.map((item) => (
            <li className="list-group-item d-flex justify-content-between" key={item.bookID}>
              <span>{item.title} (x{item.quantity})</span>
              <span>
                ${item.price.toFixed(2)} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                <button className="btn btn-sm btn-danger ms-2" onClick={() => removeFromCart(item.bookID)}>Remove</button>
              </span>
            </li>
          ))}
        </ul>
      )}
      <h4>Total: ${total.toFixed(2)}</h4>
      <button className="btn btn-secondary me-2" onClick={() => navigate(-1)}>Continue Shopping</button>
      <button className="btn btn-danger" onClick={clearCart}>Clear Cart</button>
    </div>
  );
}

export default CartPage;

