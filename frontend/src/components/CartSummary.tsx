import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartSummary() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="position-fixed top-0 end-0 m-3 bg-light border p-2 rounded shadow" role="button" onClick={() => navigate('/cart')}>
      <strong>${total.toFixed(2)}</strong> 
      <span className="badge bg-primary ms-2">{count}</span>
    </div>
  );
}

export default CartSummary;