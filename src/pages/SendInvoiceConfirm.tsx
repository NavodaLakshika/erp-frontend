interface SendInvoiceConfirmProps {
  onConfirm: () => void;
  onClose: () => void;
}

const SendInvoiceConfirm = ({
  onConfirm,
  onClose,
}: SendInvoiceConfirmProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-[90%] max-w-sm bg-[#D9D9D9] rounded-[16px] p-4 shadow-2xl">

        {/* MESSAGE */}
        <div className="text-center text-[22px] font-bold text-gray-700 mb-6 leading-tight">
          Do You Want to<br />
          <span className="text-black">Send Invoice?</span>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 justify-center">

          {/* YES */}
          <button
            onClick={onConfirm}
            className="w-24 h-12 bg-gradient-to-b from-[#7CFE96] to-[#1E7A3A]
            text-white font-bold rounded-[10px]"
          >
            YES
          </button>

          {/* NO */}
          <button
            onClick={onClose}
            className="w-24 h-12 bg-gradient-to-b from-[#C62828] to-[#7A1212]
            text-white font-bold rounded-[10px]"
          >
            NO
          </button>

        </div>
      </div>
    </div>
  );
};

export default SendInvoiceConfirm;
