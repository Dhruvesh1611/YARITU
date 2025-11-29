"use client";

import React, { useState } from 'react';

export default function AddHeroModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ title: '', imageUrl: '', link: '', visibility: 'both' });
  const [saving, setSaving] = useState(false);

  // State for upload progress
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  // debug state: store server response after creating a hero image
  const [debugSaved, setDebugSaved] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Client-side size limit check (50 MB)
    const MAX_BYTES = 50 * 1024 * 1024; // 50 MB
    if (file.size > MAX_BYTES) {
      setUploadError(`File is too large. Please select a file smaller than ${MAX_BYTES / 1024 / 1024} MB.`);
      setUploadProgress(0);
      return;
    }

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

  // Reusable upload helper that requests a presigned URL from the server
  // and uploads the file directly to S3 using PUT so the server never sees
  // the file bytes (Client -> S3). Signature: (file, onProgress) => Promise<string>
  const uploadToS3 = (file, onProgress) => {
    return new Promise(async (resolve, reject) => {
      try {
        const presignRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: file.name, folder: 'YARITU/hero', contentType: file.type }),
        });

        if (!presignRes.ok) {
          const errBody = await presignRes.json().catch(() => ({}));
          return reject(new Error(errBody.error || 'Failed to get presigned URL'));
        }

        const { signedUrl, key, publicUrl } = await presignRes.json();
        if (!signedUrl || !key) return reject(new Error('Presign response missing signedUrl or key'));

        // Upload using XHR so we can report progress
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
            // Prefer server-provided publicUrl if available, otherwise construct one client-side
            if (publicUrl) return resolve(publicUrl);
            const bucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;
            const region = process.env.NEXT_PUBLIC_AWS_REGION;
            const publicConstructed = bucket && region
              ? `https://${bucket}.s3.${region}.amazonaws.com/${key}`
              : `/${key}`;
            resolve(publicConstructed);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/hero', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Create failed');
      const json = await res.json().catch(() => null);
      // expose the server response for debugging so admin can verify the saved imageUrl
      setDebugSaved(json?.data || json || { success: true });
      console.info('AddHeroModal - create response:', json);
      if (onAdd && json?.data) onAdd(json.data);
      // intentionally do NOT auto-close the modal so the admin can copy/verify the returned URL
    } catch (err) {
      console.error(err);
      alert('Create failed. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="modalBackdrop" onClick={onClose}>
        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
          <h3 className="modalTitle">Add Hero Image</h3>
          <form onSubmit={handleSubmit}>
            <div className="formGroup">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g., Grand Winter Collection"
                required
              />
            </div>
            <div className="formGroup">
              <label htmlFor="link">Link (optional)</label>
              <input
                id="link"
                value={form.link}
                onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
                placeholder="e.g., /collections/winter"
              />
            </div>
            <div className="formGroup">
              <label>Image</label>
              <div className="imagePreview">
                 {form.imageUrl ? <img src={form.imageUrl} alt="preview" /> : <span>No Image Selected</span>}
              </div>
              <div className="formGroup">
                <label htmlFor="visibility">Visibility</label>
                <select id="visibility" value={form.visibility} onChange={(e) => setForm((p) => ({ ...p, visibility: e.target.value }))}>
                  <option value="both">Both (Desktop & Mobile)</option>
                  <option value="desktop">Desktop only</option>
                  <option value="mobile">Mobile only</option>
                </select>
              </div>
              <label htmlFor="image-upload" className={`uploadButton ${uploading ? 'disabled' : ''}`}>
                Choose Image File
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="hiddenFileInput"
              />
              {uploading && (
                <div className="progressContainer">
                  <div className="progressBar" style={{ width: `${uploadProgress}%` }}>
                    {uploadProgress > 10 && `${uploadProgress}%`}
                  </div>
                </div>
              )}
              {uploadError && <div className="errorMessage">{uploadError}</div>}
            </div>
            <div className="actionButtons">
              <button type="button" onClick={onClose} className="btnCancel" disabled={saving || uploading}>Cancel</button>
              <button type="submit" disabled={saving || uploading} className="btnSave">
                {saving ? 'Adding...' : 'Add'}
              </button>
            </div>
            {/* Debug panel shown after a successful create to help verify saved Cloudinary URL */}
            {debugSaved && (
              <div style={{ marginTop: 14, padding: 12, borderRadius: 8, background: '#f7f7f9', border: '1px solid #e6e6ea' }}>
                <div style={{ fontSize: 13, marginBottom: 8, color: '#222', fontWeight: 600 }}>Saved hero item (debug)</div>
                <div style={{ fontSize: 13, marginBottom: 8 }}>
                  <div style={{ marginBottom: 6 }}><strong>imageUrl:</strong></div>
                  <div style={{ wordBreak: 'break-all' }}>{debugSaved.imageUrl || debugSaved.image || debugSaved.url || JSON.stringify(debugSaved)}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        const url = debugSaved.imageUrl || debugSaved.image || debugSaved.url || '';
                        navigator.clipboard.writeText(url || JSON.stringify(debugSaved));
                        alert('Copied to clipboard');
                      } catch (e) {
                        alert('Copy failed — check console');
                      }
                    }}
                    style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
                  >
                    Copy URL
                  </button>
                  <button type="button" onClick={() => { setDebugSaved(null); onClose(); }} style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc', background: '#111', color: '#fff', cursor: 'pointer' }}>
                    Done & Close
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      <style jsx>{`
        .modalBackdrop {
            position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); display: flex;
            align-items: center; justify-content: center; z-index: 1000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
            width: 100%;
            height: 250px;
            background: #f0f0f0;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #888;
            border: 2px dashed #ccc;
        }
        .imagePreview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .hiddenFileInput { display: none; }
        .uploadButton {
            display: block; width: 100%; text-align: center; box-sizing: border-box;
            padding: 10px 16px; background-color: #f5f5f5;
            border: 1px solid #ccc; border-radius: 6px; cursor: pointer; transition: background-color 0.2s;
            font-weight: 500;
        }
        .uploadButton.disabled { cursor: not-allowed; background-color: #e0e0e0; opacity: 0.7; }
        .uploadButton:not(.disabled):hover { background-color: #e0e0e0; }
          /* uploadModeBadge removed — UI now validates file size client-side */
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
        .actionButtons {
            display: flex; justify-content: flex-end; gap: 12px;
            margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee;
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
      `}</style>
    </>
  );
}
