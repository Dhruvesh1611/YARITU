"use client";
import React, { useState } from 'react';
import uploadFileWithPresign from '../utils/uploadFileWithPresign';

// ICONS (Agar yeh icons alag file mein nahi hain to yahan rakhiye)
const EditIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const DeleteIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);


export default function FeaturedImageCard({ item, onUpdate, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({ title: item.title || '', alt: item.alt || '', src: item.src });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    // ✅ Fix: ID check, kyunki humne placeholder images hata diye hain,
    // par yeh check safety ke liye theek hai.
    if (!item._id) {
        console.error("🚫 Error: Cannot save changes without a valid database ID.");
        alert("Cannot update. Item is missing ID.");
        setIsOpen(false);
        return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/featured/${item._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Save failed');
      const json = await res.json().catch(() => null);
      const updated = (json && json.data) || null;
      if (onUpdate && updated) onUpdate(updated);
      setIsOpen(false);
    } catch (err) { console.error(err); alert('Save failed'); } finally { setSaving(false); }
  };

  // ✅ Single Deletion Logic (Double modal fix)
  const confirmDelete = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/featured/${item._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      // Ab hum sirf parent component (ImageSlider) ke onDelete prop ko call karenge
      if (onDelete) onDelete(item._id); 
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    } finally {
      setIsProcessing(false);
      setIsDeleting(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { publicUrl } = await uploadFileWithPresign(file, 'YARITU/featured', (pct) => {});
      if (!publicUrl) throw new Error('Upload failed');
      setForm((p) => ({ ...p, src: publicUrl }));
    } catch (err) { console.error(err); alert('Upload failed'); } finally { setUploading(false); }
  };

  return (
    <div style={{ width: 220, padding: 8, background: '#fff', borderRadius: 8, position: 'relative' }}>
      <div style={{ height: 160, overflow: 'hidden', borderRadius: 8, marginBottom: 8 }}>
        <img src={item.src} alt={item.alt || 'featured'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      
      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setIsOpen(true)}>
          <EditIcon /> Edit
        </button>
        <button onClick={() => setIsDeleting(true)} style={{ background: '#ff4d4f', color: 'white' }}>
          <DeleteIcon /> Delete
        </button>
      </div>

      {/* 1. Edit Modal */}
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: 16, borderRadius: 8, width: 520, maxHeight: '80vh', overflowY: 'auto' }}>
            <h3>Edit Featured Image</h3>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Title</label>
                <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Alt text</label>
                <input value={form.alt} onChange={(e) => setForm((p) => ({ ...p, alt: e.target.value }))} style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Upload Image</label>
                <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
                {uploading && <div style={{ marginTop: 8, color: '#0070f3' }}>Uploading...</div>}
                {form.src && <img src={form.src} alt="Current" style={{ marginTop: 10, width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }} />}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" onClick={() => setIsOpen(false)} style={{ padding: '8px 16px' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: '8px 16px', background: saving ? '#ccc' : '#0070f3', color: 'white' }}>{saving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Delete Confirmation Modal (Top-centered) */}
      {isDeleting && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => { if (!isProcessing) setIsDeleting(false); }}
          style={{ position: 'fixed', inset: 0, zIndex: 1200, pointerEvents: 'auto', background: 'rgba(0,0,0,0.3)' }} 
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              left: '50%',
              top: 20,
              transform: isDeleting ? 'translate(-50%, 0)' : 'translate(-50%, -20px)',
              transition: 'transform 220ms ease, opacity 220ms ease',
              opacity: isDeleting ? 1 : 0,
              background: 'white',
              padding: 16,
              borderRadius: 8,
              width: 360,
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
            }}
          >
            <h4 style={{ margin: '0 0 8px', fontSize: '1.1em' }}>Confirm Deletion</h4>
            <p style={{ margin: '0 0 16px', color: '#555' }}>Are you sure you want to delete this image?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setIsDeleting(false)} disabled={isProcessing} style={{ padding: '8px 16px' }}>Cancel</button>
              <button onClick={confirmDelete} style={{ background: '#e53e3e', color: 'white', padding: '8px 16px' }} disabled={isProcessing}>{isProcessing ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}