import React from 'react';
import useVideosSecure from '../../../hooks/useVideosSecure';

const ManageVideos = () => {
    const [videos, isLoading, refetch, error]=useVideosSecure();
    console.log(videos);
    return (
        <div>
            <h2>Manage Your Videos</h2>;
        </div>
    );
};

export default ManageVideos;