import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const AdminNotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <AlertTriangle className="h-16 w-16 text-amber-400 mb-6" />
      <h1 className="text-2xl font-bold text-white mb-4">Page Not Found</h1>
      <p className="text-gray-300 mb-8 max-w-lg">
        The admin page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/admin" className="btn btn-primary">
        Return to Dashboard
      </Link>
    </div>
  );
};

export default AdminNotFound;