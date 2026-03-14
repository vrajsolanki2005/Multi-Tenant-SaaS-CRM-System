import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16, alignItems: 'center' }}>
      <button
        className="btn btn-secondary btn-sm"
        disabled={!hasPrevPage}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={14} /> Prev
      </button>
      
      <span style={{ fontSize: 13, padding: '5px 10px', color: 'var(--text-muted)' }}>
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        className="btn btn-secondary btn-sm"
        disabled={!hasNextPage}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        Next <ChevronRight size={14} />
      </button>
    </div>
  );
}
