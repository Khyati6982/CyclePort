import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../utils/axios';
import { setUser } from '../redux/slices/authSlice';
import { FiUser, FiEdit2, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Avatar from '../components/Avatar';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [nameValid, setNameValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatar(user.avatar);
    }
  }, [user]);

  const validateName = (value) => {
    setNameValid(value.trim().length >= 2);
  };

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    setEmailValid(regex.test(value.trim()));
  };

  // Upload avatar via /api/upload/profile
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('/api/upload/profile', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const imagePath = res.data.imagePath;
      setAvatar(imagePath);
      toast.success('Profile image uploaded!');
    } catch (err) {
      toast.error('Image upload failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent empty updates
    if (
      name === user.name &&
      email === user.email &&
      !password
    ) {
      toast.info("No changes detected.");
      setIsEditing(false);
      return;
    }

    if (!nameValid || !emailValid) {
      toast.error("Please fix validation errors.");
      return;
    }

    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (password) formData.append("password", password);
    // Removed avatar append — handled separately via /api/upload/profile

    setLoading(true);
    try {
      const { data } = await axios.put("/api/auth/profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Normalize avatar before dispatch
      const normalizedUser = {
        ...data.user,
        avatar: data.user.avatar?.startsWith("/uploads")
          ? `${import.meta.env.VITE_API_URL}${data.user.avatar}`
          : data.user.avatar || "/images/default-avatar.png",
      };

      dispatch(setUser(normalizedUser));
      toast.success("Profile updated successfully!");
      setPassword("");
      setConfirmPassword("");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatar(user.avatar);
    }
    setPassword('');
    setConfirmPassword('');
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="text-center mt-10">
        <p className="text-lg text-gray-500">Loading profile...</p>
      </div>
    );
  }

  const userAvatarPath = user?.avatar?.startsWith("/uploads")
    ? `${import.meta.env.VITE_API_URL}${user.avatar}`
    : user?.avatar || "/images/default-avatar.png";

  const avatarPath = avatar?.startsWith("/uploads")
    ? `${import.meta.env.VITE_API_URL}${avatar}`
    : avatar || "/images/default-avatar.png";

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-[var(--color-charcoal-800)] rounded shadow transition-transform hover:scale-[1.01]"
         aria-label="User Profile Section">
      <h2 className="text-xl font-bold mb-6 text-[var(--color-teal-500)] flex items-center gap-2">
        <FiUser /> Your Profile
      </h2>

      {!isEditing ? (
        <>
          <div className="flex justify-center mb-4">
            <Avatar src={userAvatarPath} className="w-20 h-20" />
          </div>

          <p className="text-md text-[var(--color-charcoal-700)] dark:text-white text-center">
            <strong>Name:</strong> {user.name}
          </p>
          <p className="text-md text-[var(--color-charcoal-700)] dark:text-white text-center mt-2">
            <strong>Email:</strong> {user.email}
          </p>

          <button
            onClick={() => setIsEditing(true)}
            className="btnPrimary w-full mt-4 flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiEdit2 /> Edit Profile
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password fields */}
          <div>
            <label className="block font-semibold text-[var(--color-charcoal-700)] dark:text-white">
              New Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="inputField pr-10"
                placeholder="Leave blank to keep current password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer"
                aria-label="Toggle password visibility"
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? '🙈' : '🐵'}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[var(--color-charcoal-700)] dark:text-white">
              Confirm Password:
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="inputField pr-10"
                placeholder="Confirm new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer"
                aria-label="Toggle confirm password visibility"
                title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
              >
                {showConfirmPassword ? '🙈' : '🐵'}
              </button>
            </div>
          </div>

          {/* Profile Image Upload */}
          <div>
            <label className="block font-semibold text-[var(--color-charcoal-700)] dark:text-white">
              Profile Image:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="inputField cursor-pointer"
              disabled={loading}
            />
            {avatar && (
              <div className="mt-2 flex justify-center">
                <Avatar src={avatarPath} className="w-20 h-20" />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="btnPrimary flex items-center gap-2 cursor-pointer"
            >
              <FiSave /> {loading ? 'Updating...' : 'Save Changes'}
            </button>

                        <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition flex items-center gap-2 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;