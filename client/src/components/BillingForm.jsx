import { useState } from 'react';

const BillingForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      city: '',
      postalCode: '',
      country: 'IN',
    },
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, phone: digitsOnly.slice(0, 10) }));
      return;
    }

    if (name === "postalCode") {
      const digitsOnly = value.replace(/\D/g, "");
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, postalCode: digitsOnly.slice(0, 6) },
      }));
      return;
    }

    if (name === "name") {
      const lettersOnly = value.replace(/[^A-Za-z\s]/g, ""); // only letters + spaces
      setForm((prev) => ({ ...prev, name: lettersOnly }));
      return;
    }

    if (name === "city") {
      const lettersOnly = value.replace(/[^A-Za-z\s]/g, ""); // only letters + spaces
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, city: lettersOnly },
      }));
      return;
    }

    if (name === "line1") {
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, line1: value },
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = "";

    if (name === "name") {
      if (!value.trim()) error = "Full name is required.";
      else if (!/^[A-Za-z\s]+$/.test(value)) error = "Name should only contain letters and spaces.";
    }

    if (name === "email") {
      if (!value.trim()) error = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Please enter a valid email address.";
    }

    if (name === "phone") {
      if (!value.trim()) error = "Mobile number is required.";
      else if (!/^[0-9]{10}$/.test(value)) error = "Mobile number must be exactly 10 digits.";
    }

    if (name === "city") {
      if (!value.trim()) error = "City is required.";
      else if (!/^[A-Za-z\s]+$/.test(value)) error = "City should only contain letters.";
    }

    if (name === "postalCode") {
      if (!value.trim()) error = "Postal code is required.";
      else if (!/^[0-9]{6}$/.test(value)) error = "Postal code must be exactly 6 digits.";
    }

    if (name === "line1") {
      if (!value.trim()) error = "Address Line 1 is required.";
      else if (!/[A-Za-z0-9]/.test(value)) error = "Address must contain letters or numbers.";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Full name is required.";
    else if (!/^[A-Za-z\s]+$/.test(form.name)) newErrors.name = "Name should only contain letters and spaces.";

    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Please enter a valid email address.";

    if (!form.phone.trim()) newErrors.phone = "Mobile number is required.";
    else if (!/^[0-9]{10}$/.test(form.phone)) newErrors.phone = "Mobile number must be exactly 10 digits.";

    if (!form.address.city.trim()) newErrors.city = "City is required.";
    else if (!/^[A-Za-z\s]+$/.test(form.address.city)) newErrors.city = "City should only contain letters.";

    if (!form.address.postalCode.trim()) newErrors.postalCode = "Postal code is required.";
    else if (!/^[0-9]{6}$/.test(form.address.postalCode)) newErrors.postalCode = "Postal code must be exactly 6 digits.";

    if (!form.address.line1.trim()) newErrors.line1 = "Address Line 1 is required.";
    else if (!/[A-Za-z0-9]/.test(form.address.line1)) newErrors.line1 = "Address must contain letters or numbers.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(form);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-10 space-y-6 p-6 bg-white dark:bg-[var(--color-charcoal-900)] rounded-lg shadow-md"
      aria-label="Billing form"
    >
      <h2 className="text-2xl font-bold text-[var(--color-teal-500)] mb-4">Billing Details</h2>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="inputField w-full"
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="inputField w-full"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium mb-1">Mobile Number</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="inputField w-full"
            placeholder="Enter your mobile number"
            maxLength={10}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Address Line 1 */}
        <div>
          <label className="block text-sm font-medium mb-1">Address Line 1</label>
          <input
            type="text"
            name="line1"
            value={form.address.line1}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="inputField w-full"
            placeholder="Street address"
          />
          {errors.line1 && <p className="text-red-500 text-sm mt-1">{errors.line1}</p>}
        </div>

        {/* City + Postal Code */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              value={form.address.city}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="inputField w-full"
              placeholder="City"
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={form.address.postalCode}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="inputField w-full"
              placeholder="PIN code"
              maxLength={6}
            />
            {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
          </div>
        </div>
      </div>

            <button
        type="submit"
        className="btnPrimary w-full mt-6 cursor-pointer"
        aria-label="Continue to payment"
      >
        Continue to Payment
      </button>
    </form>
  );
};

export default BillingForm;