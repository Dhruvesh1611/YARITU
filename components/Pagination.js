import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        <li>
          <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            &lt;
          </button>
        </li>
        {pageNumbers.map(number => (
          <li key={number} className={currentPage === number ? 'active' : ''}>
            <button onClick={() => onPageChange(number)}>
              {number}
            </button>
          </li>
        ))}
        <li>
          <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            &gt;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
