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
  title = 'Khadijah Clothing Brand - Elegant Women\'s Fashion Collection',
  description = 'Discover elegant, high-quality women\'s fashion at Khadijah Clothing Brand. Shop our exclusive collection of 3pc sets, kurtis, and Pakistani dresses for the modern woman.',
  keywords = 'khadijah clothing, khadijah clothing brand, women fashion, 3pc sets, kurti, pakistani dress, women clothing, fashion brand',
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
        'name': 'Khadijah Clothing Brand',
        'alternateName': 'Khadijah Clothing',
        'description': description,
        'url': 'https://khadijahclothing.com',
        'logo': 'https://khadijahclothing.com/logo.png',
        'image': ogImage,
        'telephone': '+880298837165',
        'email': 'admin@khadijahclothing.com',
        'priceRange': '৳৳',
        'currenciesAccepted': 'BDT',
        'paymentAccepted': 'Cash, Credit Card, bKash',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Sadik Tower, Nayasarak, sylhet sadar',
          'addressLocality': 'Sylhet',
          'addressRegion': 'Sylhet',
          'postalCode': '3100',
          'addressCountry': 'Bangladesh'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': '24.899966',
          'longitude': '91.869843'
        },
        'openingHoursSpecification': [
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            'opens': '09:00',
            'closes': '20:00'
          },
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': 'Sunday',
            'opens': '10:00',
            'closes': '18:00'
          }
        ],
        'sameAs': [
          'https://www.facebook.com/khadijah.clothingbrand',
          'https://www.instagram.com/khadijahclothing',
          'https://twitter.com/khadijahclothing'
        ],
        'offers': {
          '@type': 'AggregateOffer',
          'priceCurrency': 'BDT',
          'lowPrice': '500',
          'highPrice': '5000',
          'offerCount': '100+'
        },
        'hasMap': 'https://goo.gl/maps/example-map-url',
        'areaServed': {
          '@type': 'GeoCircle',
          'geoMidpoint': {
            '@type': 'GeoCoordinates',
            'latitude': '24.899966',
            'longitude': '91.869843'
          },
          'geoRadius': '50000'
        },
        'potentialAction': {
          '@type': 'SearchAction',
          'target': 'https://khadijahclothing.com/products?search={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
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
      
      {/* Additional SEO meta tags */}
      <meta name="author" content="Khadijah Clothing Brand" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />
      
      {/* Structured Data */}
      <script type="application/ld+json">{structuredDataScript}</script>
    </Helmet>
  );
};

export default SEOHead; 