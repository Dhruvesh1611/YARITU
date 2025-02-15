import React, { useState } from "react";
import '../App.css';
import Contents from "./Content.jsx";
import './Contents.css';

function Homepage() {
    const [query, setQuery] = useState(""); // State to capture search query
    const [results, setResults] = useState([]); // State to store API results
    const [error, setError] = useState(""); // State to store error messages
    const [loading, setLoading] = useState(false); // Loading state

    // Replace YOUR_API_KEY with your actual YouTube API key
    const API_KEY = "AIzaSyCNQ4i7icpDnnypNBPtsTGsrk0jyBF-y2Y"; 

    // Function to handle search
    const handleSearch = async () => {
        if (!query.trim()) {
            setError("Please enter a search term.");
            return;
        }

        setLoading(true);
        setError("");
        setResults([]);

        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(
                    query
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

    return (
        <>
            <div className="searchbar">
                <div className="search">
                    <input
                        type="text"
                        placeholder="Search YouTube"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)} // Update query state on input change
                    />
                    <div className="search_icon" onClick={handleSearch}>
                        <img
                            src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/02.youtube-clone/assets/search.png?raw=true"
                            alt="Search icon"
                        />
                    </div>
                </div>
            </div>

            <div className="results">
                {loading ? (
                    <div className="loading-message">Loading...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : results.length > 0 ? (
                    results.map((video) => (
                        <div key={video.id?.videoId || video.etag} className="result-item">
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
