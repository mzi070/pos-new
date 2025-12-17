import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { useViewport } from '@/hooks/useResponsive';
import { Button } from '@/components/ui/Button';

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: T) => ReactNode;
  mobile?: boolean; // Show on mobile
  tablet?: boolean; // Show on tablet
  desktop?: boolean; // Show on desktop (default true if not specified)
}

export type SortOrder = 'asc' | 'desc' | null;

interface ResponsiveTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  sortable?: boolean;
  onSort?: (key: keyof T, order: SortOrder) => void;
  selectable?: boolean;
  selectedRows?: Set<string>;
  onSelectRow?: (rowKey: string) => void;
  onSelectAll?: (selected: boolean) => void;
}

/**
 * Responsive data table component
 * Desktop: Traditional table layout
 * Tablet: Horizontal scroll with fixed first column
 * Mobile: Card-based list view
 */
export function ResponsiveTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  isLoading,
  emptyMessage = 'No data found',
  pagination,
  onSort,
  selectable = false,
  selectedRows = new Set(),
  onSelectRow,
  onSelectAll,
}: ResponsiveTableProps<T>) {
  const [sortedColumn, setSortedColumn] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const { isMobile, isTablet } = useViewport();

  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !onSort) return;

    let newOrder: SortOrder = 'asc';
    if (sortedColumn === column.key && sortOrder === 'asc') {
      newOrder = 'desc';
    } else if (sortedColumn === column.key && sortOrder === 'desc') {
      newOrder = null;
    }

    setSortedColumn(newOrder ? column.key : null);
    setSortOrder(newOrder);
    onSort(column.key, newOrder);
  };

  if (isLoading) {
    return <TableSkeleton columns={columns} />;
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <p className="text-slate-600 dark:text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  // Mobile: Card-based view
  if (isMobile) {
    return (
      <div className="space-y-3">
        {data.map((row, index) => {
          const rowKey = keyExtractor(row, index);
          const visibleColumns = columns.filter((col) => col.mobile !== false);

          return (
            <div
              key={rowKey}
              onClick={() => onRowClick?.(row)}
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer hover:shadow-md transition"
            >
              {visibleColumns.map((column) => (
                <div key={String(column.key)} className="flex justify-between items-center p-3 border-b border-slate-100 dark:border-slate-700 last:border-b-0">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                    {column.label}
                  </span>
                  <span className="text-sm text-slate-900 dark:text-white font-medium">
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key] || '-')}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  // Tablet & Desktop: Table view
  const visibleColumns = columns.filter((col) => {
    if (isTablet && col.tablet === false) return false;
    if (!isTablet && col.desktop === false) return false;
    return true;
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm">
        {/* Header */}
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            {selectable && (
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                  checked={selectedRows.size === data.length && data.length > 0}
                  className="rounded"
                />
              </th>
            )}
            {visibleColumns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-4 py-3 text-left font-semibold text-slate-900 dark:text-white ${column.width || ''}`}
              >
                <div className="flex items-center gap-2">
                  <span>{column.label}</span>
                  {column.sortable && onSort && (
                    <button
                      onClick={() => handleSort(column)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition"
                    >
                      {sortedColumn === column.key ? (
                        sortOrder === 'asc' ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )
                      ) : (
                        <ArrowUpDown size={16} className="opacity-50" />
                      )}
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {data.map((row, index) => {
            const rowKey = keyExtractor(row, index);
            const isSelected = selectedRows.has(rowKey);

            return (
              <tr
                key={rowKey}
                onClick={() => onRowClick?.(row)}
                className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        onSelectRow?.(rowKey);
                      }}
                      className="rounded"
                    />
                  </td>
                )}
                {visibleColumns.map((column) => (
                  <td key={String(column.key)} className="px-4 py-3 text-slate-900 dark:text-white">
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key] || '-')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={pagination.currentPage === 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Table skeleton loader
 */
function TableSkeleton<T extends Record<string, unknown>>({ columns }: { columns: Column<T>[] }) {
  return (
    <div className="space-y-2 p-4">
      {[...Array(5)].map((_: unknown, i: number) => (
        <div key={i} className="flex gap-4 p-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse">
          {columns.map((col) => (
            <div key={String(col.key)} className="flex-1 h-4 bg-slate-300 dark:bg-slate-600 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Advanced table with filtering, sorting, and export
 */
interface AdvancedTableProps<T extends Record<string, unknown>> extends ResponsiveTableProps<T> {
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  exportable?: boolean;
  onExport?: (format: 'csv' | 'json') => void;
  filters?: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ label: string; value: string }>;
  }[];
}

export function AdvancedTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  isLoading,
  emptyMessage,
  pagination,
  sortable,
  onSort,
  selectable,
  selectedRows,
  onSelectRow,
  onSelectAll,
  searchable,
  searchPlaceholder,
  onSearch,
  exportable,
  onExport,
  filters,
}: AdvancedTableProps<T>) {
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {(searchable || exportable || filters) && (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-2 flex-1">
            {searchable && (
              <input
                type="text"
                placeholder={searchPlaceholder || 'Search...'}
                onChange={(e) => onSearch?.(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            )}
            {filters?.map((filter) => (
              <select
                key={filter.label}
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}
          </div>

          {exportable && (
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => onExport?.('csv')}>
                Export CSV
              </Button>
              <Button size="sm" variant="secondary" onClick={() => onExport?.('json')}>
                Export JSON
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <ResponsiveTable
        columns={columns}
        data={data}
        keyExtractor={keyExtractor}
        onRowClick={onRowClick}
        isLoading={isLoading}
        emptyMessage={emptyMessage}
        pagination={pagination}
        sortable={sortable}
        onSort={onSort}
        selectable={selectable}
        selectedRows={selectedRows}
        onSelectRow={onSelectRow}
        onSelectAll={onSelectAll}
      />
    </div>
  );
}
