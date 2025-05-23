import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../data/ApiUrl';
import SEOHead from '../components/SEO/SEOHead';

// Define the team member interface based on API response
interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string;
  created_at?: string;
  updated_at?: string;
}

const AboutPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch team members from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}api/team/`);
        const data = await response.json();
        
        if (data.status === 'success' && data.team) {
          setTeamMembers(data.team);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  // SEO structured data
  const aboutPageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'mainEntity': {
      '@type': 'Organization',
      'name': 'Khadijah Clothing Brand',
      'description': 'Founded in 2020, Khadijah Clothing Brand brings elegant, high-quality women\'s fashion to customers who appreciate both traditional and contemporary styles with specialty in 3pc sets, Gowns, and Pakistani dresses.',
      'foundingDate': '2020',
      'founders': [
        {
          '@type': 'Person',
          'name': 'Founder Name' // Replace with actual founder name
        }
      ],
      'url': 'https://khadijahclothing.com',
      'logo': 'https://khadijahclothing.com/logo.png',
      'sameAs': [
        'https://facebook.com/khadijah.clothingbrand',
        'https://instagram.com/khadijahclothing'
      ]
    }
  };

  return (
    <>
      <SEOHead 
        title="About Khadijah Clothing Brand | Our Story & Values"
        description="Learn about Khadijah Clothing Brand - our story, values, and the team behind our elegant women's fashion designs including 3pc sets, Gowns, and Pakistani dresses."
        keywords="khadijah clothing brand, khadijah clothing, women's fashion, Three-Piece sets, Gown, pakistani dress, about khadijah"
        canonicalUrl="https://khadijahclothing.com/about"
        ogUrl="https://khadijahclothing.com/about"
        structuredData={aboutPageStructuredData}
      />
      <div className="pt-24 pb-12 bg-teal-950 min-h-screen">
        {/* Hero Banner */}
        <div className="relative h-[40vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-teal-950/80 to-teal-900/40"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1701252068382-fbe79b926cdc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay'
            }}
          ></div>
          <div className="container-custom relative h-full flex flex-col justify-center">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight slide-up">
                About <span className="gradient-text">Khadijah Clothing Brand</span>
              </h1>
              <p className="text-xl text-gray-200 mb-6 slide-up" style={{animationDelay: '0.1s'}}>
                Celebrating Elegance in Women's Fashion
              </p>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="container-custom mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
              <p className="text-gray-300 mb-4">
                Founded in 2020, <Link to="/brand" className="text-amber-400 hover:underline">Khadijah Clothing Brand</Link> was born out of a passion for bringing elegant, high-quality women's clothing to customers who appreciate both traditional and contemporary styles, specializing in Three-Piece sets, Gowns, and Pakistani dresses.
              </p>
              <p className="text-gray-300 mb-4">
                Our name "Khadijah" is inspired by the historical figure known for her independence, business acumen, and dignified presence – qualities we hope to imbue in every garment we create.
              </p>
              <p className="text-gray-300 mb-6">
                What started as a small boutique in Dhaka has now grown into a beloved brand, serving customers across Bangladesh and internationally with a commitment to quality craftsmanship and thoughtful design.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/brand" className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition">
                  Learn More About Our Brand
                </Link>
                <Link to="/products" className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition inline-flex items-center">
                  <ShoppingBag className="mr-2" size={18} />
                  Explore Our Collection
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-64 rounded-lg overflow-hidden">
                <img 
                  src="/store1.jpeg" 
                  alt="Khadijah Clothing Brand Design Team" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-64 rounded-lg overflow-hidden">
                <img 
                  src="/store2.jpeg" 
                  alt="Khadijah Clothing Brand Fabric Selection" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-64 rounded-lg overflow-hidden">
                <img 
                  src="/store4.jpeg" 
                  alt="Khadijah Clothing Brand Garment Stitching" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-64 rounded-lg overflow-hidden">
                <img 
                  src="/store3.jpeg" 
                  alt="Khadijah Clothing Brand Store Interior" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="container-custom mt-20">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Our Values at <Link to="/brand" className="text-amber-400 hover:underline">Khadijah Clothing Brand</Link></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-teal-900 rounded-lg p-6 h-full">
              <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Quality</h3>
              <p className="text-gray-300">
                We meticulously select fabrics and monitor our production process to ensure every garment meets our high standards of quality and comfort, whether it's our 3pc sets, Gowns or Pakistani dresses.
              </p>
            </div>
            <div className="bg-teal-900 rounded-lg p-6 h-full">
              <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Style</h3>
              <p className="text-gray-300">
                We celebrate and embrace fashion that respects tradition while offering stylish, contemporary designs that today's women desire, from elegant 3pc sets to stylish Gowns.
              </p>
            </div>
            <div className="bg-teal-900 rounded-lg p-6 h-full">
              <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Innovation</h3>
              <p className="text-gray-300">
                While honoring tradition, we continuously explore new designs, techniques, and sustainable practices to bring fresh perspectives to women's fashion, including our popular Pakistani dresses.
              </p>
            </div>
          </div>
        </div>

        {/* Our Team */}
        <div className="container-custom mt-20">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Meet the Team Behind <Link to="/brand" className="text-amber-400 hover:underline">Khadijah Clothing Brand</Link></h2>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-teal-900 rounded-lg overflow-hidden animate-pulse">
                  <div className="h-64 bg-teal-800"></div>
                  <div className="p-6">
                    <div className="h-4 bg-teal-800 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-teal-800 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-teal-800 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {teamMembers.map(member => (
                <div key={member.id} className="bg-teal-900 rounded-lg overflow-hidden shadow-md">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={`${member.name} - Khadijah Clothing Brand ${member.position}`} 
                      className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-medium text-white">Name: {member.name}</h3>
                    <p className="text-sm text-white-400 mb-1">ID: {member.s_id}</p>
                    <p className="text-sm text-white-400 mb-1"> {member.position}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-teal-900/30 rounded-lg">
              <h3 className="text-xl font-medium text-white mb-2">Our team information is currently being updated</h3>
              <p className="text-gray-400">Please check back soon to meet the amazing team behind Khadijah Clothing Brand.</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="container-custom mt-20">
          <div className="bg-teal-900 rounded-lg p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Experience Khadijah Clothing Brand</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Discover why women around the world choose Khadijah Clothing Brand for their fashion needs.
              From elegant 3pc sets to stylish Gowns and Pakistani dresses, we offer quality fashion without compromising on style.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/brand" className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition">Learn More About Our Brand</Link>
              <Link to="/products" className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition inline-flex items-center">
                <ShoppingBag className="mr-2" size={18} />
                Shop Our Collections
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;