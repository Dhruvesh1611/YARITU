// import React from "react";
// import '../components/../App.css'
// import Contents from "./Contents.jsx";
// import './Contents.css'

// function Homepage() {
//     return (
//         <>
//             <div className="searchbar">
//                 <div className="search"><p1>search</p1>
//                     <div className="search_icone"><img src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/02.youtube-clone/assets/search.png?raw=true" alt="" /></div>
//                 </div>
//                 <div className="items">
//                     <div className="mic"><img src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/02.youtube-clone/assets/mic.png?raw=true" alt="" /></div>
//                     <div className="create it"><img src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/02.youtube-clone/assets/create.png?raw=true" alt="" /></div>
//                     <div className="find it"><img src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/02.youtube-clone/assets/more.png?raw=true" alt="" /></div>
//                     <div className="bell it"><img src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/02.youtube-clone/assets/bell.png?raw=true" alt="" /></div>
//                     <div className="profile it"><img src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/02.youtube-clone/assets/Ellipse%201%20(6).png?raw=true" alt="" /></div>
//                 </div>
//             </div>
            // <div className="option">
            //     <div className="text3">all</div>
            //     <div className="text1">Coke Studio</div>
            //     <div className="text1">UX</div>
                // <div className="text1">Case Study</div>
                // <div className="text1">Music</div>
                // <div className="text1">Bnagla Lofi</div>
                // <div className="text1">Tour</div>
                // <div className="text1">Saintmartin</div>
                // <div className="text1">Tech</div>
                // <div className="text1">iPhone 13</div>
                // <div className="text1">User Interface Design</div>
                // <div className="text1">Computer</div>
            // </div>
//             {}
//             <Contents/>
//         </>
//     )
// }
// export default Homepage;





//before search priveous change
import React, { useState } from "react";
import '../components/../App.css';
import Contents from "./Contents.jsx";
import './Contents.css';

function Homepage() {
    const [query, setQuery] = useState(""); // State to capture search query
    const [results, setResults] = useState([]); // State to store API results

    // Function to handle search
    const handleSearch = async () => {
        if (!query) return; // Don't search if query is empty

        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=4&q=${query}&key=AIzaSyCNQ4i7icpDnnypNBPtsTGsrk0jyBF-y2Y`);
            const data = await response.json(); // Parse the response as JSON
            setResults(data.items); // Set the search results
        } catch (error) {
            console.error('Error fetching data from YouTube API:', error);
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
                <div className="items">
                    <div className="mic"><img src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/02.youtube-clone/assets/mic.png?raw=true" alt="" /></div>
                    <div className="create it"><img src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/02.youtube-clone/assets/create.png?raw=true" alt="" /></div>
                    <div className="find it"><img src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/02.youtube-clone/assets/more.png?raw=true" alt="" /></div>
                    <div className="bell it"><img src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/02.youtube-clone/assets/bell.png?raw=true" alt="" /></div>
                    <div className="profile it"><img src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/02.youtube-clone/assets/Ellipse%201%20(6).png?raw=true" alt="" /></div>
                </div>
            </div>
            <div className="option">
                <div className="text3">all</div>
                <div className="text1">Coke Studio</div>
                <div className="text1">UX</div>
                <div className="text1">Case Study</div>
                <div className="text1">Music</div>
                <div className="text1">Bnagla Lofi</div>
                <div className="text1">Tour</div>
                <div className="text1">Saintmartin</div>
                <div className="text1">Tech</div>
                <div className="text1">iPhone 13</div>
                <div className="text1">User Interface Design</div>
                <div className="text1">Computer</div>
            </div>
            
            <div className="results">
                {results.map((video) => (
                    <div key={video.id.videoId} className="result-item">
                        <img 
                            src={video.snippet.thumbnails.default.url} 
                            alt={video.snippet.title} 
                            className="video-thumbnail"
                        />
                        <p>{video.snippet.title}</p>
                    </div>
                ))}
            </div>

            <Contents />
        </>
    );
}

export default Homepage;
