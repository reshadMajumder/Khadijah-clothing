import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import { useCart, CartProduct } from '../../context/CartContext';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    image: string;
    price: number;
    sizes: string[];
    category: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Quick add always uses the first size and quantity 1
    const cartProduct: CartProduct = {
      id: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
      size: product.sizes[0],
      quantity: 1
    };

    addToCart(cartProduct);
    toast.success(`Added ${product.title} to cart!`);
  };

  return (
    <div className="card group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden">
          {/* Product Image */}
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Action Buttons Container */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            {/* View Details Button */}
            {/* <Link
              to={`/product/${product.id}`}
              className="bg-teal-600 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-teal-500"
              aria-label="View details"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye size={20} />
            </Link> */}
            
            {/* Quick Add Button */}
            <button
              onClick={handleQuickAdd}
              className="bg-white text-teal-900 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-orange-500 hover:text-white"
              aria-label="Quick add to cart"
            >
              <ShoppingBag size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-orange-400 mb-1 uppercase tracking-wider">
            {product.category}
          </p>
          
          {/* Title */}
          <h3 className="text-lg font-medium text-white mb-2 truncate group-hover:text-orange-300 transition-colors">
            {product.title}
          </h3>
          
          {/* Price */}
          <p className="text-lg font-semibold">
            ৳ {product.price.toLocaleString()}
          </p>
          
          {/* View Details Button (below product info) */}
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link 
              to={`/product/${product.id}`}
              className="text-sm text-teal-400 hover:text-teal-300 flex items-center justify-center w-full py-1 border border-teal-700 rounded transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye size={16} className="mr-1" />
              View Details
            </Link>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;