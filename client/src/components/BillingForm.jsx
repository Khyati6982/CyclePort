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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['line1', 'city', 'postalCode'].includes(name)) {
      setForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-10 space-y-6 p-6 bg-white dark:bg-[var(--color-charcoal-900)] rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-[var(--color-teal-500)] mb-4">Billing Details</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-[var(--color-charcoal-700)] dark:text-[var(--color-charcoal-100)]">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="inputField w-full"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-[var(--color-charcoal-700)] dark:text-[var(--color-charcoal-100)]">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="inputField w-full"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-[var(--color-charcoal-700)] dark:text-[var(--color-charcoal-100)]">
            Mobile Number
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="inputField w-full"
            placeholder="Enter your mobile number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-[var(--color-charcoal-700)] dark:text-[var(--color-charcoal-100)]">
            Address Line 1
          </label>
          <input
            type="text"
            name="line1"
            value={form.address.line1}
            onChange={handleChange}
            required
            className="inputField w-full"
            placeholder="Street address"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--color-charcoal-700)] dark:text-[var(--color-charcoal-100)]">
              City
            </label>
            <input
              type="text"
              name="city"
              value={form.address.city}
              onChange={handleChange}
              required
              className="inputField w-full"
              placeholder="City"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--color-charcoal-700)] dark:text-[var(--color-charcoal-100)]">
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              value={form.address.postalCode}
              onChange={handleChange}
              required
              className="inputField w-full"
              placeholder="PIN code"
            />
          </div>
        </div>
      </div>

      <button type="submit" className="btnPrimary w-full mt-6 cursor-pointer">
        Continue to Payment
      </button>
    </form>
  );
};

export default BillingForm;