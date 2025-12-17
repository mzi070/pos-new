import React, { useState, type ReactNode } from 'react';
import { ShoppingCart, Heart, Share2, Eye } from 'lucide-react';
import { useViewport } from '@/hooks/useResponsive';
import { Button, Badge, Card, CardBody } from '@/components/ui/Button';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  inStock: boolean;
  stock?: number;
  badge?: string;
  badgeColor?: string;
}

interface ResponsiveProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onWishlist?: (product: Product) => void;
  onShare?: (product: Product) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  isLoading?: boolean;
  emptyState?: ReactNode;
}

/**
 * Responsive product grid component
 * Mobile: 1 column (full width)
 * Tablet: 2 columns
 * Desktop: 3-4 columns
 */
export function ResponsiveProductGrid({
  products,
  onProductClick,
  onAddToCart,
  onWishlist,
  onShare,
  viewMode = 'grid',
  isLoading = false,
  emptyState,
}: ResponsiveProductGridProps) {
  const { isMobile, isTablet } = useViewport();

  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  if (products.length === 0) {
    return emptyState || <EmptyProductState />;
  }

  if (viewMode === 'list' && !isMobile) {
    return (
      <ProductListView
        products={products}
        onProductClick={onProductClick}
        onAddToCart={onAddToCart}
        onWishlist={onWishlist}
        onShare={onShare}
      />
    );
  }

  return (
    <div className={`
      grid
      grid-cols-1
      ${!isMobile ? 'md:grid-cols-2' : ''}
      ${!isMobile && !isTablet ? 'lg:grid-cols-3 xl:grid-cols-4' : ''}
      gap-3 sm:gap-4 md:gap-5
    `}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onProductClick={onProductClick}
          onAddToCart={onAddToCart}
          onWishlist={onWishlist}
          onShare={onShare}
        />
      ))}
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onWishlist?: (product: Product) => void;
  onShare?: (product: Product) => void;
}

/**
 * Individual product card (responsive)
 * Touch-friendly with 44px+ buttons on mobile
 */
function ProductCard({
  product,
  onProductClick,
  onAddToCart,
  onWishlist,
  onShare,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { isMobile } = useViewport();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onWishlist?.(product);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <Card
      hover
      clickable
      onClick={() => onProductClick(product)}
      className="flex flex-col h-full overflow-hidden group"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-slate-100 dark:bg-slate-700 overflow-hidden rounded-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-2 left-2">
            <Badge variant={product.badgeColor as any}>{product.badge}</Badge>
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white font-bold text-xs px-2 py-1 rounded">
            -{discount}%
          </div>
        )}

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}

        {/* Quick Actions (hover on desktop) */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 md:flex gap-2 hidden">
          <Button
            size="sm"
            variant="primary"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              onProductClick(product);
            }}
            leftIcon={<Eye size={16} />}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="secondary"
            fullWidth
            onClick={handleShare}
            leftIcon={<Share2 size={16} />}
          >
            Share
          </Button>
        </div>

        {/* Mobile Action Buttons */}
        <div className="absolute top-2 right-2 md:hidden flex flex-col gap-1">
          <button
            onClick={handleWishlist}
            className={`p-2 rounded-full transition ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Content */}
      <CardBody className="flex-1">
        {/* Category */}
        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">{product.category}</p>

        {/* Name */}
        <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white line-clamp-2 mt-1">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating || 0) ? '' : 'opacity-30'}>
                  ★
                </span>
              ))}
            </div>
            {product.reviews && <span className="text-xs text-slate-500 dark:text-slate-400">({product.reviews})</span>}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-slate-400 dark:text-slate-500 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Stock Info */}
        {product.stock !== undefined && (
          <p className={`text-xs mt-2 ${product.stock > 5 ? 'text-green-600' : 'text-orange-600'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
        )}
      </CardBody>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
        <Button
          onClick={handleWishlist}
          variant="ghost"
          size="md"
          fullWidth
          className="hidden md:flex"
          leftIcon={<Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />}
        >
          Like
        </Button>
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          size="md"
          fullWidth
          leftIcon={<ShoppingCart size={18} />}
        >
          {isMobile ? 'Add' : 'Add to Cart'}
        </Button>
      </div>
    </Card>
  );
}

/**
 * Product list view (alternative to grid, shown on desktop)
 */
function ProductListView({
  products,
  onProductClick,
  onAddToCart,
  onWishlist,
}: Omit<ResponsiveProductGridProps, 'isLoading' | 'emptyState' | 'viewMode' | 'onViewModeChange'>) {
  return (
    <div className="space-y-3">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => onProductClick(product)}
          className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg hover:shadow-md transition border border-slate-200 dark:border-slate-700 cursor-pointer"
        >
          {/* Image */}
          <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">{product.category}</p>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">{product.name}</h3>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">${product.price}</p>
                {product.originalPrice && (
                  <p className="text-sm text-slate-400 line-through">${product.originalPrice}</p>
                )}
              </div>
            </div>

            {product.rating && (
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating || 0) ? '' : 'opacity-30'}>
                      ★
                    </span>
                  ))}
                </div>
                {product.reviews && <span className="text-xs text-slate-500">({product.reviews} reviews)</span>}
              </div>
            )}

            <p className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
              {product.inStock ? `${product.stock} in stock` : 'Out of stock'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex flex-col gap-2">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              leftIcon={<ShoppingCart size={16} />}
            >
              Add
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onWishlist?.(product);
              }}
              leftIcon={<Heart size={16} />}
            >
              Like
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Empty state component
 */
function EmptyProductState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <ShoppingCart size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Products Found</h3>
      <p className="text-slate-600 dark:text-slate-400 text-center">
        Try adjusting your filters or search criteria
      </p>
    </div>
  );
}

/**
 * Loading skeleton for product grid
 */
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden animate-pulse">
          <div className="aspect-square" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-3/4" />
            <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
