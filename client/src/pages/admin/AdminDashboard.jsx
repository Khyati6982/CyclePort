import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/slices/productSlice';
import { fetchAllOrders } from '../../redux/slices/orderSlice';
import { FaBoxOpen, FaClipboardList, FaRupeeSign } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products?.products || []);
  const orders = useSelector((state) => state.orders?.allOrders || []);
  const loadingProducts = useSelector((state) => state.products?.loading || false);
  const loadingOrders = useSelector((state) => state.orders?.loading || false);
  const error = useSelector((state) => state.orders?.error || null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, { className: 'toastError' });
    }
  }, [error]);

  const totalRevenue = orders.reduce((sum, order) => {
    const total = typeof order.total === 'number' ? order.total : 0;
    return sum + total;
  }, 0);

  const recentOrders = orders.slice(0, 5);

  if (loadingProducts || loadingOrders) {
    return <p className="text-center mt-10 text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div className="w-full mt-6 space-y-10">
      <h2 className="text-2xl font-bold text-[var(--color-teal-500)]">Admin Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[var(--color-charcoal-800)] p-6 rounded shadow text-center transition-transform hover:scale-[1.02]">
          <FaBoxOpen className="text-4xl text-[var(--color-teal-500)] mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-[var(--color-charcoal-700)] dark:text-white">Total Products</h3>
          <p className="text-3xl font-bold text-[var(--color-teal-500)] mt-2">{products.length}</p>
        </div>

        <div className="bg-white dark:bg-[var(--color-charcoal-800)] p-6 rounded shadow text-center transition-transform hover:scale-[1.02]">
          <FaClipboardList className="text-4xl text-[var(--color-teal-500)] mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-[var(--color-charcoal-700)] dark:text-white">Total Orders</h3>
          <p className="text-3xl font-bold text-[var(--color-teal-500)] mt-2">{orders.length}</p>
        </div>

        <div className="bg-white dark:bg-[var(--color-charcoal-800)] p-6 rounded shadow text-center transition-transform hover:scale-[1.02]">
          <FaRupeeSign className="text-4xl text-[var(--color-teal-500)] mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-[var(--color-charcoal-700)] dark:text-white">Total Revenue</h3>
          <p className="text-3xl font-bold text-[var(--color-teal-500)] mt-2">₹{totalRevenue}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[var(--color-charcoal-800)] p-6 rounded shadow">
        <h3 className="text-xl font-semibold text-[var(--color-teal-500)] mb-4">Recent Orders</h3>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
              <thead className="border-b text-[var(--color-teal-500)]">
                <tr>
                  <th className="py-2">Order ID</th>
                  <th className="py-2">Total</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="py-2">#{order._id.slice(-6)}</td>
                    <td className="py-2">₹{order.total}</td>
                    <td className="py-2">{new Date(order.createdAt).toLocaleDateString('en-GB')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No recent orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
