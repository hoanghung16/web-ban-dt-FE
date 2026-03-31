import React from 'react';

export const Skeleton = ({ className = '', width = '100%', height = '1rem' }) => {
  return (
    <div
      className={`bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 animate-pulse rounded ${className}`}
      style={{ width, height }}
    />
  );
};

export const ProductCardSkeleton = () => (
  <div className="bg-zinc-900/30 border border-white/10 rounded-2xl p-5 space-y-4">
    <Skeleton className="rounded-xl" width="100%" height="200px" />
    <Skeleton width="80%" height="1rem" />
    <Skeleton width="60%" height="1.5rem" />
    <Skeleton width="40%" height="0.75rem" />
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="grid md:grid-cols-2 gap-12">
    <Skeleton className="rounded-2xl" width="100%" height="400px" />
    <div className="space-y-8">
      <Skeleton width="60%" height="2rem" />
      <Skeleton width="40%" height="1.5rem" />
      <Skeleton width="100%" height="100px" />
      <Skeleton width="50%" height="3rem" />
    </div>
  </div>
);

export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr>
    {[...Array(columns)].map((_, i) => (
      <td key={i} className="px-6 py-3">
        <Skeleton width="80%" height="1rem" />
      </td>
    ))}
  </tr>
);
