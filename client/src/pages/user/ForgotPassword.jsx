import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/verify-email', { email });
      toast.success(data.message || 'Email verified.');
      navigate(`/reset-password/${btoa(email)}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-10 px-6">
      <div className="formContainer max-w-md mx-auto bg-white dark:bg-[var(--color-bg-dark)] rounded-lg shadow-md p-6">
        <h2 className="formTitle text-[var(--color-teal-500)] text-2xl font-bold mb-4">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Enter your registered email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="inputField"
            placeholder="Email"
          />
          <button type="submit" className="btnPrimary w-full cursor-pointer" disabled={loading}>
            {loading ? 'Verifying...' : 'Continue'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;