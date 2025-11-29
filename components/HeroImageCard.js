"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function HeroImageCard({ item, onUpdate, onDelete }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ title: item.title || '', imageUrl: item.imageUrl, link: item.link || '', visibility: item.visibility || 'both' });
  
  // State for upload and delete processes
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      const secureUrl = await uploadToS3(file, setUploadProgress);
      setForm((p) => ({ ...p, imageUrl: secureUrl }));
    } catch (err) {
      console.error(err);
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const uploadToS3 = (file, onProgress) => {
    return new Promise(async (resolve, reject) => {
      try {
        // 1) Request a presigned URL and key from the server
        const presignRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: file.name, folder: 'YARITU/hero', contentType: file.type }),
        });

        if (!presignRes.ok) {
          const errBody = await presignRes.json().catch(() => ({}));
          return reject(new Error(errBody.error || 'Failed to get presigned URL'));
        }

        const { signedUrl, key } = await presignRes.json();

        if (!signedUrl || !key) return reject(new Error('Presign response missing signedUrl or key'));

        // 2) Upload file directly to S3 using PUT to the presigned URL so we can track progress
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signedUrl, true);
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && typeof onProgress === 'function') {
            onProgress(Math.round((event.loaded * 100) / event.total));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            // Construct a public URL for the uploaded object. Adjust if you use a custom domain or CloudFront.
            const bucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;
            const region = process.env.NEXT_PUBLIC_AWS_REGION;
            const publicUrl = bucket && region
              ? `https://${bucket}.s3.${region}.amazonaws.com/${key}`
              : `/${key}`; // fallback: return key so server can construct URL

            resolve(publicUrl);
          } else {
            reject(new Error('S3 upload failed'));
          }
        };

        xhr.onerror = () => reject(new Error('Network error during S3 upload'));
        xhr.send(file);
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/hero/${item._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Save failed');
      const updated = (await res.json()).data;
      if (onUpdate) onUpdate(updated);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this hero image?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/hero/${item._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      const deleted = (await res.json()).data;
      if (onDelete && deleted) onDelete(deleted._id);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="hero-card-container">
        <Image src={item.imageUrl} alt={item.title || 'hero'} fill sizes="(max-width: 480px) 100vw, 300px" className="hero-card-image" />
        {session && (
          <button onClick={() => setIsOpen(true)} className="edit-button">Edit</button>
        )}
      </div>

      {isOpen && (
        <div className="modalBackdrop" onClick={() => setIsOpen(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3 className="modalTitle">Edit Hero Image</h3>
            <form onSubmit={handleSave}>
              <div className="formGroup">
                <label htmlFor="title">Title</label>
                <input id="title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="formGroup">
                <label htmlFor="link">Link (optional)</label>
                <input id="link" value={form.link} onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))} />
              </div>
              <div className="formGroup">
                <label>Image</label>
                <div className="imagePreview">
                  {form.imageUrl ? <img src={form.imageUrl} alt="preview" /> : <span>No Image</span>}
                </div>
                <label htmlFor="image-upload" className={`uploadButton ${uploading ? 'disabled' : ''}`}>
                  Choose New Image
                </label>
                <input id="image-upload" type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hiddenFileInput" />
                {uploading && (
                  <div className="progressContainer">
                    <div className="progressBar" style={{ width: `${uploadProgress}%` }}>
                      {uploadProgress > 10 && `${uploadProgress}%`}
                    </div>
                  </div>
                )}
                {uploadError && <div className="errorMessage">{uploadError}</div>}
              </div>
              <div className="formGroup">
                <label htmlFor="visibility">Visibility</label>
                <select id="visibility" value={form.visibility} onChange={(e) => setForm((p) => ({ ...p, visibility: e.target.value }))}>
                  <option value="both">Both (Desktop & Mobile)</option>
                  <option value="desktop">Desktop only</option>
                  <option value="mobile">Mobile only</option>
                </select>
              </div>
              <div className="modalFooter">
                 <button type="button" onClick={handleDelete} className="btnDelete" disabled={deleting || uploading}>
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                <div className="actionButtons">
                  <button type="button" onClick={() => setIsOpen(false)} className="btnCancel" disabled={uploading}>Close</button>
                  <button type="submit" className="btnSave" disabled={uploading}>Save</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .hero-card-container {
            position: relative;
            width: 300px;
            height: 160px;
            margin: 8px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .hero-card-image {
            object-fit: cover;
        }
        .edit-button {
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 6px 10px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
        }
        .edit-button:hover {
            background: white;
            transform: scale(1.05);
        }

        /* Modal Styles */
        .modalBackdrop {
            position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); display: flex;
            align-items: center; justify-content: center; z-index: 1000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .modalContent {
            background: #ffffff; padding: 24px; border-radius: 12px;
            width: 540px; max-width: 95%; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        .modalTitle {
            margin: 0 0 20px 0; text-align: center; font-size: 24px; font-weight: 600; color: #333;
        }
        .formGroup {
            margin-bottom: 16px;
        }
        .formGroup label {
            display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #444;
        }
        .formGroup input {
            width: 100%; padding: 10px 12px; border: 1px solid #ccc; border-radius: 8px;
            font-size: 16px; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .formGroup input:focus {
            outline: none; border-color: #0070f3; box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
        }
        .imagePreview {
            width: 100%; height: 250px; background: #f0f0f0; border-radius: 8px;
            overflow: hidden; margin-bottom: 12px; display: flex; align-items: center;
            justify-content: center; color: #888; border: 2px dashed #ccc;
        }
        .imagePreview img { width: 100%; height: 100%; object-fit: cover; }
        .hiddenFileInput { display: none; }
        .uploadButton {
            display: block; width: 100%; text-align: center; box-sizing: border-box;
            padding: 10px 16px; background-color: #f5f5f5; border: 1px solid #ccc;
            border-radius: 6px; cursor: pointer; transition: background-color 0.2s; font-weight: 500;
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
        .btnDelete { background-color: transparent; color: #b91c1c; border-color: transparent; }
        .btnDelete:hover { background-color: #fee2e2; }
        .actionButtons button:disabled, .btnDelete:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </>
  );
}
