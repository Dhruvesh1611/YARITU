"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import uploadFileWithPresign from '../utils/uploadFileWithPresign';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './StayClassy.css';
import SkeletonLoader from './SkeletonLoader';

const collectionImages = [
  '/images/Featured1.png', '/images/Trending1.png', '/images/Featured3.png', '/images/reel2.png', '/images/reel3.png',
  '/images/reel4.png', '/images/reel5.png', '/images/store.png', '/images/offer1.png', '/images/offer2.png',
  '/images/offer3.png', '/images/offer4.png', '/images/offer5.png', '/images/hero1.png', '/images/hero2.png',
  '/images/Featured1.png', '/images/Trending1.png', '/images/Featured3.png', '/images/reel2.png', '/images/reel3.png',
  '/images/reel4.png', '/images/reel5.png', '/images/store.png', '/images/offer1.png', '/images/offer2.png'
];

const StayClassy = () => {
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);
  const gridRef = useRef(null);
  const { data: session } = useSession();
  const isAdmin = !!(session?.user?.isAdmin || session?.user?.role === 'admin');
  const [metadata, setMetadata] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('stayClassyMetadata');
      if (saved) setMetadata(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to read metadata from localStorage', e);
    }
  }, []);

  // Modal State
  const [editingIndex, setEditingIndex] = useState(null);
  const [category, setCategory] = useState('men');
  const [collectionName, setCollectionName] = useState('Koti');
  const [otherCollection, setOtherCollection] = useState('');
  
  // NEW: State for file handling and upload progress
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  const handleFlip = () => setIsFlipped(!isFlipped);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsFlipped(true);
        else setIsFlipped(false);
      },
      { threshold: 0.5 }
    );
    if (gridRef.current) observer.observe(gridRef.current);
    return () => { if (gridRef.current) observer.unobserve(gridRef.current); };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('stayClassyMetadata', JSON.stringify(metadata));
    } catch (e) {
      console.error('Failed to save metadata', e);
    }
  }, [metadata]);

  function openEdit(index) {
    const meta = metadata[index] || {};
    setEditingIndex(index);
  // keep category and collection values as-is; editing modal will only change the image
  setCategory(meta.category || 'men');
  setCollectionName(meta.collectionName || 'Koti');
  setOtherCollection(meta.otherCollection || '');
    
    // NEW: Reset all file and upload states when opening modal
    setFilePreview(meta.imageUrl || null); // Show existing new image if available
    setSelectedFile(null);
    setUploading(false);
    setUploadProgress(0);
    setUploadError(null);
  }

  function closeEdit() {
    setEditingIndex(null);
  }

  // NEW: Handle file selection from input
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      setUploadError(null);
    }
  };

  // Treat absolute http(s) URLs as remote. Legacy Cloudinary env vars were removed
  // during the migration to S3; any existing Cloudinary-hosted URLs are still
  // remote (they start with http(s)).
  const isRemote = (url) => {
    if (!url) return false;
    try {
      if (url.startsWith('http://') || url.startsWith('https://')) return true;
    } catch (e) {}
    return false;
  };

  // UPDATED: Save function is now async to handle uploads
  const saveEdit = async () => {
    let newImageUrl = filePreview; // Start with the current preview URL

    // Step 1: Upload the image to our server (/api/upload -> S3) IF a new file was selected
    if (selectedFile) {
      setUploading(true);
      setUploadProgress(0);
      setUploadError(null);

      try {
        const url = await uploadToS3(selectedFile, setUploadProgress);
        newImageUrl = url; // On success, update the image URL
      } catch (error) {
        console.error(error);
        setUploadError('Image upload failed. Please try again.');
        setUploading(false);
        return; // Stop the save process if upload fails
      }
      setUploading(false);
    }

    // Step 2: Save only the image URL (S3 or legacy remote URL). Keep existing category/collection data intact.
    const existing = metadata[editingIndex] || {};
    const next = {
      ...metadata,
      [editingIndex]: {
        ...existing,
  imageUrl: newImageUrl, // Save the new image URL (S3 or legacy remote)
      },
    };
    setMetadata(next);
    closeEdit();
  };

  // Use shared presign helper for uploads
  const uploadToS3 = async (file, onProgress) => {
    const res = await uploadFileWithPresign(file, 'YARITU/stayclassy', onProgress);
    return res.publicUrl || res.key || null;
  };

  return (
    <section className="stay-classy-section" ref={gridRef}>
      <h2 className="section-title">
        Stay <span className="highlight">Classy</span>
      </h2>
      <div className="stay-classy-grid">
        {Array.from({ length: 25 }).map((_, index) => {
          const meta = metadata[index] || {};
          const displayImage = meta.imageUrl || collectionImages[index];
          return (
            <div key={index} className="flip-card" style={{ position: 'relative' }}>
              <div
                className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}
                style={{ transitionDelay: `${isFlipped ? index * 0.05 : (24 - index) * 0.05}s` }}
                onClick={() => router.push('/collection')}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') router.push('/collection'); }}
              >
                <div className="flip-card-front"></div>
                <div className="flip-card-back">
                  {isRemote(displayImage) ? (
                    <Image
                      src={displayImage}
                      alt={`Collection item ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 20vw, 10vw"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0 }}>
                      <SkeletonLoader style={{ width: '100%', height: '100%' }} />
                    </div>
                  )}
                  {/* meta-badge removed: category and collection info intentionally hidden */}
                </div>
              </div>
              {isAdmin && (
                <button onClick={() => openEdit(index)} style={{ position: 'absolute', right: 8, top: 8, zIndex: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', padding: '6px 8px', borderRadius: 6, cursor: 'pointer' }}>Edit</button>
              )}
            </div>
          );
        })}
      </div>
      <button onClick={handleFlip} className="flip-button">
        {isFlipped ? 'View Logo' : 'View Collection'}
      </button>

      {/* Redesigned Edit Modal with Upload Progress */}
      {editingIndex !== null ? (
        <div className="modalBackdrop" onClick={closeEdit}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3 className="modalTitle">Edit Stay Classy Item</h3>
            <div className="modalBody">
              <div className="imageColumn">
                <div className="imagePreview">
                  <img src={filePreview || collectionImages[editingIndex]} alt="preview" />
                </div>
                <label htmlFor="image-upload" className={`uploadButton ${uploading ? 'disabled' : ''}`}>
                  Choose File
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hiddenFileInput"
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
                {/* NEW: Progress Bar and Error Message */}
                {uploading ? (
                  <div className="progressContainer">
                    <div className="progressBar" style={{ width: `${uploadProgress}%` }}>
                      {uploadProgress > 10 && `${uploadProgress}%`}
                    </div>
                  </div>
                ) : null}
                {uploadError ? <div className="errorMessage">{uploadError}</div> : null}

                <div style={{ marginTop: 12 }}>
                  <div className="actionButtons" style={{ justifyContent: 'space-between' }}>
                    <button onClick={closeEdit} className="btnCancel" disabled={uploading}>Cancel</button>
                    <button onClick={saveEdit} className="btnSave" disabled={uploading}>{uploading ? 'Uploading...' : 'Save'}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        /* Modal Styles */
        .modalBackdrop {
            position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); display: flex;
            align-items: center; justify-content: center; z-index: 100;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .modalContent {
            background: #ffffff; padding: 24px; border-radius: 12px;
            width: auto; max-width: 95%; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        .modalTitle {
            margin: 0 0 20px 0; text-align: center; font-size: 24px; font-weight: 600; color: #333;
        }
        .modalBody { display: flex; gap: 24px; }
        .imageColumn { width: 280px; text-align: center; }
        .imagePreview {
            width: 100%; height: 280px; border-radius: 8px; overflow: hidden;
            background: #f0f0f0; margin-bottom: 12px; border: 2px dashed #ccc;
        }
        .imagePreview img { width: 100%; height: 100%; object-fit: cover; }
        .hiddenFileInput { display: none; }
        .uploadButton {
            display: inline-block; width: 100%; padding: 10px 16px; background-color: #f5f5f5;
            border: 1px solid #ccc; border-radius: 6px; cursor: pointer; transition: background-color 0.2s;
            font-weight: 500;
        }
        .uploadButton.disabled { cursor: not-allowed; background-color: #e0e0e0; opacity: 0.7; }
        .uploadButton:not(.disabled):hover { background-color: #e0e0e0; }
        
        /* NEW: Progress Bar Styles */
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
        .errorMessage { color: #d93025; font-size: 13px; margin-top: 8px; text-align: left; }

        .formColumn { flex: 1; display: flex; flex-direction: column; }
        .formGroup { margin-bottom: 16px; }
        .formGroup label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #444; }
        .formGroup input, .formGroup select {
            width: 100%; padding: 10px 12px; border: 1px solid #ccc; border-radius: 8px;
            font-size: 16px; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .formGroup input:focus, .formGroup select:focus {
            outline: none; border-color: #0070f3; box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
        }
        .actionButtons {
            display: flex; justify-content: flex-end; gap: 12px; margin-top: auto;
            padding-top: 16px; border-top: 1px solid #eee;
        }
        .actionButtons button {
            padding: 10px 20px; font-size: 15px; font-weight: 500; border-radius: 8px;
            border: 1px solid #ccc; cursor: pointer; transition: all 0.2s;
        }
        .btnCancel { background-color: #fff; color: #555; }
        .btnCancel:hover { background-color: #f5f5f5; }
        .btnSave { background-color: #111; color: #fff; border-color: #111; }
        .btnSave:hover { background-color: #333; }
        .actionButtons button:disabled { opacity: 0.6; cursor: not-allowed; }
        
        @media (max-width: 640px) {
            .modalBody { flex-direction: column; }
            .imageColumn { width: 100%; }
            .imagePreview { width: 200px; height: 200px; margin: 0 auto 12px; }
        }
      `}</style>
    </section>
  );
};

export default StayClassy;