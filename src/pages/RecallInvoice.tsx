import { useEffect, useState } from "react";
import { getInvoices } from "../api/invoice";
import Pagination from "../components/Pagination";

interface RecallInvoiceProps {
  onClose: () => void;
  onSelect?: (invoice: Invoice) => void;
}

interface Invoice {
  id: number;
  previous_invoice_id: number | null;
  customer_id: number;
  created_at: string;
  updated_at: string;
  created_user_id: number;
  status: string;
  paid_amount: number;
  total_amount: number;
  discount_type: string;
  discount_amount: number;
  next_box_number: number;
  invoice_no?: string; // Added this field
  created_user?: {
    username: string;
    first_name: string;
    last_name: string;
  };
  customer?: {
    id: number;
    first_name: string;
    last_name: string;
    address?: string;
    telephone?: string;
  };
  invoice_items?: any[]; // Added this field for items
}

const ITEMS_PER_PAGE = 10;

const RecallInvoice = ({ onClose, onSelect }: RecallInvoiceProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const res = await getInvoices();
        
        console.log("Invoices API Response:", res); // Debug log
        
        // Check different possible response structures
        let invoicesData: Invoice[] = [];
        
        if (Array.isArray(res.data)) {
          invoicesData = res.data;
        } else if (Array.isArray(res.data?.data)) {
          invoicesData = res.data.data;
        } else if (res.data?.data && typeof res.data.data === 'object') {
          // If data is an object with invoices property
          invoicesData = res.data.data.invoices || [];
        } else if (res.data && typeof res.data === 'object') {
          // Try to extract array from object values
          const values = Object.values(res.data);
          if (values.length > 0 && Array.isArray(values[0])) {
            invoicesData = values[0] as Invoice[];
          }
        }
        
        console.log("Parsed invoices:", invoicesData); // Debug log
        setInvoices(invoicesData);
        
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) =>
    invoice.id.toString().includes(search) ||
    (invoice.invoice_no && invoice.invoice_no.toLowerCase().includes(search.toLowerCase())) ||
    invoice.created_at.toLowerCase().includes(search.toLowerCase()) ||
    (invoice.customer &&
      `${invoice.customer.first_name || ''} ${invoice.customer.last_name || ''}`
        .toLowerCase()
        .includes(search.toLowerCase())) ||
    (invoice.created_user &&
      `${invoice.created_user.first_name || ''} ${invoice.created_user.last_name || ''}`
        .toLowerCase()
        .includes(search.toLowerCase()))
  );

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Pagination calculations
  const totalPages = Math.max(
    1,
    Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE)
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInvoices = filteredInvoices.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleRecallInvoice = () => {
    if (!selectedInvoice) {
      alert("Please select an invoice first");
      return;
    }

    console.log("Selected invoice for recall:", selectedInvoice); // Debug log
    
    // Call the onSelect callback with the selected invoice
    if (onSelect) {
      onSelect(selectedInvoice);
    } else {
      alert(`Invoice ${selectedInvoice.invoice_no || `INV-${selectedInvoice.id}`} recalled successfully!`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl lg:max-w-6xl bg-[#D9D9D9] rounded-3xl p-6 sm:p-9 shadow-2xl">
        {/* Search */}
        <div className="flex items-center bg-white rounded-full px-6 py-3 mb-6">
          <img src="/search.png" alt="Search" className="w-7 h-7 mr-3" />
          <input
            type="text"
            placeholder="Search Invoice..."
            className="w-full outline-none bg-transparent text-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-[#BFBABA] rounded-3xl overflow-hidden">
          <div className="grid grid-cols-5 bg-[#9FA8DA] text-sm sm:text-base font-semibold text-black px-4.5 sm:px-6 py-4.5 sm:py-6">
            <div className="text-center sm:text-left">#</div>
            <div className="text-center sm:text-left">Created At</div>
            <div className="text-center sm:text-left">Invoice No</div>
            <div className="text-center sm:text-left">Created By</div>
            <div className="text-center sm:text-left">Customer</div>
          </div>

          <div className="h-72 sm:h-96 overflow-y-auto">
            {loading && <div className="text-center py-9 text-xl">Loading...</div>}

            {!loading && paginatedInvoices.length === 0 && (
              <div className="text-center py-9 text-xl">
                {filteredInvoices.length === 0 ? "No invoices found" : "No results for your search"}
              </div>
            )}

            {!loading &&
              paginatedInvoices.map((inv, i) => (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`grid grid-cols-5 text-sm sm:text-base px-4.5 sm:px-6 py-4.5 sm:py-6 border-b border-black/20 hover:bg-white/30 transition-colors cursor-pointer text-xl ${selectedInvoice?.id === inv.id ? "bg-green-300" : ""}`}
                >
                  <div className="font-medium text-center sm:text-left">
                    {startIndex + i + 1}
                  </div>
                  <div className="text-center sm:text-left">
                    {new Date(inv.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="font-semibold text-blue-700 text-center sm:text-left">
                    {inv.invoice_no || `INV-${inv.id}`}
                  </div>
                  <div className="text-center sm:text-left">
                    {inv.created_user 
                      ? `${inv.created_user.first_name} ${inv.created_user.last_name}`
                      : `User ${inv.created_user_id}`
                    }
                  </div>
                  <div className="text-center sm:text-left">
                    {inv.customer 
                      ? `${inv.customer.first_name} ${inv.customer.last_name}`
                      : `Customer ${inv.customer_id}`
                    }
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
          <div className="flex gap-6">
            <button
              onClick={onClose}
              className="px-9 h-16 bg-gray-300 rounded-full text-xl hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleRecallInvoice}
              disabled={!selectedInvoice}
              className="px-9 h-16 bg-gradient-to-b from-[#0E7A2A] to-[#064C18] text-white rounded-full text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-[#0E8A2A] hover:to-[#065C18] transition-all"
            >
              Recall Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecallInvoice;