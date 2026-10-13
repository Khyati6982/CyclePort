import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../utils/axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const { email } = useParams()
  const decodedEmail = atob(email)
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passwordValid, setPasswordValid] = useState(true)

  const validatePassword = (value) => {
    setPasswordValid(value.trim().length >= 6)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!passwordValid) {
      toast.error('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await axios.post('/api/auth/reset-password', {
        email: decodedEmail,
        password: password.trim(),
      })
      toast.success('Password reset successful.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Reset failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-10 px-6">
      <div className="formContainer max-w-md mx-auto bg-white dark:bg-[var(--color-bg-dark)] rounded-lg shadow-md p-6">
        <h2 className="formTitle text-[var(--color-teal-500)] text-2xl font-bold mb-4">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={(e) => validatePassword(e.target.value)}
              placeholder="New Password"
              required
              disabled={loading}
              aria-label="New Password"
              aria-invalid={!passwordValid}
              aria-describedby="passwordError"
              className={`inputField pr-10 ${password.length === 0 ? '' : passwordValid ? 'border-green-500' : 'border-red-500'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1 text-xl cursor-pointer"
              title={showPassword ? 'Hide Password' : 'Show Password'}
              aria-label="Toggle password visibility"
            >
              {showPassword ? '🙈' : '🐵'}
            </button>
            {!passwordValid && (
              <p id="passwordError" className="text-red-500 text-sm mt-1">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
              disabled={loading}
              aria-label="Confirm Password"
              className="inputField pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1 text-xl cursor-pointer"
              title={showConfirm ? 'Hide Confirm Password' : 'Show Confirm Password'}
              aria-label="Toggle confirm password visibility"
            >
              {showConfirm ? '🙈' : '🐵'}
            </button>
          </div>

          <button
            type="submit"
            className="btnPrimary w-full mt-4 cursor-pointer flex items-center justify-center gap-2"
            disabled={loading}
            aria-label="Submit reset password form"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default ResetPassword