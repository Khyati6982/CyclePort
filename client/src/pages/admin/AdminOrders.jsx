import { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { fetchAllOrders } from '../../redux/slices/orderSlice';
import { toast } from 'react-toastify';
import { FiUser, FiTag, FiPackage } from 'react-icons/fi';

const AdminOrders = () => {
  const dispatch = useDispatch();

  const { allOrders, loading, error } = useSelector(
    (state) => ({
      allOrders: state.orders.allOrders,
      loading: state.orders.loading,
      error: state.orders.error,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading orders...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error loading orders.</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 space-y-6">
      <h2 className="text-2xl font-bold text-[var(--color-teal-500)]">Admin Order Dashboard</h2>

      {allOrders.length === 0 ? (
        <p className="text-center text-[var(--color-charcoal-700)]">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {allOrders.map((order) => (
            <div
              key={order._id}
              className="border rounded p-4 shadow bg-[var(--color-white)] dark:bg-[var(--color-charcoal-900)] transition-transform hover:scale-[1.01]"
              aria-label={`Order ${order._id}`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-[var(--color-teal-500)]">
                  <FiPackage className="inline-block mr-2" />
                  Order #{order._id.slice(-6)}
                </h3>
                <span
                  className={`text-sm px-2 py-1 rounded uppercase ${
                    order.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>

              <p className="text-sm text-[var(--color-charcoal-700)] dark:text-[var(--color-charcoal-100)] mt-2 flex items-center gap-2">
                <FiUser /> User ID: {order.userId?.name || order.userId}
              </p>
              <p className="text-sm mt-1 flex items-center gap-2">
                <FiTag /> Total: ₹{order.total}
              </p>

              <ul className="mt-2 list-disc list-inside text-sm">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} × {item.quantity} — ₹{item.price * item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
