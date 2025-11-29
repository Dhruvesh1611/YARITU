"use client";

import React, { useState } from 'react';
import uploadFileWithPresign from '../utils/uploadFileWithPresign';

export default function AddStoreModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({ name: '', address: '', imageUrl: '', mapQuery: '' });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const { publicUrl } = await uploadFileWithPresign(file, 'YARITU/store', (pct) => {});
      if (!publicUrl) throw new Error('Upload did not return a URL');
      setFormData((prev) => ({ ...prev, imageUrl: publicUrl }));
    } catch (err) {
      console.error('Image upload error', err);
      setUploadError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.imageUrl) {
      alert('Please fill in the store name, address, and upload an image.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to create store');
      const json = await res.json().catch(() => null);
      if (onAdd && json?.data) onAdd(json.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="modalBackdrop" onClick={onClose}>
        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
          <h2 className="modalTitle">Add New Store</h2>
          <form onSubmit={handleSubmit}>
            <div className="formGrid">
              <div className="formGroup">
                <label htmlFor="store-name">Name</label>
                <input
                  id="store-name"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g., YARITU Flagship Store"
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="store-address">Address</label>
                <input
                  id="store-address"
                  value={formData.address}
                  onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                  placeholder="e.g., 123 Fashion St, Mumbai"
                  required
                />
              </div>
              
              <div className="formGroup">
                <label htmlFor="map-query">Google Maps Query</label>
                <input
                  id="map-query"
                  value={formData.mapQuery}
                  onChange={(e) => setFormData((p) => ({ ...p, mapQuery: e.target.value }))}
                  placeholder="Search query for Google Maps link"
                />
              </div>

              <div className="formGroup">
                <label>Store Image</label>
                <div className="imageUploadArea">
                  {formData.imageUrl ? (
                    <div className="imagePreview">
                      <img src={formData.imageUrl} alt="Store preview" />
                    </div>
                  ) : (
                    <div className="uploadPlaceholder">
                      <span>📷</span>
                      <p>Image will appear here</p>
                    </div>
                  )}
                  <div className="uploadActions">
                    <label htmlFor="image-upload" className="uploadButton">
                      {uploading ? 'Uploading...' : 'Choose File'}
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hiddenFileInput"
                    />
                    {uploadError && <div className="errorMessage">{uploadError}</div>}
                  </div>
                </div>
              </div>
            </div>

            <div className="actionButtons">
              <button type="button" onClick={onClose} className="btnCancel" disabled={saving}>
                Cancel
              </button>
              <button type="submit" disabled={saving || uploading} className="btnSave">
                {saving ? 'Saving...' : 'Add Store'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .modalBackdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .modalContent {
            background: #ffffff;
            padding: 24px;
            border-radius: 12px;
            width: 600px;
            max-width: 95%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            max-height: 90vh;
            overflow-y: auto;
        }
        .modalTitle {
            margin: 0 0 20px 0;
            text-align: center;
            font-size: 24px;
            font-weight: 600;
            color: #333;
        }
        .formGrid {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .formGroup {
            display: flex;
            flex-direction: column;
        }
        .formGroup label {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
            color: #444;
        }
        .formGroup input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .formGroup input:focus {
            outline: none;
            border-color: #0070f3;
            box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
        }
        .imageUploadArea {
            display: flex;
            gap: 16px;
            align-items: flex-start;
        }
        .imagePreview, .uploadPlaceholder {
            flex: 0 0 180px;
            height: 120px;
            border-radius: 8px;
            background-color: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border: 2px dashed #ccc;
        }
        .imagePreview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .uploadPlaceholder {
            flex-direction: column;
            color: #888;
            text-align: center;
        }
        .uploadPlaceholder span {
            font-size: 24px;
        }
        .uploadPlaceholder p {
            font-size: 12px;
            margin: 4px 0 0;
        }
        .uploadActions {
            flex: 1;
        }
        .hiddenFileInput {
            display: none;
        }
        .uploadButton {
            display: inline-block;
            padding: 10px 16px;
            background-color: #f5f5f5;
            border: 1px solid #ccc;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .uploadButton:hover {
            background-color: #e0e0e0;
        }
        .errorMessage {
            color: #d93025;
            font-size: 13px;
            margin-top: 8px;
        }
        .actionButtons {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #eee;
        }
        .actionButtons button {
            padding: 10px 20px;
            font-size: 15px;
            font-weight: 500;
            border-radius: 8px;
            border: 1px solid #ccc;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btnCancel {
            background-color: #fff;
            color: #555;
        }
        .btnCancel:hover {
            background-color: #f5f5f5;
        }
        .btnSave {
            background-color: #111;
            color: #fff;
            border-color: #111;
        }
        .btnSave:hover {
            background-color: #333;
        }
        .actionButtons button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
      `}</style>
    </>
  );
}