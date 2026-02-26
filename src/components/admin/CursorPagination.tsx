type CursorPaginationProps = {
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  loading?: boolean;
};

export default function CursorPagination({
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  loading,
}: CursorPaginationProps) {
  return (
    <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
      <button
        onClick={onPrev}
        disabled={!hasPrev || loading}
        className="px-4 py-2 text-sm font-secondary rounded border border-orange text-orange
          disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange hover:text-white transition-colors"
      >
        &larr; Anterior
      </button>
      {loading && (
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-orange border-t-transparent" />
      )}
      <button
        onClick={onNext}
        disabled={!hasNext || loading}
        className="px-4 py-2 text-sm font-secondary rounded border border-orange text-orange
          disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange hover:text-white transition-colors"
      >
        Pr&oacute;ximo &rarr;
      </button>
    </div>
  );
}
