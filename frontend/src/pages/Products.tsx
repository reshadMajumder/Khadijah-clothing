import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import { Search } from 'lucide-react';
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
  category: string;
  short_description?: string;
}

const Products: React.FC = () => {
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
        const response = await fetch(`${API_BASE_URL}api/products/`);
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

  return (
    <div className="pt-24 pb-12 bg-teal-950 min-h-screen">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-white mb-8">Our Products</h1>
        
        {/* Category Filter - Same design as HomePage */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-center space-x-2 space-y-2 sm:space-y-0">
            {categories.map(category => (
              <Link
                key={category.id}
                to={category.id === 'all' ? '/products' : `/products?category=${category.id}`}
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

        {/* Products Grid - Same design as HomePage */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-8">
            {activeCategory === 'all' 
              ? 'All Products' 
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
      </div>
    </div>
  );
};

export default Products;
