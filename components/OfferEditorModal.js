"use-client";

import React, { useState, useEffect, useCallback } from 'react';
// You will still need heroicons for the 'X' icon
import { XMarkIcon } from '@heroicons/react/24/outline';

// Animation styles are injected via a <style> tag since they can't be defined inline.
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(20px) scale(0.98); opacity: 0; }
    to { transform: translateY(0) scale(1); opacity: 1; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function OfferEditorModal({ open, item, onClose, onSaved, onDeleted, storeName, storeId, storePhone, onStoreUpdated }) {
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [discount, setDiscount] = useState('');
  // We'll split validity into day/month/year inputs for better control
  const [validityDay, setValidityDay] = useState('1');
  const [validityMonth, setValidityMonth] = useState('January');
  // year should start with '20' and allow two more digits
  const [validityYear, setValidityYear] = useState('20');
  const [validityRaw, setValidityRaw] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [phone, setPhone] = useState('');
  const [toastText, setToastText] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // State to manage hover effects
  const [isCloseHovered, setCloseHovered] = useState(false);
  const [isCancelHovered, setCancelHovered] = useState(false);
  const [isSaveHovered, setSaveHovered] = useState(false);

  useEffect(() => {
    setHeading(item?.heading || '');
    setSubheading(item?.subheading || '');
    setDiscount(item?.discount || '');
    // parse existing validity string like 'Ends December 15, 2025' or 'Dec 15, 2025'
    const val = item?.validity || '';
    setValidityRaw(val || '');
    try {
      const m = /([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/.exec(val);
      if (m) {
        const mm = m[1];
        const dd = String(Number(m[2]));
        const yy = String(m[3]);
        setValidityMonth(mm);
        setValidityDay(dd);
        setValidityYear(yy);
      } else {
        // fallback to defaults
        setValidityDay('1');
        setValidityMonth('January');
        setValidityYear('20');
      }
    } catch (e) {
      setValidityDay('1'); setValidityMonth('January'); setValidityYear('20');
    }
    setImagePreview(item?.image || '');
    setSelectedFile(null);
    // Prefill phone only when editing an existing offer; hide on new-offer flow
    setPhone(item?.phone ?? '');
  }, [item]);

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
  
  // Clean up Object URL
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);


  if (!open) return null;
  
  // --- Event Handlers (logic remains the same) ---
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const toDataURL = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleSave = async () => {
    setSaving(true);
    try {
  // Support both `id` and Mongoose `_id` when editing so we update instead of creating
  // assemble validity into a readable string
  const assembledValidity = validityMonth && validityDay && validityYear ? `Ends ${validityMonth} ${validityDay}, ${validityYear}` : (validityRaw || '');

  // normalize discount: if it's digits only, convert to 'NN% OFF'
  let normalizedDiscount = discount;
  const onlyDigits = (discount || '').toString().trim().match(/^\d{1,3}$/);
  if (onlyDigits) normalizedDiscount = `${onlyDigits[0]}% OFF`;

  let payload = { id: item?.id || item?._id || null, heading, subheading, discount: normalizedDiscount, validity: assembledValidity };
      
      // *** YAHAN BADLAV KIYA GAYA HAI ***
      // Agar yeh naya offer hai (item null hai), to storeName ko payload mein jodo
      if (!item && storeName) {
        payload.store = storeName;
      }

      if (selectedFile) {
        payload.imageBase64 = await toDataURL(selectedFile);
        payload.imageName = selectedFile.name;
      } else if (item?.image) {
        payload.image = item.image;
      }

      const res = await fetch('/api/admin/offers-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const j = await res.json();
      if (j.success) {
        // Normalize id field: Mongoose returns _id, client expects id
        const returned = j.data || {};
        if (!returned.id && returned._id) returned.id = returned._id;
        onSaved?.(returned);
        onClose?.();

  // If editing an existing offer and admin entered a phone and a storeId prop exists, update that store's phone
  if (item && phone && storeId) {
          (async () => {
            try {
              const r = await fetch(`/api/stores/${storeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
              });
                if (r.ok) {
                  const json = await r.json().catch(() => null);
                  if (json && json.success && json.data) {
                    // Notify parent to update its local store list so UI reflects the change immediately
                    try {
                      onStoreUpdated && onStoreUpdated(json.data);
                    } catch (e) {
                      // silent
                    }
                    // show success toast
                    setToastText('Store contact updated');
                    setToastVisible(true);
                    setTimeout(() => setToastVisible(false), 3000);
                  } else {
                    const err = (json && (json.error || json.message)) || 'Unknown error';
                    console.warn('Failed to update store phone', err);
                    setToastText('Failed to update store contact');
                    setToastVisible(true);
                    setTimeout(() => setToastVisible(false), 3000);
                  }
                } else {
                  const err = await r.json().catch(() => ({}));
                  console.warn('Failed to update store phone', err);
                  setToastText('Failed to update store contact');
                  setToastVisible(true);
                  setTimeout(() => setToastVisible(false), 3000);
                }
            } catch (err) {
              console.warn('Failed to update store phone', err);
                setToastText('Failed to update store contact');
                setToastVisible(true);
                setTimeout(() => setToastVisible(false), 3000);
            }
          })();
        }
      } else {
        alert(j.message || 'Could not save the offer.');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const idToDelete = item?.id || item?._id;
    if (!idToDelete) return alert('Cannot delete: missing id');
    if (!confirm('Are you sure you want to delete this offer? This action cannot be undone.')) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/offers-content', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idToDelete }),
      });
      const j = await res.json();
      if (j.success) {
        // call deletion callback if provided
        if (typeof onDeleted === 'function') onDeleted(j.data.id || j.data._id || idToDelete);
        onClose?.();
      } else {
        alert(j.message || 'Could not delete item');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred while deleting.');
    } finally {
      setSaving(false);
    }
  };

  // --- Style Objects ---
  const styles = {
    backdrop: {
      position: 'fixed', inset: 0, zIndex: 200, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    modalContent: {
      backgroundColor: 'white', borderRadius: '12px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      width: '100%', maxWidth: '640px', maxHeight: '90vh',
      display: 'flex', flexDirection: 'column',
      animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '16px 24px', borderBottom: '1px solid #e5e7eb',
    },
    title: { fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 },
    closeButtonBase: {
      padding: '8px', borderRadius: '50%', border: 'none', backgroundColor: 'transparent',
      color: '#6b7280', cursor: 'pointer', transition: 'background-color 0.2s, color 0.2s',
    },
    body: {
      padding: '24px', overflowY: 'auto', display: 'grid',
      gridTemplateColumns: '1fr 1fr', gap: '20px 24px',
    },
    formGroup: { display: 'flex', flexDirection: 'column' },
    formGroupFull: { gridColumn: '1 / -1' },
    label: {
      marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: '#374151',
    },
    input: {
      display: 'block', width: '100%', padding: '10px 12px', boxSizing: 'border-box',
      fontSize: '1rem', color: '#111827', backgroundColor: '#fff',
      border: '1px solid #d1d5db', borderRadius: '8px',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
    imageUploadContainer: { display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px' },
    imagePreview: { width: '72px', height: '72px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e5e7eb' },
    uploadButtonLabel: {
      cursor: 'pointer', borderRadius: '6px', backgroundColor: '#fff', padding: '8px 12px',
      fontSize: '0.875rem', fontWeight: 500, color: '#374151',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #d1d5db',
    },
    footer: {
      display: 'flex', justifyContent: 'space-between', gap: '12px',
      padding: '16px 24px', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb',
    },
    buttonBase: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      padding: '10px 20px', borderRadius: '8px', border: '1px solid transparent',
      fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
    },
    spinner: {
      width: '16px', height: '16px', marginRight: '8px',
      border: '3px solid rgba(255, 255, 255, 0.3)',
      borderTopColor: '#fff', borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }
  };
  
  // Dynamic styles for hover states
  const closeButtonStyle = {
    ...styles.closeButtonBase,
    backgroundColor: isCloseHovered ? '#f3f4f6' : 'transparent',
    color: isCloseHovered ? '#111827' : '#6b7280',
  };
  const cancelButtonStyle = {
    ...styles.buttonBase,
    backgroundColor: isCancelHovered && !saving ? '#f9fafb' : 'white',
    color: '#374151',
    borderColor: '#d1d5db',
    opacity: saving ? 0.6 : 1,
  };
  const saveButtonStyle = {
    ...styles.buttonBase,
    backgroundColor: saving ? '#93c5fd' : (isSaveHovered ? '#1d4ed8' : '#2563eb'),
    color: 'white',
    cursor: saving ? 'not-allowed' : 'pointer',
    opacity: saving ? 0.6 : 1,
  };
  const deleteButtonStyle = {
    ...styles.buttonBase,
    backgroundColor: '#dc2626',
    color: '#fff',
    borderColor: '#b91c1c',
    boxShadow: '0 2px 6px rgba(220,38,38,0.12)',
    padding: '8px 14px',
    borderRadius: 8,
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div style={styles.backdrop} onClick={onClose}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          
          <header style={styles.header}>
            <h3 style={styles.title}>{(item?.id || item?._id) ? 'Edit Offer' : 'Add New Offer'}</h3>
            <button style={closeButtonStyle} onMouseEnter={() => setCloseHovered(true)} onMouseLeave={() => setCloseHovered(false)} onClick={onClose} aria-label="Close">
              <XMarkIcon width={24} height={24} />
            </button>
          </header>

          <main style={styles.body}>
            <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
              <label htmlFor="heading" style={styles.label}>Heading</label>
              <input id="heading" value={heading} onChange={(e) => setHeading(e.target.value)} style={styles.input} />
            </div>

            <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
              <label htmlFor="subheading" style={styles.label}>Subheading</label>
              <input id="subheading" value={subheading} onChange={(e) => setSubheading(e.target.value)} style={styles.input} />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="discount" style={styles.label}>Discount Text</label>
              {/* Editable discount: show numeric editing and format to 'NN% OFF' on blur */}
              <input
                id="discount"
                value={discount}
                onChange={(e) => {
                  // allow typing numbers or full text; keep what user types
                  const v = e.target.value;
                  setDiscount(v);
                }}
                onBlur={() => {
                  // if the user entered only digits, format to 'NN% OFF'
                  const digits = (discount || '').toString().trim().match(/^\d{1,3}$/);
                  if (digits) setDiscount(`${digits[0]}% OFF`);
                }}
                style={styles.input}
                placeholder="e.g., 25 or 25% OFF"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Validity (Ends)</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select value={validityDay} onChange={(e) => setValidityDay(e.target.value)} style={{ ...styles.input, padding: '8px' }}>
                  {Array.from({ length: 31 }).map((_, i) => {
                    const d = String(i + 1);
                    return <option key={d} value={d}>{d}</option>;
                  })}
                </select>
                <select value={validityMonth} onChange={(e) => setValidityMonth(e.target.value)} style={{ ...styles.input, padding: '8px' }}>
                  {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <input
                  value={validityYear}
                  onChange={(e) => {
                    // keep only digits and max length 4; if user starts without 20, allow but enforce maxlength
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    const trimmed = raw.slice(0, 4);
                    // if user clears, ensure at least '20' remains as prefix when they begin typing next
                    setValidityYear(trimmed || '20');
                  }}
                  onFocus={(e) => {
                    // if default is '20' and user focuses, keep it so they can type the rest
                    if (!validityYear) setValidityYear('20');
                  }}
                  style={{ ...styles.input, width: 100 }}
                  maxLength={4}
                />
              </div>
            </div>
            
            <div style={{...styles.formGroup, ...styles.formGroupFull}}>
                <label style={styles.label}>Image (Optional)</label>
                <div style={styles.imageUploadContainer}>
                    {imagePreview && <img src={imagePreview} alt="Offer preview" style={styles.imagePreview} />}
                    <label htmlFor="file-upload" style={styles.uploadButtonLabel}>
                        {imagePreview ? 'Change Image' : 'Upload Image'}
                    </label>
                    <input id="file-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                </div>
            </div>
           
          </main>

          <footer style={styles.footer}>
            {item ? (
              <button
                onClick={handleDelete}
                disabled={saving}
                style={deleteButtonStyle}
                title="Delete offer"
              >
                Delete
              </button>
            ) : <div />}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
              onClick={onClose}
              disabled={saving}
              style={cancelButtonStyle}
              onMouseEnter={() => setCancelHovered(true)}
              onMouseLeave={() => setCancelHovered(false)}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={saveButtonStyle}
              onMouseEnter={() => setSaveHovered(true)}
              onMouseLeave={() => setSaveHovered(false)}
            >
              {saving && <div style={styles.spinner}></div>}
              {saving ? 'Saving...' : 'Save Offer'}
            </button>
            </div>
          </footer>
          
          {/* Inline toast inside modal (top-right) */}
          {toastVisible && (
            <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 400 }}>
              <div style={{ background: '#111827', color: '#fff', padding: '8px 12px', borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.15)' }}>
                {toastText}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}