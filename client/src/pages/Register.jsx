import { useState } from 'react'
import axios from '../utils/axios'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/slices/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import { FiUserPlus } from 'react-icons/fi'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [nameValid, setNameValid] = useState(true)
  const [emailValid, setEmailValid] = useState(true)
  const [passwordValid, setPasswordValid] = useState(true)
  const [loading, setLoading] = useState(false)

  const validateName = (value) => {
    setNameValid(value.trim().length >= 2)
  }

  const validateEmail = (value) => {
    const regex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z]+\.[a-zA-Z]{2,}$/
    setEmailValid(regex.test(value.trim()))
  }

  const validatePassword = (value) => {
    setPasswordValid(value.trim().length >= 6)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      toast.error('Please fill all fields.', { className: 'toastError' })
      return
    }

    if (!nameValid || !emailValid || !passwordValid) {
      toast.error('Please fix validation errors.', { className: 'toastError' })
      return
    }

    try {
      setLoading(true)
      const { data } = await axios.post('/api/auth/register', {
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      })
      toast.success(data.message, { className: 'toastSuccess' })
      localStorage.setItem('token', data.token)
      dispatch(setUser(data.user))
      setName('')
      setEmail('')
      setPassword('')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.', { className: 'toastError' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-10 px-6">
      <div className="formContainer transition-transform hover:scale-[1.01]" aria-label="Registration Form">
        <h2 className="formTitle flex items-center gap-2 text-[var(--color-teal-500)]">
          <FiUserPlus /> Create Your CyclePort Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 relative">
          <input
            type="text"
            placeholder="Name"
            value={name}
            autoComplete="name"
            aria-label="Name"
            aria-invalid={!nameValid}
            aria-describedby="nameError"
            onChange={(e) => setName(e.target.value)}
            onBlur={(e) => validateName(e.target.value)}
            className={`formInput ${name.length === 0 ? '' : nameValid ? 'border-green-500' : 'border-red-500'}`}
            required
          />
          {!nameValid && (
            <p id="nameError" className="text-red-500 text-sm mb-2">
              Name must be at least 2 characters
            </p>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            autoComplete="email"
            aria-label="Email"
            aria-invalid={!emailValid}
            aria-describedby="emailError"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => validateEmail(e.target.value)}
            className={`formInput ${email.length === 0 ? '' : emailValid ? 'border-green-500' : 'border-red-500'}`}
            required
          />
          {!emailValid && (
            <p id="emailError" className="text-red-500 text-sm mb-2">
              Invalid email format
            </p>
          )}

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              autoComplete="new-password"
              aria-label="Password"
              aria-invalid={!passwordValid}
              aria-describedby="passwordError"
              onChange={(e) => setPassword(e.target.value)}
              onBlur={(e) => validatePassword(e.target.value)}
              className={`formInput pr-10 ${password.length === 0 ? '' : passwordValid ? 'border-green-500' : 'border-red-500'}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-xl"
              aria-label="Toggle password visibility"
            >
              {showPassword ? '🙈' : '🐵'}
            </button>
          </div>
          {!passwordValid && (
            <p id="passwordError" className="text-red-500 text-sm mb-2">
              Password must be at least 6 characters
            </p>
          )}

          <button
            type="submit"
            className="formButton w-full"
            disabled={loading}
            aria-label="Submit registration form"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <Link to="/login" className="formLink" aria-label="Go to login page">
          Already have an account? Login
        </Link>
      </div>
    </section>
  )
}

export default Register