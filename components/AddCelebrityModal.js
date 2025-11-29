"use client";
import React, { useState } from 'react';
import uploadFileWithPresign from '../utils/uploadFileWithPresign';

export default function AddCelebrityModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ title: '', videoUrl: '', visibility: 'both' });
  const [saving, setSaving] = useState(false);
  
  // State for upload progress
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    try {
      const secureUrl = await uploadToS3(file, setUploadProgress);
      setForm((p) => ({ ...p, videoUrl: secureUrl }));
    } catch (err) {
      console.error(err);
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Wrapper around shared helper which requests a presigned URL then PUTs the file
  const uploadToS3 = async (file, onProgress, folder = 'YARITU/celebrity') => {
    const result = await uploadFileWithPresign(file, folder, onProgress);
    return result.publicUrl || result.key || null;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/celebrity', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Create failed');
      const json = await res.json().catch(() => null);
      if (onAdd && json?.data) onAdd(json.data);
      onClose();
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
          <h3 className="modalTitle">Add Celebrity Video</h3>
          <form onSubmit={handleSubmit}>
            <div className="formGroup">
              <label htmlFor="title">Title</label>
              <input 
                id="title" 
                value={form.title} 
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g., In Frame with YARITU"
                required
              />
            </div>

            <div className="formGroup">
              <label htmlFor="video-upload">Upload Video</label>
              <label htmlFor="video-upload" className={`uploadButton ${uploading ? 'disabled' : ''}`}>
                Choose Video File
              </label>
              <input 
                id="video-upload" 
                type="file" 
                accept="video/*" 
                onChange={handleFileUpload} 
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

            <div className="divider">OR</div>

            <div className="formGroup">
              <label htmlFor="videoUrl">Paste Video URL</label>
              <input 
                id="videoUrl"
                value={form.videoUrl} 
                onChange={(e) => setForm((p) => ({ ...p, videoUrl: e.target.value }))}
                placeholder="https://example.com/video.mp4"
              />
            </div>

            <div className="formGroup">
              <label htmlFor="visibility">Visibility</label>
              <select id="visibility" value={form.visibility} onChange={(e) => setForm((p) => ({ ...p, visibility: e.target.value }))}>
                <option value="both">Both (Desktop & Mobile)</option>
                <option value="desktop">Desktop only</option>
                <option value="mobile">Mobile only</option>
              </select>
            </div>

            {form.videoUrl && (
              <div className="videoPreview">
                <video src={form.videoUrl} controls />
              </div>
            )}
            
            <div className="actionButtons">
              <button type="button" onClick={onClose} className="btnCancel" disabled={saving || uploading}>Cancel</button>
              <button type="submit" disabled={saving || uploading} className="btnSave">
                {saving ? 'Adding...' : 'Add Video'}
              </button>
            </div>
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
        .hiddenFileInput { display: none; }
        .uploadButton {
            display: block; width: 100%; text-align: center; box-sizing: border-box;
            padding: 10px 16px; background-color: #f5f5f5;
            border: 1px solid #ccc; border-radius: 6px; cursor: pointer; transition: background-color 0.2s;
            font-weight: 500;
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
        .divider {
            text-align: center; color: #999; margin: 20px 0;
            font-size: 14px; font-weight: 500;
        }
        .videoPreview {
            margin-top: 16px;
            width: 100%;
            background: #f0f0f0;
            border-radius: 8px;
            overflow: hidden;
        }
        .videoPreview video {
            width: 100%;
            max-height: 240px;
            display: block;
        }
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
