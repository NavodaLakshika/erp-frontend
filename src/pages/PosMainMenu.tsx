import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateInvoice from "./CreateInvoice";
import CreateEditCustomer from "./CreateEditCustomer";
import ViewPreviousInvoice from "./ViewPreviousInvoice";

const PosMainMenu = () => {
  const navigate = useNavigate();

  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const [showViewInvoice, setShowViewInvoice] = useState(false);

  if (showCreateInvoice) return <CreateInvoice goBack={() => setShowCreateInvoice(false)} />;
  if (showCreateCustomer) return <CreateEditCustomer goBack={() => setShowCreateCustomer(false)} />;
  if (showViewInvoice) return <ViewPreviousInvoice goBack={() => setShowViewInvoice(false)} />;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center px-4 py-6">
      {/* Top Bar */}
      <div className="w-full max-w-[500px] bg-gray-200 rounded-full flex items-center justify-between px-4 py-3 mb-6">
        <button
          onClick={() => navigate("/main-menu")}
          className="flex items-center gap-2 text-[16px] sm:text-[17px]"
        >
          <img src="/Polygon.png" alt="Back" className="w-5 h-5 sm:w-6 sm:h-6" />
          Main menu
        </button>
        <span className="font-bold text-[22px] sm:text-[25px]">POS</span>
        <button className="flex items-center gap-2 text-[16px] sm:text-[17px]">
          Main menu
          <img src="/Polygon 2.png" alt="Next" className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Buttons Container */}
      <div className="w-full max-w-[450px] flex flex-col gap-4 sm:gap-6">

        {/* Create Invoice */}
        <button
          onClick={() => setShowCreateInvoice(true)}
          className="flex flex-col sm:flex-row items-center justify-between rounded-3xl sm:rounded-[80px] p-4 sm:p-6 text-white bg-gradient-to-b from-[#7D77ED] via-[#251DCC] to-[#191388] h-auto sm:h-50"
        >
          <div className="text-left mb-2 sm:mb-0 sm:ml-6">
            <h2 className="text-xl sm:text-3xl font-bold leading-snug">
              Create<br />New<br />Invoice
            </h2>
          </div>
          <div className="text-4xl sm:text-5xl">
            <img src="/mdi_invoice-text-plus.png" alt="Create Invoice" className="w-20 h-20 sm:w-30 sm:h-30" />
          </div>
        </button>

        {/* View Previous Invoice */}
        <button
          onClick={() => setShowViewInvoice(true)}
          className="flex flex-col sm:flex-row items-center justify-between rounded-3xl sm:rounded-[80px] p-4 sm:p-6 text-white bg-gradient-to-b from-[#9EF6A5] via-[#1B8C21] to-[#022003] h-auto sm:h-50"
        >
          <div className="text-left mb-2 sm:mb-0 sm:ml-6">
            <h2 className="text-xl sm:text-3xl font-bold leading-snug">
              View<br />Previous<br />Invoice
            </h2>
          </div>
          <div className="text-4xl sm:text-5xl">
            <img src="/mdi_invoice-clock.png" alt="View Invoice" className="w-20 h-20 sm:w-30 sm:h-30" />
          </div>
        </button>

        {/* Create / Edit Customer */}
        <button
          onClick={() => setShowCreateCustomer(true)}
          className="flex flex-col sm:flex-row items-center justify-between rounded-3xl sm:rounded-[80px] p-4 sm:p-6 text-white bg-gradient-to-b from-[#F6ED9E] via-[#868C1B] to-[#1A2002] h-auto sm:h-50"
        >
          <div className="text-left mb-2 sm:mb-0 sm:ml-6">
            <h2 className="text-xl sm:text-3xl font-bold leading-snug">
              Create /<br />Edit<br />Customer
            </h2>
          </div>
          <div className="text-4xl sm:text-5xl">
            <img src="/mdi_user-add.png" alt="Create Customer" className="w-20 h-20 sm:w-30 sm:h-30" />
          </div>
        </button>

      </div>
    </div>
  );
};

export default PosMainMenu;
