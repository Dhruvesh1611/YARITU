import React, { useState } from "react";
import '../App.css';
import Contents from "./Contents.jsx";
import './Contents.css';

function Homepage() {
    const [query, setQuery] = useState(""); // State to capture search query
    const [results, setResults] = useState([]); // State to store API results
    const [error, setError] = useState(""); // State to store error messages
    const [loading, setLoading] = useState(false); // Loading state
    const [selectedVideo, setSelectedVideo] = useState(null); // State to store the selected video ID
    const [selectedCategory, setSelectedCategory] = useState(""); // State to store selected category

    const API_KEY = "AIzaSyCNQ4i7icpDnnypNBPtsTGsrk0jyBF-y2Y"; 

    const handleSearch = async (category = "") => {
        const searchQuery = category || query.trim(); // Use category if provided, else use query

        if (!searchQuery) {
            setError("Please enter a search term or select a category.");
            return;
        }

        setLoading(true);
        setError("");
        setResults([]);

        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(
                    searchQuery
                )}&key=${API_KEY}`
            );

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setResults(data.items || []); // Safeguard for undefined items
        } catch (err) {
            console.error("Error fetching data from YouTube API:", err);
            setError("Failed to fetch results. Please check your API key or try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleVideoClick = (videoId) => {
        setSelectedVideo(videoId); // Set the videoId of the selected video
    };

    const handleCloseVideo = () => {
        setSelectedVideo(null); // Reset the selected video
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category); // Set the selected category
        handleSearch(category); // Fetch videos for the selected category
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch(); // Trigger search when Enter is pressed
        }
    };

    return (
        <>
            <div className="searchbar">
                <div className="search">
                    <input
                        type="text"
                        placeholder="Search YouTube"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)} // Update query state on input change
                        onKeyDown={handleKeyDown} // Trigger search on Enter key
                    />
                    <div className="search_icon" onClick={() => handleSearch()}>
                        <img
                            src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/02.youtube-clone/assets/search.png?raw=true"
                            alt="Search icon"
                        />
                    </div>
                </div>
            </div>
            <div className="option">
                {["Coke Studio", "UX", "Case Study", "Music", "Bangla Lofi", "Tour", "Saintmartin", "Tech", "iPhone 13", "User Interface Design", "Computer"].map((category) => (
                    <div
                        key={category}
                        className={`text1 ${selectedCategory === category ? "active" : ""}`}
                        onClick={() => handleCategoryClick(category)} // Handle category button click
                    >
                        {category}
                    </div>
                ))}
            </div>

            <div className="results">
                {loading ? (
                    <div className="loading-message">Loading...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : selectedVideo ? (
                    <div className="video-player">
                        <iframe
                            width="100%"
                            height="600px"
                            src={`https://www.youtube.com/embed/${selectedVideo}`} // Embed the selected video
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        <button className="close-video" onClick={handleCloseVideo}>Close</button>
                    </div>
                ) : results.length > 0 ? (
                    results.map((video) => (
                        <div key={video.id?.videoId || video.etag} className="result-item" onClick={() => handleVideoClick(video.id.videoId)}>
                            <img
                                src={video.snippet?.thumbnails?.medium?.url || ""}
                                alt={video.snippet?.title || "No title"}
                                className="video-thumbnail"
                            />
                            <p>{video.snippet?.title || "No title available"}</p>
                        </div>
                    ))
                ) : (
                    <Contents />
                )}
            </div>
        </>
    );
}

export default Homepage;
