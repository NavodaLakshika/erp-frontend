import { useState } from "react";
import RecallInvoice from "./RecallInvoice";
import CancelInvoiceConfirm from "./CancelInvoiceConfirm";
import AddCustomer from "./AddCustomer";
import CreateCustomer from "./CreateCustomer";
import SelectProducts from "./SelectProducts";
import SendInvoiceConfirm from "./SendInvoiceConfirm";
import type { Customer } from "../api/customers";

interface CreateInvoiceProps {
  goBack: () => void;
}

const CreateInvoice = ({ goBack }: CreateInvoiceProps) => {
  const [showRecall, setShowRecall] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [qty, setQty] = useState(25);
  const increaseQty = () => setQty(qty + 1);
  const decreaseQty = () => qty > 0 && setQty(qty - 1);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-5">
      {/* Top Bar - Responsive */}
      <div className="w-[550px] max-w-2xl bg-[#D9D9D9] rounded-full flex items-center justify-between px-4 sm:px-6 py-3 mb-4 sm:mb-3">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-sm sm:text-base md:text-[17px] text-black"
        >
          <img
            src="/Polygon.png"
            alt="Back"
            className="w-5 h-5 sm:w-6 sm:h-6"
          />
          POS
        </button>
        <span className="font-bold text-lg sm:text-xl md:text-[25px] text-black">
          Create New Invoice
        </span>
        <button className="flex items-center gap-2 text-sm sm:text-base md:text-[17px] text-black opacity-50">
          POS
          <img
            src="/Polygon 2.png"
            alt="Next"
            className="w-5 h-5 sm:w-6 sm:h-6"
          />
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl">
        {/* Action Buttons Row */}
        <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-3  items-center justify-center">
          <button
            onClick={() => setShowRecall(true)}
            className="w-full sm:w-65 h-12 sm:h-15 bg-gradient-to-b from-[#9BF5AD] via-[#4AED80] to-[#053E0A] text-white rounded-full font-bold text-sm sm:text-base md:text-[22px]"
          >
            Recall Invoice
          </button>

          <button
            onClick={() => setShowCancelConfirm(true)}
            className="w-full sm:w-65 h-12 sm:h-15 bg-gradient-to-b from-[#F59B9B] via-[#ED654A] to-[#3B0202] text-white rounded-full font-medium text-sm sm:text-base md:text-[22px]"
          >
            Cancel Invoice
          </button>
        </div>

        {/* Customer & Info Card */}
        <div className="sm:w-140 sm:h-52 bg-gradient-to-b from-[#D9D9D9] via-[#827E7E] to-[#676464] rounded-2xl p-3 sm:p-4 mb-4 sm:mb-3 sm:ml-14 ">
          <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4 ">
            {/* Customer Buttons */}
            <div className="flex flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setShowAddCustomer(true)}
                className="flex-1 sm:w-25 h-24 sm:h-45 bg-gradient-to-b from-[#9BF5A3] via-[#72ED4A] to-[#023B06] text-white rounded-[30px] font-medium flex flex-col items-center justify-center gap-2"
              >
                <img
                  src="/lets-icons_user-alt-fill.png"
                  alt="Add Customer"
                  className="w-8 h-8 sm:w-15 sm:h-15"
                />
                <span className="text-xs sm:text-[15px] text-center">
                  Add<br />Customer
                </span>
              </button>

              <button
                onClick={() => setShowCreateCustomer(true)}
                className="flex-1 sm:w-25 h-24 sm:h-45 bg-gradient-to-b from-[#A19BF5] via-[#4A5DED] to-[#02043B] text-white rounded-[30px] font-medium flex flex-col items-center justify-center gap-2"
              >
                <img
                  src="/typcn_user-add.png"
                  alt="Create Customer"
                  className="w-8 h-8 sm:w-15 sm:h-15"
                />
                <span className="text-xs sm:text-[15px] text-center">
                  Create<br />Customer
                </span>
              </button>
            </div>


            {/* Right Side Info */}
            <div className="flex-1 text-xs sm:text-[16px] text-white ml-5 mt-5">
              <div className="flex flex-col sm:flex-row mb-2">
                <span className="font-semibold w-24 sm:w-28">Bill For</span>
                <span>
                  :{" "}
                  <span className="text-blue-700 font-bold">
                    {selectedCustomer
                      ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}`
                      : "Select Customer"}
                  </span>
                </span>
              </div>
              <div className="flex flex-col sm:flex-row mb-2">
                <span className="font-semibold w-24 sm:w-28">Bill No</span>
                <span>
                  : <span className="text-blue-700 font-bold">INV01258</span>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row mb-3 sm:mb-4">
                <span className="font-semibold w-24 sm:w-28">Billing by</span>
                <span>
                  : <span className="text-blue-700 font-bold">Cashier 0025</span>
                </span>
              </div>

              {/* Quantity */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <span className="font-semibold w-28">Bag/Box Quantity</span>

                <div className="flex items-center bg-[#D9D9D9] rounded-lg px-2 py-1 gap-2 shadow">
                  <button
                    onClick={increaseQty}
                    className="w-7 h-7 bg-green-700 text-white rounded flex items-center justify-center active:scale-95"
                  >
                    +
                  </button>

                  <span className="font-bold text-blue-700 w-8 text-center">
                    {qty}
                  </span>

                  <button
                    onClick={decreaseQty}
                    className="w-7 h-7 bg-red-700 text-white rounded flex items-center justify-center active:scale-95"
                  >
                    −
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Add Items Button */}
        <button
          onClick={() => setShowProducts(true)}
          className="w-full sm:w-[550px] h-12 sm:h-15 sm:ml-14.5 items-center justify-center bg-gradient-to-b from-[#807CFE] via-[#574AED] to-[#0A053E] text-white rounded-full font-bold text-sm sm:text-base md:text-[22px] mb-4 sm:mb-3"
        >
          Add Items To Invoice
        </button>

        {/* ITEMS TABLE */}
        <div className=" h-[70vh] sm:w-140  sm:h-[40vh] bg-[#2F2F2F] rounded-lg overflow-hidden mb-4 sm:mb-3 flex flex-col sm:ml-14 ">

          {/* Table Header */}
          <div className="grid grid-cols-6 gap-6 text-[10px] sm:text-[15px] text-white bg-[#3A3A3A] px-2 sm:px-3 py-2 font-semibold ">
            <div>Item<br />No</div>
            <div>SKU</div>
            <div>Item Name</div>
            <div>Description</div>
            <div>Unit Price</div>
            <div>Qty</div>
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-y-auto  text-[10px] sm:text-[13px] text-white">
            {/* Row */}
            <div className="grid grid-cols-6 px-2 sm:px-3 py-2 border-b border-white/10">
              <div>01</div>
              <div>FUA1245</div>
              <div>Ben 10 action figure</div>
              <div>85752453</div>
              <div>100.00</div>
              <div className="flex items-center justify-center">
                <span className="px-2 py-1 border border-lime-400 rounded text-lime-400">
                  5
                </span>
              </div>
            </div>

            {/* Empty rows (visual only) */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-6 px-2 sm:px-3 py-3 border-b border-white/5"
              >
                <div>&nbsp;</div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            ))}
          </div>

          {/* Bottom Summary */}
          <div className="flex w-full text-[10px] sm:text-[15px] font-semibold">
            <div className="w-1/2 bg-[#1E40FF] text-white px-3 sm:px-4 py-2 sm:py-3">
              Total Item count<br />- 12
            </div>
            <div className="w-1/2 bg-[#1F4D1F] text-white px-3 sm:px-4 py-2 sm:py-3 text-right">
              Total Amount - 5500.00
            </div>
          </div>

        </div>

        <div className="w-full max-w-2xl flex   text-sm sm:text-base text-white/80  ml-12">
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
        {/* SEND TO CASHIER BUTTON */}
        <button
          onClick={() => setShowSendConfirm(true)}
          className="w-full h-12 sm:w-[550px] sm:h-16 sm:ml-15 bg-gradient-to-b from-[#7CFE96] via-[#4AED7B] to-[#053E13] text-white rounded-xl font-bold text-sm sm:text-base md:text-[22px] flex items-center justify-center gap-2 mt-2"
        >
          Send Invoice to cashier
          <span className="text-lg sm:text-[32px]">➤</span>
        </button>
      </div>

      {/* Modals */}
      {showRecall && <RecallInvoice onClose={() => setShowRecall(false)} />}

      {showCancelConfirm && (
        <CancelInvoiceConfirm
          onClose={() => setShowCancelConfirm(false)}
          onConfirm={() => {
            setShowCancelConfirm(false);
            console.log("Invoice Cancelled");
          }}
        />
      )}

      {showAddCustomer && (
        <AddCustomer
          onClose={() => setShowAddCustomer(false)}
          onSelect={(customer) => {
            setSelectedCustomer(customer);
            setShowAddCustomer(false);
          }}
        />
      )}

      {showCreateCustomer && (
        <CreateCustomer onClose={() => setShowCreateCustomer(false)} />
      )}

      {showProducts && <SelectProducts onClose={() => setShowProducts(false)} />}

      {showSendConfirm && (
        <SendInvoiceConfirm
          onConfirm={() => {
            setShowSendConfirm(false);
            console.log("Invoice sent to cashier");
          }}
          onClose={() => setShowSendConfirm(false)}
        />
      )}
    </div>
  );
};

export default CreateInvoice;