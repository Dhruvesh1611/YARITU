"use client";
import React, { useState, useEffect } from 'react';
import styles from './JewelleryModal.module.css'; // CSS Module ko import karein
import uploadFileWithPresign from '../utils/uploadFileWithPresign';

export default function JewelleryModal({ initial = null, onClose, onSaved, stores = [], category = null }) {
  const isEdit = Boolean(initial && initial._id);
  const [name, setName] = useState(initial?.name || '');
  // store selection removed — we no longer show a store dropdown in the modal
  const [price, setPrice] = useState(initial?.price || '');
  const [discountedPrice, setDiscountedPrice] = useState(initial?.discountedPrice || '');
  const [status, setStatus] = useState(initial?.status || 'Available');
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(initial?.mainImage || '');
  const [otherFiles, setOtherFiles] = useState([]);
  const [otherPreviews, setOtherPreviews] = useState(initial?.otherImages || []);
  const [description, setDescription] = useState(initial?.description || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && initial) {
      setDescription(initial.description || '');
    }
    return () => {
      // revoke created blob URLs
      if (mainImagePreview && mainImagePreview.startsWith('blob:')) URL.revokeObjectURL(mainImagePreview);
      otherPreviews.forEach(p => { if (p.startsWith('blob:')) URL.revokeObjectURL(p); });
    };
  }, [mainImagePreview, otherPreviews]);

  const uploadFile = async (file) => {
    const cat = (category || initial?.category || 'ALL').toString().toUpperCase();
    const folder = `YARITU/JEWELLERY/${cat}`;
    const res = await uploadFileWithPresign(file, folder, (pct) => {});
    return res.publicUrl || res.key || null;
  };

  const handleMainImageChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (mainImagePreview && mainImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(mainImagePreview);
    }
    setMainImageFile(f);
    setMainImagePreview(URL.createObjectURL(f));
  };

  const handleOtherChange = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5 - otherPreviews.length);
    if (!files.length) return;
    
    setOtherFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setOtherPreviews(prev => [...prev, ...newPreviews]);
  };
  
  const removeOtherPreview = (index, preview) => {
    if (preview.startsWith('blob:')) {
      // Find the corresponding file in otherFiles and remove it
      const fileIndex = otherPreviews.filter(p => p.startsWith('blob:')).indexOf(preview);
      if (fileIndex > -1) {
        setOtherFiles(prev => prev.filter((_, i) => i !== fileIndex));
      }
      URL.revokeObjectURL(preview);
    }
    setOtherPreviews(prev => prev.filter((_, i) => i !== index));
  };


  const handleSubmit = async () => {
    if (!name) return alert('Name required');
    setLoading(true);
    try {
      let mainUrl = mainImagePreview;
      if (mainImageFile) mainUrl = await uploadFile(mainImageFile);
      
      const otherUrls = [...otherPreviews.filter(p => !p.startsWith('blob:'))]; // Keep existing URLs
      for (const f of otherFiles) {
        const u = await uploadFile(f);
        otherUrls.push(u);
      }

      const payload = { 
        name, 
        description,
        price: Number(price) || 0, 
        discountedPrice: Number(discountedPrice) || 0, 
        status, 
        mainImage: mainUrl, 
        otherImages: otherUrls 
      };
      
      const url = isEdit ? `/api/admin/jewellery?id=${initial._id}` : '/api/admin/jewellery';
      const method = isEdit ? 'PUT' : 'POST';
      
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), credentials: 'include' });
      const j = await res.json();
      if (res.ok && j.success) {
        onSaved?.(j.data || j);
        onClose?.();
      } else {
        alert(j.error || 'Save failed');
      }
    } catch (e) {
      console.error(e); alert('Upload or save failed');
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.header}>{isEdit ? 'Edit Jewellery' : 'Add New Jewellery'}</h3>
        
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input id="name" className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className={styles.input}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Short description of this jewellery item"
          />
        </div>

        <div className={styles.grid2}>
          <div className={styles.formGroup}>
            <label htmlFor="status">Status</label>
            <select id="status" className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Available</option>
              <option>Out of Stock</option>
              <option>Coming Soon</option>
            </select>
          </div>
        </div>
        
        <div className={styles.grid2}>
          <div className={styles.formGroup}>
            <label htmlFor="price">Price</label>
            <input id="price" type="number" className={styles.input} value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="discountedPrice">Discounted Price</label>
            <input id="discountedPrice" type="number" className={styles.input} value={discountedPrice} onChange={(e) => setDiscountedPrice(e.target.value)} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="mainImage">Main Image</label>
          <input id="mainImage" type="file" accept="image/*" className={styles.fileInput} onChange={handleMainImageChange} />
          {mainImagePreview && (
            <div className={styles.previewContainer}>
              <img src={mainImagePreview} className={styles.mainPreview} alt="Main preview" />
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="otherImages">Other Images</label>
          <input id="otherImages" type="file" accept="image/*" multiple className={styles.fileInput} onChange={handleOtherChange} disabled={otherPreviews.length >= 5} />
          <span className={styles.hintText}>You can add up to {5 - otherPreviews.length} more images.</span>
          {otherPreviews.length > 0 && (
            <div className={styles.otherPreviewContainer}>
              {otherPreviews.map((p, i) => (
                <div key={i} className={styles.otherPreviewWrapper}>
                  <img src={p} className={styles.otherPreview} alt={`Other preview ${i+1}`} />
                  <button className={styles.removeImageBtn} onClick={() => removeOtherPreview(i, p)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={onClose} disabled={loading} className={`${styles.btn} ${styles.btnSecondary}`}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className={`${styles.btn} ${styles.btnPrimary}`}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}