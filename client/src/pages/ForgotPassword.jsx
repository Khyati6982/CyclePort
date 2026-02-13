import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // flexible regex
    setEmailValid(regex.test(value.trim()));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailValid) {
      toast.error('Please enter a valid email.', { className: 'toastError' });
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/verify-email', { email: email.trim() });
      toast.success(data.message || 'Email verified.');
      navigate(`/reset-password/${btoa(email.trim())}`);
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
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Enter your registered email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => validateEmail(e.target.value)}
            required
            disabled={loading}
            aria-label="Email"
            aria-invalid={!emailValid}
            aria-describedby="emailError"
            className={`inputField ${email.length === 0 ? '' : emailValid ? 'border-green-500' : 'border-red-500'}`}
            placeholder="Email"
          />
          {!emailValid && (
            <p id="emailError" className="text-red-500 text-sm mb-2">
              Invalid email format
            </p>
          )}
          <button
            type="submit"
            className="btnPrimary w-full cursor-pointer"
            disabled={loading}
            aria-label="Submit forgot password form"
          >
            {loading ? 'Verifying...' : 'Continue'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;