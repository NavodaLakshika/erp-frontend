import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const prevDisabled = currentPage === 1;
  const nextDisabled = currentPage === totalPages;

  return (
    <div className="flex gap-2 text-sm  mt-4 items-center">
      <button
        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded
          ${prevDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-white/10"}`}
        disabled={prevDisabled}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ◀
      </button>

      <span className="font-medium">
        Page <span className="font-bold">{currentPage}</span> of{" "}
        <span className="font-bold">{totalPages}</span>
      </span>

      <button
        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded
          ${nextDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-white/10"}`}
        disabled={nextDisabled}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ▶
      </button>
    </div>
  );
};

export default Pagination;
