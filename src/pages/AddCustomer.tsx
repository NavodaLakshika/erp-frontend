import { useEffect, useState } from "react";
import { getCustomers } from "../api/customers";
import type { Customer } from "../api/customers";

interface AddCustomerProps {
  onClose: () => void;
  onSelect: (customer: Customer) => void;
}

const AddCustomer = ({ onClose, onSelect }: AddCustomerProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await getCustomers(search, 1, 10);
      setCustomers(res.data.data); // backend returns { data, meta }
    } catch (e) {
      console.error(e);
      alert("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    const delay = setTimeout(loadCustomers, 400);
    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL - Same size as RecallInvoice */}
      <div className="relative w-full max-w-2xl lg:max-w-4xl bg-[#D9D9D9] rounded-xl  p-4 sm:p-6 shadow-2xl">

        {/* SEARCH - Same as RecallInvoice */}
        <div className="flex items-center bg-white rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-3">
          <img
            src="/add-customer-search.png"
            alt="Search Customer"
            className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Customer..."
            className="w-full outline-none text-sm sm:text-base bg-transparent placeholder:text-gray-500"
          />
        </div>

        {/* TABLE - Same height as RecallInvoice */}
        <div className="bg-[#BFBABA] rounded-xl sm:rounded-2xl overflow-hidden border border-black/30">
          {/* HEADER */}
          <div className="grid grid-cols-5 bg-[#9FA8DA] text-xs sm:text-sm font-semibold text-black">
            <div className="p-3 sm:p-4 border-r border-b border-black/30 text-center sm:text-left">
              #
            </div>
            <div className="p-3 sm:p-4 border-r border-b border-black/30">
              Customer Name
            </div>
            <div className="p-3 sm:p-4 border-r border-b border-black/30">
              Address
            </div>
            <div className="p-3 sm:p-4 border-r border-b border-black/30">
              Phone
            </div>
            <div className="p-3 sm:p-4 border-b border-black/30">
              Email
            </div>
          </div>

          {/* BODY */}
          <div className="h-64 overflow-y-auto bg-white/30">
            {loading && (
              <div className="text-center py-6">Loading...</div>
            )}

            {!loading && customers.length === 0 && (
              <div className="text-center py-6">No customers found</div>
            )}

            {customers.map((c, i) => (
              <div
                key={c.id}
                onClick={() => setSelected(c)}
                className={`grid grid-cols-5 text-xs sm:text-sm cursor-pointer
          ${selected?.id === c.id ? "bg-green-300" : "hover:bg-white/40"}`}
              >
                <div className="p-3 border-r border-b border-black/20 text-center sm:text-left">
                  {i + 1}
                </div>

                <div className="p-3 border-r border-b border-black/20">
                  {c.firstName} {c.lastName}
                </div>

                <div className="p-3 border-r border-b border-black/20">
                  {c.address || "-"}
                </div>

                <div className="p-3 border-r border-b border-black/20">
                  {c.phone || "-"}
                </div>

                <div className="p-3 border-b border-black/20 truncate">
                  {c.email || "-"}
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* FOOTER - Same layout as RecallInvoice */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4  gap-3 sm:gap-0">
          {/* Pagination - Same as RecallInvoice */}
          <div className="flex items-center ">
            <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-full text-black">
              ◀
            </button>
            <span className="text-sm sm:text-base font-medium text-black">
              Page <span className="font-bold">2</span> of <span className="font-bold">2</span>
            </span>
            <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-full text-black">
              ▶
            </button>
          </div>

          {/* Action Buttons - Same as RecallInvoice */}
          <div className="flex gap-3 sm:gap-4">

            <button
              disabled={!selected}
              onClick={() => selected && onSelect(selected)}
              className="px-5 sm:px-6 h-9 sm:h-11 sm:w-35 bg-[#05522B] text-white rounded-full font-medium text-sm sm:text-base hover:from-[#0E8A2A] hover:to-[#065C18] transition-all">
              Select
            </button>
          </div>
        </div>

        {/* TITLE - Same style as RecallInvoice */}

      </div>
    </div>
  );
};

export default AddCustomer;