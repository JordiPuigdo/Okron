import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  onPageChange,
}) => {
  return (
    <div className="flex justify-end mt-8 gap-4 mr-4">
      <button
        onClick={() => {
          onPageChange(currentPage - 1);
        }}
        disabled={currentPage === 1}
      >
        Anterior
      </button>
      <span className="mr-2">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={() => {
          onPageChange(currentPage + 1);
        }}
        disabled={!hasNextPage}
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;
