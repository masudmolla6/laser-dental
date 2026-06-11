import React from 'react';
import useReviewsSecure from '../../../hooks/useReviewsSecure';

const ManageReviews = () => {
    const [reviews, isLoading, refetch, error]=useReviewsSecure();
    return (
        <div>
            <h2>Manage All Reviews.</h2>
        </div>
    );
};

export default ManageReviews;