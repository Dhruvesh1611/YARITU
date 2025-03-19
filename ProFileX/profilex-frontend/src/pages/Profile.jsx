import { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("/api/user") // Replace with actual API
      .then((response) => setUser(response.data))
      .catch((error) => console.error("Error fetching user:", error));
  }, []);

  return (
    <div>
      <h1>User Profile</h1>
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Bio:</strong> {user.bio}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}

export default Profile;
