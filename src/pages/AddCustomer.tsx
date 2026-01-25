import { useEffect, useState } from "react";
import { getCustomers, type Customer } from "../api/customers";
import Pagination from "../components/Pagination";

interface AddCustomerProps {
  onClose: () => void;
  onSelect: (customer: Customer) => void;
}

const ITEMS_PER_PAGE = 10;

const AddCustomer = ({ onClose, onSelect }: AddCustomerProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await getCustomers(currentPage, ITEMS_PER_PAGE, );

      setCustomers(res.data.data);
      setTotalPages(Math.ceil(res.data.total / res.data.limit));
    } catch (e) {
      console.error("Error loading customers:", e);
      alert("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  // Reload when page changes
  useEffect(() => {
    loadCustomers();
  }, [currentPage]);

  // Reset page & debounce search
  useEffect(() => {
    setCurrentPage(1);
    const delay = setTimeout(loadCustomers, 400);
    return () => clearTimeout(delay);
  }, [search]);

  const handleSelect = () => {
    if (!selected) return;
    onSelect(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl lg:max-w-6xl bg-[#D9D9D9] rounded-3xl p-6 sm:p-9 shadow-2xl">

        {/* Search */}
        <div className="flex items-center bg-white rounded-full px-6 py-3 mb-6">
          <img
            src="/add-customer-search.png"
            alt="Search Customer"
            className="w-8 h-8 mr-3"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Customer..."
            className="w-full outline-none bg-transparent text-xl"
          />
        </div>

        {/* Table */}
        <div className="bg-[#BFBABA] rounded-3xl overflow-hidden border border-black/30">
          <div className="grid grid-cols-5 bg-[#9FA8DA] font-semibold text-black">
            <div className="p-6 border-r border-b border-black/30 text-xl">#</div>
            <div className="p-6 border-r border-b border-black/30 text-xl">Customer Name</div>
            <div className="p-6 border-r border-b border-black/30 text-xl">Address</div>
            <div className="p-6 border-r border-b border-black/30 text-xl">Phone</div>
            <div className="p-6 border-b border-black/30 text-xl">Description</div>
          </div>

          <div className="h-96 overflow-y-auto bg-white/30">
            {loading && (
              <div className="text-center py-10 text-xl">Loading...</div>
            )}

            {!loading && customers.length === 0 && (
              <div className="text-center py-10 text-xl">
                No customers found
              </div>
            )}

            {customers.map((c, i) => (
              <div
                key={c.id}
                onClick={() => setSelected(c)}
                className={`grid grid-cols-5 cursor-pointer text-xl
                  ${
                    selected?.id === c.id
                      ? "bg-green-300"
                      : "hover:bg-white/40"
                  }`}
              >
                <div className="p-6 border-r border-b border-black/20">
                  {i + 1 + (currentPage - 1) * ITEMS_PER_PAGE}
                </div>
                <div className="p-6 border-r border-b border-black/20">
                  {c.first_name} {c.last_name}
                </div>
                <div className="p-6 border-r border-b border-black/20">
                  {c.address || "-"}
                </div>
                <div className="p-6 border-r border-b border-black/20">
                  {c.telephone || "-"}
                </div>
                <div className="p-6 border-b border-black/20 truncate">
                  {c.description || "-"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          {/* Pagination */}
          <div className="flex justify-center sm:justify-start text-black">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-6 h-12 bg-gray-300 text-black rounded-full text-xl hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              disabled={!selected}
              onClick={handleSelect}
              className="px-8 h-12 bg-[#05522B] text-white rounded-full text-xl disabled:opacity-50"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
