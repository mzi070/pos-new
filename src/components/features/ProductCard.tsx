import type { Product, Category } from '@/types';

interface ProductCardProps {
  product: Product;
  category?: Category;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export default function ProductCard({ product, category, onEdit, onDelete }: ProductCardProps) {
  const stockStatus = product.quantity <= product.minQuantity
    ? 'Low'
    : product.quantity === 0
    ? 'Out'
    : 'In';
  const stockColor =
    stockStatus === 'Low' ? 'bg-yellow-100 text-yellow-800' :
    stockStatus === 'Out' ? 'bg-red-100 text-red-800' :
    'bg-green-100 text-green-800';

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 border border-gray-100">
      <div className="flex items-center gap-3">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400">No Image</div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <div className="text-xs text-gray-500">SKU: {product.sku}</div>
          {category && <div className="text-xs text-gray-400">{category.name}</div>}
        </div>
        <div className={`px-2 py-1 rounded text-xs font-bold ${stockColor}`}>{stockStatus}</div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="text-primary-600 font-bold text-lg">${product.price.toFixed(2)}</div>
        <div className="flex gap-2">
          {onEdit && (
            <button className="text-blue-600 hover:underline text-xs" onClick={() => onEdit(product)}>Edit</button>
          )}
          {onDelete && (
            <button className="text-red-600 hover:underline text-xs" onClick={() => onDelete(product)}>Delete</button>
          )}
        </div>
      </div>
    </div>
  );
}
