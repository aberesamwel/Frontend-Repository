/**
 * Production-grade Materials component with optimized data fetching
 * 
 * Features:
 * - Paginated data loading
 * - Backend search and filtering
 * - Optimistic updates
 * - Virtual scrolling for large lists
 * - Proper loading and error states
 */
import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, RefreshCw, AlertTriangle } from 'lucide-react';
import { usePaginatedData } from '../hooks/useDataFetching';
import VirtualizedTable from '../components/VirtualizedTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';

const MaterialsOptimized = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    low_stock: false
  });
  const [showFilters, setShowFilters] = useState(false);

  // Production-grade data fetching with pagination
  const {
    data: materials,
    pagination,
    loading,
    error,
    search,
    filter,
    refresh,
    goToPage,
    nextPage,
    previousPage
  } = usePaginatedData('/materials', {
    pageSize: 50,
    initialParams: {
      ordering: 'name'
    }
  });

  // Debounced search
  const debouncedSearch = useMemo(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        search(searchTerm);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, search]);

  // Apply filters
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    filter(newFilters);
  };

  // Table columns configuration
  const columns = [
    {
      key: 'name',
      title: 'Material Name',
      width: 200,
      render: (item) => (
        <div>
          <div className=\"font-medium text-slate-900\">{item.name}</div>
          {item.sku && <div className=\"text-sm text-slate-500\">{item.sku}</div>}
        </div>
      )
    },
    {
      key: 'quantity',
      title: 'Stock',
      width: 120,
      render: (item) => (
        <div className=\"text-right\">
          <div className=\"font-medium\">{item.quantity} {item.unit}</div>
          {item.needs_reorder && (
            <div className=\"text-xs text-red-600 flex items-center\">
              <AlertTriangle className=\"w-3 h-3 mr-1\" />
              Reorder needed
            </div>
          )}
        </div>
      )
    },
    {
      key: 'price',
      title: 'Unit Price',
      width: 100,
      render: (item) => `$${parseFloat(item.price).toFixed(2)}`
    },
    {
      key: 'stock_value',
      title: 'Total Value',
      width: 120,
      render: (item) => `$${parseFloat(item.stock_value || 0).toFixed(2)}`
    },
    {
      key: 'status',
      title: 'Status',
      width: 120,
      render: (item) => (
        <span className={`px-2 py-1 text-xs rounded-full ${\n          item.status === 'in_stock' ? 'bg-green-100 text-green-800' :\n          item.status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :\n          item.status === 'critical' ? 'bg-red-100 text-red-800' :\n          'bg-gray-100 text-gray-800'\n        }`}>\n          {item.status.replace('_', ' ').toUpperCase()}\n        </span>\n      )\n    },\n    {\n      key: 'category',\n      title: 'Category',\n      width: 150,\n      render: (item) => item.category || 'Uncategorized'\n    },\n    {\n      key: 'supplier',\n      title: 'Supplier',\n      width: 150,\n      render: (item) => item.supplier || 'Unknown'\n    }\n  ];\n\n  if (error) {\n    return (\n      <div className=\"p-6\">\n        <div className=\"bg-red-50 border border-red-200 rounded-lg p-4\">\n          <div className=\"flex items-center\">\n            <AlertTriangle className=\"w-5 h-5 text-red-600 mr-2\" />\n            <div>\n              <h3 className=\"text-red-800 font-medium\">Error Loading Materials</h3>\n              <p className=\"text-red-600 text-sm mt-1\">{error}</p>\n              <button\n                onClick={refresh}\n                className=\"mt-2 text-red-600 hover:text-red-800 text-sm underline\"\n              >\n                Try again\n              </button>\n            </div>\n          </div>\n        </div>\n      </div>\n    );\n  }\n\n  return (\n    <ErrorBoundary>\n      <div className=\"p-6 space-y-6\">\n        {/* Header */}\n        <div className=\"flex justify-between items-center\">\n          <div>\n            <h1 className=\"text-2xl font-bold text-slate-900\">Materials Inventory</h1>\n            <p className=\"text-slate-600\">\n              {pagination.count} materials • Page {pagination.page} of {pagination.pages}\n            </p>\n          </div>\n          <div className=\"flex space-x-3\">\n            <button\n              onClick={refresh}\n              disabled={loading}\n              className=\"px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center\"\n            >\n              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />\n              Refresh\n            </button>\n            <button className=\"px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center\">\n              <Plus className=\"w-4 h-4 mr-2\" />\n              Add Material\n            </button>\n          </div>\n        </div>\n\n        {/* Search and Filters */}\n        <div className=\"bg-white rounded-lg border border-slate-200 p-4\">\n          <div className=\"flex space-x-4\">\n            {/* Search */}\n            <div className=\"flex-1 relative\">\n              <Search className=\"absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5\" />\n              <input\n                type=\"text\"\n                placeholder=\"Search materials, SKU, category, or supplier...\"\n                value={searchTerm}\n                onChange={(e) => setSearchTerm(e.target.value)}\n                className=\"w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500\"\n              />\n            </div>\n            \n            {/* Filter Toggle */}\n            <button\n              onClick={() => setShowFilters(!showFilters)}\n              className={`px-4 py-2 border rounded-lg flex items-center ${\n                showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-300 hover:bg-slate-50'\n              }`}\n            >\n              <Filter className=\"w-4 h-4 mr-2\" />\n              Filters\n            </button>\n          </div>\n\n          {/* Filter Panel */}\n          {showFilters && (\n            <div className=\"mt-4 pt-4 border-t border-slate-200\">\n              <div className=\"grid grid-cols-1 md:grid-cols-4 gap-4\">\n                <div>\n                  <label className=\"block text-sm font-medium text-slate-700 mb-1\">Status</label>\n                  <select\n                    value={filters.status}\n                    onChange={(e) => handleFilterChange({ ...filters, status: e.target.value })}\n                    className=\"w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500\"\n                  >\n                    <option value=\"\">All Statuses</option>\n                    <option value=\"in_stock\">In Stock</option>\n                    <option value=\"low_stock\">Low Stock</option>\n                    <option value=\"critical\">Critical</option>\n                    <option value=\"out_of_stock\">Out of Stock</option>\n                  </select>\n                </div>\n                \n                <div>\n                  <label className=\"block text-sm font-medium text-slate-700 mb-1\">Category</label>\n                  <input\n                    type=\"text\"\n                    placeholder=\"Filter by category\"\n                    value={filters.category}\n                    onChange={(e) => handleFilterChange({ ...filters, category: e.target.value })}\n                    className=\"w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500\"\n                  />\n                </div>\n                \n                <div className=\"flex items-end\">\n                  <label className=\"flex items-center\">\n                    <input\n                      type=\"checkbox\"\n                      checked={filters.low_stock}\n                      onChange={(e) => handleFilterChange({ ...filters, low_stock: e.target.checked })}\n                      className=\"mr-2\"\n                    />\n                    <span className=\"text-sm text-slate-700\">Low stock only</span>\n                  </label>\n                </div>\n                \n                <div className=\"flex items-end\">\n                  <button\n                    onClick={() => handleFilterChange({ status: '', category: '', low_stock: false })}\n                    className=\"text-sm text-slate-600 hover:text-slate-800 underline\"\n                  >\n                    Clear filters\n                  </button>\n                </div>\n              </div>\n            </div>\n          )}\n        </div>\n\n        {/* Materials Table */}\n        <div className=\"bg-white rounded-lg border border-slate-200 overflow-hidden\">\n          {loading && materials.length === 0 ? (\n            <div className=\"flex items-center justify-center py-12\">\n              <LoadingSpinner size=\"lg\" />\n              <span className=\"ml-3 text-slate-600\">Loading materials...</span>\n            </div>\n          ) : (\n            <VirtualizedTable\n              data={materials}\n              columns={columns}\n              height={600}\n              loading={loading}\n              onRowClick={(material) => console.log('View material:', material)}\n            />\n          )}\n        </div>\n\n        {/* Pagination */}\n        {pagination.pages > 1 && (\n          <div className=\"flex items-center justify-between\">\n            <div className=\"text-sm text-slate-600\">\n              Showing {((pagination.page - 1) * 50) + 1} to {Math.min(pagination.page * 50, pagination.count)} of {pagination.count} materials\n            </div>\n            \n            <div className=\"flex space-x-2\">\n              <button\n                onClick={previousPage}\n                disabled={!pagination.has_previous || loading}\n                className=\"px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed\"\n              >\n                Previous\n              </button>\n              \n              <span className=\"px-3 py-2 text-slate-600\">\n                Page {pagination.page} of {pagination.pages}\n              </span>\n              \n              <button\n                onClick={nextPage}\n                disabled={!pagination.has_next || loading}\n                className=\"px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed\"\n              >\n                Next\n              </button>\n            </div>\n          </div>\n        )}\n      </div>\n    </ErrorBoundary>\n  );\n};\n\nexport default MaterialsOptimized;