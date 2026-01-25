import { useState, useEffect } from "react";
import api from "../api/axios"; // make sure this is your axios instance
import Pagination from "../components/Pagination";

interface ViewStockProps {
  goBack: () => void; // Function to navigate back to the main menu
}

interface Stock {
  id: number;
  name: string;
  other_name?: string;
  type_name?: string;
  category_name?: string;
  sub_category_name?: string;
  sku?: string;
  description?: string;
  rack?: string;
  outlet_name?: string;
  origin?: string;
  buy_price?: number;
  retail_price?: number;
  stock_price?: number;
  quantity?: number;
  unit?: string;
  created_at?: string;
  status?: string;
}

// API call
const getStocks = async (take = 10, skip = 0) => {
  return api.get("/store/stocks", { params: { take, skip } });
};

const ViewStock = ({ goBack }: ViewStockProps) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [page] = useState(1);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const take = 10;

  const loadStocks = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const skip = (pageNumber - 1) * take;
      const res = await getStocks(take, skip);

      // assuming res.data is an array of stock objects
      setStocks(res.data.data || res.data || []);
      setTotal(res.data.total || res.data.length || 0); // if API sends total
    } catch (err) {
      console.error(err);
      alert("Failed to load stocks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStocks(page);
  }, [page]);

  const totalPages = Math.ceil(total / take);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">

      {/* TOP BAR */}
      <div className="w-full max-w-6xl lg:max-w-7xl bg-[#D9D9D9] rounded-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2 sm:py-8 mb-4 sm:mb-6">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-[25px] font-medium text-black"
        >
          <img src="/Polygon.png" className="w-4 h-4 sm:w-10 sm:h-10" alt="Back" />
          Main menu
        </button>

        <span className="font-bold text-[36px]  text-black">
          View Stock
        </span>

        <button className="flex items-center gap-2 text-[25px] font-medium text-black opacity-50">
          Main menu
          <img src="/Polygon 2.png" className="w-4 h-4 sm:w-10 sm:h-10" alt="Next" />
        </button>
      </div>

      {/* TABLE */}
      <div className="w-400  overflow-x-auto">
        <div className="min-w-[2000px] bg-[#2F2F2F] rounded-[5px] overflow-hidden">

          {/* HEADER */}
          <div className="grid grid-cols-17 bg-[#243A9B] text-white text-[20px] font-semibold">
            {[
              "Name", "Sinhala Name", "Type", "Category", "Sub Category", "SKU",
              "Description", "Rack", "Outlet", "Origin",
              "Buying Price", "Retail Price", "Wholesale Price",
              "Quantity", "Unit", "Created At", "Status"
            ].map((h, i) => (
              <div key={i} className="px-2 py-3 border-r border-white/20 truncate">
                {h}
              </div>
            ))}
          </div>

          {/* BODY */}
          <div className="h-[55vh] overflow-y-auto text-[20px] text-white">
            {loading ? (
              <div className="grid grid-cols-17 text-center  py-10">
                <div className="col-span-17 ml-[-350px]">Loading...</div>
              </div>
            ) : (
              stocks.map((stock) => (
                <div key={stock.id} className="grid grid-cols-17 bg-[#3A3A3A]">
                  <div className="px-2 py-3 border-r border-white/10 truncate">{stock.name}</div>
                  <div className="px-2 py-3 border-r border-white/10 truncate">{stock.other_name || "-"}</div>
                  <div className="px-2 py-3 border-r border-white/10 truncate">{stock.type_name || "-"}</div>
                  <div className="px-2 py-3 border-r border-white/10 truncate">{stock.category_name || "-"}</div>
                  <div className="px-2 py-3 border-r border-white/10 truncate">{stock.sub_category_name || "-"}</div>
                  <div className="px-2 py-3 border-r border-white/10 truncate">{stock.sku || "-"}</div>
                  <div className="px-2 py-3 border-r border-white/10 truncate">{stock.description || "-"}</div>
                  <div className="px-2 py-3 border-r border-white/10 truncate">{stock.rack || "-"}</div>
                  <div className="px-2 py-3 border-r border-white/10 truncate">{stock.outlet_name || "-"}</div>
                  <div className="px-2 py-3 border-r border-white/10 truncate">  {(stock as any)["item.origin"] || "-"}</div>                                   
                  <div className="px-2 py-3 border-r border-white/10 truncate">{stock.buy_price || "-"}</div>
                  <div className="px-2 py-3 border-r border-white/10 truncate">{stock.retail_price || "-"}</div>
                  <div className="px-2 py-3 border-r border-white/10 truncate">{stock.stock_price || "-"}</div>
                  <div className="px-2 py-3 border-r border-white/10 truncate">{stock.quantity || "-"}</div>
                  <div className="px-2 py-3 border-r border-white/10 truncate">{stock.unit || "-"}</div>
                  <div className="px-2 py-3 border-r border-white/10 truncate">{stock.created_at?.split("T")[0]}</div>
                  <div className="px-2 py-3 border-r border-white/10 truncate">{stock.status || "-"}</div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      <div className="text-white">
      {/* PAGINATION */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
</div>
    </div>
  );
};

export default ViewStock;


