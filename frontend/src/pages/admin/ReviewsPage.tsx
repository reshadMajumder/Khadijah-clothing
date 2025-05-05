import React, { useState, useEffect } from 'react';
import { Check, Trash2, Plus, MessageSquare } from 'lucide-react';
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import toast from 'react-hot-toast';

// Mock Data - Remove when connecting to Firebase
import { mockReviews } from '../../data/mockData';

interface Review {
  id: string;
  name: string;
  review_text: string;
  approved: boolean;
}

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    review_text: '',
    approved: true
  });

  // Fetch reviews
  useEffect(() => {
    // In a real implementation, fetch from Firebase
    // const fetchReviews = async () => {
    //   try {
    //     const reviewsCollection = collection(db, 'reviews');
    //     const reviewsSnapshot = await getDocs(reviewsCollection);
    //     const reviewsList = reviewsSnapshot.docs.map(doc => ({
    //       id: doc.id,
    //       ...doc.data()
    //     })) as Review[];
    //     setReviews(reviewsList);
    //   } catch (error) {
    //     console.error('Error fetching reviews:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchReviews();

    // Using mock data for now
    setReviews(mockReviews);
    setLoading(false);
  }, []);

  const approveReview = async (reviewId: string) => {
    try {
      // In a real implementation, update in Firebase
      // await updateDoc(doc(db, 'reviews', reviewId), {
      //   approved: true
      // });
      
      // Update locally for demo
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
      // In a real implementation, delete from Firebase
      // await deleteDoc(doc(db, 'reviews', reviewId));
      
      // Remove locally for demo
      setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
      
      toast.success('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: value }));
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReview.name.trim() || !newReview.review_text.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      // In a real implementation, add to Firebase
      // const docRef = await addDoc(collection(db, 'reviews'), {
      //   name: newReview.name,
      //   review_text: newReview.review_text,
      //   approved: newReview.approved,
      //   created_at: serverTimestamp()
      // });
      
      // Add locally for demo
      const newId = `review${reviews.length + 1}`;
      const reviewToAdd = {
        id: newId,
        name: newReview.name,
        review_text: newReview.review_text,
        approved: newReview.approved
      };
      
      setReviews(prevReviews => [...prevReviews, reviewToAdd]);
      
      // Reset form and close modal
      setNewReview({
        name: '',
        review_text: '',
        approved: true
      });
      setShowAddModal(false);
      
      toast.success('Review added successfully');
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Failed to add review');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Reviews</h1>
        <button
          onClick={() => setShowAddModal(true)}
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
                      <td className="py-3 px-4 text-gray-300 max-w-xs truncate">{review.review_text}</td>
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
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <Plus size={16} className="mr-1" />
            Add First Review
          </button>
        </div>
      )}

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-teal-900 rounded-lg shadow-lg max-w-md w-full overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-teal-800">
              <h3 className="text-lg font-bold text-white">Add New Review</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddReview} className="p-6">
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
                    value={newReview.name}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                
                {/* Review Text */}
                <div>
                  <label htmlFor="review_text" className="block text-gray-300 mb-1">
                    Review Text
                  </label>
                  <textarea
                    id="review_text"
                    name="review_text"
                    value={newReview.review_text}
                    onChange={handleInputChange}
                    className="input-field min-h-[120px]"
                    required
                  />
                </div>
                
                {/* Approved Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="approved"
                    name="approved"
                    checked={newReview.approved}
                    onChange={(e) => setNewReview(prev => ({ ...prev, approved: e.target.checked }))}
                    className="h-4 w-4 rounded bg-teal-800 border-teal-600 text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="approved" className="ml-2 text-gray-300">
                    Approve immediately
                  </label>
                </div>
                
                <div className="flex justify-end mt-6 space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-teal-800 text-white rounded-md hover:bg-teal-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Add Review
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