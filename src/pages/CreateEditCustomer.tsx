import { useState } from "react";

interface CreateEditCustomerProps {
  goBack: () => void;
}

const CreateEditCustomer = ({ goBack }: CreateEditCustomerProps) => {





  const [form] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    description: "",
  });

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">

      {/* Top Bar - Responsive */}
      <div className="w-full max-w-2xl bg-[#D0D0D0] rounded-full flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-sm sm:text-base md:text-[17px] font-medium text-black"
        >
          <img
            src="/Polygon.png"
            alt="Back"
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
          POS
        </button>

        <span className="font-bold text-[14px] sm:text-xl md:text-[23px] text-black">
          Create / Edit Customer
        </span>

        <button className="flex items-center gap-2 text-sm sm:text-base md:text-[17px] font-medium text-black opacity-50">
          POS
          <img
            src="/Polygon 2.png"
            alt="Next"
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
        </button>
      </div>

      {/* Form Card - Responsive */}
      <div className="w-full max-w-2xl bg-[#D0D0D0] rounded-2xl sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">

        {/* Name Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* First Name */}
          <div className="flex flex-col">
            <label className="px-3 py-1 text-xs font-medium">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              className="w-full h-9 bg-white rounded-full px-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label className="px-3 py-1 text-xs font-medium">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              className="w-full h-9 bg-white rounded-full px-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Address, Email, Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">

          {/* Address */}
          <div className="flex flex-col">
            <label className="px-3 py-1 text-xs font-medium">
              Address
            </label>
            <textarea
              rows={5}
              className="h-32 rounded-xl sm:rounded-2xl px-4 py-3 outline-none resize-none text-sm sm:text-[16px] focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* Email & Phone */}
          <div className="flex flex-col gap-4">

            <div className="flex flex-col">
              <label className="px-3 py-1 text-xs font-medium">
                Email
              </label>
              <input
                type="email"
                className="w-full h-9 rounded-full px-4 outline-none text-sm sm:text-[16px] focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="flex flex-col">
              <label className="px-3 py-1 text-xs font-medium">
                Phone
              </label>
              <input
                type="tel"
                className="w-full h-9 rounded-full px-4 outline-none text-sm sm:text-[16px] focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col mb-6">
          <label className="px-3 py-1 text-xs font-medium">
            Description
          </label>
          <textarea
            rows={5}
            className="w-full h-32 rounded-xl sm:rounded-2xl px-4 py-3 outline-none resize-none text-sm sm:text-[16px] focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* ADD Button */}
        <button className="w-24 sm:w-32 h-9 sm:h-12 bg-gradient-to-b from-[#0E7A2A] to-[#064C18] text-white rounded-full font-medium text-sm sm:text-base ml-auto block hover:from-[#0E8A2A] hover:to-[#065C18] transition-all">
          ADD
        </button>

      </div>


      {/* Table Placeholder - Responsive */}
      <div className="w-full max-w-2xl bg-[#2F2F2F] rounded-xl sm:rounded-2xl p-4 sm:p-6 overflow-hidden">

        {/* Table Wrapper */}
        <div className="overflow-x-auto overflow-y-auto max-h-64 sm:max-h-80 rounded-lg">
          <table className="min-w-full border-collapse text-sm text-gray-200">

            {/* Table Head */}
            <thead className="sticky top-0 bg-[#3A3A3A] text-xs uppercase text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left border border-gray-600">First Name</th>
                <th className="px-4 py-3 text-left border border-gray-600">Last Name</th>
                <th className="px-4 py-3 text-left border border-gray-600">Address</th>
                <th className="px-4 py-3 text-left border border-gray-600">Phone</th>
                <th className="px-4 py-3 text-left border border-gray-600">Email</th>
                <th className="px-4 py-3 text-left border border-gray-600">Description</th>
                <th className="px-4 py-3 text-left border border-gray-600">Created At</th>
                <th className="px-4 py-3 text-right border border-gray-600">Credit Amount</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {/* Empty rows (like screenshot) */}
              {[...Array(10)].map((_, i) => (
                <tr key={i} className="hover:bg-[#3B3B3B]">
                  <td className="px-4 py-3 border border-gray-600">&nbsp;</td>
                  <td className="px-4 py-3 border border-gray-600"></td>
                  <td className="px-4 py-3 border border-gray-600"></td>
                  <td className="px-4 py-3 border border-gray-600"></td>
                  <td className="px-4 py-3 border border-gray-600"></td>
                  <td className="px-4 py-3 border border-gray-600"></td>
                  <td className="px-4 py-3 border border-gray-600"></td>
                  <td className="px-4 py-3 border border-gray-600 text-right"></td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
      <div className="w-full max-w-2xl flex   text-sm sm:text-base text-white/80 mt-2">
        <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center  ounded-full">
          ◀
        </button>
        <span className="font-medium my-2">
          Page <span className="font-bold">2</span> of <span className="font-bold">2</span>
        </span>
        <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center   rounded-full">
          ▶
        </button>
      </div>
    </div>
  );
};

export default CreateEditCustomer;