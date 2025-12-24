import { useState } from "react";
import RecallInvoiceConfirm from "./RecallInvoiceConfirm";

interface ViewPreviousInvoiceProps {
  goBack: () => void;
}

const ViewPreviousInvoice = ({ goBack }: ViewPreviousInvoiceProps) => {

  const [showRecallConfirm, setShowRecallConfirm] = useState(false);

  const handleRecall = () => {
    console.log("Invoice recalled");
    setShowRecallConfirm(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">

      {/* TOP BAR - Responsive */}
      <div className="w-full max-w-2xl bg-[#D9D9D9] rounded-full flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
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

        <span className="font-bold text-[15px] sm:text-xl md:text-[22px] text-black text-center">
          View Previous Invoice
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

      {/* TABLE CONTAINER - Responsive */}
      <div className="w-full max-w-2xl bg-[#2F2F2F] rounded-[10px] overflow-hidden mb-4 sm:mb-6">

        {/* TABLE HEADER - Responsive */}
        <div className="grid grid-cols-8 text-[10px] sm:text-xs text-white bg-[#3A3A3A] px-3 sm:px-4 py-3 sm:py-4 font-semibold">
          <div className="text-center sm:text-left">Invoice No</div>
          <div className="text-center sm:text-left">Created</div>
          <div className="text-center sm:text-left">Created By</div>
          <div className="text-center sm:text-left">Created For</div>
          <div className="text-center sm:text-left">Value</div>
          <div className="text-center sm:text-left">Paid Amount</div>
          <div className="text-center sm:text-left">Status</div>
          <div className="text-center sm:text-left">Action</div>
        </div>

        {/* TABLE BODY - Responsive height */}
        <div className="h-[50vh] sm:h-[60vh] overflow-y-auto text-[10px] sm:text-xs text-white">

          {/* SAMPLE ROW */}
          <div className="grid grid-cols-8 px-3 sm:px-4 py-3 sm:py-4 border-b border-white/10 hover:bg-white/5 transition-colors">
            <div className="font-medium text-center sm:text-left">INV1245</div>
            <div className="text-center sm:text-left">2025/02/18<br />12:10PM</div>
            <div className="text-center sm:text-left">22-Harry<br />Potter</div>
            <div className="text-center sm:text-left">05 - Ron<br />Weasley</div>
            <div className="text-center sm:text-left font-semibold">12500</div>
            <div className="text-center sm:text-left font-semibold ">500</div>
            <div className="text-center sm:text-left">
              <span className="px-2 py-1 rounded-full  text-[9px] sm:text-xs">
                Pending
              </span>
            </div>
            <div className="text-center sm:text-left">
              <button
                onClick={() => setShowRecallConfirm(true)}
                className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full text-[9px] sm:text-xs font-semibold hover:from-blue-600 hover:to-blue-800 transition-all"
              >
                Recall
              </button>
            </div>
          </div>




          {/* EMPTY ROWS */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`empty-${i}`}
              className="grid grid-cols-8 px-3 sm:px-4 py-3 sm:py-4 border-b border-white/5"
            >
              <div>&nbsp;</div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ))}
        </div>
      </div>

      {/* PAGINATION - Responsive */}
      <div className="w-full max-w-2xl flex  gap-2 sm:gap-2 text-sm sm:text-base text-white/80 mt-2">
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