// CreateCustomer.tsx
import { useState } from "react";
import { createCustomer, type Customer } from "../api/customers";

interface CreateCustomerProps {
  onClose: () => void;
  onCustomerCreated?: (customer: Customer) => void;
}

const CreateCustomer = ({ onClose, onCustomerCreated }: CreateCustomerProps) => {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    address: "",
    telephone: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await createCustomer(formData);
      const newCustomer: Customer = response.data.data || response.data;
      
      alert("Customer created successfully!");
      
      if (onCustomerCreated) {
        onCustomerCreated(newCustomer);
      }
      
      onClose();
    } catch (error) {
      console.error("Error creating customer:", error);
      alert("Failed to create customer");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
  {/* BACKDROP */}
  <div
    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
    onClick={onClose}
  />

  {/* MODAL */}
  <div className="relative w-full max-w-2xl lg:max-w-3xl bg-[#D9D9D9] rounded-3xl p-6 sm:p-9 shadow-2xl">
    
    {/* HEADER */}
    <div className="text-center mb-6">
      <h2 className="text-2xl sm:text-4xl font-bold text-black text-[30px]">Create New Customer</h2>
      <p className="text-base text-gray-600 text-[21px]">Fill in customer details</p>
    </div>

    {/* FORM */}
    <form onSubmit={handleSubmit} className="space-y-4.5 sm:space-y-6">
      {/* First Name */}
      <div>
        <label className="block text-base font-medium text-gray-700 mb-1.5 text-[21px]">
          First Name *
        </label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
          className="w-full px-6 py-3 bg-white rounded-2xl border border-gray-300 focus:ring-3 focus:ring-blue-500 focus:border-blue-500 outline-none text-[24px]"
          placeholder="Enter first name"
        />
      </div>

      {/* Middle Name */}
      <div>
        <label className="block text-base font-medium text-gray-700 mb-1.5 text-[21px]">
          Middle Name
        </label>
        <input
          type="text"
          name="middle_name"
          value={formData.middle_name}
          onChange={handleChange}
          className="w-full px-6 py-3 bg-white rounded-2xl border border-gray-300 focus:ring-3 focus:ring-blue-500 focus:border-blue-500 outline-none text-[24px]"
          placeholder="Enter middle name (optional)"
        />
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-base font-medium text-gray-700 mb-1.5 text-[21px]">
          Last Name *
        </label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
          className="w-full px-6 py-3 bg-white rounded-2xl border border-gray-300 focus:ring-3 focus:ring-blue-500 focus:border-blue-500 outline-none text-[24px]"
          placeholder="Enter last name"
        />
      </div>

      {/* Telephone */}
      <div>
        <label className="block text-base font-medium text-gray-700 mb-1.5 text-[21px]">
          Telephone *
        </label>
        <input
          type="tel"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          required
          className="w-full px-6 py-3 bg-white rounded-2xl border border-gray-300 focus:ring-3 focus:ring-blue-500 focus:border-blue-500 outline-none text-[24px]"
          placeholder="Enter phone number"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-base font-medium text-gray-700 mb-1.5 text-[21px]">
          Address
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-6 py-3 bg-white rounded-2xl border border-gray-300 focus:ring-3 focus:ring-blue-500 focus:border-blue-500 outline-none text-[24px]"
          placeholder="Enter address"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-base font-medium text-gray-700 mb-1.5 text-[21px]">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-6 py-3 bg-white rounded-2xl border border-gray-300 focus:ring-3 focus:ring-blue-500 focus:border-blue-500 outline-none text-[24px]"
          placeholder="Enter description (optional)"
        />
      </div>

      {/* BUTTONS */}
      <div className="flex justify-end gap-4.5 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-7.5 h-15 bg-gray-300 text-black rounded-full font-medium hover:bg-gray-400 transition-all text-[21px]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-7.5 h-15 bg-[#05522B] text-white rounded-full font-medium hover:bg-[#0E8A2A] transition-all disabled:opacity-50 text-[21px]"
        >
          {loading ? "Creating..." : "Create Customer"}
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default CreateCustomer;