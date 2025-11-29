"use client";
import React, { useState } from 'react';
import uploadFileWithPresign from '../utils/uploadFileWithPresign';
import { useSession } from 'next-auth/react';

export default function TrendingVideoCard({ item, onUpdate }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ title: item.title || '', videoUrl: item.videoUrl });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (!session) return null; // only show edit to authenticated users

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/trending/${item._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Save failed');
      const json = await res.json().catch(() => null);
      const updated = (json && json.data) || null;
      if (onUpdate && updated) onUpdate(updated);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert('Save failed');
    } finally { setSaving(false); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { publicUrl, key } = await uploadFileWithPresign(file, 'YARITU/trending', (pct) => {});
      const secureUrl = publicUrl || key;
      if (!secureUrl) throw new Error('Upload did not return URL');

      // Immediately tell the server to update the video's URL using the expected field name
      const putRes = await fetch(`/api/trending/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: secureUrl }),
      });
      if (!putRes.ok) throw new Error('Server update failed');
      const putJson = await putRes.json().catch(() => null);
      const updated = (putJson && putJson.data) || null;

      // Update local form and notify parent
      setForm((p) => ({ ...p, videoUrl: secureUrl }));
      if (onUpdate && updated) onUpdate(updated);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally { setUploading(false); }
  };

  return (
    <div style={{ width: 220, padding: 8, background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
      <div style={{ height: 120, background: '#000', borderRadius: 6, overflow: 'hidden', marginBottom: 8 }}>
        <video src={item.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted loop />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setIsOpen(true)}>Edit</button>
      </div>

      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: 16, borderRadius: 8, width: 520, maxHeight: '80vh', overflowY: 'auto' }}>
            <h3>Edit Trending Video</h3>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: 8 }}>
                <label>Title</label>
                <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} style={{ width: '100%', padding: 8 }} />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label>Replace Video (upload a local file)</label>
                <input type="file" accept="video/*" onChange={handleFileUpload} disabled={uploading} />
                {uploading && <div>Uploading...</div>}
                {form.videoUrl && (
                  <div style={{ marginTop: 8 }}>
                    <video src={form.videoUrl} controls style={{ width: '100%', maxHeight: 240 }} />
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={() => setIsOpen(false)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
