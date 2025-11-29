"use client";
import React, { useState, useEffect } from 'react';
import styles from './AddFeaturedModal.module.css';
import uploadFileWithPresign from '../utils/uploadFileWithPresign';

export default function AddFeaturedModal({ onClose, onAdd, isEditing = false, item = null, onUpdate }) {
  const [form, setForm] = useState({ title: '', alt: '', src: '' });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing && item) {
      setForm({
        title: item.title || '',
        alt: item.alt || '',
        src: item.src || ''
      });
    }
  }, [isEditing, item]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { publicUrl } = await uploadFileWithPresign(file, 'YARITU/featured', (pct) => {});
      if (!publicUrl) throw new Error('Upload failed to return URL');
      setForm((p) => ({ ...p, src: publicUrl }));
    } catch (err) {
      console.error(err);
      alert('Upload failed. Please check console for details.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.src) {
        alert("Please upload an image first.");
        return;
    }
    setSaving(true);
    try {
      const url = isEditing ? `/api/featured/${item._id}` : '/api/featured';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      
      if (!res.ok) throw new Error(isEditing ? 'Update failed' : 'Create failed');
      
      const result = await res.json();
      console.log('AddFeaturedModal.handleSubmit -> api result:', result);
      console.log('AddFeaturedModal.handleSubmit -> submitted form:', form);
      
      if (isEditing) {
        if (onUpdate && result.data) onUpdate(result.data);
      } else {
        if (onAdd && result.data) onAdd(result.data);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert('Operation failed. Please check console for details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{isEditing ? 'Edit Featured Image' : 'Add New Featured Image'}</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className={styles.input}
              placeholder="e.g., Bridal Lehenga"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="alt">Alt Text (for SEO)</label>
            <input
              id="alt"
              value={form.alt}
              onChange={(e) => setForm((p) => ({ ...p, alt: e.target.value }))}
              className={styles.input}
              placeholder="e.g., Red silk bridal lehenga choli"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="file-upload">Upload Image</label>
            <input id="file-upload" type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className={styles.fileInput} />
            {uploading && <p className={styles.statusText}>Uploading...</p>}
            {form.src && (
              <div className={styles.previewContainer}>
                <img src={form.src} alt="Uploaded preview" className={styles.previewImage} />
              </div>
            )}
          </div>
          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={saving || uploading}>
              Cancel
            </button>
            <button type="submit" disabled={saving || uploading || !form.src} className={styles.submitButton}>
              {saving ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Image')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}