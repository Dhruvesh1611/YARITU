import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileCard = ({ name, skills, profileId }) => {
  const navigate = useNavigate();

  return (
    <div className="profile-card" onClick={() => navigate(`/profile/${profileId}`)}>
      <h3>{name}</h3>
      <p>Skills: {skills}</p>
    </div>
  );
};

export default ProfileCard;
