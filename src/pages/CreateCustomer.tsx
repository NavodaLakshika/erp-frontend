import { useState } from "react";
import { createCustomer } from "../api/customers";

interface CreateCustomerProps {
  onClose: () => void;
  onCreated?: (customer: any) => void;

}

const CreateCustomer = ({ onClose, onCreated }: CreateCustomerProps) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName) {
      alert("First name and last name are required");
      return;
    }

    try {
      setLoading(true);

      const res = await createCustomer(form);

      // ✅ pass created customer back
      onCreated?.(res.data);

      onClose();
    } catch (err) {
      alert("Failed to create customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-2xl bg-[#D3D3D3] rounded-xl p-4 sm:p-5 shadow-2xl">

        {/* FORM GRID */}
        <div className="grid grid-cols-2 gap-3 text-sm">

          {/* First Name */}
          <div>
            <label className="block  px-3 py-1   text-xs font-medium">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full h-8 bg-[#EDEDED] rounded-[13px] px-3 outline-none"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block  px-3 py-1 rounded-full  text-xs font-medium">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full h-8 bg-[#EDEDED] rounded-[13px] px-3 outline-none"
            />
          </div>

          {/* Address */}
          <div >
            <label className="block px-3 py-1 rounded-lg  text-xs font-medium ">
              Address
            </label>
            <div>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full h-25  bg-[#EDEDED] rounded-xl px-3 py-2 outline-none resize-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block px-3 py-1 rounded-full  text-xs font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full h-8  bg-[#EDEDED] rounded-[13px] px-3 outline-none"
            />

            {/* Phone */}
            <label className="block  px-3 py-1 rounded-full mt-2 text-xs font-medium">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full h-8  bg-[#EDEDED] rounded-[13px] px-3 outline-none"
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block px-3 py-1 rounded-lg  text-xs font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full h-25  bg-[#EDEDED] rounded-xl px-3 py-2 outline-none resize-none"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-left justify-between mt-2">

          {/* ADD BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 h-8 bg-[#0B5D3A] text-white  rounded-full text-xs font-semibold hover:opacity-90 ml-139"
          >
            {loading ? "Saving..." : "ADD"}
          </button>
        </div>
      </div>
    </div>
  );

};

export default CreateCustomer;