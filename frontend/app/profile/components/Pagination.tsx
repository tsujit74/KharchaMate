type Props = {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onChange,
}: Props) {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button
        disabled={currentPage === 1}
        onClick={() =>
          onChange(Math.max(1, currentPage - 1))
        }
        className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40"
      >
        Prevsss
      </button>

      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() =>
          onChange(
            Math.min(totalPages, currentPage + 1)
          )
        }
        className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}