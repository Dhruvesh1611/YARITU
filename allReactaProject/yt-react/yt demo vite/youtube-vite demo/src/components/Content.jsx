import React, { useEffect, useState } from "react";
import './Contents.css';

function Contents() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("https://youtube-api-jytp.onrender.com/data")
            .then((response) => response.json())
            .then((data) => setData(data)) 
            .catch((error) => console.log("Error fetching data:", error));
    }, []); 

    return (
            <div className="feed">
                {data.map((feed) => (
                    <div key={feed.id} className="video">
                        <img src={feed.img_url} alt={feed.title} className="Video-thumb" />
                        <div className='Channel'>
                            
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
                ))}
            </div>
    );
}

console.log("Contents component loaded");
export default function Contents() {
  return <div>Contents Component</div>;
}
