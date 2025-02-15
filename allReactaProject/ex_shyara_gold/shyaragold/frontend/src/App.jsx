// import React, { useState, useEffect } from 'react';
// import { Search } from 'lucide-react';

// const JewelryCollection = () => {
//   const [designs, setDesigns] = useState([]);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     mobile: '',
//     material: '',
//     style: '',
//     goldType: ''
//   });
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchDesigns();
//   }, []);

//   const fetchDesigns = async () => {
//     try {
//       const response = await fetch('http://localhost:4001/users_design_data');
//       if (!response.ok) throw new Error('Failed to fetch designs');
//       const data = await response.json();
//       setDesigns(data);
//     } catch (error) {
//       console.error('Error fetching designs:', error);
//       setError('Failed to load designs');
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         setError('File size should be less than 5MB');
//         return;
//       }
//       setSelectedFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewUrl(reader.result);
//       };
//       reader.readAsDataURL(file);
//       setError('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const formDataToSend = new FormData();
//       // Append all form data
//       Object.keys(formData).forEach(key => {
//         formDataToSend.append(key, formData[key]);
//       });
//       // Append the image file
//       if (selectedFile) {
//         formDataToSend.append('image', selectedFile);
//       }

//       const response = await fetch('http://localhost:4001/users_design_data', {
//         method: 'POST',
//         body: formDataToSend
//       });

//       if (!response.ok) throw new Error('Failed to submit design');

//       // Reset form after successful submission
//       setFormData({
//         name: '',
//         email: '',
//         mobile: '',
//         material: '',
//         style: '',
//         goldType: ''
//       });
//       setSelectedFile(null);
//       setPreviewUrl('');
      
//       // Refresh designs
//       fetchDesigns();
      
//     } catch (error) {
//       console.error('Error submitting design:', error);
//       setError('Failed to submit design. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ... (previous styles object)

//   return (
//     <div style={styles.container}>
//       {/* ... (previous navbar and breadcrumb code) */}
      
//       <div style={styles.mainContent}>
//         <h1 style={styles.title}>Customers design</h1>

//         {error && <div style={styles.errorMessage}>{error}</div>}

//         <div style={styles.grid}>
//           {designs.map((design) => (
//             <div key={design._id} style={styles.imageContainer}>
//               <img
//                 src={design.imageUrl ? `http://localhost:4001${design.imageUrl}` : "/placeholder.jpg"}
//                 alt={`Design by ${design.name}`}
//                 style={styles.image}
//               />
//             </div>
//           ))}
//         </div>

//         <h2 style={styles.addDesignText}>Add your design</h2>

//         <div style={styles.formContainer}>
//           <h3 style={styles.formTitle}>Details</h3>
//           <form onSubmit={handleSubmit}>
//             <div style={styles.formGroup}>
//               <input 
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 placeholder="Enter your name"
//                 style={styles.input}
//                 required
//               />
//             </div>
//             {/* ... (other form inputs remain the same) ... */}
            
//             <div style={styles.formGroup}>
//               <input
//                 type="file"
//                 onChange={handleFileChange}
//                 accept="image/*"
//                 style={styles.input}
//                 required
//               />
//               {previewUrl && (
//                 <img
//                   src={previewUrl}
//                   alt="Preview"
//                   style={styles.previewImage}
//                 />
//               )}
//             </div>
            
//             <button 
//               type="submit" 
//               style={{
//                 ...styles.submitButton,
//                 opacity: loading ? 0.7 : 1,
//                 cursor: loading ? 'not-allowed' : 'pointer'
//               }}
//               disabled={loading}
//             >
//               {loading ? 'Sending...' : 'Send'}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JewelryCollection;

import React, { useState } from "react";
import './App.css';


const JewelryCollection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    jewelleryType: "",
    category: "",
    imageUrl: "",
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4001/users_design_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("User data added successfully!");
        setError(null);
      } else {
        setError(result.message || "Something went wrong!");
        setSuccessMessage("");
      }
    } catch (err) {
      setError("Error submitting form: " + err.message);
      setSuccessMessage("");
    }
  };

  return (
    <div>
      <h2>Add User Design Data</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="mobileNumber">Mobile Number:</label>
          <input
            type="text"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="jewelleryType">Jewellery Type:</label>
          <input
            type="text"
            id="jewelleryType"
            name="jewelleryType"
            value={formData.jewelleryType}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default JewelryCollection;
