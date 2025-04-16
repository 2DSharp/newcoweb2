'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Plus } from 'lucide-react';
import { format } from 'date-fns';
import apiService from '@/services/api';

interface Review {
    id: number;
    productId: string;
    productName: string;
    reviewerId: string;
    reviewerName: string;
    rating: number;
    comment: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

interface ProductRating {
    averageRating: number;
    count: number;
}

interface ReviewsData {
    reviews: Review[];
    canAddReview: boolean;
    productRating: ProductRating;
}

interface ReviewsProps {
    productId: string;
}

export function Reviews({ productId }: ReviewsProps) {
    const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
    const [showAddReview, setShowAddReview] = useState(false);
    const [newReview, setNewReview] = useState({
        rating: 5,
        title: '',
        comment: ''
    });
    const [reviewsError, setReviewsError] = useState<string | null>(null);
    const [addReviewError, setAddReviewError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const fetchReviews = () => {
            apiService.reviews.getProductReviews(productId)
                .then(response => {
                    if (mounted && response.successful) {
                        setReviewsData(response.data);
                        setReviewsError(null);
                    }
                })
                .catch(error => {
                    if (mounted) {
                        console.error('Error fetching reviews:', error);
                        setReviewsError('Failed to load reviews');
                        setReviewsData(null);
                    }
                });
        };

        fetchReviews();

        return () => {
            mounted = false;
        };
    }, [productId]);

    const handleAddReview = () => {
        setAddReviewError(null);
        apiService.reviews.addReview({
            productId,
            ...newReview
        })
            .then(response => {
                if (response.successful) {
                    // Refresh reviews
                    apiService.reviews.getProductReviews(productId)
                        .then(updatedResponse => {
                            if (updatedResponse.successful) {
                                setReviewsData(updatedResponse.data);
                            }
                        });
                    setShowAddReview(false);
                    setNewReview({
                        rating: 5,
                        title: '',
                        comment: ''
                    });
                }
            })
            .catch(error => {
                console.error('Error adding review:', error);
                // Handle both 4xx and 5xx errors
                if (error.response?.data?.message) {
                    // 4xx error with specific message
                    setAddReviewError(error.response.data.message);
                } else {
                    // 5xx error or other unexpected errors
                    setAddReviewError('Something went wrong. Please try again later.');
                }
            });
    };

    if (reviewsError) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600">{reviewsError}</p>
                <Button 
                    variant="outline" 
                    onClick={() => {
                        setReviewsError(null);
                        apiService.reviews.getProductReviews(productId)
                            .then(response => {
                                if (response.successful) {
                                    setReviewsData(response.data);
                                    setReviewsError(null);
                                }
                            });
                    }}
                    className="mt-4"
                >
                    Try Again
                </Button>
            </div>
        );
    }

    if (!reviewsData) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading reviews...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Rating Summary */}
            <div className="flex flex-col md:flex-row gap-8">
                <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900">
                        {reviewsData.productRating.averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center mt-2">
                        {[...Array(5)].map((_, i) => (
                            <Star 
                                key={i} 
                                className={`w-5 h-5 ${
                                    i < Math.floor(reviewsData.productRating.averageRating) 
                                        ? 'fill-current text-yellow-400' 
                                        : i < reviewsData.productRating.averageRating 
                                            ? 'fill-current text-yellow-400 opacity-50' 
                                            : 'text-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                        Based on {reviewsData.productRating.count} reviews
                    </div>
                </div>
                
                {/* Rating Bars */}
                <div className="flex-1 max-w-md">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviewsData.reviews.filter(r => r.rating === rating).length;
                        const percentage = reviewsData.productRating.count > 0 
                            ? (count / reviewsData.productRating.count) * 100 
                            : 0;
                        return (
                            <div key={rating} className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 w-6">{rating}</span>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-yellow-400 rounded-full"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-500 w-8">
                                    {percentage.toFixed(0)}%
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Add Review Button */}
            {reviewsData.canAddReview && !showAddReview && (
                <Button 
                    onClick={() => setShowAddReview(true)}
                    className="flex items-center gap-2 bg-white hover:bg-gray-50"
                    variant="outline"
                >
                    <Plus className="w-4 h-4" />
                    Add a Review
                </Button>
            )}

            {/* Add Review Form */}
            {showAddReview && (
                <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="text-lg font-medium">Write a Review</h4>
                    {addReviewError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{addReviewError}</p>
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Rating</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                                    className="focus:outline-none"
                                >
                                    <Star 
                                        className={`w-6 h-6 ${
                                            rating <= newReview.rating 
                                                ? 'fill-current text-yellow-400' 
                                                : 'text-gray-300'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <Input
                            value={newReview.title}
                            onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Give your review a title"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Comment</label>
                        <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                            className="w-full p-2 border rounded-md min-h-[100px]"
                            placeholder="Share your experience with this product"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleAddReview}>Submit Review</Button>
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setShowAddReview(false);
                                setNewReview({
                                    rating: 5,
                                    title: '',
                                    comment: ''
                                });
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {reviewsData.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={`w-4 h-4 ${
                                            i < review.rating 
                                                ? 'fill-current text-yellow-400' 
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-medium">{review.reviewerName}</span>
                            <span className="text-sm text-gray-500">· {format(new Date(review.createdAt), 'MMM d, yyyy')}</span>
                        </div>
                        <h4 className="text-lg font-medium mb-2">{review.title}</h4>
                        <p className="text-gray-600">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
} 