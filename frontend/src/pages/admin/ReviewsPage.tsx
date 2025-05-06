import React, { useState, useEffect } from 'react';
import { Check, Trash2, Plus, MessageSquare, X, Star, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../data/ApiUrl';

interface Review {
  id: string;
  name: string;
  message: string;
  rating: number;
  approved: boolean;
  created_at?: string;
  updated_at?: string;
}

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentReview, setCurrentReview] = useState<Review>({
    id: '',
    name: '',
    message: '',
    rating: 5,
    approved: true
  });
  
  const { authTokens } = useAuth();
  const API_URL = `${API_BASE_URL}api/admin/reviews/`;

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load reviews');
      }
      
      const data = await response.json();
      setReviews(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authTokens?.access) {
      fetchReviews();
    }
  }, [authTokens]);

  const approveReview = async (reviewId: string) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      if (!review) return;
      
      const response = await fetch(`${API_URL}${reviewId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens?.access}`
        },
        body: JSON.stringify({ ...review, approved: true })
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve review');
      }
      
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId ? { ...review, approved: true } : review
        )
      );
      
      toast.success('Review approved');
    } catch (error) {
      console.error('Error approving review:', error);
      toast.error('Failed to approve review');
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const response = await fetch(`${API_URL}${reviewId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authTokens?.access}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete review');
      }
      
      setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
      toast.success('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentReview(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCurrentReview(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentReview.name.trim() || !currentReview.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens?.access}`
        },
        body: JSON.stringify(currentReview)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add review');
      }
      
      const data = await response.json();
      setReviews(prevReviews => [...prevReviews, data]);
      
      // Reset form and close modal
      resetForm();
      
      toast.success('Review added successfully');
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Failed to add review');
    }
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentReview.name.trim() || !currentReview.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}${currentReview.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens?.access}`
        },
        body: JSON.stringify(currentReview)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update review');
      }
      
      const data = await response.json();
      
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === currentReview.id ? data : review
        )
      );
      
      // Reset form and close modal
      resetForm();
      
      toast.success('Review updated successfully');
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentReview({
      id: '',
      name: '',
      message: '',
      rating: 5,
      approved: true
    });
    setShowModal(true);
  };

  const openEditModal = (review: Review) => {
    setIsEditing(true);
    setCurrentReview(review);
    setShowModal(true);
  };

  const resetForm = () => {
    setCurrentReview({
      id: '',
      name: '',
      message: '',
      rating: 5,
      approved: true
    });
    setShowModal(false);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Reviews</h1>
        <button
          onClick={openAddModal}
          className="btn btn-primary text-sm"
        >
          <Plus size={16} className="mr-1" />
          Add Review
        </button>
      </div>
      
      {loading ? (
        <div className="bg-teal-900 rounded-lg p-6 animate-pulse">
          <div className="h-8 bg-teal-800 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-24 bg-teal-800 rounded"></div>
            ))}
          </div>
        </div>
      ) : reviews.length > 0 ? (
        <div className="bg-teal-900 rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-teal-800">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Review</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Rating</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map(review => (
                    <tr 
                      key={review.id}
                      className="border-b border-teal-800/50 hover:bg-teal-800/20"
                    >
                      <td className="py-3 px-4 text-white">{review.name}</td>
                      <td className="py-3 px-4 text-gray-300 max-w-xs truncate">{review.message}</td>
                      <td className="py-3 px-4 text-yellow-400">
                        <div className="flex items-center">
                          {review.rating || 0} <Star size={14} className="ml-1" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          review.approved
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-amber-900/30 text-amber-400'
                        }`}>
                          {review.approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(review)}
                            className="p-1.5 bg-blue-900/30 text-blue-400 rounded-md hover:bg-blue-900/50 transition-colors"
                            title="Edit Review"
                          >
                            <Edit size={16} />
                          </button>
                          {!review.approved && (
                            <button
                              onClick={() => approveReview(review.id)}
                              className="p-1.5 bg-green-900/30 text-green-400 rounded-md hover:bg-green-900/50 transition-colors"
                              title="Approve Review"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteReview(review.id)}
                            className="p-1.5 bg-red-900/30 text-red-400 rounded-md hover:bg-red-900/50 transition-colors"
                            title="Delete Review"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-teal-900 rounded-lg p-8 text-center">
          <div className="mb-4">
            <MessageSquare className="h-16 w-16 text-gray-600 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No reviews yet</h2>
          <p className="text-gray-400 mb-6">
            When customers submit reviews, they will appear here for approval.
          </p>
          <button
            onClick={openAddModal}
            className="btn btn-primary"
          >
            <Plus size={16} className="mr-1" />
            Add First Review
          </button>
        </div>
      )}

      {/* Add/Edit Review Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-teal-900 rounded-lg shadow-lg max-w-md w-full overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-teal-800">
              <h3 className="text-lg font-bold text-white">
                {isEditing ? 'Edit Review' : 'Add New Review'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white transition-colors"
                title="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={isEditing ? handleUpdateReview : handleAddReview} className="p-6">
              <div className="space-y-4">
                {/* Reviewer Name */}
                <div>
                  <label htmlFor="name" className="block text-gray-300 mb-1">
                    Reviewer Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentReview.name}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                
                {/* Review Text */}
                <div>
                  <label htmlFor="message" className="block text-gray-300 mb-1">
                    Review Text
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={currentReview.message}
                    onChange={handleInputChange}
                    className="input-field min-h-[120px]"
                    required
                  />
                </div>
                
                {/* Rating */}
                <div>
                  <label htmlFor="rating" className="block text-gray-300 mb-1">
                    Rating (1-5)
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      id="rating"
                      name="rating"
                      min="1"
                      max="5"
                      value={currentReview.rating}
                      onChange={handleInputChange}
                      className="input-field w-20"
                      required
                    />
                    <div className="flex ml-2 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          fill={i < currentReview.rating ? "currentColor" : "none"} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Approved Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="approved"
                    name="approved"
                    checked={currentReview.approved}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded bg-teal-800 border-teal-600 text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="approved" className="ml-2 text-gray-300">
                    Approve review
                  </label>
                </div>
                
                <div className="flex justify-end mt-6 space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-teal-800 text-white rounded-md hover:bg-teal-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {isEditing ? 'Update Review' : 'Add Review'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;