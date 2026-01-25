import { useEffect, useState } from "react";
import { getItems } from "../api/items";
import { getStocksByOutlet } from "../api/stocks";

interface SelectProductsProps {
  onClose: () => void;
  onAdd: (product: any) => void;
}

interface Item {
  id: number;
  sub_category_id: number;
  name: string;
  other_name: string;
  description: string;
  origin: string;
  sku: string;
  created_at: string;
}

const SelectProducts = ({ onClose, onAdd }: SelectProductsProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState<string>("1");
  const [wholesalePrice, setWholesalePrice] = useState<string>("");
  const [sellingPrice, setSellingPrice] = useState<string>("");
  const outletId = Number(localStorage.getItem("outlet_id")) || 1;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const res = await getItems(search);
        console.log("Items API Response:", res.data);
        if (Array.isArray(res.data)) {
          setItems(res.data);
        } else if (res.data.data && Array.isArray(res.data.data)) {
          setItems(res.data.data);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("Error fetching items:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [search]);

  const handleItemSelect = async (item: Item) => {
    setSelectedItem(item);

    try {
      const outletId = Number(localStorage.getItem("outlet_id")) || 1;

      // Use the correct API endpoint for stocks by outlet
      const res = await getStocksByOutlet(outletId);
      
      // Check the actual response structure
      console.log("Stocks API Response:", res.data);
      
      // The response might be nested in a data property
      const stocksData = Array.isArray(res.data) ? res.data : 
                       (res.data.data && Array.isArray(res.data.data)) ? res.data.data : 
                       [];
      
      // Find stock for selected item
      const stock = stocksData.find(
        (s: any) => s.item_id === item.id
      );

      if (!stock) {
        alert("No stock available for this item");
        setWholesalePrice("");
        setSellingPrice("");
        return;
      }

      // ✅ REAL PRICES FROM BACKEND - use buy_price for wholesale and stock_price/retail_price for selling
      const wholesale = stock.buy_price || 0;
      const selling = stock.stock_price || stock.retail_price || 0;
      
      setWholesalePrice(wholesale.toString());
      setSellingPrice(selling.toString());

    } catch (err) {
      console.error("Failed to load stock price", err);
      setWholesalePrice("");
      setSellingPrice("");
    }
  };

  const handleAddToInvoice = () => {
    if (!selectedItem) {
      alert("Please select an item first");
      return;
    }

    const qty = parseInt(quantity) || 1;
    const price = parseFloat(sellingPrice) || 0;

    const product = {
      id: selectedItem.id,
      sku: selectedItem.sku,
      name: selectedItem.name,
      description: selectedItem.description,
      unitPrice: price,
      qty: qty
    };

    // Call the parent's onAdd function
    onAdd(product);
    
    // Reset form
    setSelectedItem(null);
    setQuantity("1");
    setSellingPrice("");
    setWholesalePrice("");
    
    // Show success message (optional)
    alert("Product added to invoice!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-3xl lg:max-w-6xl bg-[#D9D9D9] rounded-3xl sm:rounded-3xl p-6 sm:p-9 shadow-2xl">
        {/* SEARCH */}
        <div className="flex items-center bg-white rounded-[18px] px-6 sm:px-9 py-3 sm:py-4.5 mb-6 sm:mb-9">
          <img
            src="./search-products.png"
            alt="Search"
            className="mr-3 sm:mr-4.5 w-7.5 h-7.5 sm:w-9 sm:h-9"
          />
          <input
            type="text"
            placeholder="Search Products..."
            className="w-full outline-none text-base sm:text-lg bg-transparent placeholder:text-gray-500 text-[24px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="bg-[#A0A0A0] rounded-3xl sm:rounded-3xl overflow-hidden">
          {/* HEADER */}
          <div className="grid grid-cols-5 bg-[#2F2F2F] text-sm sm:text-base font-semibold text-white px-4.5 sm:px-6 py-4.5 sm:py-6">
            <div className="text-center sm:text-left text-[18px]">#</div>
            <div className="text-center sm:text-left text-[18px]">SKU</div>
            <div className="text-center sm:text-left text-[18px]">Description</div>
            <div className="text-center sm:text-left text-[18px]">Item Name</div>
            <div className="text-center sm:text-left text-[18px]">Outlet</div>
          </div>

          {/* ROWS */}
          <div className="h-54 sm:h-72 overflow-y-auto">
            {loading && <div className="text-center py-9 text-[24px]">Loading...</div>}

            {!loading && items.length === 0 && (
              <div className="text-center py-9 text-[24px]">No items found</div>
            )}

            {!loading &&
              items.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => handleItemSelect(item)}
                  className={`grid grid-cols-5 text-sm sm:text-base px-4.5 sm:px-6 py-4.5 sm:py-6 border-b border-white/10 hover:bg-white/10 transition-colors cursor-pointer text-[18px] ${selectedItem?.id === item.id ? 'bg-blue-100' : ''}`}
                >
                  <div className="text-center sm:text-left text-[18px]">{i + 1}</div>
                  <div className="text-center sm:text-left font-medium text-[18px]">{item.sku}</div>
                  <div className="text-center sm:text-left text-[18px]">{item.description}</div>
                  <div className="text-center sm:text-left text-[18px]">{item.name}</div>
                  <div className="text-center sm:text-left text-[18px]">{item.origin}</div>
                </div>
              ))}
          </div>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center mt-3">
          <button className="w-12 h-12 sm:w-15 sm:h-15 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-full text-black text-[24px]">
            ◀
          </button>
          <span className="text-base sm:text-lg font-medium text-black mx-4.5 text-[24px]">
            Page <span className="font-bold">1</span> of <span className="font-bold">1</span>
          </span>
          <button className="w-12 h-12 sm:w-15 sm:h-15 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-full text-black text-[24px]">
            ▶
          </button>
        </div>

        {/* FORM - Responsive */}
        <div className="flex flex-col items-end mt-6">
          {/* Selected Product */}
          <div className="w-full sm:w-auto rounded-3xl sm:rounded-3xl p-4.5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[21px]">Selected:</span>
                <span className="text-blue-700 font-bold text-base sm:text-lg text-[24px]">
                  {selectedItem ? selectedItem.sku : "None"}
                </span>
              </div>
              <div className="flex-1 flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Add quantity"
                  className="w-full sm:w-[250px] bg-white px-4.5 sm:px-6 py-3 rounded-[21px] outline-none focus:ring-3 focus:ring-blue-500 text-[24px]"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Wholesale Price */}
          <div className="w-full sm:w-auto rounded-3xl sm:rounded-3xl p-4.5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[21px]">Wholesale Price:</span>
              </div>
              <div className="flex-1 flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Enter wholesale price"
                  className="w-full sm:w-[250px] bg-white px-4.5 sm:px-6 py-3 rounded-[21px] outline-none focus:ring-3 focus:ring-blue-500 text-[24px]"
                  value={wholesalePrice}
                  onChange={(e) => setWholesalePrice(e.target.value)}
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Selling Price */}
          <div className="w-full sm:w-auto rounded-3xl sm:rounded-3xl p-4.5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[21px]">Selling Price:</span>
              </div>
              <div className="flex-1 flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Enter selling price"
                  className="w-full sm:w-[250px] bg-white px-4.5 sm:px-6 py-3 rounded-[21px] outline-none focus:ring-3 focus:ring-blue-500 text-[24px]"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4.5 sm:gap-0 mt-6">
          {/* Action Buttons */}
          <div className="flex gap-4.5 sm:gap-6">
            <button
              onClick={onClose}
              className="px-9 sm:px-12 h-13.5 sm:h-16.5 bg-gradient-to-b from-[#F59B9B] via-[#ED654A] to-[#3B0202] text-white rounded-full font-medium text-base sm:text-lg hover:from-[#F5ABAB] hover:to-[#ED755A] transition-all flex items-center gap-3 text-[21px]"
            >
              CANCEL
            </button>
            
            <button
              onClick={handleAddToInvoice}
              disabled={!selectedItem}
              className="px-9 sm:px-12 h-13.5 sm:h-16.5 bg-gradient-to-b from-[#0E7A2A] to-[#064C18] text-white rounded-full font-medium text-base sm:text-lg hover:from-[#0E8A2A] hover:to-[#065C18] transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-[21px]"
            >
              <span>ADD</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectProducts;