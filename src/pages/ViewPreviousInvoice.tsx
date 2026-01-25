import { useEffect, useState } from "react";
import RecallInvoiceConfirm from "./RecallInvoiceConfirm";
import { getInvoices } from "../api/invoice";
import Pagination from "../components/Pagination";

interface ViewPreviousInvoiceProps {
  goBack: () => void;
}

interface Invoice {
  id: number;
  created_at: string;
  created_user_id: number;
  status: string;
  paid_amount: string | null;
  total_amount: string | null;
  created_user?: {
    first_name: string;
    last_name: string;
  };
}

const ITEMS_PER_PAGE = 10;

const ViewPreviousInvoice = ({ goBack }: ViewPreviousInvoiceProps) => {
  const [showRecallConfirm, setShowRecallConfirm] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 🔹 Load invoices
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setLoading(true);
        const res = await getInvoices();
        setInvoices(res.data.data);
      } catch (err) {
        console.error("Failed to load invoices", err);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  // 🔹 Reset page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [invoices]);

  const handleRecall = () => {
    console.log("Invoice recalled");
    setShowRecallConfirm(false);
  };

  // 🔹 Pagination logic
  const totalPages = Math.ceil(invoices.length / ITEMS_PER_PAGE);

  const paginatedInvoices = invoices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">

      {/* TOP BAR */}
      <div className="w-250 bg-[#D9D9D9] rounded-full flex items-center justify-between px-4 sm:px-6 py-8 mb-6">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-sm sm:text-base md:text-[27px] font-medium text-black"
        >
          <img src="/Polygon.png" alt="Back" className="w-4 h-4 sm:w-10 sm:h-10" />
          POS
        </button>

        <span className="font-bold text-[15px] sm:text-xl md:text-[30px] text-black">
          View Previous Invoice
        </span>

        <button className="flex items-center gap-2 text-sm sm:text-base md:text-[27px] font-medium text-black opacity-50">
          POS
          <img src="/Polygon 2.png" alt="Next" className="w-4 h-4 sm:w-10 sm:h-10" />
        </button>
      </div>

      {/* TABLE */}
      <div className="w-240 bg-[#2F2F2F] rounded-[10px] overflow-hidden mb-6">

        {/* HEADER */}
        <div className="grid grid-cols-8 text-[10px] sm:text-[25px] text-white bg-[#3A3A3A] px-3 sm:px-4 py-3 sm:py-4 font-semibold">
          <div>Invoice No</div>
          <div>Created</div>
          <div>Created By</div>
          <div>Created For</div>
          <div>Value</div>
          <div>Paid Amount</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {/* BODY */}
        <div className="h-[50vh] sm:h-[60vh] overflow-y-auto text-[10px] sm:text-[18px] text-white">

          {loading && (
            <div className="text-center py-6">Loading...</div>
          )}

          {!loading && paginatedInvoices.length === 0 && (
            <div className="text-center py-6">No invoices found</div>
          )}

          {paginatedInvoices.map((inv) => (
            <div
              key={inv.id}
              className="grid grid-cols-8 px-3 sm:px-4 py-3 sm:py-4 border-b border-white/10 hover:bg-white/5 transition-colors"
            >
              <div className="font-medium">INV{inv.id}</div>

              <div>
                {new Date(inv.created_at).toLocaleDateString()}
                <br />
                {new Date(inv.created_at).toLocaleTimeString()}
              </div>

              <div>
                {inv.created_user
                  ? `${inv.created_user.first_name} ${inv.created_user.last_name}`
                  : inv.created_user_id}
              </div>

              <div className="font-semibold">
                {inv.created_user
                  ? `${inv.created_user.first_name} ${inv.created_user.last_name}`
                  : "-"}
              </div>

              <div className="font-semibold">
                {inv.total_amount ?? "-"}
              </div>

              <div className="font-semibold">
                {inv.paid_amount ?? "-"}
              </div>

              <div>{inv.status}</div>

              <div>
                <button
                  onClick={() => setShowRecallConfirm(true)}
                  className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full text-[9px] sm:text-xs font-semibold hover:from-blue-600 hover:to-blue-800 transition-all"
                >
                  Recall
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>


      <div className="ml-[-750px] mb-10px text-white">
      {/* PAGINATION */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
</div>
      {/* MODAL */}
      {showRecallConfirm && (
        <RecallInvoiceConfirm
          onConfirm={handleRecall}
          onClose={() => setShowRecallConfirm(false)}
        />
      )}
      
    </div>
  );
};

export default ViewPreviousInvoice;
