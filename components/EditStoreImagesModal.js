"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import uploadFileWithPresign from '../utils/uploadFileWithPresign';
import Image from 'next/image';
import './EditStoreImagesModal.css'; // Import the new CSS file

export default function EditStoreImagesModal({ store, onClose, onSaved }) {
  const { data: session } = useSession();
  const isAdmin = !!(session?.user?.isAdmin || session?.user?.role === 'admin');
  
  // Only handle a single main image URL
  const [mainImage, setMainImage] = useState(store.imageUrl || '');
  const [uploading, setUploading] = useState(false);
  const [isDirty, setIsDirty] = useState(false); // To track if changes have been made

  // Effect to reset mainImage if store changes or if image is removed externally
  useEffect(() => {
    setMainImage(store.imageUrl || '');
    setIsDirty(false); // Reset dirty state on initial load/store change
  }, [store]);

  if (!isAdmin) return null;

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { publicUrl } = await uploadFileWithPresign(file, 'YARITU/store', (pct) => {});
      if (!publicUrl) throw new Error('Upload failed to return URL');
      setMainImage(publicUrl);
      setIsDirty(true);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setMainImage(''); // Clear the image URL
    setIsDirty(true); // Mark as dirty
  };

  const saveChanges = async () => {
    if (!isDirty && !mainImage) { // If no changes or no image to save
        onClose();
        return;
    }
    
    try {
      const res = await fetch(`/api/stores/${store._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // Update only imageUrl, and clear otherImageUrls if they exist for a single-image setup
        body: JSON.stringify({ imageUrl: mainImage, otherImageUrls: [] }), 
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save store changes.');
      }
      onSaved?.(data.data); // Pass updated store data back
      onClose(); // Close modal on success
    } catch (error) {
      console.error('Save error:', error);
      alert(error.message);
    }
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div className="edit-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="edit-close-button" onClick={onClose}>&times;</button>
        
        <h3 className="edit-modal-title">Edit Main Image: {store.name || store.city}</h3>
        
        <div className="edit-modal-body">
          {/* Current Main Image Display or Upload Area */}
          <div className="image-display-area">
            {mainImage ? (
              <div className="current-image-preview">
                <Image
                  src={mainImage}
                  alt={`Current image for ${store.name || store.city}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority // Good for LCP/SEO
                  unoptimized
                />
                <button className="remove-image-button" onClick={handleRemoveImage}>
                  &times; Remove
                </button>
              </div>
            ) : (
              <label className="image-upload-placeholder">
                {uploading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <span>+ Add Main Image</span>
                    <small>Click to upload (Max 5MB)</small>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files?.[0])}
                  className="hidden-file-input"
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>

        <div className="edit-modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button 
            className="btn btn-primary" 
            onClick={saveChanges} 
            disabled={uploading || !isDirty} // Disable if uploading or no changes
          >
            {uploading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}