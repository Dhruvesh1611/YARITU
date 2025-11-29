"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import uploadFileWithPresign from '../utils/uploadFileWithPresign';
import { buildGoogleMapsUrl } from '../utils/maps';
import { useSession } from 'next-auth/react';

export default function StoreCard({ store, index, onUpdate, onDelete }) {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for the modal form
  const [formData, setFormData] = useState({
    name: store.name,
    address: store.address,
    imageUrl: store.imageUrl,
    mapQuery: store.mapQuery,
  });

  // State for file handling and upload progress
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [nameRevealed, setNameRevealed] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    const handleResize = (e) => setIsMobile(e.matches);
    handleResize(mediaQuery);
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  const openMap = () => {
    const url = buildGoogleMapsUrl(store?.mapQuery || store?.address || '');
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleClick = () => {
    if (isMobile) {
      if (!nameRevealed) setNameRevealed(true);
      else openMap();
    } else {
      openMap();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      }, { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => { if (cardRef.current) observer.unobserve(cardRef.current); };
  }, []);

  const handleEditClick = (e) => {
    e.stopPropagation();
    // Reset form to the original store data when opening
    setFormData({
      name: store.name,
      address: store.address,
      imageUrl: store.imageUrl,
      mapQuery: store.mapQuery,
    });
    // Reset file states
    setSelectedFile(null);
    setUploadError(null);
    setUploadProgress(0);
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
      setUploadError(null);
    }
  };

  const uploadToS3 = async (file, onProgress, folder = 'YARITU/store') => {
    const result = await uploadFileWithPresign(file, folder, onProgress);
    return result.publicUrl || result.key || null;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let finalData = { ...formData };

    if (selectedFile) {
      setUploading(true);
      try {
  const newImageUrl = await uploadToS3(selectedFile, setUploadProgress);
        finalData.imageUrl = newImageUrl;
      } catch (err) {
        console.error(err);
        setUploadError('Image upload failed. Please try again.');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    try {
      const res = await fetch(`/api/stores/${store._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });
      if (!res.ok) throw new Error('Failed to update store');
      const updated = (await res.json()).data;
      if (onUpdate) onUpdate(updated);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Failed to save. See console for details.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this store? This cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/stores/${store._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      if (onDelete) onDelete(store._id);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to delete store.');
    } finally {
      setDeleting(false);
    }
  };

  // Render store name with explicit break opportunities after commas and spaces
  const renderWrappedName = (name) => {
    if (!name) return null;
    // Split and keep separators (spaces and commas)
    const parts = name.split(/(\s+|,)/g);
    return parts.map((p, idx) => {
      if (p === ',') return <React.Fragment key={idx}>,<wbr/></React.Fragment>;
      // keep whitespace as-is so browser can wrap on spaces
      if (/^\s+$/.test(p)) return p;
      return <React.Fragment key={idx}>{p}</React.Fragment>;
    });
  };

  return (
    <>
      <div
        ref={cardRef}
        className={`home-store-card ${isVisible ? 'animate-in' : ''} ${nameRevealed ? 'name-revealed' : ''}`}
        style={{ transitionDelay: `${index * 30}ms`, cursor: 'pointer' }}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      >
        {session && (
          <button onClick={handleEditClick} className="edit-store-button">
            Edit
          </button>
        )}
        <div className="store-image">
          <Image src={store.imageUrl || "/images/store_1.png"} alt={store.name} fill sizes="(max-width: 768px) 100vw, 300px" style={{ objectFit: 'cover' }} loading="lazy" />
        </div>
        <div className="store-name-overlay">
          <span className="store-name-text">{renderWrappedName(store.name)}</span>
        </div>
      </div>

      {isModalOpen && (
        <div className="modalBackdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3 className="modalTitle">Edit Store</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="modalBody">
                <div className="formColumn">
                  <div className="formGroup">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} required />
                  </div>
                  <div className="formGroup">
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" name="address" value={formData.address} onChange={handleFormChange} required />
                  </div>
                  <div className="formGroup">
                    <label htmlFor="mapQuery">Map Query</label>
                    <input type="text" id="mapQuery" name="mapQuery" value={formData.mapQuery} onChange={handleFormChange} />
                  </div>
                </div>

                <div className="imageColumn">
                  <label>Store Image</label>
                  <div className="imagePreview">
                    {formData.imageUrl ? <img src={formData.imageUrl} alt="Store preview" /> : <span>No Image</span>}
                  </div>
                  <label htmlFor="image-upload" className={`uploadButton ${uploading ? 'disabled' : ''}`}>
                    Choose File
                  </label>
                  <input id="image-upload" type="file" accept="image/*" className="hiddenFileInput" onChange={handleFileSelect} disabled={uploading} />
                  {uploading && (
                    <div className="progressContainer">
                      <div className="progressBar" style={{ width: `${uploadProgress}%` }}>
                        {uploadProgress > 10 && `${uploadProgress}%`}
                      </div>
                    </div>
                  )}
                  {uploadError && <div className="errorMessage">{uploadError}</div>}
                </div>
              </div>
              <div className="modalFooter">
                <div className="deleteButtonContainer">
                   <button type="button" onClick={handleDelete} className="btnDelete" disabled={deleting || uploading}>
                    {deleting ? 'Deleting...' : 'Delete Store'}
                  </button>
                </div>
                <div className="actionButtons">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btnCancel" disabled={deleting || uploading}>
                    Cancel
                  </button>
                  <button type="submit" className="btnSave" disabled={deleting || uploading}>
                    {uploading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Styles for the Store Card itself */
        .edit-store-button {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 10;
          background-color: rgba(255, 255, 255, 0.9);
          color: #333;
          border: 1px solid #ddd;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        .edit-store-button:hover {
          background-color: white;
        }
        .store-image {
          position: absolute;
          inset: 0;
        }
        .store-name-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
        }

        /* Styles for the MODAL */
        .modalBackdrop {
            position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); display: flex;
            align-items: center; justify-content: center; z-index: 1000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .modalContent {
            background: #ffffff; padding: 24px; border-radius: 12px;
            width: 800px; max-width: 95%; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        .modalTitle {
            margin: 0 0 20px 0; text-align: center; font-size: 24px; font-weight: 600; color: #333;
        }
        .modalBody { display: flex; gap: 24px; }
        .formColumn { flex: 1; }
        .imageColumn { width: 300px; }
        .imageColumn label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #444; }
        .formGroup { margin-bottom: 16px; }
        .formGroup label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #444; }
        .formGroup input {
            width: 100%; padding: 10px 12px; border: 1px solid #ccc; border-radius: 8px;
            font-size: 16px; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .formGroup input:focus {
            outline: none; border-color: #0070f3; box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
        }
        .imagePreview {
            width: 100%; height: 200px; border-radius: 8px; overflow: hidden;
            background: #f0f0f0; margin-bottom: 12px; border: 2px dashed #ccc;
            display: flex; align-items: center; justify-content: center; color: #888;
        }
        .imagePreview img { width: 100%; height: 100%; object-fit: cover; }
        .hiddenFileInput { display: none; }
        .uploadButton {
            display: inline-block; width: 100%; padding: 10px 16px; background-color: #f5f5f5;
            border: 1px solid #ccc; border-radius: 6px; cursor: pointer; transition: background-color 0.2s;
            font-weight: 500; box-sizing: border-box; text-align: center;
        }
        .uploadButton.disabled { cursor: not-allowed; background-color: #e0e0e0; opacity: 0.7; }
        .uploadButton:not(.disabled):hover { background-color: #e0e0e0; }
        .progressContainer {
            width: 100%; background-color: #e0e0e0; border-radius: 4px;
            margin-top: 12px; height: 20px; overflow: hidden;
        }
        .progressBar {
            height: 100%; background-color: #0070f3; color: white;
            display: flex; align-items: center; justify-content: center;
            font-size: 12px; font-weight: bold;
            transition: width 0.3s ease-in-out;
        }
        .errorMessage { color: #d93025; font-size: 13px; margin-top: 8px; }
        
        .modalFooter {
            display: flex; justify-content: space-between; align-items: center;
            margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee;
        }
        .actionButtons { display: flex; gap: 12px; }
        .actionButtons button, .btnDelete {
            padding: 10px 20px; font-size: 15px; font-weight: 500; border-radius: 8px;
            border: 1px solid #ccc; cursor: pointer; transition: all 0.2s;
        }
        .btnCancel { background-color: #fff; color: #555; }
        .btnCancel:hover { background-color: #f5f5f5; }
        .btnSave { background-color: #111; color: #fff; border-color: #111; }
        .btnSave:hover { background-color: #333; }
        .btnDelete {
            background-color: transparent; color: #b91c1c; border-color: transparent;
        }
        .btnDelete:hover {
            background-color: #fee2e2;
        }
        .actionButtons button:disabled, .btnDelete:disabled { opacity: 0.6; cursor: not-allowed; }

        @media (max-width: 768px) {
            .modalBody { flex-direction: column-reverse; }
            .imageColumn { width: 100%; }
            .imagePreview { width: 250px; height: 180px; margin: 0 auto 12px; }
        }
      `}</style>
    </>
  );
}