// CreateInvoice.tsx
import { useState } from "react";
import RecallInvoice from "./RecallInvoice";
import CancelInvoiceConfirm from "./CancelInvoiceConfirm";
import AddCustomer from "./AddCustomer";
import CreateCustomer from "./CreateCustomer";
import SelectProducts from "./SelectProducts";
import SendInvoiceConfirm from "./SendInvoiceConfirm";
import type { Customer } from "../api/customers";
import type { InvoiceItem } from "../api/items";
import { createInvoice, addInvoiceItem, sendInvoice } from "../api/invoice";

// Props for CreateInvoice
interface CreateInvoiceProps {
  goBack: () => void;
}

const CreateInvoice = ({ goBack }: CreateInvoiceProps) => {
  // Modal states
  const [showRecall, setShowRecall] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  
  // Selected customer
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Invoice items
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  
  // Quantity for bag/box
  const [qty, setQty] = useState(25);
  const increaseQty = () => setQty(qty + 1);
  const decreaseQty = () => qty > 0 && setQty(qty - 1);

  // Invoice details
  const invoiceNumber = "INV01258";
  const cashierId = 25; // Cashier 0025
  const [discountType] = useState<"percentage" | "fixed">("percentage");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [previousInvoiceId, setPreviousInvoiceId] = useState<number | null>(null);

  // Calculate totals
  const subtotal = invoiceItems.reduce((acc, item) => acc + (item.unitPrice * item.qty), 0);
  const discountValue = discountType === "percentage" ? (subtotal * discountAmount / 100) : discountAmount;
  const totalAmount = subtotal - discountValue;

  const itemCount = invoiceItems.length;

  // Handle customer selection from AddCustomer modal
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  // Handle customer creation
  const handleCustomerCreated = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCreateCustomer(false);
  };

  // Add product from SelectProducts modal
  const handleAddProduct = (product: InvoiceItem) => {
    const existingItemIndex = invoiceItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...invoiceItems];
      updatedItems[existingItemIndex].qty += product.qty;
      setInvoiceItems(updatedItems);
    } else {
      setInvoiceItems(prev => [...prev, product]);
    }
  };

  // Remove item from invoice
  const handleRemoveItem = (index: number) => {
    const updatedItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(updatedItems);
  };

  // Handle recall invoice
  const handleRecallInvoice = (invoice: any) => {
    console.log("Recalled invoice:", invoice);
    setShowRecall(false);
    alert(`Invoice INV${invoice.id} recalled!`);
    setPreviousInvoiceId(invoice.id);
  };

  // Create invoice with all required fields
  const handleSendInvoice = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer first");
      return;
    }

    if (invoiceItems.length === 0) {
      alert("Please add items to the invoice");
      return;
    }

    try {
      // Step 1: Create the invoice with snake_case field names
      const invoiceData = {
        customer_id: selectedCustomer.id,
        created_user_id: cashierId,
        status: "pending",
        previous_invoice_id: previousInvoiceId,
        paid_amount: paidAmount,
        total_amount: totalAmount,
        discount_type: discountType,
        discount_amount: discountAmount,
        box_quantity: qty,
      };

      console.log("Sending invoice data:", invoiceData);

      const invoiceResponse = await createInvoice(invoiceData);
      const newInvoiceId = invoiceResponse.data.id || invoiceResponse.data.data?.id;
      
      if (!newInvoiceId) {
        throw new Error("No invoice ID returned from server");
      }

      console.log("Invoice created with ID:", newInvoiceId);

      // Step 2: Add all items to the invoice
      const itemPromises = invoiceItems.map(item => 
        addInvoiceItem(newInvoiceId, {
          product_id: item.id,
          quantity: item.qty,
          unit_price: item.unitPrice
        })
      );

      await Promise.all(itemPromises);
      console.log("All items added to invoice");

      // Step 3: Send the invoice
      await sendInvoice(newInvoiceId);
      console.log("Invoice sent successfully");

      // Reset form
      setInvoiceItems([]);
      setSelectedCustomer(null);
      setQty(25);
      setDiscountAmount(0);
      setPaidAmount(0);
      setPreviousInvoiceId(null);
      
      alert("Invoice sent to cashier successfully!");
      setShowSendConfirm(false);
      
    } catch (error: any) {
      console.error("Error creating invoice:", error);
      
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        alert(`Failed to send invoice: ${error.response.data?.message || "Validation error"}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response from server. Please check your connection.");
      } else {
        console.error("Error message:", error.message);
        alert(`Failed to send invoice: ${error.message}`);
      }
    }
  };

  // Handle cancel invoice
  const handleCancelInvoice = () => {
    setInvoiceItems([]);
    setSelectedCustomer(null);
    setQty(25);
    setDiscountAmount(0);
    setPaidAmount(0);
    setPreviousInvoiceId(null);
    setShowCancelConfirm(false);
    alert("Invoice cancelled successfully!");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-5">
      {/* Top Bar */}
      <div className="w-[550px] max-w-2xl bg-[#D9D9D9] rounded-full flex items-center justify-between px-4 sm:px-6 py-3 mb-4 sm:mb-3">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-sm sm:text-base md:text-[17px] text-black"
        >
          <img src="/Polygon.png" alt="Back" className="w-5 h-5 sm:w-6 sm:h-6" />
          POS
        </button>
        <span className="font-bold text-lg sm:text-xl md:text-[25px] text-black">
          Create New Invoice
        </span>
        <button className="flex items-center gap-2 text-sm sm:text-base md:text-[17px] text-black opacity-50">
          POS
          <img src="/Polygon 2.png" alt="Next" className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl">
        {/* Action Buttons Row */}
        <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-3 items-center justify-center">
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
        <div className="sm:w-140 sm:h-52 bg-gradient-to-b from-[#D9D9D9] via-[#827E7E] to-[#676464] rounded-2xl p-3 sm:p-4 mb-4 sm:mb-3 sm:ml-14">
          <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4">
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
                      ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
                      : "Select Customer"}
                  </span>
                </span>
              </div>
              <div className="flex flex-col sm:flex-row mb-2">
                <span className="font-semibold w-24 sm:w-28">Bill No</span>
                <span>: <span className="text-blue-700 font-bold">{invoiceNumber}</span></span>
              </div>

              <div className="flex flex-col sm:flex-row mb-3 sm:mb-4">
                <span className="font-semibold w-24 sm:w-28">Billing by</span>
                <span>: <span className="text-blue-700 font-bold">Cashier 0025</span></span>
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
        <div className="h-[70vh] sm:w-140 sm:h-[40vh] bg-[#2F2F2F] rounded-lg overflow-hidden mb-4 sm:mb-3 flex flex-col sm:ml-14">
          {/* Table Header */}
          <div className="grid grid-cols-7 gap-4 text-[10px] sm:text-[15px] text-white bg-[#3A3A3A] px-2 sm:px-3 py-2 font-semibold">
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
              <div className="text-center py-8 text-gray-400">
                No items added. Click "Add Items To Invoice" to add products.
              </div>
            ) : (
              invoiceItems.map((item, i) => (
                <div key={item.id} className="grid grid-cols-7 px-2 sm:px-3 py-2 border-b border-white/10">
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
          <div className="flex w-full text-[10px] sm:text-[15px] font-semibold">
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
          className="w-full h-12 sm:w-[550px] sm:h-16 sm:ml-15 bg-gradient-to-b from-[#7CFE96] via-[#4AED7B] to-[#053E13] text-white rounded-xl font-bold text-sm sm:text-base md:text-[22px] flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
      {showAddCustomer && (
        <AddCustomer
          onClose={() => setShowAddCustomer(false)}
          onSelect={handleSelectCustomer}
        />
      )}
      {showCreateCustomer && (
        <CreateCustomer
          onClose={() => setShowCreateCustomer(false)}
          onCustomerCreated={handleCustomerCreated}
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