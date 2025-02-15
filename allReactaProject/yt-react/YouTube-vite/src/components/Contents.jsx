import React, { useEffect, useState } from "react";
import './Contents.css';

function Contents() {
    const [data, setData] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null); // State to track selected video for larger view

    useEffect(() => {
        fetch("https://youtube-api-jytp.onrender.com/data")
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => console.log("Error fetching data:", error));
    }, []);

    // Function to handle video click and open it in a larger view
    const handleVideoClick = (videoId) => {
        setSelectedVideo(videoId); // Set the selected video ID
    };

    // Function to close the video player
    const closePlayer = () => {
        setSelectedVideo(null); // Reset the selected video ID to close the player
    };

    return (
        <div className="feed">
            {selectedVideo ? (
                <div className="video-player">
                    <button className="close-button" onClick={closePlayer}>
                        Close
                    </button>
                    <iframe
                        width="100%"
                        height="600px"
                        src={`https://www.youtube.com/embed/${selectedVideo}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            ) : (
                data.map((feed) => (
                    <div key={feed.id} className="video" onClick={() => handleVideoClick(feed.videoId)}>
                        <img src={feed.img_url} alt={feed.title} className="Video-thumb" />
                        <div className="Channel">
                            <div>
                                <img src={feed.channel} alt="Channel logo" />
                            </div>
                            <div>
                                <p className="title">{feed.title}</p>
                                <p className="info">{feed.description}</p>
                                <p className="info">{feed.views}</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Contents;
