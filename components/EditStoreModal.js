"use-client";

import React, { useState, useEffect, useCallback } from 'react';
import uploadFileWithPresign from '../utils/uploadFileWithPresign';

// Animation styles are injected via a <style> tag since they can't be inline.
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function EditStoreModal({ open, onClose, store, idx, onSaved }) {
  // Defensive: ensure idx is a valid number to avoid sending bad payloads to API
  const numericIdx = typeof idx === 'number' ? idx : (typeof idx === 'string' && idx.trim() !== '' ? Number(idx) : NaN);
  useEffect(() => {
    if (open && (Number.isNaN(numericIdx) || !Number.isFinite(numericIdx))) {
      alert('Cannot open Edit Store modal: invalid store index. Please try again.');
      onClose && onClose();
    }
  }, [open, numericIdx, onClose]);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);

  // State to manage hover effects for buttons
  const [isCancelHovered, setCancelHovered] = useState(false);
  const [isSaveHovered, setSaveHovered] = useState(false);

  useEffect(() => {
    if (store) {
      setAddress(store.address || '');
      setPhone(store.phone || '');
      setImagePreview(store.imageUrl || null);
    }
    setFile(null);
  }, [store]);

  const handleEscape = useCallback((event) => {
    if (event.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, handleEscape]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!open) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setImagePreview(URL.createObjectURL(selectedFile));
    } else {
      setImagePreview(store?.imageUrl || null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // If the store has a Mongo _id, update via the DB-backed API
      if (store && store._id) {
        let imageUrl = store.imageUrl || store.image || null;

  // If a new file was selected, upload to our server which stores the file in S3
        if (file) {
          const { publicUrl } = await uploadFileWithPresign(file, 'YARITU/store', (pct) => {});
          if (!publicUrl) throw new Error('Upload failed');
          imageUrl = publicUrl;
        }

        const payload = { address, phone };
        if (imageUrl) payload.imageUrl = imageUrl;

        const res = await fetch(`/api/stores/${store._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const j = await res.json().catch(() => null);
        if (res.ok && j?.success) {
          onSaved && onSaved(j.data);
          onClose();
        } else {
          console.error('Update store (DB) failed', j);
          alert('Save failed: ' + (j?.message || 'Unknown'));
        }

      } else {
        // Fallback for file-based admin stores.json flow (keep existing behavior)
        let imageBase64 = null;
        let imageName = null;
        if (file) {
          imageName = file.name;
          const reader = new FileReader();
          const promise = new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
          });
          reader.readAsDataURL(file);
          imageBase64 = await promise;
        }

        const payload = { idx: numericIdx, address, phone, imageBase64, imageName };
        const res = await fetch('/api/admin/stores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const j = await res.json();
        if (j.success) {
          onSaved && onSaved(j.data);
          onClose();
        } else {
          alert('Save failed: ' + (j.message || 'Unknown'));
        }
      }
    } catch (err) {
      console.error(err);
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  // --- Style Objects ---
  
  const styles = {
    backdrop: {
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      animation: 'fadeIn 0.3s ease-out',
    },
    modalContent: {
      position: 'relative',
      width: '100%',
      maxWidth: '520px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideUp 0.3s ease-out',
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: '20px',
      borderBottom: '1px solid #e5e7eb',
    },
    modalTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#111827',
      margin: 0,
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '6px',
      borderRadius: '8px',
      color: '#9ca3af',
      transition: 'background-color 0.2s, color 0.2s',
    },
    modalBody: {
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    formGroup: {
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: 500,
      color: '#374151',
    },
    formInput: {
      display: 'block',
      width: '100%',
      padding: '10px 12px',
      fontSize: '14px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      boxSizing: 'border-box',
    },
    imageUploadContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginTop: '4px',
    },
    imagePreview: {
      width: '80px',
      height: '80px',
      borderRadius: '8px',
      objectFit: 'cover',
      border: '1px solid #e5e7eb',
    },
    uploadButtonLabel: {
      cursor: 'pointer',
      borderRadius: '6px',
      backgroundColor: '#fff',
      padding: '8px 12px',
      fontSize: '14px',
      fontWeight: 500,
      color: '#374151',
      border: '1px solid #d1d5db',
    },
    modalFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      padding: '20px',
      borderTop: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb',
      borderBottomLeftRadius: '12px',
      borderBottomRightRadius: '12px',
    },
    buttonBase: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid transparent',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: 500,
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.2s, opacity 0.2s',
    },
    spinner: {
      border: '3px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '50%',
      borderTopColor: '#fff',
      width: '16px',
      height: '16px',
      animation: 'spin 1s linear infinite',
      marginRight: '8px',
    },
  };
  
  // Dynamic styles that depend on state (hover, disabled)
  const cancelButtonStyle = {
    ...styles.buttonBase,
    backgroundColor: isCancelHovered ? '#f9fafb' : '#fff',
    color: '#374151',
    borderColor: '#d1d5db',
    opacity: saving ? 0.6 : 1,
  };

  const saveButtonStyle = {
    ...styles.buttonBase,
    backgroundColor: saving ? '#93c5fd' : (isSaveHovered ? '#1d4ed8' : '#2563eb'),
    color: '#fff',
    cursor: saving ? 'not-allowed' : 'pointer',
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div style={styles.backdrop} onClick={onClose}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>Edit Store Details</h3>
            <button type="button" onClick={onClose} style={styles.closeButton}>
              <svg style={{ width: 20, height: 20 }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div style={styles.modalBody}>
            <div style={styles.formGroup}>
              <label htmlFor="address" style={styles.label}>Address</label>
              <textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} style={{...styles.formInput, minHeight: 80 }} />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="phone" style={styles.label}>Phone Number</label>
              <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} style={styles.formInput} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Store Image</label>
              <div style={styles.imageUploadContainer}>
                {imagePreview && <img src={imagePreview} alt="Store preview" style={styles.imagePreview} />}
                <label htmlFor="file-upload" style={styles.uploadButtonLabel}>Replace Image</label>
                <input id="file-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
              </div>
            </div>
          </div>

          <div style={styles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              style={cancelButtonStyle}
              onMouseEnter={() => setCancelHovered(true)}
              onMouseLeave={() => setCancelHovered(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={saveButtonStyle}
              onMouseEnter={() => setSaveHovered(true)}
              onMouseLeave={() => setSaveHovered(false)}
            >
              {saving && <div style={styles.spinner}></div>}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}