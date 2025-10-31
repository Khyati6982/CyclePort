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

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatar(user.avatar);
    }
  }, [user]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('/api/upload', formData);
      const imagePath = res.data.imagePath;
      setAvatar(imagePath);
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error('Image upload failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (password) formData.append('password', password);
    if (avatar) formData.append('avatar', avatar);

    setLoading(true);
    try {
      const { data } = await axios.put('/api/auth/profile', formData);
      dispatch(setUser(data.user));
      toast.success('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center mt-10">
        <p className="text-lg text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div
      className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-[var(--color-charcoal-800)] rounded shadow transition-transform hover:scale-[1.01]"
      aria-label="User Profile Section"
    >
      <h2 className="text-xl font-bold mb-6 text-[var(--color-teal-500)] flex items-center gap-2">
        <FiUser /> Your Profile
      </h2>

      {!isEditing ? (
        <>
          <div className="flex justify-center mb-4">
            <Avatar src={user?.avatar} className="w-20 h-20" />
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
          <div className="flex justify-center mb-4">
            <Avatar src={avatar || user?.avatar} className="w-20 h-20" />
          </div>

          <div>
            <label className="block font-semibold text-[var(--color-charcoal-700)] dark:text-white">
              Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="inputField"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-[var(--color-charcoal-700)] dark:text-white">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="inputField"
              required
            />
          </div>

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

          <div>
            <label className="block font-semibold text-[var(--color-charcoal-700)] dark:text-white">
              Profile Image:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="inputField cursor-pointer"
            />
          </div>

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
              onClick={() => setIsEditing(false)}
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