import React, { useState, useEffect } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../data/ApiUrl';

interface Review {
  id: string;
  name: string;
  message: string;
  rating: number;
  approved: boolean;
  created_at?: string;
}

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    name: '',
    message: '',
    rating: 5
  });

  const API_URL = `${API_BASE_URL}api/reviews/`;

  // Fetch approved reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        const data = await response.json();
        // Filter for approved reviews only
        const approvedReviews = data.filter((review: Review) => review.approved);
        setReviews(approvedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Could not load reviews');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReview.name.trim() || !newReview.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newReview,
          // Reviews submitted by customers are not approved by default
          approved: false
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit review');
      }
      
      // Reset form
      setNewReview({
        name: '',
        message: '',
        rating: 5
      });
      
      toast.success('Your review has been submitted for approval. Thank you!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    }
  };

  // Render star rating component
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex mt-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className="h-5 w-5" 
            fill={i < rating ? "#f97316" : "none"} 
            color={i < rating ? "#f97316" : "#9ca3af"}
          />
        ))}
      </div>
    );
  };

  // Interactive star rating selector for form
  const StarSelector = () => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(star)}
            className="focus:outline-none"
            aria-label={`Rate ${star} stars`}
          >
            <Star 
              size={24} 
              className="transition-colors" 
              fill={star <= newReview.rating ? "#f97316" : "none"} 
              color={star <= newReview.rating ? "#f97316" : "#9ca3af"}
            />
          </button>
        ))}
      </div>
    );
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
                        <StarRating rating={review.rating || 0} />
                      </div>
                    </div>
                    <p className="text-gray-300">{review.message}</p>
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
                  
                  {/* Rating */}
                  <div>
                    <label htmlFor="rating" className="block text-gray-300 mb-1 text-sm">
                      Your Rating
                    </label>
                    <StarSelector />
                  </div>
                  
                  {/* Review Text */}
                  <div>
                    <label htmlFor="message" className="block text-gray-300 mb-1 text-sm">
                      Your Review
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={newReview.message}
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