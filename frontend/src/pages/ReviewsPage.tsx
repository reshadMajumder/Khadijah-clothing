import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

// Mock Data - Remove when connecting to Firebase
import { mockReviews } from '../data/mockData';

interface Review {
  id: string;
  name: string;
  review_text: string;
  approved: boolean;
}

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    name: '',
    review_text: ''
  });

  // Fetch approved reviews
  useEffect(() => {
    // In a real implementation, fetch from Firebase
    // const fetchReviews = async () => {
    //   try {
    //     const reviewsCollection = collection(db, 'reviews');
    //     const q = query(reviewsCollection, where('approved', '==', true));
    //     const reviewsSnapshot = await getDocs(q);
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

    // Using mock data for now - filter for approved
    setReviews(mockReviews.filter(review => review.approved));
    setLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
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
      //   approved: false,
      //   created_at: serverTimestamp()
      // });
      
      // Reset form
      setNewReview({
        name: '',
        review_text: ''
      });
      
      toast.success('Your review has been submitted for approval. Thank you!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="pt-24 pb-12 bg-teal-950 min-h-screen">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Customer Reviews</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Don't just take our word for it. See what our customers have to say about their experience shopping with Khadijah Women's Fashion.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="grid grid-cols-1 gap-6 animate-pulse">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-teal-900 rounded-lg p-6">
                    <div className="h-4 bg-teal-800 rounded w-1/4 mb-3"></div>
                    <div className="h-4 bg-teal-800 rounded w-full mb-2"></div>
                    <div className="h-4 bg-teal-800 rounded w-full mb-2"></div>
                    <div className="h-4 bg-teal-800 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {reviews.map(review => (
                  <div key={review.id} className="bg-teal-900 rounded-lg p-6">
                    <div className="flex items-start mb-4">
                      <MessageSquare className="h-10 w-10 text-orange-400 mr-4 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-medium text-white">{review.name}</h3>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300">{review.review_text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-teal-900 rounded-lg p-8 text-center">
                <div className="mb-4">
                  <MessageSquare className="h-16 w-16 text-gray-600 mx-auto" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">No reviews yet</h2>
                <p className="text-gray-400">
                  Be the first to share your experience with us!
                </p>
              </div>
            )}
          </div>

          {/* Submit Review Form */}
          <div className="lg:col-span-1">
            <div className="bg-teal-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Share Your Experience</h2>
              <p className="text-gray-300 mb-6 text-sm">
                We value your feedback! Submit your review and help others make informed decisions.
              </p>
              
              <form onSubmit={handleSubmitReview}>
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-gray-300 mb-1 text-sm">
                      Your Name
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
                    <label htmlFor="review_text" className="block text-gray-300 mb-1 text-sm">
                      Your Review
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
                  
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                  >
                    Submit Review
                  </button>
                  
                  <p className="text-xs text-gray-400 mt-4">
                    All reviews are moderated and will be published after approval.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;