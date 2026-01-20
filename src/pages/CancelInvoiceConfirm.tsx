interface CancelInvoiceConfirmProps {
  onConfirm: () => void;
  onClose: () => void;
}

const CancelInvoiceConfirm = ({
  onConfirm,
  onClose,
}: CancelInvoiceConfirmProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-[85%] max-w-md sm:max-w-lg bg-[#D9D9D9] rounded-[16px] sm:rounded-[20px] p-5 sm:p-6 shadow-xl flex items-center justify-between gap-4 sm:gap-6">
        
        {/* TEXT */}
        <div className="text-[20px] sm:text-[24px] md:text-[28px] font-bold text-gray-700 leading-tight">
          Do You Want to
          <br />
          <span className="text-black">Cancel Invoice?</span>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* YES */}
          <button
            onClick={onConfirm}
            className="w-24 h-12 sm:w-28 sm:h-14 bg-gradient-to-b from-[#F59B9B] via-[#ED654A] to-[#3B0202] text-white font-bold rounded-[6px] sm:rounded-[8px] shadow hover:from-[#F5ABAB] hover:to-[#ED755A] transition-all"
          >
            YES
          </button>

          {/* NO */}
          <button
            onClick={onClose}
            className="w-24 h-12 sm:w-28 sm:h-14 bg-gradient-to-b from-[#7CFE96] to-[#1E7A3A] text-white font-bold rounded-[6px] sm:rounded-[8px] shadow hover:from-[#8CFEA6] hover:to-[#2E8A4A] transition-all"
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelInvoiceConfirm;