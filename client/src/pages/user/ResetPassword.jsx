import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../../utils/axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const { email } = useParams()
  const decodedEmail = atob(email)
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      await axios.post('/api/auth/reset-password', {
        email: decodedEmail,
        password,
      })
      toast.success('Password reset successful')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Reset failed')
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
              placeholder="New Password"
              required
              className="inputField pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2/3 -translate-y-1/2 text-xl"
              title={showPassword ? 'Hide Password' : 'Show Password'}
            >
              {showPassword ? '🙈' : '🐵'}
            </button>
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
              className="inputField pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-3 top-2/3 -translate-y-1/2 text-xl"
              title={showConfirm ? 'Hide Confirm Password' : 'Show Confirm Password'}
            >
              {showConfirm ? '🙈' : '🐵'}
            </button>
          </div>

          <button type="submit" className="btnPrimary w-full mt-4">
            Reset Password
          </button>
        </form>
      </div>
    </section>
  )
}

export default ResetPassword