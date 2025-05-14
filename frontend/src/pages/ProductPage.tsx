import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Share2, ChevronLeft, Check, AlertTriangle, ChevronRight } from 'lucide-react';
import { useCart, CartProduct } from '../context/CartContext';
import toast from 'react-hot-toast';
import ProductCard from '../components/products/ProductCard';
import { API_BASE_URL } from '../data/ApiUrl';

interface Size {
  id: string;
  size: string;
}

interface CategoryData {
  id: string;
  name: string;
}

interface ProductImage {
  id: string;
  image: string;
  image_url: string | null;
}

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  size: Size[];
  category: CategoryData;
  images: ProductImage[];
}

// Interface for the ProductCard component properties
interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  price: number;
  sizes: string[];
  category: string;
  short_description?: string;
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedSizeId, setSelectedSizeId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addToCart } = useCart();

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}api/products/${id}`);
        const data = await response.json();
        
        if (data.status === 'success' && data.product) {
          setProduct(data.product);
          // Reset active image index when product changes
          setActiveImageIndex(0);
          // Set default selected size to the first available size
          if (data.product.size && data.product.size.length > 0) {
            setSelectedSize(data.product.size[0].size);
            setSelectedSizeId(data.product.size[0].id);
          }
          
          // Fetch related products from the same category
          fetchRelatedProducts(data.product.category.id);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch related products by category
    const fetchRelatedProducts = async (categoryId: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}api/products/?category=${categoryId}`);
        const data = await response.json();
        
        if (data.status === 'success' && data.products) {
          // Filter out the current product and take up to 4 related products
          const related = data.products
            .filter((p: Product) => p.id !== id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    if (id) {
      fetchProductDetails();
      // Reset scroll position
      window.scrollTo(0, 0);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedSizeId) return;

    const cartProduct: CartProduct = {
      id: product.id,
      title: product.title,
      image: getProductImage(product, 0),
      price: product.price,
      size: selectedSize,
      sizeId: selectedSizeId,
      quantity
    };

    addToCart(cartProduct);
    toast.success(`Added ${product.title} to cart!`);
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    // For now, let's assume we have enough stock
    const available_stock = 10;
    if (value > available_stock) {
      toast.error(`Sorry, only ${available_stock} items available`);
      return;
    }
    setQuantity(value);
  };

  // Navigate through product images
  const handlePrevImage = () => {
    if (!product || !product.images.length) return;
    setActiveImageIndex((prevIndex) => 
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    if (!product || !product.images.length) return;
    setActiveImageIndex((prevIndex) => 
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Helper function to get the product image at specified index
  const getProductImage = (product: Product, index: number = 0): string => {
    if (product.images && product.images.length > index) {
      const image = product.images[index];
      return image.image || image.image_url || '';
    }
    return '';
  };

  // Map API product to ProductCard props
  const mapToProductCardProps = (product: Product): ProductCardProps => {
    return {
      id: product.id,
      title: product.title,
      image: getProductImage(product),
      price: product.price,
      sizes: product.size.map(s => s.size),
      category: product.category.name,
      short_description: product.description
    };
  };

  if (loading) {
    return (
      <div className="pt-24 pb-12 bg-teal-950 min-h-screen">
        <div className="container-custom animate-pulse">
          <div className="h-6 bg-teal-800 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-teal-800 rounded"></div>
            <div>
              <div className="h-8 bg-teal-800 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-teal-800 rounded w-full mb-2"></div>
              <div className="h-4 bg-teal-800 rounded w-full mb-6"></div>
              <div className="h-8 bg-teal-800 rounded w-1/4 mb-6"></div>
              <div className="h-10 bg-teal-800 rounded w-full mb-4"></div>
              <div className="h-10 bg-teal-800 rounded w-full mb-4"></div>
              <div className="h-12 bg-teal-800 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 pb-12 bg-teal-950 min-h-screen">
        <div className="container-custom text-center py-12">
          <AlertTriangle className="mx-auto h-16 w-16 text-amber-400 mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-4">Product Not Found</h2>
          <p className="text-gray-300 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products" className="btn btn-primary">
            Return to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 bg-teal-950 min-h-screen">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/products" className="text-gray-400 hover:text-orange-400 flex items-center text-sm">
            <ChevronLeft size={16} className="mr-1" />
            Back to products
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images Gallery */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex flex-col gap-2">
                {product.images.map((image, index) => (
                  <div 
                    key={image.id} 
                    onClick={() => setActiveImageIndex(index)}
                    className={`h-20 w-20 cursor-pointer overflow-hidden rounded border-2 transition ${
                      activeImageIndex === index 
                        ? 'border-orange-400' 
                        : 'border-teal-800 hover:border-teal-600'
                    }`}
                  >
                    <div className="aspect-square w-full h-full bg-teal-800 flex items-center justify-center overflow-hidden">
                      <img 
                        src={image.image || image.image_url || ''} 
                        alt={`${product.title} thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="relative flex-1 flex items-center justify-center p-0 m-0 bg-transparent overflow-visible">
              <img 
                src={getProductImage(product, activeImageIndex)} 
                alt={product.title} 
                className="block"
                style={{ maxWidth: '100%', maxHeight: '80vh', width: 'auto', height: 'auto', margin: 0, padding: 0, boxShadow: 'none', background: 'none', border: 'none' }}
              />
              {/* Navigation Arrows */}
              {product.images && product.images.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="pb-8 border-b border-teal-800">
              <p className="text-sm text-orange-400 uppercase tracking-wider mb-2">
                {product.category.name}
              </p>
              <h1 className="text-3xl font-bold text-white mb-4">{product.title}</h1>
              <p className="text-gray-300 mb-6">{product.description}</p>
              <p className="text-2xl font-bold text-white">৳ {product.price.toLocaleString()}</p>
            </div>

            <div className="py-6 border-b border-teal-800">
              {/* Size Selection */}
              <h3 className="text-white font-medium mb-3">Size</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {product.size.map(size => (
                  <button
                    key={size.id}
                    onClick={() => {
                      setSelectedSize(size.size);
                      setSelectedSizeId(size.id);
                    }}
                    className={`h-10 min-w-[40px] px-3 rounded-md flex items-center justify-center transition-all ${
                      selectedSize === size.size
                        ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-white font-medium'
                        : 'bg-teal-800 text-white hover:bg-teal-700'
                    }`}
                  >
                    {size.size}
                  </button>
                ))}
              </div>

              {/* Availability */}
              <div className="flex items-center mb-6">
                <Check size={18} className="text-green-500 mr-2" />
                <span className="text-green-500">In Stock</span>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Quantity</h3>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="h-10 w-10 rounded-l-md bg-teal-800 text-white flex items-center justify-center hover:bg-teal-700 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <div className="h-10 w-12 bg-teal-800/80 flex items-center justify-center text-white">
                    {quantity}
                  </div>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="h-10 w-10 rounded-r-md bg-teal-800 text-white flex items-center justify-center hover:bg-teal-700 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="btn btn-primary w-full py-3 text-lg"
              >
                <ShoppingBag className="mr-2" size={20} />
                Add to Cart
              </button>
            </div>

            {/* Share */}
            <div className="pt-6">
              <button className="flex items-center text-gray-400 hover:text-orange-400 transition-colors">
                <Share2 size={18} className="mr-2" />
                Share this product
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">You may also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={mapToProductCardProps(relatedProduct)} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;