"use client";

import { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/20/solid"; 

type Review = {
  id: string;
  reviewer_name: string;
  rating: number; // 1-5
  comment: string;
  created_at: string;
};

export default function ReviewsSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 6; 

  // Form State
  const [newReview, setNewReview] = useState({ name: "", rating: 0, comment: "" });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // 1. Fetch Reviews (Handles Initial Load & Show More)
  useEffect(() => {
    async function fetchReviews() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        const res = await fetch(`${baseUrl}/api/v1/kits/${productId}/reviews?skip=${offset}&limit=${LIMIT}`);
        
        if (res.ok) {
          const data = await res.json();
          
          if (data.length < LIMIT) {
            setHasMore(false);
          }

          setReviews((prev) => {
            // ✅ FIX: Deduplication Logic
            // If offset is 0, we are resetting the list (fresh load)
            if (offset === 0) return data;
            
            // Otherwise, filtering out duplicates before appending
            const existingIds = new Set(prev.map(r => r.id));
            const uniqueNewReviews = data.filter((r: Review) => !existingIds.has(r.id));
            
            return [...prev, ...uniqueNewReviews];
          });
        }
      } catch (err) {
        console.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    }
    
    if (productId) fetchReviews();
  }, [productId, offset]);

  // 2. Handle "Show More" Click
  const handleShowMore = () => {
    setOffset((prev) => prev + LIMIT);
  };

  // 3. Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newReview.rating === 0) {
      setMessage("Please select a star rating.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/api/v1/kits/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewer_name: newReview.name,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to post review");
      }

      const savedReview = await res.json();
      
      // Add to TOP of list immediately, but check for duplicates just in case
      setReviews((prev) => {
        if (prev.some(r => r.id === savedReview.id)) return prev;
        return [savedReview, ...prev];
      });
      
      setNewReview({ name: "", rating: 0, comment: "" }); 
      setHoverRating(0); 
      setMessage("Review submitted successfully!");
      
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 border-t border-gray-200 pt-10">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customer Reviews</h2>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        
        {/* LEFT COLUMN: Review List */}
        <div className="flex flex-col h-full">
          {loading && reviews.length === 0 ? (
            <p className="text-gray-500">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
          ) : (
            <>
              <div className="space-y-6 flex-grow">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 animate-fadeIn">
                    <div className="flex items-center mb-2">
                      <div className="flex text-[#FBBF24]"> 
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon 
                            key={star} 
                            className={`h-4 w-4 ${star <= review.rating ? "text-[#FBBF24]" : "text-[#D1D5DB]"}`} 
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900">{review.reviewer_name}</span>
                      <span className="ml-2 text-sm text-gray-500">• {new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>

              {/* Show More Button */}
              {hasMore && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleShowMore}
                    className="text-sm font-semibold text-blue hover:text-dark hover:underline transition-colors"
                  >
                    Show More Reviews
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT COLUMN: Add Review Form */}
        <div className="bg-gray-50 p-6 rounded-2xl h-fit lg:sticky lg:top-24">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Interactive Star Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div 
                className="flex gap-1"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    onMouseEnter={() => setHoverRating(star)}
                    className="focus:outline-none p-1 transition-transform hover:scale-110"
                  >
                    <StarIcon 
                      className={`h-8 w-8 pointer-events-none transition-colors duration-150 ${
                        star <= (hoverRating || newReview.rating) 
                          ? "text-[#FBBF24] fill-current" 
                          : "text-[#D1D5DB] fill-current"
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue focus:ring-blue sm:text-sm p-2 border"
                placeholder="John Doe"
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
              />
            </div>

            {/* Comment Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Review</label>
              <textarea
                required
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue focus:ring-blue sm:text-sm p-2 border"
                placeholder="What did you like or dislike?"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue hover:bg-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>

            {message && (
              <p className={`text-sm text-center mt-2 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}