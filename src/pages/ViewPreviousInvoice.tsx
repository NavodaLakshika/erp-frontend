import { useEffect, useState } from "react";
import RecallInvoiceConfirm from "./RecallInvoiceConfirm";
import { getInvoices } from "../api/invoice";

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

const ViewPreviousInvoice = ({ goBack }: ViewPreviousInvoiceProps) => {
  const [showRecallConfirm, setShowRecallConfirm] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  // Load invoices from API
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setLoading(true);
        const res = await getInvoices();
        setInvoices(res.data.data); // IMPORTANT
      } catch (err) {
        console.error("Failed to load invoices", err);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  const handleRecall = () => {
    console.log("Invoice recalled");
    setShowRecallConfirm(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">

      {/* TOP BAR */}
      <div className="w-full max-w-2xl bg-[#D9D9D9] rounded-full flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-sm sm:text-base md:text-[17px] font-medium text-black"
        >
          <img src="/Polygon.png" alt="Back" className="w-4 h-4 sm:w-5 sm:h-5" />
          POS
        </button>

        <span className="font-bold text-[15px] sm:text-xl md:text-[22px] text-black">
          View Previous Invoice
        </span>

        <button className="flex items-center gap-2 text-sm sm:text-base md:text-[17px] font-medium text-black opacity-50">
          POS
          <img src="/Polygon 2.png" alt="Next" className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* TABLE CONTAINER */}
      <div className="w-full max-w-2xl bg-[#2F2F2F] rounded-[10px] overflow-hidden mb-4 sm:mb-6">

        {/* TABLE HEADER */}
        <div className="grid grid-cols-8 text-[10px] sm:text-xs text-white bg-[#3A3A3A] px-3 sm:px-4 py-3 sm:py-4 font-semibold">
          <div>Invoice No</div>
          <div>Created</div>
          <div>Created By</div>
          <div>Created For</div>
          <div>Value</div>
          <div>Paid Amount</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {/* TABLE BODY */}
        <div className="h-[50vh] sm:h-[60vh] overflow-y-auto text-[10px] sm:text-xs text-white">

          {loading && (
            <div className="text-center py-6">
              Loading...
            </div>
          )}

          {!loading && invoices.length === 0 && (
            <div className="text-center py-6">
              No invoices found
            </div>
          )}

          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="grid grid-cols-8 px-3 sm:px-4 py-3 sm:py-4 border-b border-white/10 hover:bg-white/5 transition-colors"
            >
              {/* Invoice No */}
              <div className="font-medium">INV{inv.id}</div>

              {/* Created */}
              <div>
                {new Date(inv.created_at).toLocaleDateString()}
                <br />
                {new Date(inv.created_at).toLocaleTimeString()}
              </div>

              {/* Created By */}
              <div>
                {inv.created_user
                  ? `${inv.created_user.first_name} ${inv.created_user.last_name}`
                  : inv.created_user_id}
              </div>

              {/* Created For */}
              <div>-</div>

              {/* Value */}
              <div className="font-semibold">
                {inv.total_amount ?? "-"}
              </div>

              {/* Paid Amount */}
              <div className="font-semibold">
                {inv.paid_amount ?? "-"}
              </div>

              {/* Status */}
              <div>
                <span className="px-2 py-1 rounded-full text-[9px] sm:text-xs">
                  {inv.status}
                </span>
              </div>

              {/* Action */}
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

      {/* PAGINATION (UI only, unchanged) */}
      <div className="w-full max-w-2xl flex gap-2 text-sm text-white/80 mt-2">
        <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
          ◀
        </button>
        <span className="font-medium my-2">
          Page <span className="font-bold">1</span> of <span className="font-bold">1</span>
        </span>
        <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
          ▶
        </button>
      </div>

      {/* RECALL CONFIRM MODAL */}
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
