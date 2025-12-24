interface SelectProductsProps {
  onClose: () => void;
}

const SelectProducts = ({ onClose }: SelectProductsProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL - Same size as other modals */}
      <div className="relative w-full max-w-2xl lg:max-w-4xl bg-[#D9D9D9] rounded-xl sm:rounded-xl p-4 sm:p-6 shadow-2xl">

        {/* SEARCH - Same as other modals */}
        <div className="flex items-center bg-white rounded-[12px] px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
          <img
            src="./search-products.png"
            alt="Search"
            className="mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6"
          />
          <input
            type="text"
            placeholder="Search Products..."
            className="w-full outline-none text-sm sm:text-base bg-transparent placeholder:text-gray-500"
          />
        </div>

        {/* TABLE - Same height as other modals */}
        <div className="bg-[#A0A0A0] rounded-xl sm:rounded-xl overflow-hidden ">
          {/* HEADER */}
          <div className="grid grid-cols-5 bg-[#2F2F2F] text-xs sm:text-sm font-semibold text-white px-3 sm:px-4 py-3 sm:py-4">
            <div className="text-center sm:text-left">#</div>
            <div className="text-center sm:text-left">SKU</div>
            <div className="text-center sm:text-left">Description</div>
            <div className="text-center sm:text-left">Item Name</div>
            <div className="text-center sm:text-left">Outlet</div>
          </div>

          {/* ROWS - Same height as other modals */}
          <div className="h-36 sm:h-48 overflow-y-auto">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`grid grid-cols-5 text-xs sm:text-sm px-3 sm:px-4 py-3 sm:py-4 border-b border-white/10 hover:bg-white/10 transition-colors ${i === 2 ? "bg-[#7A9FD6]" : ""
                  }`}
              >
                <div className="text-center sm:text-left">{i}</div>
                <div className="text-center sm:text-left font-medium">
                  {i === 1 ? "TYP5398" : i === 2 ? "TYP7896" : `TYP${4000 + i}`}
                </div>
                <div className="text-center sm:text-left">879652-7{i}</div>
                <div className="text-center sm:text-left">
                  {i === 1 ? "BEN 10 Watch" : i === 2 ? "BEN 10 Car" : `Product ${i}`}
                </div>
                <div className="text-center sm:text-left">
                  {i === 1 ? "S3F1" : i === 2 ? "S3F5" : `S3F${i}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PAGINATION - Same as other modals */}
        <div className="flex items-center mt-2">
          <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-full text-black">
            ◀
          </button>
          <span className="text-sm sm:text-base font-medium text-black">
            Page <span className="font-bold">2</span> of <span className="font-bold">2</span>
          </span>
          <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-full text-black">
            ▶
          </button>
        </div>

        {/* FORM - Responsive */}
        <div className="flex flex-col items-end ">

          {/* Selected Product */}
          <div className="w-full sm:w-auto rounded-xl sm:rounded-2xl p-3 sm:p-4 ">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 ">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Selected :</span>
                <span className="text-blue-700 font-bold text-sm sm:text-base">TYP7896</span>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add quantity"
                  className="w-full sm:w-45 bg-white px-3 sm:px-4 py-2 rounded-[14px] outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Wholesale Price */}
          <div className="w-full sm:w-auto rounded-xl sm:rounded-2xl p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-[-20px]">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Wholesale Price :</span>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  className="w-full sm:w-45 bg-white px-3 sm:px-4 py-2 rounded-[14px] outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Selling Price */}
          <div className="w-full sm:w-auto rounded-xl sm:rounded-2xl p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-[-20px]">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Selling Price :</span>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  className="w-full sm:w-45 bg-white px-3 sm:px-4 py-2 rounded-[14px] outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

        </div>


        {/* FOOTER - Same layout as other modals */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          {/* Title - Same style as other modals */}
          <div className="text-center sm:text-left">

          </div>

          {/* Action Buttons - Same as other modals */}
          <div className="flex gap-3 sm:gap-4 mt-5">

            <button className="px-6 sm:px-8 h-9 sm:h-11 bg-gradient-to-b from-[#0E7A2A] to-[#064C18] text-white rounded-full font-medium text-sm sm:text-base hover:from-[#0E8A2A] hover:to-[#065C18] transition-all flex items-center gap-2">
              <span>ADD </span>

            </button>
          </div>
        </div>
      </div>
    </div>


  );
};

export default SelectProducts;