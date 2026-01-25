import { useState, useEffect } from "react";
import RecallInvoice from "./RecallInvoice";
import CancelInvoiceConfirm from "./CancelInvoiceConfirm";
import AddCustomer from "./AddCustomer";
import CreateCustomer from "./CreateCustomer";
import SelectProducts from "./SelectProducts";
import SendInvoiceConfirm from "./SendInvoiceConfirm";
import type { Customer } from "../api/customers";
import type { InvoiceItem } from "../api/items";
import { createInvoice, addInvoiceItem, sendInvoice } from "../api/invoice";

/* ================= TOKEN HELPERS ================= */
const getUserFromToken = () => {
  try {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
};

const getUserIdFromToken = (): number | null => {
  const payload = getUserFromToken();
  return payload?.sub ?? payload?.user_id ?? payload?.id ?? null;
};

const getUserNameFromToken = (): string => {
  const payload = getUserFromToken();

  const value =
    payload?.username ??
    payload?.name ??
    payload?.email ??
    "User";

  // If it's an email, return only the part before @
  if (value.includes("@")) {
    return value.split("@")[0];
  }

  return value;
};

/* ================= COMPONENT ================= */
interface CreateInvoiceProps {
  goBack: () => void;
}

const CreateInvoice = ({ goBack }: CreateInvoiceProps) => {
  /* ================= MODALS ================= */
  const [showRecall, setShowRecall] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showSendConfirm, setShowSendConfirm] = useState(false);

  /* ================= DATA ================= */
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [qty, setQty] = useState<string>("0"); // Changed to string with default "0"
  const [invoiceNumber, setInvoiceNumber] = useState<string>("AUTO");
  const [discountType] = useState<"percentage" | "fixed">("percentage");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [previousInvoiceId, setPreviousInvoiceId] = useState<number | null>(null);
  const [lastCreatedInvoiceNo, setLastCreatedInvoiceNo] = useState<string | null>(null);

  /* ================= TOTALS ================= */
  const subtotal = invoiceItems.reduce(
    (acc, item) => acc + (item.unitPrice * item.qty),
    0
  );
  const discountValue =
    discountType === "percentage"
      ? (subtotal * discountAmount) / 100
      : discountAmount;
  const totalAmount = subtotal - discountValue;
  const itemCount = invoiceItems.length;

  /* ================= HANDLERS ================= */
  const handleAddProduct = (product: InvoiceItem) => {
    const index = invoiceItems.findIndex(i => i.id === product.id);
    if (index >= 0) {
      const updated = [...invoiceItems];
      updated[index].qty += product.qty;
      setInvoiceItems(updated);
    } else {
      setInvoiceItems(prev => [...prev, product]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const handleRecallInvoice = (invoice: any) => {
    console.log("Recalled invoice:", invoice);
    setPreviousInvoiceId(invoice.id);
    setInvoiceNumber(invoice.invoice_no || `INV-${invoice.id}`);
    setSelectedCustomer(invoice.customer || null);
    setInvoiceItems(invoice.invoice_items || []);
    setPaidAmount(invoice.paid_amount || 0);
    setDiscountAmount(invoice.discount_amount || 0);
    setQty(invoice.next_box_number?.toString() || "0");
    setShowRecall(false);
  };

  /* ================= SEND INVOICE ================= */
  const handleSendInvoice = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer first");
      return;
    }

    if (invoiceItems.length === 0) {
      alert("Please add items to the invoice");
      return;
    }

    const userId = getUserIdFromToken();
    if (!userId) {
      alert("User session invalid. Please login again.");
      return;
    }

    try {
      // Parse qty to number, default to 0 if empty/invalid
      const boxQty = parseInt(qty) || 0;

      const invoicePayload = {
        customer_id: selectedCustomer.id,
        created_user_id: userId,
        status: "PENDING",
        previous_invoice_id: previousInvoiceId || null,
        paid_amount: paidAmount,
        total_amount: totalAmount,
        discount_type: discountType.toUpperCase(),
        discount_amount: discountAmount,
        next_box_number: boxQty
      };

      console.log("Creating invoice with payload:", invoicePayload);

      const invoiceResponse = await createInvoice(invoicePayload);
      
      console.log("Invoice creation response:", invoiceResponse);

      const responseData = invoiceResponse.data?.data || invoiceResponse.data;
      
      if (!responseData) {
        throw new Error("No response data from server");
      }

      const newInvoiceId = responseData.id;
      const newInvoiceNo = responseData.invoice_no || `INV-${newInvoiceId}`;

      if (!newInvoiceId) {
        throw new Error("Invoice ID not returned");
      }

      // Set the invoice number and remember it
      setInvoiceNumber(newInvoiceNo);
      setLastCreatedInvoiceNo(newInvoiceNo);

      const itemPromises = invoiceItems.map(async (item) => {
        const itemPayload = {
          stock_id: item.id,
          quantity: item.qty,
          selling_price: item.unitPrice,
          discount_type: discountType.toUpperCase(),
          discount_amount: 0
        };
        console.log("Adding invoice item:", itemPayload);
        return addInvoiceItem(newInvoiceId, itemPayload);
      });

      await Promise.all(itemPromises);

      await sendInvoice(newInvoiceId);

      alert(`Invoice #${newInvoiceNo} sent to cashier successfully!`);
      
      // Reset form but keep the invoice number displayed
      setInvoiceItems([]);
      setSelectedCustomer(null);
      setQty("0");
      setDiscountAmount(0);
      setPaidAmount(0);
      setPreviousInvoiceId(null);
      // Don't reset invoiceNumber here - keep showing the last created invoice number
      setShowSendConfirm(false);

    } catch (error: any) {
      console.error("Invoice creation error:", error);
      const errorMessage = error?.response?.data?.message ||
                          error?.message ||
                          "Failed to send invoice. Please try again.";
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleCancelInvoice = () => {
    // Reset everything including invoice number
    setInvoiceItems([]);
    setSelectedCustomer(null);
    setQty("0");
    setDiscountAmount(0);
    setPaidAmount(0);
    setPreviousInvoiceId(null);
    setInvoiceNumber("AUTO");
    setLastCreatedInvoiceNo(null);
    setShowCancelConfirm(false);
    alert("Invoice cancelled successfully!");
  };

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or numbers
    if (value === "" || /^\d*$/.test(value)) {
      setQty(value);
    }
  };

  const increaseQty = () => {
    const current = parseInt(qty) || 0;
    setQty((current + 1).toString());
  };

  const decreaseQty = () => {
    const current = parseInt(qty) || 0;
    if (current > 0) {
      setQty((current - 1).toString());
    }
  };

  // Display invoice number - show last created if exists, otherwise show AUTO
  const displayInvoiceNumber = lastCreatedInvoiceNo || invoiceNumber;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-5">
      {/* Top Bar */}
      <div className="w-[900px] bg-[#D9D9D9] rounded-full flex items-center justify-between px-4 sm:px-6 py-3 mb-4 sm:mb-3">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-sm sm:text-base md:text-[27px] text-black"
        >
          <img src="/Polygon.png" alt="Back" className="w-5 h-5 sm:w-10 sm:h-10" />
          POS
        </button>
        <span className="font-bold text-lg sm:text-xl md:text-[45px] text-black">
          Create New Invoice
        </span>
        <button className="flex items-center gap-2 text-sm sm:text-base md:text-[27px] text-black opacity-50">
          POS
          <img src="/Polygon 2.png" alt="Next" className="w-5 h-5 sm:w-10 sm:h-10" />
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl">
        {/* Action Buttons Row */}
        <div className="w-200 ml-[-60px] flex sm:flex-row gap-3 sm:gap-5 sm:mb-3 items-center justify-center">
          <button
            onClick={() => setShowRecall(true)}
            className="sm:w-205 h-12 sm:h-25 bg-gradient-to-b from-[#9BF5AD] via-[#4AED80] to-[#053E0A] text-white rounded-full font-bold text-sm sm:text-base md:text-[30px]"
          >
            Recall Invoice
          </button>

          <button
            onClick={() => setShowCancelConfirm(true)}
            className="sm:w-205 h-12 sm:h-25 bg-gradient-to-b from-[#F59B9B] via-[#ED654A] to-[#3B0202] text-white rounded-full font-medium text-sm sm:text-base md:text-[30px]"
          >
            Cancel Invoice
          </button>
        </div>

        {/* Customer & Info Card */}
        <div className="sm:w-205 sm:h-80 bg-gradient-to-b from-[#D9D9D9] via-[#827E7E] to-[#676464] rounded-[40px] p-3 sm:p-4 mb-4 sm:mb-3 ml-[-75px]">
          <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Customer Buttons */}
            <div className="flex flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setShowAddCustomer(true)}
                className="flex-1 sm:w-20 sm:h-73 bg-gradient-to-b from-[#9BF5A3] via-[#72ED4A] to-[#023B06] text-white rounded-[50px] font-medium flex flex-col items-center justify-center gap-2"
              >
                <img
                  src="/lets-icons_user-alt-fill.png"
                  alt="Add Customer"
                  className="w-8 h-8 sm:w-30 sm:h-30"
                />
                <span className="text-xs sm:text-[25px] text-center">
                  Add<br />Customer
                </span>
              </button>

              <button
                onClick={() => setShowCreateCustomer(true)}
                className="flex-1 sm:w-80 sm:h-73 bg-gradient-to-b from-[#A19BF5] via-[#4A5DED] to-[#02043B] text-white rounded-[50px] font-medium flex flex-col items-center justify-center gap-2"
              >
                <img
                  src="/typcn_user-add.png"
                  alt="Create Customer"
                  className="w-8 h-8 sm:w-30 sm:h-30"
                />
                <span className="text-xs sm:text-[25px] text-center">
                  Create<br />Customer
                </span>
              </button>
            </div>

            {/* Right Side Info */}
            <div className="flex-1 text-xs sm:text-[26px] text-white ml-5 mt-12">
              {/* Bill For - Customer Name */}
              <div className="flex flex-col sm:flex-row mb-2">
                <span className="font-semibold w-24 sm:w-28">Bill For</span>
                <span>
                  :{" "}
                  <span className="text-blue-700 font-bold">
                    {selectedCustomer
                      ? `${selectedCustomer.first_name || ''} ${selectedCustomer.last_name || ''}`.trim()
                      : "Select Customer"}
                  </span>
                </span>
              </div>
              
              {/* Bill No - Invoice Number */}
              <div className="flex flex-col sm:flex-row mb-2">
                <span className="font-semibold w-24 sm:w-28">Bill No</span>
                <span>: <span className="text-blue-700 font-bold">{displayInvoiceNumber}</span></span>
              </div>

              {/* Billing by - User Name */}
              <div className="flex flex-col sm:flex-row mb-3 sm:mb-4">
                <span className="font-semibold w-24 sm:w-28">Billing by</span>
                <span>: <span className="text-blue-700 font-bold">{getUserNameFromToken()}</span></span>
              </div>

              {/* Bag/Box Quantity - With typeable input AND + - buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <span className="font-semibold w-28">Bag/Box Quantity</span>
                <div className="flex items-center bg-[#D9D9D9] rounded-lg px-2 py-1 gap-2 shadow">
                  <button
                    onClick={decreaseQty}
                    className="w-7 h-7 bg-red-700 text-white rounded flex items-center justify-center active:scale-95"
                  >
                    −
                  </button>

                  <input
                    type="text"
                    value={qty}
                    onChange={handleQtyChange}
                    className="w-12 bg-transparent outline-none text-blue-700 font-bold text-center text-[18px]"
                    placeholder="0"
                    maxLength={5}
                  />

                  <button
                    onClick={increaseQty}
                    className="w-7 h-7 bg-green-700 text-white rounded flex items-center justify-center active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Items Button */}
        <button
          onClick={() => setShowProducts(true)}
          className="sm:w-205 sm:h-25 items-center ml-[-75px] justify-center bg-gradient-to-b from-[#807CFE] via-[#574AED] to-[#0A053E] text-white rounded-full font-bold text-sm sm:text-base md:text-[30px] mb-4 sm:mb-3"
        >
          Add Items To Invoice
        </button>

        {/* ITEMS TABLE */}
        <div className="h-[70vh] sm:w-205 sm:h-[40vh] bg-[#2F2F2F] rounded-lg overflow-hidden mb-4 sm:mb-3 flex flex-col ml-[-75px]">
          {/* Table Header */}
          <div className="grid grid-cols-7 gap-4 text-[20px] sm:text-[23px] text-white bg-[#3A3A3A] px-2 sm:px-3 py-2 font-semibold">
            <div>Item<br />No</div>
            <div>SKU</div>
            <div>Item Name</div>
            <div>Description</div>
            <div>Unit Price</div>
            <div>Qty</div>
            <div>Action</div>
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-y-auto text-[10px] sm:text-[13px] text-white">
            {invoiceItems.length === 0 ? (
              <div className="text-center text-[20px] py-8 text-gray-400">
                No items added. Click "Add Items To Invoice" to add products.
              </div>
            ) : (
              invoiceItems.map((item, i) => (
                <div key={item.id} className="grid grid-cols-7 px-2 text-[15px] sm:px-3 py-2 border-b border-white/10">
                  <div>{i + 1}</div>
                  <div>{item.sku}</div>
                  <div>{item.name}</div>
                  <div className="truncate" title={item.description}>{item.description}</div>
                  <div>${item.unitPrice.toFixed(2)}</div>
                  <div className="flex items-center justify-center">
                    <span className="px-2 py-1 border border-lime-400 rounded text-lime-400">
                      {item.qty}
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleRemoveItem(i)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Empty rows if needed */}
            {[...Array(Math.max(0, 12 - invoiceItems.length))].map((_, i) => (
              <div key={`empty-${i}`} className="grid grid-cols-7 px-2 sm:px-3 py-3 border-b border-white/5">
                {Array.from({ length: 7 }).map((_, c) => <div key={c}>&nbsp;</div>)}
              </div>
            ))}
          </div>

          {/* Bottom Summary */}
          <div className="flex w-full text-[10px] sm:text-[23px] font-semibold">
            <div className="w-1/2 bg-[#1E40FF] text-white px-3 sm:px-4 py-2 sm:py-3">
              Total Item count<br />- {itemCount}
            </div>
            <div className="w-1/2 bg-[#1F4D1F] text-white px-3 sm:px-4 py-2 sm:py-3 text-right">
              <div>Subtotal: ${subtotal.toFixed(2)}</div>
              <div>Discount: {discountType === "percentage" ? `${discountAmount}%` : `$${discountAmount.toFixed(2)}`}</div>
              <div className="font-bold">Total: ${totalAmount.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Send to cashier */}
        <button
          onClick={() => setShowSendConfirm(true)}
          disabled={!selectedCustomer || invoiceItems.length === 0}
          className="sm:w-205 sm:h-25 items-center ml-[-75px] justify-center bg-gradient-to-b from-[#7CFE96] via-[#4AED7B] to-[#053E13] text-white rounded-full font-bold text-sm sm:text-base md:text-[30px] flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send Invoice to cashier
          <span className="text-lg sm:text-[32px]">➤</span>
        </button>
      </div>

      {/* Modals */}
      {showRecall && <RecallInvoice onClose={() => setShowRecall(false)} onSelect={handleRecallInvoice} />}
      {showCancelConfirm && (
        <CancelInvoiceConfirm
          onClose={() => setShowCancelConfirm(false)}
          onConfirm={handleCancelInvoice}
        />
      )}
      {showAddCustomer && <AddCustomer onClose={() => setShowAddCustomer(false)} onSelect={setSelectedCustomer} />}
      {showCreateCustomer && (
        <CreateCustomer
          onClose={() => setShowCreateCustomer(false)}
          onCustomerCreated={setSelectedCustomer}
        />
      )}
      {showProducts && (
        <SelectProducts 
          onClose={() => setShowProducts(false)} 
          onAdd={handleAddProduct} 
        />
      )}
      {showSendConfirm && (
        <SendInvoiceConfirm
          onConfirm={handleSendInvoice}
          onClose={() => setShowSendConfirm(false)}
        />
      )}
    </div>
  );
};

export default CreateInvoice;