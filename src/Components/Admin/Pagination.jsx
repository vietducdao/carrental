import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const buildPageList = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (current >= total - 2) [total - 1, total - 2, total - 3].forEach((p) => pages.add(p));
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("…");
    result.push(sorted[i]);
  }
  return result;
};

const Pagination = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}) => {
  const { t } = useLanguage();
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalItems === 0) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const pageList = buildPageList(currentPage, totalPages);

  const goTo = (p) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    onPageChange(p);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-white/5 bg-white/[0.02]">
      <div className="flex items-center gap-4 text-[11px] text-gray-500 font-bold uppercase tracking-widest">
        <span>
          {t.admin.pagination.showing}{" "}
          <span className="text-orange-400">{start}-{end}</span>{" "}
          {t.admin.pagination.of}{" "}
          <span className="text-white">{totalItems}</span>{" "}
          {t.admin.pagination.results}
        </span>
        {onPageSizeChange && (
          <div className="hidden md:flex items-center gap-2">
            <span>{t.admin.pagination.rowsPerPage}:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-white/5 border border-white/10 rounded-lg py-1 pl-2 pr-6 text-xs text-gray-200 focus:outline-none focus:border-orange-500/50 cursor-pointer"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n} className="bg-gray-950">{n}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 border border-white/5 hover:border-orange-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-xs font-bold uppercase tracking-widest"
        >
          <ChevronLeft size={14} />
          <span className="hidden sm:inline">{t.admin.pagination.prev}</span>
        </button>

        {pageList.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-600 text-xs">…</span>
          ) : (
            <button
              key={p}
              onClick={() => goTo(p)}
              className={`min-w-[36px] h-9 rounded-xl text-xs font-bold transition-all border ${
                p === currentPage
                  ? "bg-orange-500 text-black border-orange-500 shadow-lg shadow-orange-500/20"
                  : "bg-white/5 text-gray-400 border-white/5 hover:text-white hover:bg-white/10 hover:border-white/10"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 border border-white/5 hover:border-orange-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-xs font-bold uppercase tracking-widest"
        >
          <span className="hidden sm:inline">{t.admin.pagination.next}</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
