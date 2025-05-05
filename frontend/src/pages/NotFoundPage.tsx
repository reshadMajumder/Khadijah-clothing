import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="pt-24 pb-12 bg-teal-950 min-h-screen">
      <div className="container-custom flex flex-col items-center justify-center text-center py-20">
        <AlertTriangle className="h-20 w-20 text-amber-400 mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Oops! Page not found</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-lg">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary text-lg px-8 py-3">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;