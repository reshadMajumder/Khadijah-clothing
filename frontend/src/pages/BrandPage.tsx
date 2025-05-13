import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEO/SEOHead';
import { ShoppingBag, Star, TrendingUp, Heart, Award, Truck } from 'lucide-react';

const BrandPage: React.FC = () => {
  // Structured data specifically for the brand page
  const brandStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    'name': 'Khadijah Clothing Brand',
    'description': 'Khadijah Clothing Brand is a premium women\'s fashion retailer specializing in elegant clothing including 3pc sets, kurtis, and Pakistani dresses. Our brand represents quality, style, and contemporary design.',
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

  return (
    <>
      <SEOHead 
        title="Khadijah Clothing Brand - Premium Women's Fashion Collection"
        description="Discover the story behind Khadijah Clothing Brand. We create premium women's fashion including 3pc sets, kurtis, and Pakistani dresses with a focus on quality, style, and elegance."
        keywords="khadijah clothing brand, women's fashion brand, 3pc sets, kurti, pakistani dress, fashion brand, premium clothing"
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
              Elegance and style that celebrates the modern woman with exquisite 3pc sets, kurtis, and Pakistani dresses
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
                At Khadijah Clothing Brand, we believe that quality and style can go hand in hand. Our designs reflect this philosophy, combining traditional elements with contemporary fashion sensibilities in our 3pc sets, kurtis, and Pakistani dresses.
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
      
      {/* Collection Showcase */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Explore Our Collections</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover our range of exclusive designs created for the modern woman</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.pexels.com/photos/7788046/pexels-photo-7788046.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Khadijah Clothing Brand 3pc Collection" 
                className="w-full h-80 object-cover transform transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">3pc Sets</h3>
                <p className="text-gray-200 mb-4">Elegant three-piece sets for every occasion</p>
                <Link 
                  to="/products?category=3pc" 
                  className="inline-block px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition"
                >
                  View Collection
                </Link>
              </div>
            </div>
            
            <div className="group relative rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.pexels.com/photos/8386654/pexels-photo-8386654.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Khadijah Clothing Brand Kurtis Collection" 
                className="w-full h-80 object-cover transform transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Kurtis</h3>
                <p className="text-gray-200 mb-4">Beautiful kurtis in various styles and designs</p>
                <Link 
                  to="/products?category=kurtis" 
                  className="inline-block px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition"
                >
                  View Collection
                </Link>
              </div>
            </div>
            
            <div className="group relative rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.pexels.com/photos/11679859/pexels-photo-11679859.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Khadijah Clothing Brand Pakistani Dresses Collection" 
                className="w-full h-80 object-cover transform transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Pakistani Dresses</h3>
                <p className="text-gray-200 mb-4">Stunning Pakistani designs for special moments</p>
                <Link 
                  to="/products?category=pakistani" 
                  className="inline-block px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition"
                >
                  View Collection
                </Link>
              </div>
            </div>
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
            <div className="bg-gray-50 p-6 rounded-xl shadow-md">
              <div className="flex items-center text-amber-500 mb-4">
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
              </div>
              <p className="text-gray-700 mb-6 italic">
                "The quality of the 3pc set I ordered was beyond my expectations. The stitching is perfect and the fabric feels luxurious. Will definitely be ordering more!"
              </p>
              <div className="flex items-center">
                <img 
                  src="https://randomuser.me/api/portraits/women/12.jpg" 
                  alt="Customer" 
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-medium text-gray-800">Ayesha Khan</h4>
                  <p className="text-gray-600 text-sm">Dhaka</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl shadow-md">
              <div className="flex items-center text-amber-500 mb-4">
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
              </div>
              <p className="text-gray-700 mb-6 italic">
                "I've been a regular customer for over a year now. Their Pakistani dresses always get me compliments at every event I attend. Such unique designs!"
              </p>
              <div className="flex items-center">
                <img 
                  src="https://randomuser.me/api/portraits/women/36.jpg" 
                  alt="Customer" 
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-medium text-gray-800">Farida Rahman</h4>
                  <p className="text-gray-600 text-sm">Chittagong</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl shadow-md">
              <div className="flex items-center text-amber-500 mb-4">
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
                <Star className="fill-current h-5 w-5" />
              </div>
              <p className="text-gray-700 mb-6 italic">
                "The kurtis from Khadijah are perfect for my work wardrobe. Comfortable, stylish and so well made. Their customer service is also exceptional!"
              </p>
              <div className="flex items-center">
                <img 
                  src="https://randomuser.me/api/portraits/women/62.jpg" 
                  alt="Customer" 
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-medium text-gray-800">Sabina Ahmed</h4>
                  <p className="text-gray-600 text-sm">Sylhet</p>
                </div>
              </div>
            </div>
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
              src="https://images.pexels.com/photos/6765524/pexels-photo-6765524.jpeg?auto=compress&cs=tinysrgb&w=300" 
              alt="Instagram feed" 
              className="w-full h-40 object-cover rounded-md shadow-sm hover:opacity-90 transition"
            />
            <img 
              src="https://images.pexels.com/photos/6765627/pexels-photo-6765627.jpeg?auto=compress&cs=tinysrgb&w=300" 
              alt="Instagram feed" 
              className="w-full h-40 object-cover rounded-md shadow-sm hover:opacity-90 transition"
            />
            <img 
              src="https://images.pexels.com/photos/7679740/pexels-photo-7679740.jpeg?auto=compress&cs=tinysrgb&w=300" 
              alt="Instagram feed" 
              className="w-full h-40 object-cover rounded-md shadow-sm hover:opacity-90 transition"
            />
            <img 
              src="https://images.pexels.com/photos/6765577/pexels-photo-6765577.jpeg?auto=compress&cs=tinysrgb&w=300" 
              alt="Instagram feed" 
              className="w-full h-40 object-cover rounded-md shadow-sm hover:opacity-90 transition"
            />
            <img 
              src="https://images.pexels.com/photos/6764083/pexels-photo-6764083.jpeg?auto=compress&cs=tinysrgb&w=300" 
              alt="Instagram feed" 
              className="w-full h-40 object-cover rounded-md shadow-sm hover:opacity-90 transition hidden md:block"
            />
            <img 
              src="https://images.pexels.com/photos/5709665/pexels-photo-5709665.jpeg?auto=compress&cs=tinysrgb&w=300" 
              alt="Instagram feed" 
              className="w-full h-40 object-cover rounded-md shadow-sm hover:opacity-90 transition hidden md:block"
            />
          </div>
          <div className="mt-8 text-center">
            <a 
              href="https://www.instagram.com/khadijahclothing" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition"
            >
              View Instagram Profile
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