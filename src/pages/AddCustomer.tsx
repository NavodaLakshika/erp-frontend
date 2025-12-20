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
      <div className="relative w-full max-w-2xl lg:max-w-4xl bg-[#D9D9D9] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">

        {/* SEARCH - Same as RecallInvoice */}
        <div className="flex items-center bg-white rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
          <span className="mr-2 sm:mr-3 text-lg sm:text-xl">👤</span>
          <input
               value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Customer..."
            className="w-full outline-none text-sm sm:text-base bg-transparent placeholder:text-gray-500"
          />
        </div>

        {/* TABLE - Same height as RecallInvoice */}
        <div className="bg-[#BFBABA] rounded-xl sm:rounded-2xl overflow-hidden">
          {/* HEADER */}
          <div className="grid grid-cols-5 bg-[#9FA8DA] text-xs sm:text-sm font-semibold text-black px-3 sm:px-4 py-3 sm:py-4">
            <div className="text-center sm:text-left">#</div>
            <div className="text-center sm:text-left">Customer Name</div>
            <div className="text-center sm:text-left">Address</div>
            <div className="text-center sm:text-left">Phone</div>
            <div className="text-center sm:text-left">Email</div>
          </div>

          {/* BODY - Same height as RecallInvoice */}
             <div className="h-64 overflow-y-auto">
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
                className={`grid grid-cols-5 px-4 py-3 border-b cursor-pointer
                  ${
                    selected?.id === c.id
                      ? "bg-green-300"
                      : "hover:bg-white/40"
                  }`}
              >
                <div>{i + 1}</div>
                <div>{c.firstName} {c.lastName}</div>
                <div>{c.address || "-"}</div>
                <div>{c.phone || "-"}</div>
                <div className="truncate">{c.email || "-"}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER - Same layout as RecallInvoice */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-6 gap-3 sm:gap-0">
          {/* Pagination - Same as RecallInvoice */}
          <div className="flex items-center gap-2 sm:gap-4">
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
              onClick={onClose}
              className="px-5 sm:px-6 h-9 sm:h-11 bg-gradient-to-b from-gray-400 to-gray-600 text-white rounded-full font-medium text-sm sm:text-base hover:opacity-90 transition-opacity"
            >
              Cancel
            </button>
            <button 
           disabled={!selected}
  onClick={() => selected && onSelect(selected)}
            className="px-5 sm:px-6 h-9 sm:h-11 bg-gradient-to-b from-[#0E7A2A] to-[#064C18] text-white rounded-full font-medium text-sm sm:text-base hover:from-[#0E8A2A] hover:to-[#065C18] transition-all">
           Select Customer
            </button>
          </div>
        </div>

        {/* TITLE - Same style as RecallInvoice */}
        
      </div>
    </div>
  );
};

export default AddCustomer;