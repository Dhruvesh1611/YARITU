import React from 'react';
import './Pagination.css';

// Build a compact, professional pagination with ellipses
const buildPages = (current, total, siblings = 1) => {
  const pages = [];
  if (total <= 1) return pages;

  const push = (val) => pages.push(val);

  // Always show first page
  push(1);

  const left = Math.max(current - siblings, 2);
  const right = Math.min(current + siblings, total - 1);

  if (left > 2) push('ellipsis-left');

  for (let i = left; i <= right; i++) push(i);

  if (right < total - 1) push('ellipsis-right');

  if (total > 1) push(total);
  return pages;
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = buildPages(currentPage, totalPages, 1);

  const goTo = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <nav aria-label="Pagination Navigation">
      <ul className="pagination">
        <li>
          <button
            aria-label="First page"
            onClick={() => goTo(1)}
            disabled={currentPage === 1}
          >
            «
          </button>
        </li>
        <li>
          <button
            aria-label="Previous page"
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹
          </button>
        </li>

        {pages.map((p, idx) => (
          <li key={`${p}-${idx}`} className={p === currentPage ? 'active' : ''}>
            {typeof p === 'number' ? (
              <button onClick={() => goTo(p)} aria-current={p === currentPage ? 'page' : undefined}>
                {p}
              </button>
            ) : (
              <span className="ellipsis">…</span>
            )}
          </li>
        ))}

        <li>
          <button
            aria-label="Next page"
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </li>
        <li>
          <button
            aria-label="Last page"
            onClick={() => goTo(totalPages)}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
