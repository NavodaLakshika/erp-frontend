interface ViewStockProps {
  goBack: () => void;
}

const ViewStock = ({ goBack }: ViewStockProps) => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">

      {/* TOP BAR - Responsive */}
      <div className="w-full max-w-6xl lg:max-w-7xl bg-[#D9D9D9] rounded-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2 sm:py-3 mb-4 sm:mb-6">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-sm sm:text-base font-medium text-black"
        >
          <img src="/Polygon.png" className="w-4 h-4 sm:w-5 sm:h-5" alt="Back" />
          Main menu
        </button>

        <span className="font-bold text-[16px] sm:text-xl lg:text-2xl text-black">
          View Stock
        </span>

        <button className="flex items-center gap-2 text-sm sm:text-base font-medium text-black opacity-50">
          Main menu
          <img src="/Polygon 2.png" className="w-4 h-4 sm:w-5 sm:h-5" alt="Next" />
        </button>
      </div>

      {/* TABLE CONTAINER - Horizontal scroll for many columns */}
      <div className="w-full max-w-7xl overflow-x-auto">
        <div className="min-w-[1600px] bg-[#2F2F2F] rounded-[5px] overflow-hidden">

          {/* HEADER */}
          <div className="grid grid-cols-17 bg-[#243A9B] text-white text-[10px] font-semibold">
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
          <div className="h-[55vh] overflow-y-auto text-[10px] text-white">

            {/* DATA ROW */}
            <div className="grid grid-cols-17 bg-[#3A3A3A]">
              {[
                "BEN 10", "-", "TOY", "Action Figure", "Cartoon", "TAC4578",
                "789654-78", "R5", "S3F1", "CHINA",
                "1000", "1500", "1200", "105", "PIECE",
                "2025/12/18 14:08PM", "Merged"
              ].map((cell, i) => (
                <div key={i} className="px-2 py-3 border-r border-white/10 truncate">
                  {cell}
                </div>
              ))}
            </div>

            {/* EMPTY ROWS */}
            {[...Array(10)].map((_, r) => (
              <div key={r} className="grid grid-cols-17 border-t border-white/10">
                {Array.from({ length: 17 }).map((_, c) => (
                  <div key={c} className="px-2 py-3 truncate">&nbsp;</div>
                ))}
              </div>
            ))}

          </div>
        </div>
      </div>


      {/* PAGINATION - Responsive */}
      <div className="w-full max-w-6xl lg:max-w-7xl flex  text-xs sm:text-sm text-white/80 mt-3 sm:mt-4">
        <button className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 flex items-center justify-center  rounded-full">
          ◀
        </button>
        <span className="font-medium mt-3">
          Page <span className="font-bold">2</span> of <span className="font-bold">2</span>
        </span>
        <button className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 flex items-center justify-center  rounded-full">
          ▶
        </button>
      </div>


    </div>
  );
};

export default ViewStock;