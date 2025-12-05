import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage, 
  totalItems,
  onItemsPerPageChange 
}) => {
  const { getThemeClass } = useTheme();

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 p-4 ${getThemeClass('bg', 'secondary')} border-t ${getThemeClass('border', 'primary')}`}>
      <div className="flex items-center space-x-2">
        <span className={`text-sm ${getThemeClass('text', 'muted')}`}>Show</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className={`border ${getThemeClass('border', 'primary')} rounded px-2 py-1 text-sm ${getThemeClass('bg', 'primary')} ${getThemeClass('text', 'primary')}`}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className={`text-sm ${getThemeClass('text', 'muted')}`}>
          of {totalItems} entries
        </span>
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:' + getThemeClass('bg', 'hover')} ${getThemeClass('text', 'secondary')}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`px-3 py-1 rounded text-sm ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : page === '...'
                ? `${getThemeClass('text', 'muted')} cursor-default`
                : `${getThemeClass('text', 'secondary')} hover:${getThemeClass('bg', 'hover')}`
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:' + getThemeClass('bg', 'hover')} ${getThemeClass('text', 'secondary')}`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;