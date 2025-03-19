import React from "react";

const ResumeDownload = ({ profileId }) => {
  return (
    <a href={`http://localhost:5000/api/resume/${profileId}`} download>
      <button>Download Resume</button>
    </a>
  );
};

export default ResumeDownload;
