import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const JewelryCollection = () => {
  const [designs, setDesigns] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    material: '',
    style: '',
    goldType: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const response = await fetch(' https://shayara-gold.onrender.com/users_design_data');
      if (!response.ok) throw new Error('Failed to fetch designs');
      const data = await response.json();
      setDesigns(data);
    } catch (error) {
      console.error('Error fetching designs:', error);
      setError('Failed to load designs');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      // Append all form data
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      // Append the image file
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      const response = await fetch(' https://shayara-gold.onrender.com/users_design_data', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) throw new Error('Failed to submit design');

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        mobile: '',
        material: '',
        style: '',
        goldType: ''
      });
      setSelectedFile(null);
      setPreviewUrl('');
      
      // Refresh designs
      fetchDesigns();
      
    } catch (error) {
      console.error('Error submitting design:', error);
      setError('Failed to submit design. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ... (previous styles object)

  return (
    <div style={styles.container}>
      {/* ... (previous navbar and breadcrumb code) */}
      
      <div style={styles.mainContent}>
        <h1 style={styles.title}>Customers design</h1>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <div style={styles.grid}>
          {designs.map((design) => (
            <div key={design._id} style={styles.imageContainer}>
              <img
                src={design.imageUrl ? `http://localhost:5003${design.imageUrl}` : "/placeholder.jpg"}
                alt={`Design by ${design.name}`}
                style={styles.image}
              />
            </div>
          ))}
        </div>

        <h2 style={styles.addDesignText}>Add your design</h2>

        <div style={styles.formContainer}>
          <h3 style={styles.formTitle}>Details</h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                style={styles.input}
                required
              />
            </div>
            {/* ... (other form inputs remain the same) ... */}
            
            <div style={styles.formGroup}>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                style={styles.input}
                required
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={styles.previewImage}
                />
              )}
            </div>
            
            <button 
              type="submit" 
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JewelryCollection;