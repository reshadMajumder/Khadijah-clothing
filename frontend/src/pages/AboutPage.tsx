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
      'name': 'Khadijah Women\'s Fashion',
      'description': 'Founded in 2020, Khadijah Women\'s Fashion brings elegant, high-quality clothing to women who appreciate both traditional and contemporary styles.',
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
        'https://facebook.com/khadijahclothing',
        'https://instagram.com/khadijahclothing'
      ]
    }
  };

  return (
    <>
      <SEOHead 
        title="About Khadijah Women's Fashion | Our Story & Values"
        description="Learn about Khadijah Women's Fashion - our story, values, and the team behind our elegant Islamic clothing designs for the modern Muslim woman."
        keywords="khadijah clothing brand, khadijah women's fashion, islamic fashion history, modest fashion values, muslim women clothing, about khadijah"
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
              backgroundImage: "url('https://images.pexels.com/photos/3597429/pexels-photo-3597429.jpeg?auto=compress&cs=tinysrgb&w=1600')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay'
            }}
          ></div>
          <div className="container-custom relative h-full flex flex-col justify-center">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight slide-up">
                About <span className="gradient-text">Khadijah</span>
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
                Founded in 2020, Khadijah Women's Fashion was born out of a passion for bringing elegant, high-quality clothing to women who appreciate both traditional and contemporary styles.
              </p>
              <p className="text-gray-300 mb-4">
                Our name "Khadijah" is inspired by the historical figure known for her independence, business acumen, and dignified presence – qualities we hope to imbue in every garment we create.
              </p>
              <p className="text-gray-300 mb-6">
                What started as a small boutique in Dhaka has now grown into a beloved brand, serving customers across Bangladesh with a commitment to quality craftsmanship and thoughtful design.
              </p>
              <Link to="/" className="btn btn-primary inline-flex items-center">
                <ShoppingBag className="mr-2" size={18} />
                Explore Our Collection
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-64 rounded-lg overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/3786766/pexels-photo-3786766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Design Team" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-64 rounded-lg overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/3768167/pexels-photo-3768167.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Fabric Selection" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-64 rounded-lg overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Garment Stitching" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-64 rounded-lg overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Store Interior" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="container-custom mt-20">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-teal-900 rounded-lg p-6 h-full">
              <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Quality</h3>
              <p className="text-gray-300">
                We meticulously select fabrics and monitor our production process to ensure every garment meets our high standards of quality and comfort.
              </p>
            </div>
            <div className="bg-teal-900 rounded-lg p-6 h-full">
              <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Craftsmanship</h3>
              <p className="text-gray-300">
                We celebrate and preserve traditional craftsmanship by working with skilled artisans who bring decades of expertise to every piece we create.
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
                While honoring tradition, we continuously explore new designs, techniques, and sustainable practices to bring fresh perspectives to women's fashion.
              </p>
            </div>
          </div>
        </div>

        {/* Our Team */}
        <div className="container-custom mt-20">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Meet Our Team</h2>
          
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
                      alt={member.name} 
                      className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-orange-400 mb-1">{member.position}</p>
                    <h3 className="text-xl font-medium text-white">{member.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-teal-900/30 rounded-lg">
              <h3 className="text-xl font-medium text-white mb-2">Our team information is currently being updated</h3>
              <p className="text-gray-400">Please check back soon to meet our amazing team members.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AboutPage;