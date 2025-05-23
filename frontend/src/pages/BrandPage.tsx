import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEO/SEOHead';
import { ShoppingBag, Star, TrendingUp, Heart, Award, Truck, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from '../data/ApiUrl';

const BrandPage: React.FC = () => {
  // Structured data specifically for the brand page
  const brandStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    'name': 'Khadijah Clothing Brand',
    'description': 'Khadijah Clothing Brand is a premium women\'s fashion retailer specializing in elegant clothing including Three-Piece sets, Gowns, and Pakistani dresses. Our brand represents quality, style, and contemporary design.',
    'logo': 'https://khadijahclothing.com/logo.png',
    'url': 'https://khadijahclothing.com/brand',
    'sameAs': [
      'https://www.facebook.com/khadijah.clothingbrand',
      // Add other social profiles here
    ],
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://khadijahclothing.com/products?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  // Reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await fetch(`${API_BASE_URL}api/reviews/`);
        const data = await response.json();
        // Only approved reviews
        const approved = Array.isArray(data) ? data.filter((r: any) => r.approved) : [];
        setReviews(approved.slice(0, 3));
      } catch (error) {
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Categories state
  interface CategoryData {
    id: string;
    name: string;
    image?: string;
  }
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch(`${API_BASE_URL}api/categories/`);
        const data = await response.json();
        if (data.status === 'success' && data.categories) {
          setCategories(data.categories);
        }
      } catch (error) {
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <SEOHead 
        title="Khadijah Clothing Brand - Premium Women's Fashion Collection"
        description="Discover the story behind Khadijah Clothing Brand. We create premium women's fashion including Three-Piece sets, Gowns, and Pakistani dresses with a focus on quality, style, and elegance."
        keywords="khadijah clothing brand, women's fashion brand, Three-Piece sets, Gowns, pakistani dress, fashion brand, premium clothing"
        canonicalUrl="https://khadijahclothing.com/brand"
        structuredData={brandStructuredData}
      />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-900 to-teal-800 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-pattern"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Discover <span className="text-amber-400">Khadijah</span> Clothing Brand
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mb-10">
              Elegance and style that celebrates the modern woman with exquisite Three-Piece sets, Gowns, and Pakistani dresses
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/products" 
                className="px-8 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition duration-300 shadow-lg flex items-center"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Collection
              </Link>
              <a 
                href="#our-story" 
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-teal-900 transition duration-300"
              >
                Our Story
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-white opacity-10"></div>
      </div>
      
      {/* Brand Promise */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Award className="h-10 w-10 text-amber-500 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800">Premium Quality</h3>
              <p className="text-sm text-gray-600">Finest fabrics & craftsmanship</p>
            </div>
            <div className="flex flex-col items-center">
              <TrendingUp className="h-10 w-10 text-amber-500 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800">Trending Designs</h3>
              <p className="text-sm text-gray-600">Contemporary styles & patterns</p>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="h-10 w-10 text-amber-500 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800">Customer Love</h3>
              <p className="text-sm text-gray-600">Satisfaction guaranteed</p>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="h-10 w-10 text-amber-500 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Nationwide shipping</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Story */}
      <div id="our-story" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/7679863/pexels-photo-7679863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Khadijah Clothing Brand story" 
                  className="rounded-lg shadow-xl object-cover w-full h-[500px]"
                />
                <div className="absolute -bottom-6 -right-6 bg-amber-500 p-4 rounded-lg shadow-lg hidden md:block">
                  <p className="text-white font-bold text-2xl">Since 2020</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 relative">
                <span className="relative z-10">Our Brand Story</span>
                <span className="absolute -z-10 bottom-0 left-0 w-24 h-3 bg-amber-300 opacity-60"></span>
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Founded in 2020, Khadijah Clothing Brand was born from a passion to create stylish yet comfortable clothing for women who appreciate both traditional and contemporary styles.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Our name "Khadijah" is inspired by the historical figure known for her strength, business acumen, and dignified presence – qualities we hope to imbue in every garment we create.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                At Khadijah Clothing Brand, we believe that quality and style can go hand in hand. Our designs reflect this philosophy, combining traditional elements with contemporary fashion sensibilities in our Three-Piece sets, Gowns, and Pakistani dresses.
              </p>
              <div className="flex items-center space-x-4">
                <img 
                  src="https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop" 
                  alt="Founder" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-amber-500"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">Nafeesa Rahman</h4>
                  <p className="text-gray-600 text-sm">Founder & Creative Director</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Values */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Brand Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The pillars that guide us in creating exquisite clothing that resonates with our customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-8 shadow-md transform transition duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-teal-50 rounded-lg flex items-center justify-center mb-6">
                <Star className="text-teal-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Quality</h3>
              <p className="text-gray-600">
                We source only the finest fabrics and materials to create clothing that's not just beautiful, but durable and comfortable for everyday wear.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 shadow-md transform transition duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-amber-50 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="text-amber-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Style</h3>
              <p className="text-gray-600">
                Every piece in our collection is designed with style in mind, ensuring that our customers can look fashionable while staying true to their preferences.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 shadow-md transform transition duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-teal-50 rounded-lg flex items-center justify-center mb-6">
                <Heart className="text-teal-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We constantly push the boundaries of fashion, introducing new designs, cuts, and styles that reflect current trends while maintaining our commitment to quality.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Collection Showcase - replaced with dynamic categories */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Explore Our Collections</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover our range of exclusive designs created for the modern woman</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categoriesLoading ? (
              [...Array(3)].map((_, idx) => (
                <div key={idx} className="h-80 bg-teal-800/30 rounded-lg animate-pulse"></div>
              ))
            ) : categories.length === 0 ? (
              <div className="col-span-3 text-center text-gray-400 py-8">No categories available</div>
            ) : (
              categories.slice(0, 3).map((category, index) => (
                <div key={category.id} className="group relative rounded-xl overflow-hidden shadow-lg h-80">
                  <img
                    src={category.image || `https://images.pexels.com/photos/${2689615 + index * 100000}/pexels-photo-${2689615 + index * 100000}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`}
                    alt={`${category.name} Collection`}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                    <Link
                      to={`/products?category=${category.id}`}
                      className="inline-block px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition"
                    >
                      View Collection
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-12 text-center">
            <Link 
              to="/products" 
              className="inline-block px-8 py-3 bg-teal-800 text-white rounded-full hover:bg-teal-700 transition shadow-lg"
            >
              View All Collections
            </Link>
          </div>
        </div>
      </div>
      

      
      {/* Testimonials */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Customer Love</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Hear what our customers have to say about their Khadijah experience</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviewsLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-xl shadow-md animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))
            ) : reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <div key={review.id || idx} className="bg-gray-50 p-6 rounded-xl shadow-md">
                  <div className="flex items-center text-amber-500 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="fill-current h-5 w-5" fill={i < (review.rating || 0) ? '#f59e42' : 'none'} color={i < (review.rating || 0) ? '#f59e42' : '#e5e7eb'} />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{review.message}"</p>
                  <div className="flex items-center">
                    <MessageSquare className="w-10 h-10 text-orange-400 mr-4" />
                    <div>
                      <h4 className="font-medium text-gray-800">{review.name}</h4>
                      <p className="text-gray-600 text-sm">{review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 p-6 rounded-xl shadow-md text-center col-span-3">
                <p className="text-gray-500">No customer reviews yet.</p>
              </div>
            )}
          </div>
          <div className="mt-8 text-center">
            <Link to="/reviews" className="inline-block px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition">
              Read All Reviews
            </Link>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-16 bg-teal-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-pattern"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Experience Khadijah Clothing Brand Today
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Join thousands of satisfied customers and discover why Khadijah is becoming Bangladesh's favorite women's clothing brand
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/products" 
                className="px-8 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition shadow-lg"
              >
                Shop Now
              </Link>
              <Link 
                to="/contact" 
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-teal-900 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Social Proof */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-xl font-medium text-gray-700">Follow us on social media</h3>
            <p className="text-gray-500">@khadijahclothing</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <img 
              src="https://th.bing.com/th/id/OIP.pswuwFGNXbKM4BXT7LjPFwHaLH?cb=iwp2&rs=1&pid=ImgDetMain" 
              alt="Instagram feed" 
              className="w-full h-40 object-cover rounded-md shadow-sm hover:opacity-90 transition"
            />
            <img 
              src="https://images.pexels.com/photos/19248233/pexels-photo-19248233/free-photo-of-western-dress-shoot-by-dhanno.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Instagram feed" 
              className="w-full h-40 object-cover rounded-md shadow-sm hover:opacity-90 transition"
            />
            <img 
              src="https://images.pexels.com/photos/19292843/pexels-photo-19292843/free-photo-of-western-dress-2024-shoot-by-dhanno-mayra-jaffri.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Instagram feed" 
              className="w-full h-40 object-cover rounded-md shadow-sm hover:opacity-90 transition"
            />
            <img 
              src="https://images.pexels.com/photos/19511802/pexels-photo-19511802/free-photo-of-eastern-dresses-2024-shoot-by-dhanno.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Instagram feed" 
              className="w-full h-40 object-cover rounded-md shadow-sm hover:opacity-90 transition"
            />
            <img 
              src="https://images.pexels.com/photos/19511779/pexels-photo-19511779/free-photo-of-eastern-dresses-2024-shoot-by-dhanno.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Instagram feed" 
              className="w-full h-40 object-cover rounded-md shadow-sm hover:opacity-90 transition hidden md:block"
            />
            <img 
              src="https://images.pexels.com/photos/19401522/pexels-photo-19401522/free-photo-of-luxury-eastern-dresses-2024-shoot-by-dhanno.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Instagram feed" 
              className="w-full h-40 object-cover rounded-md shadow-sm hover:opacity-90 transition hidden md:block"
            />
          </div>
          <div className="mt-8 text-center">
            <a 
              href="https://www.facebook.com/khadijah.clothingbrand" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition"
            >
              View Facebook Profile
            </a>
          </div>
        </div>
      </div>
      
      <style>{`
        .bg-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </>
  );
};

export default BrandPage;