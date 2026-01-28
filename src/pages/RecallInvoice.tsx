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
  invoice_no?: string;
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
  invoice_items?: any[];
}

const ITEMS_PER_PAGE = 10;

const RecallInvoice = ({ onClose, onSelect }: RecallInvoiceProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const res = await getInvoices();

        console.log("Invoices API Response:", res);

        let invoicesData: Invoice[] = [];

        if (Array.isArray(res.data)) {
          invoicesData = res.data;
        } else if (Array.isArray(res.data?.data)) {
          invoicesData = res.data.data;
        } else if (res.data?.data && typeof res.data.data === 'object') {
          invoicesData = res.data.data.invoices || [];
        } else if (res.data && typeof res.data === 'object') {
          const values = Object.values(res.data);
          if (values.length > 0 && Array.isArray(values[0])) {
            invoicesData = values[0] as Invoice[];
          }
        }

        console.log("Parsed invoices:", invoicesData);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

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

    console.log("Selected invoice for recall:", selectedInvoice);

    if (onSelect) {
      onSelect(selectedInvoice);
    } else {
      alert(`Invoice ${selectedInvoice.invoice_no || `INV-${selectedInvoice.id}`} recalled successfully!`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-[1200px] max-h-[1920px] bg-[#D9D9D9] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col overflow-hidden">
        <div className="w-full bg-white rounded-full flex items-center px-10 py-5 mb-8 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] border-2 border-white/20 flex-shrink-0">
          <img src="/search.png" alt="Search" className="w-12 h-12 mr-6 opacity-60" />
          <input
            type="text"
            placeholder="Search Invoice..."
            className="w-full bg-transparent outline-none text-[35px] text-black placeholder:text-gray-400 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="flex-1 bg-[#BFBABA] rounded-3xl overflow-hidden flex flex-col mb-4 sm:mb-6 min-h-0">
          <div className="grid grid-cols-5 bg-[#9FA8DA] text-[20px] sm:text-[30px] font-semibold text-black px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
            <div className="text-center">#</div>
            <div className="text-center">Created At</div>
            <div className="text-center">Invoice No</div>
            <div className="text-center">Created By</div>
            <div className="text-center">Customer</div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            {loading && (
              <div className="text-center py-12 sm:py-20 text-[28px] sm:text-[36px] text-gray-600">
                Loading...
              </div>
            )}

            {!loading && paginatedInvoices.length === 0 && (
              <div className="text-center py-12 sm:py-20 text-[28px] sm:text-[36px] text-gray-600">
                {filteredInvoices.length === 0 ? "No invoices found" : "No results for your search"}
              </div>
            )}

            {!loading &&
              paginatedInvoices.map((inv, i) => (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`grid grid-cols-5 text-[18px] sm:text-[26px] px-4 sm:px-6 py-3 sm:py-4 border-b-2 border-black/20 hover:bg-white/30 transition-colors cursor-pointer ${selectedInvoice?.id === inv.id ? "bg-green-300" : ""}`}
                >
                  <div className="font-medium text-center">
                    {startIndex + i + 1}
                  </div>
                  <div className="text-center">
                    {new Date(inv.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="font-semibold text-blue-700 text-center">
                    {inv.invoice_no || `INV-${inv.id}`}
                  </div>
                  <div className="text-center truncate">
                    {inv.created_user
                      ? `${inv.created_user.first_name} ${inv.created_user.last_name}`
                      : `User ${inv.created_user_id}`
                    }
                  </div>
                  <div className="text-center truncate">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
          {/* Pagination */}
          <div className="flex justify-center text-black">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 sm:gap-6">
            <button
              onClick={onClose}
              className="px-8 sm:px-12 h-14 sm:h-16 bg-gray-300 rounded-full text-[20px] sm:text-[28px] hover:bg-gray-400 transition-colors min-w-[140px] sm:min-w-[160px]"
            >
              Cancel
            </button>

            <button
              onClick={handleRecallInvoice}
              disabled={!selectedInvoice}
              className="px-8 sm:px-12 h-14 sm:h-16 bg-gradient-to-b from-[#0E7A2A] to-[#064C18] text-white rounded-full text-[20px] sm:text-[28px] disabled:opacity-50 disabled:cursor-not-allowed hover:from-[#0E8A2A] hover:to-[#065C18] transition-all min-w-[160px] sm:min-w-[220px]"
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