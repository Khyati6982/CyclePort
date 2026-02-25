import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "../utils/axios";
import { setUser } from "../redux/slices/authSlice";
import { FiUser, FiEdit2, FiSave } from "react-icons/fi";
import { toast } from "react-toastify";
import Avatar from "../components/Avatar";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatar(user.avatar);
      setPreview("");
    }
  }, [user]);

  // Upload avatar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(file); // store File
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    // Handle avatar correctly
    if (avatar instanceof File) {
      formData.append("avatar", avatar);
    } else if (typeof avatar === "string") {
      formData.append("avatar", avatar);
    }

    setLoading(true);
    try {
      const { data } = await axios.put("/api/auth/profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      const normalizedUser = {
        ...data.user,
        avatar: data.user.avatar || "/images/default-avatar.jpg",
      };

      dispatch(setUser(normalizedUser));
      toast.success("Profile updated successfully!");
      setPassword("");
      setConfirmPassword("");
      setIsEditing(false);
      setPreview(""); 
    } catch (error) {
      console.error("Profile update error:", error); 
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
      setPreview("");
    }
    setPassword("");
    setConfirmPassword("");
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="text-center mt-10">
        <p className="text-lg text-gray-500">Loading profile...</p>
      </div>
    );
  }

  // Avatar rendering logic
  const avatarPath =
    avatar instanceof File
      ? preview
      : avatar?.startsWith("http")
        ? avatar
        : avatar || "/images/default-avatar.jpg";

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
            <Avatar src={avatarPath} className="w-20 h-20" />
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
                type={showPassword ? "text" : "password"}
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
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? "🙈" : "🐵"}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[var(--color-charcoal-700)] dark:text-white">
              Confirm Password:
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
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
                title={showConfirmPassword ? "Hide Password" : "Show Password"}
              >
                {showConfirmPassword ? "🙈" : "🐵"}
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
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
              className="inputField cursor-pointer"
              disabled={loading}
            />
            {avatarPath && (
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
              <FiSave /> {loading ? "Updating..." : "Save Changes"}
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
