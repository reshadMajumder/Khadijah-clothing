import React from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useCart, CartProduct } from '../../context/CartContext';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    image: string;
    price: number;
    sizes: string[];
    sizeIds?: string[];
    category: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Default sizeId if not provided
    const defaultSizeId = product.sizeIds && product.sizeIds.length > 0 
      ? product.sizeIds[0] 
      : "default-size-id";

    // Quick add always uses the first size and quantity 1
    const cartProduct: CartProduct = {
      id: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
      size: product.sizes[0],
      sizeId: defaultSizeId,
      quantity: 1
    };

    addToCart(cartProduct);
    toast.success(`Added ${product.title} to cart!`);
  };

  return (
    <div className="card group relative overflow-hidden rounded-lg">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden">
          {/* Product Image */}
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-80 object-cover transform transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Category Tag / Discount Label - With Glass Look */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md text-white text-sm font-medium rounded-md border border-white/20 shadow-sm">
              {product.category}
            </span>
          </div>
          
          {/* View Details Button - Only visible on hover - With Glass Look */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Link 
              to={`/product/${product.id}`}
              className="flex items-center justify-center w-full py-2 bg-white/20 backdrop-blur-md text-white font-medium rounded-md border border-white/20 hover:bg-white/30 transition-colors shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye size={18} className="mr-2" />
              View Details
            </Link>
          </div>
        </div>
        
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-medium text-white mb-2 group-hover:text-orange-300 transition-colors">
            {product.title}
          </h3>
          
          {/* Price */}
          <p className="text-lg font-semibold text-white">
            ৳ {product.price.toLocaleString()}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;