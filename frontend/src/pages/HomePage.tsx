import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import { ShoppingBag, Search } from 'lucide-react';
import { API_BASE_URL } from '../data/ApiUrl';

// API base URL

interface Size {
  id: string;
  size: string;
}

interface CategoryData {
  id: string;
  name: string;
  image?: string;
}

interface ProductImage {
  id: string;
  image: string;
  image_url: string | null;
}

interface Product {
  id: string;
  title: string;
  image?: string;
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
  sizeIds: string[];
  category: string;
  short_description?: string;
}

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const location = useLocation();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}api/categories/`);
        const data = await response.json();
        
        if (data.status === 'success' && data.categories) {
          setCategories([
            { id: 'all', name: 'All Products' },
            ...data.categories
          ]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}api/featured-products/`);
        const data = await response.json();
        
        if (data.status === 'success' && data.products) {
          setProducts(data.products);
          setFilteredProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get search query and category from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    const categoryParam = searchParams.get('category');

    if (categoryParam) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory('all');
    }

    if (searchQuery) {
      filterProducts(searchQuery, categoryParam || 'all');
    } else if (categoryParam) {
      filterByCategory(categoryParam);
    } else {
      setFilteredProducts(products);
    }
  }, [location.search, products]);

  const filterProducts = (searchQuery: string, category: string) => {
    const filtered = products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = category === 'all' || product.category.id === category;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredProducts(filtered);
  };

  const filterByCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.category.id === categoryId
      );
      setFilteredProducts(filtered);
    }
  };

  // Get featured categories
  const getFeaturedCategories = () => {
    return categories.filter(cat => cat.id !== 'all').slice(0, 3);
  };

  return (
    <div className="pt-16 pb-12 bg-teal-950 min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[60vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-teal-950/90 to-teal-900/60"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/27603274/pexels-photo-27603274/free-photo-of-fashion-eastern-dresses-by-dhanno.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'multiply'
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="container-custom relative h-full flex flex-col justify-center">
          <div className="max-w-xl">
            <p className="text-orange-400 font-medium mb-2 tracking-wider slide-up">NEW COLLECTION</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight slide-up" style={{animationDelay: '0.1s'}}>
              Elegant Style For <span className="gradient-text">Every Woman</span>
            </h1>
            <p className="text-gray-200 mb-6 slide-up" style={{animationDelay: '0.2s'}}>
              Discover our new collection of traditional and contemporary women's fashion. Elevate your style with Khadijah.
            </p>
            <div className="flex justify-center">
              <Link to="/products" className="btn btn-primary flex items-center slide-up px-4 py-2 text-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 w-fit" style={{animationDelay: '0.3s'}}>
                <ShoppingBag className="mr-2" size={16} />
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container-custom mt-12">
        <div className="flex flex-wrap items-center justify-center space-x-2 space-y-2 sm:space-y-0">
          {categories.map(category => (
            <Link
              key={category.id}
              to={category.id === 'all' ? '/' : `/?category=${category.id}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-white'
                  : 'bg-teal-800 text-white hover:bg-teal-700'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="container-custom mt-12">
        <h2 className="text-2xl font-bold text-white mb-8">
          {activeCategory === 'all' 
            ? 'Featured Products' 
            : categories.find(c => c.id === activeCategory)?.name || 'Collection'}
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-teal-900 rounded-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-teal-800"></div>
                <div className="p-4">
                  <div className="h-4 bg-teal-800 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-teal-800 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-teal-800 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={{
                id: product.id,
                title: product.title,
                image: product.images && product.images.length > 0 
                  ? (product.images[0].image || product.images[0].image_url || '') 
                  : '',
                price: product.price,
                sizes: product.size.map(s => s.size),
                sizeIds: product.size.map(s => s.id),
                category: product.category.name,
                short_description: product.description
              } as ProductCardProps} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-teal-600 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No products found</h3>
            <p className="text-gray-400">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>

      {/* Featured Categories */}
      <div className="container-custom mt-20">
        <h2 className="text-2xl font-bold text-white mb-8">Shop by Category</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {getFeaturedCategories().map((category, index) => (
            <div key={category.id} className="relative overflow-hidden rounded-lg group h-64">
              <img 
                src={`${category.image}` || `https://images.pexels.com/photos/${2689615 + index * 100000}/pexels-photo-${2689615 + index * 100000}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`} 
                alt={`${category.name} Collection`} 
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-950/90 via-teal-900/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
                <Link 
                  to={`/products?category=${category.id}`} 
                  className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Explore Collection
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;