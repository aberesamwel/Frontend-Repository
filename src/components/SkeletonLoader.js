/**
 * Skeleton Loader - Immediate visual feedback
 * Shows content structure while data loads
 */
import React from 'react';

const SkeletonLoader = ({ type = 'page' }) => {
  const skeletons = {
    page: <PageSkeleton />,
    table: <TableSkeleton />,
    card: <CardSkeleton />,
    stats: <StatsSkeleton />,
  };

  return skeletons[type] || skeletons.page;
};

const PageSkeleton = () => (
  <div className="p-6 space-y-6 animate-pulse">
    {/* Header */}
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <div className="h-8 bg-gray-300 rounded w-64"></div>
        <div className="h-4 bg-gray-200 rounded w-96"></div>
      </div>
      <div className="h-10 bg-gray-300 rounded w-32"></div>
    </div>
    
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg shadow">
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-8 bg-gray-300 rounded w-24"></div>
        </div>
      ))}
    </div>
    
    {/* Table */}
    <TableSkeleton />
  </div>
);

const TableSkeleton = () => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="px-6 py-4 border-b">
      <div className="h-6 bg-gray-300 rounded w-48"></div>
    </div>
    <div className="divide-y">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="px-6 py-4 flex space-x-4">
          <div className="h-4 bg-gray-200 rounded flex-1"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  </div>
);

const CardSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
  </div>
);

const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export default SkeletonLoader;