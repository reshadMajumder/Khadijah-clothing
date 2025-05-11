import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

const SEOHead: React.FC<SEOProps> = ({
  title = 'Khadijah Women\'s Fashion - Elegant Clothing',
  description = 'Discover elegant, high-quality women\'s fashion at Khadijah. Shop our collection of modest clothing designed for the modern woman.',
  keywords = 'khadijah clothing ,khadijah clothing brand, girls fashion, women clothing, modest fashion, girls fashion, khadijah brand,three piece,kurti,fashion',
  ogImage = 'https://khadijahclothing.com/og-image.jpg',
  ogUrl = 'https://khadijahclothing.com',
  canonicalUrl = 'https://khadijahclothing.com',
  structuredData,
}) => {
  // Format structured data
  const structuredDataScript = structuredData
    ? JSON.stringify(structuredData)
    : JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ClothingStore',
        name: 'Khadijah Women\'s Fashion',
        description: description,
        url: 'https://khadijahclothing.com',
        logo: 'https://khadijahclothing.com/logo.png',
        image: ogImage,
        telephone: '+880298837165', // Replace with actual phone number
        email: 'admin@khadijahclothing.com', // Replace with actual email
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Sadik Tower, Nayasarak, sylhet sadar', // Replace with actual address
          addressLocality: 'Sylhet',
          addressRegion: 'Sylhet',
          postalCode: '3100',
          addressCountry: 'Bangladesh'
        },
        priceRange: '৳৳',
        openingHours: 'Mo-Fr 09:00-18:00',
        sameAs: [
          'https://www.facebook.com/khadijah.clothingbrand',
        ]
      });

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={ogUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      <script type="application/ld+json">{structuredDataScript}</script>
    </Helmet>
  );
};

export default SEOHead; 