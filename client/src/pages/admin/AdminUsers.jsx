import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, toggleStatus } from '../../redux/slices/userSlice';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, { className: 'toastError' });
    }
  }, [error]);

  const handleToggle = (id) => {
    dispatch(toggleStatus(id));
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading users...</p>;
  }

  return (
    <div className="w-full mt-6 space-y-6">
      <div className="px-4">
        <h2 className="text-2xl font-bold text-[var(--color-teal-500)] mb-2">All Users</h2>
        <p className="text-sm text-gray-600 mb-6">
          Total Users: {users.length} | Admins: {users.filter(u => u.role === 'admin').length} | Active: {users.filter(u => u.isActive).length}
        </p>
      </div>

      {users.length > 0 ? (
        <div className="overflow-x-auto px-4">
          <table className="min-w-[600px] w-full border-collapse">
            <thead>
              <tr className="bg-[var(--color-teal-100)] dark:bg-[var(--color-charcoal-800)] text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b dark:border-gray-700">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${
                      user.role === 'admin' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      user.isActive ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    <span className="text-sm">{user.isActive ? 'Active' : 'Inactive'}</span>
                    <button
                      onClick={() => handleToggle(user._id)}
                      className="text-sm text-blue-600 hover:underline ml-2 cursor-pointer"
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-sm px-4">No users found.</p>
      )}
    </div>
  );
};

export default AdminUsers;