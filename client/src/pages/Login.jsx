import { useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (value) => {
    const regex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    setEmailValid(regex.test(value.trim()));
  };

  const validatePassword = (value) => {
    setPasswordValid(value.trim().length >= 6);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast.error("Please fill all fields.", { className: "toastError" });
      return;
    }

    if (!emailValid || !passwordValid) {
      toast.error("Please fix validation errors.", { className: "toastError" });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/login", {
        email: trimmedEmail,
        password: trimmedPassword,
      });

      toast.success(data.message, { className: "toastSuccess" });

      dispatch(setUser({
        user: data.user,
        token: data.token,
      }));

      navigate(data.user.role === "admin" ? "/admin/dashboard" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.", {
        className: "toastError",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-10 px-6">
      <div
        className="formContainer transition-transform hover:scale-[1.01]"
        aria-label="Login Form"
      >
        <h2 className="formTitle flex items-center gap-2 text-[var(--color-teal-500)]">
          <FiLogIn /> Login to CyclePort
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            className={`formInput ${
              email.length === 0
                ? ""
                : emailValid
                ? "border-green-500"
                : "border-red-500"
            }`}
            required
          />
          {!emailValid && (
            <p id="emailError" className="text-red-500 text-sm mb-2">
              Invalid email format
            </p>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              autoComplete="current-password"
              aria-label="Password"
              aria-invalid={!passwordValid}
              aria-describedby="passwordError"
              onChange={(e) => setPassword(e.target.value)}
              onBlur={(e) => validatePassword(e.target.value)}
              className={`formInput pr-10 ${
                password.length === 0
                  ? ""
                  : passwordValid
                  ? "border-green-500"
                  : "border-red-500"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-6 text-xl cursor-pointer"
              aria-label="Toggle password visibility"
              title={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? "🙈" : "🐵"}
            </button>
          </div>

          {!passwordValid && (
            <p id="passwordError" className="text-red-500 text-sm mb-2">
              Password must be at least 6 characters
            </p>
          )}

          <button
            type="submit"
            className="formButton w-full cursor-pointer"
            disabled={loading}
            aria-label="Submit login form"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-right mt-2">
          <Link
            to="/forgot-password"
            className="text-sm text-[var(--color-teal-500)] hover:underline"
            aria-label="Go to forgot password page"
          >
            Forgot Password?
          </Link>
        </div>
        <Link
          to="/register"
          className="formLink"
          aria-label="Go to registration page"
        >
          Don't have an account? Register
        </Link>
      </div>
    </section>
  );
};

export default Login;