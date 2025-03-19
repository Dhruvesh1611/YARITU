import { useState } from "react";
import axios from "axios";

function EditProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/api/edit-profile", formData) // Replace with actual API
      .then((response) => alert("Profile updated successfully!"))
      .catch((error) => alert("Error updating profile"));
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <textarea name="bio" placeholder="Bio" onChange={handleChange} required></textarea>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditProfile;
