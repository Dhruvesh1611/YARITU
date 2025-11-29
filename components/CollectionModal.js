"use client";
import React, { useState, useRef, useEffect, useReducer } from 'react';
import './CollectionModal.css'; // <-- Import the new CSS file
import uploadFileWithPresign from '../utils/uploadFileWithPresign';

// --- Constants for select options (stored/displayed in UPPERCASE) ---
const CATEGORIES = ['MEN', 'WOMEN', 'CHILDREN'];

const OPTIONS_BY_CATEGORY = {
  MEN: {
    occasions: ['WEDDING', 'HALDI', 'RECEPTION'],
    collectionTypes: ['SHERWANI', 'SUIT', 'INDO-WESTERN', 'BLAZER'],
  },
  WOMEN: {
    occasions: ['WEDDING', 'HALDI', 'SANGEET'],
    collectionTypes: ['SARI', 'LEHENGA', 'GOWN'],
  },
  CHILDREN: {
    occasions: ['BIRTHDAY', 'FESTIVAL', 'WEDDING'],
    collectionTypes: ['KURTA', 'FROCK', 'LEHENGA'],
  }
};

// Children-specific grouping (BOYS / GIRLS) and their types (UPPERCASE)
const CHILDREN_GROUPS = {
  BOYS: ['SUIT', 'KOTI', 'SHIRT-PENT', 'DHOTI'],
  GIRLS: ['FROCK', 'LEHENGA', 'GOWN', 'ANARKALI SUITS'],
};

// --- Reducer for complex form state management ---
function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET_DEPENDENT_FIELDS':
      // occasion is now an array when multiple selections are allowed
      return { ...state, occasion: [], collectionType: '', collectionGroup: '' };
    case 'LOAD_INITIAL':
      return { ...action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// --- Main Component ---
export default function CollectionModal({ initial = null, onClose, onSaved, metaOptions = {}, collections = [] }) {
  // Determine if we are in "edit" mode
  const isEditMode = Boolean(initial?._id);

  // --- State Hooks ---
  const initialState = {
    title: initial?.title || '',
    description: initial?.description || '',
    productId: initial?.productId || '',
    category: (initial?.category || 'MEN').toString().toUpperCase(),
    // `occasion` now supports multiple selections (array of UPPERCASE strings)
    occasion: initial?.occasion ? (
      Array.isArray(initial?.occasion) ? initial?.occasion.map(o => o.toString().toUpperCase()) : [initial?.occasion.toString().toUpperCase()]
    ) : [],
  collectionGroup: (initial?.collectionGroup || '').toString().toUpperCase(),
    collectionType: (initial?.collectionType || '').toString().toUpperCase(),
  price: initial?.price || '',
  discountedPrice: initial?.discountedPrice || '',
  mrp: initial?.mrp || '',
    status: initial?.status || 'Available',
    isFeatured: !!initial?.isFeatured,
    tags: (initial?.tags || []).join(', '),
  };

  const [state, dispatch] = useReducer(formReducer, initialState);
  // Accept multiple possible image key names from the collection document
  const existingMainImage = initial?.mainImage || initial?.imageUrl || initial?.image || '';
  const existingMainImage2 = initial?.mainImage2 || initial?.mainImage2Url || initial?.mainImage2Url || '';
  const existingOtherImages = initial?.otherImages || initial?.otherImageUrls || initial?.otherImageUrls || [];

  const [mainImagePreview, setMainImagePreview] = useState(existingMainImage || '');
  // When using direct uploads to the server (which stores files in S3) we'll store the uploaded URL here.
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImage2Preview, setMainImage2Preview] = useState(existingMainImage2 || '');
  const [mainImage2File, setMainImage2File] = useState(null);
  // otherImagesPreview will now hold uploaded image URLs (or existing URLs)
  const [otherImagesPreview, setOtherImagesPreview] = useState(Array.isArray(existingOtherImages) ? existingOtherImages : []);
  // track uploading state for other images
  const [uploadingImages, setUploadingImages] = useState(false);
  // Track upload progress and uploading state for main/main2/other images
  const [mainImageUploading, setMainImageUploading] = useState(false);
  const [mainImageUploadProgress, setMainImageUploadProgress] = useState(0);
  const [mainImage2Uploading, setMainImage2Uploading] = useState(false);
  const [mainImage2UploadProgress, setMainImage2UploadProgress] = useState(0);
  // Array of progress numbers for currently uploading other images
  const [otherUploadsProgress, setOtherUploadsProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const otherFilesInputRef = useRef(null);

  const handleRemoveOtherImage = (index) => {
    const newPreviews = [...otherImagesPreview];
    // Revoke blob URL if it exists (safety) then remove the URL from preview list
    const removedPreview = newPreviews[index];
    try {
      if (removedPreview && removedPreview.startsWith && removedPreview.startsWith('blob:')) {
        URL.revokeObjectURL(removedPreview);
      }
    } catch (e) {
      // ignore
    }
    newPreviews.splice(index, 1);
    setOtherImagesPreview(newPreviews);
  };

  // Upload helper: post file to our server-side S3 upload endpoint
  // Accepts optional onProgress callback which receives a number 0-100
  function uploadToS3(file, onProgress) {
      const cat = state?.category ? state.category.toString().toUpperCase() : 'MEN';
      const folder = `YARITU/COLLECTION/${cat}`;
      return uploadFileWithPresign(file, folder, onProgress).then(res => res.publicUrl || null);
    }

  // --- Effects ---
  // Reset dependent fields when category changes
  // Only reset dependent fields when the category actually changes after mount.
  // Previously this effect ran on mount and cleared occasion/collectionType for edits.
  const prevCategoryRef = useRef(state.category);
  useEffect(() => {
    // If the category is the same as the previous value (mount), do nothing.
    if (prevCategoryRef.current === state.category) {
      prevCategoryRef.current = state.category;
      return;
    }
    // Category changed -> reset dependent fields
    prevCategoryRef.current = state.category;
    dispatch({ type: 'RESET_DEPENDENT_FIELDS' });
  }, [state.category]);

  // Cleanup for image preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (mainImagePreview && mainImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(mainImagePreview);
      }
      if (mainImage2Preview && mainImage2Preview.startsWith('blob:')) {
        URL.revokeObjectURL(mainImage2Preview);
      }
      otherImagesPreview.forEach(p => {
        if (p.startsWith('blob:')) {
          URL.revokeObjectURL(p);
        }
      })
    };
  }, [mainImagePreview, mainImage2Preview, otherImagesPreview]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Normalize certain fields to uppercase for consistency
    const normalizedValue = (name === 'category' || name === 'occasion' || name === 'collectionType' || name === 'collectionGroup')
      ? (type === 'checkbox' ? checked : value.toString().toUpperCase())
      : (type === 'checkbox' ? checked : value);
    dispatch({ type: 'SET_FIELD', field: name, value: normalizedValue });
     // Clear error for the field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Toggle handler for multi-select occasion checkboxes
  const handleOccasionToggle = (e) => {
    const { value, checked } = e.target;
    const cur = Array.isArray(state.occasion) ? [...state.occasion] : [];
    const val = value.toString().toUpperCase();
    if (checked) {
      if (!cur.includes(val)) cur.push(val);
    } else {
      const idx = cur.indexOf(val);
      if (idx !== -1) cur.splice(idx, 1);
    }
    dispatch({ type: 'SET_FIELD', field: 'occasion', value: cur });
    if (errors.occasion) setErrors(prev => ({ ...prev, occasion: null }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrors(prev => ({ ...prev, mainImage: 'Image size cannot exceed 5MB.' }));
      return;
    }

    setMainImageFile(file);
  // upload immediately to our server (S3) with progress
  setMainImageUploading(true);
  setMainImageUploadProgress(0);
  uploadToS3(file, (pct) => setMainImageUploadProgress(pct))
      .then(url => {
        if (url) {
          setMainImagePreview(url);
          setErrors(prev => ({ ...prev, mainImage: null }));
        }
      })
      .catch(err => {
        console.error('Main image upload failed', err);
        setErrors(prev => ({ ...prev, mainImage: 'Failed to upload image. Please try again.' }));
      })
      .finally(() => {
        setMainImageUploading(false);
        setMainImageUploadProgress(100);
      });
    if (errors.mainImage) {
      setErrors(prev => ({ ...prev, mainImage: null }));
    }
  };

  const handleMainImage2Change = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrors(prev => ({ ...prev, mainImage2: 'Image size cannot exceed 5MB.' }));
      return;
    }

    setMainImage2File(file);
    setMainImage2Uploading(true);
    setMainImage2UploadProgress(0);
  uploadToS3(file, (pct) => setMainImage2UploadProgress(pct))
      .then(url => {
        if (url) {
          setMainImage2Preview(url);
          setErrors(prev => ({ ...prev, mainImage2: null }));
        }
      })
      .catch(err => {
        console.error('Main image2 upload failed', err);
        setErrors(prev => ({ ...prev, mainImage2: 'Failed to upload image. Please try again.' }));
      })
      .finally(() => {
        setMainImage2Uploading(false);
        setMainImage2UploadProgress(100);
      });
    if (errors.mainImage2) {
      setErrors(prev => ({ ...prev, mainImage2: null }));
    }
  };

  const handleOtherImagesChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

  // Validate file sizes and limit to 4 total images
    const filteredFiles = [];
    let tooLarge = false;
    for (const f of files) {
      if (f.size > 5 * 1024 * 1024) { // 5MB per file
        tooLarge = true;
        continue; // skip too large files
      }
      if (f instanceof File) filteredFiles.push(f);
    }

    if (tooLarge) {
      setErrors(prev => ({ ...prev, otherImages: 'One or more images exceed 5MB and were skipped.' }));
    } else if (errors.otherImages) {
      setErrors(prev => ({ ...prev, otherImages: null }));
    }

  // We'll upload selected files to our server (S3) immediately and keep their URLs in otherImagesPreview
      const allowedCount = Math.max(0, 4 - otherImagesPreview.length);
    const toUpload = filteredFiles.slice(0, allowedCount);
    if (toUpload.length === 0) return;

    // Use the same server-backed upload helper as main image. No Cloudinary client-side config required.

    setUploadingImages(true);
    const baseIndex = otherImagesPreview.length;
    // Initialize progress slots for the new uploads
    setOtherUploadsProgress(prev => {
      const copy = [...prev];
      for (let i = 0; i < toUpload.length; i++) copy.push(0);
      return copy;
    });

  const uploadPromises = toUpload.map((f, idx) => uploadToS3(f, (pct) => {
      setOtherUploadsProgress(prev => {
        const copy = [...prev];
        copy[baseIndex + idx] = pct;
        return copy;
      });
    }).catch(e => { console.error('upload failed', e); return null; }));

    Promise.all(uploadPromises)
      .then(urls => {
        const successful = (urls || []).filter(Boolean);
    const combined = [...otherImagesPreview, ...successful].slice(0, 4);
        setOtherImagesPreview(combined);
      })
      .finally(() => {
        setUploadingImages(false);
        // clear per-file progress after short delay
        setTimeout(() => setOtherUploadsProgress([]), 500);
      });
  };

  const validateForm = () => {
    const newErrors = {};
    const missing = [];

    if (!state.title.trim()) newErrors.title = 'Title is required.';
    if (!mainImagePreview && !mainImageFile) newErrors.mainImage = 'A main image is required.';

    // Product ID required
    if (!state.productId || !state.productId.toString().trim()) {
      missing.push('Product ID');
      newErrors.productId = 'Product ID is required and must be unique.';
    }

    // Category required
    if (!state.category || !state.category.toString().trim()) {
      missing.push('Category');
      newErrors.category = 'Category is required.';
    }

    // For CHILDREN require collectionGroup (BOYS/GIRLS), otherwise require occasion
    if (state.category === 'CHILDREN') {
      if (!state.collectionGroup || !state.collectionGroup.toString().trim()) {
        missing.push('Collection');
        newErrors.collectionGroup = 'Please select a collection (BOYS or GIRLS).';
      }
    } else {
      const hasOccasion = Array.isArray(state.occasion) ? state.occasion.length > 0 : (state.occasion && state.occasion.toString().trim());
      if (!hasOccasion) {
        missing.push('Occasion');
        newErrors.occasion = 'Occasion is required.';
      }
    }

    // Collection Type required
    if (!state.collectionType || !state.collectionType.toString().trim()) {
      missing.push('Collection Type');
      newErrors.collectionType = 'Collection Type is required.';
    }

    setErrors(newErrors);

    if (missing.length > 0) {
      setErrors(prev => ({ ...prev, form: `Please fill the required fields: ${missing.join(', ')}.` }));
      return false;
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
  // Build JSON payload sending image URLs (we've uploaded images to the server/S3)
    const payload = {};
    Object.keys(state).forEach(key => { payload[key] = state[key]; });

    // Send occasion as array when multiple selected, or string when single
    let payloadOccasion;
    if (Array.isArray(state.occasion)) {
      payloadOccasion = state.occasion.length === 1 ? state.occasion[0] : state.occasion;
    } else {
      payloadOccasion = state.occasion;
    }
    payload.occasion = payloadOccasion;

    const finalCollectionType = (state.collectionType || '').toString().toUpperCase();
    payload.collectionType = finalCollectionType;

    // Map main images: prefer preview (uploaded URL) or existing URL
    const mainImageUrlToSend = mainImagePreview || existingMainImage || '';
    const mainImage2UrlToSend = mainImage2Preview || existingMainImage2 || '';
    payload.imageUrl = mainImageUrlToSend;
    if (mainImage2UrlToSend) payload.mainImage2Url = mainImage2UrlToSend;

    // Other images: otherImagesPreview already contains uploaded or existing URLs
    payload.otherImages = Array.isArray(otherImagesPreview) ? otherImagesPreview : [];
    
    try {
      const url = isEditMode ? `/api/collections/${initial._id}` : '/api/collections';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      // handle non-JSON error responses gracefully (e.g., 413/html from hosting)
      const text = await res.text();
      let result;
      try {
        result = text ? JSON.parse(text) : {};
      } catch (e) {
        result = { success: false, error: text || res.statusText };
      }

      if (res.ok && result.success) {
        // After saving, re-fetch meta-options so parent UI can refresh filter lists immediately
        try {
          const metaRes = await fetch('/api/meta-options');
          const metaJson = await metaRes.json();
          if (metaRes.ok && metaJson.success) {
            // Provide updated meta-options to parent via onSaved (if parent expects it)
            onSaved?.(result.data, metaJson.data);
          } else {
            onSaved?.(result.data);
          }
        } catch (metaErr) {
          // If meta-options fetch fails, still call onSaved with the saved doc
          onSaved?.(result.data);
        }

        onClose?.();
      } else {
        // Map common server messages to friendlier errors
        const friendly = (result.error || '').toString();
        if (friendly.includes('Product ID must be unique') || friendly.includes('duplicate')) {
          setErrors({ form: 'Product ID already exists. Please choose another.' });
        } else {
          setErrors({ form: result.error || 'Failed to save the collection. Please try again.' });
        }
      }
    } catch (err) {
      console.error(err);
      setErrors({ form: 'An unexpected error occurred. Please check the console.' });
    } finally {
      setLoading(false);
    }
  };

  // Derive category options from metaOptions (server-populated) if available, otherwise fall back to static constants
  const catKeyLower = state.category ? state.category.toString().toLowerCase() : 'men';
  const derivedOccKey = `occasion_${catKeyLower}`;
  const derivedTypeKey = `collectionType_${catKeyLower}`;
  const derivedOccasions = (metaOptions[derivedOccKey] || []).filter(v => v && v.toString().toUpperCase() !== 'OTHER');
  const derivedTypes = (metaOptions[derivedTypeKey] || []).filter(v => v && v.toString().toUpperCase() !== 'OTHER');
  const categoryOptions = {
    occasions: derivedOccasions.length ? derivedOccasions : (OPTIONS_BY_CATEGORY[state.category]?.occasions || []),
    collectionTypes: derivedTypes.length ? derivedTypes : (OPTIONS_BY_CATEGORY[state.category]?.collectionTypes || []),
  };
  // Determine collection type options: for Children use selected group (Boys/Girls), otherwise use category mapping
  let collectionTypeOptions = [];
  if (state.category === 'CHILDREN') {
    const group = state.collectionGroup ? state.collectionGroup.toString().toUpperCase() : '';
    const key = group === 'BOYS' ? 'collectionType_children_boys' : (group === 'GIRLS' ? 'collectionType_children_girls' : null);
    const metaList = key ? (metaOptions[key] || []) : [];
    const cleaned = (metaList || []).filter(v => v && v.toString().toUpperCase() !== 'OTHER');
    const fallback = group === 'BOYS' ? CHILDREN_GROUPS.BOYS : (group === 'GIRLS' ? CHILDREN_GROUPS.GIRLS : []);
    collectionTypeOptions = cleaned.length ? cleaned : fallback;
  } else {
    collectionTypeOptions = (categoryOptions.collectionTypes || []);
  }

  // --- JSX ---
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditMode ? 'Edit Collection' : 'Add New Collection'}</h3>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          {/* Left Side - Form Fields */}
          <div className="form-fields">
            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input type="text" id="title" name="title" value={state.title} onChange={handleChange} />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            {/* Product ID */}
            <div className="form-group">
              <label htmlFor="productId">Product ID <span style={{fontSize:12,fontWeight:400,color:'#666'}}>(required, must be unique)</span></label>
              <input type="text" id="productId" name="productId" value={state.productId} onChange={handleChange} />
              {errors.productId && <span className="error-text">{errors.productId}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" value={state.description} onChange={handleChange} rows={3} />
            </div>

            {/* Category */}
            <div className="form-group">
                <label htmlFor="category">Category</label>
        <select id="category" name="category" value={state.category} onChange={handleChange}>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
            </div>
            
            {/* Occasion (or Collection group for Children) */}
            {state.category !== 'CHILDREN' ? (
              <>
                <div className="form-group">
                    <label>Occasion (select one or more)</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
                      {categoryOptions.occasions.map(occ => {
                        const u = occ.toString().toUpperCase();
                        const checked = Array.isArray(state.occasion) ? state.occasion.includes(u) : state.occasion === u;
                        return (
                          <label key={u} style={{ fontSize: 14 }}>
                            <input type="checkbox" name="occasion" value={u} checked={checked} onChange={handleOccasionToggle} style={{ marginRight: 8 }} />
                            {u}
                          </label>
                        );
                      })}
                    </div>
                    {errors.occasion && <span className="error-text">{errors.occasion}</span>}
                </div>
              </>
            ) : (
              <div className="form-group">
                <label htmlFor="collectionGroup">Collection</label>
                <select id="collectionGroup" name="collectionGroup" value={state.collectionGroup} onChange={handleChange}>
                  <option value="">SELECT COLLECTION</option>
                  <option value="BOYS">BOYS</option>
                  <option value="GIRLS">GIRLS</option>
                </select>
              </div>
            )}
            
            {/* Collection Type */}
            <div className="form-group">
                <label htmlFor="collectionType">Collection Type</label>
            <select id="collectionType" name="collectionType" value={state.collectionType} onChange={handleChange}>
              <option value="">SELECT TYPE</option>
              {/* Show saved value if it's not present in the current options */}
              {state.collectionType && state.collectionType !== '' && !collectionTypeOptions.includes(state.collectionType) && (
                <option key={state.collectionType} value={state.collectionType}>{state.collectionType}</option>
              )}
              {collectionTypeOptions.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            </div>

            {/* Price Fields */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" name="price" value={state.price} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="discountedPrice">Discounted Price</label>
                <input type="number" id="discountedPrice" name="discountedPrice" value={state.discountedPrice} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mrp">MRP (Market Retail Price)</label>
                <input type="number" id="mrp" name="mrp" value={state.mrp} onChange={handleChange} />
              </div>
            </div>

            {/* Status */}
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={state.status} onChange={handleChange}>
                <option>Available</option>
                <option>Out of Stock</option>
              </select>
            </div>

            {/* Tags and Featured options removed per requirements */}
          </div>
          {/* Right Side - Image & Actions */}
          <div className="form-sidebar">
            <div className="form-group">
              <label>Main Image *</label>
              <div className="image-uploader" onClick={() => fileInputRef.current?.click()}>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                {mainImagePreview ? (
                  <img src={mainImagePreview} alt="main preview" />
                ) : (
                  <div className="upload-placeholder">
                    <span>Click to Upload</span>
                    <small>SVG,PNG, JPG, WEBP up to 5MB</small>
                  </div>
                )}
              </div>
              {errors.mainImage && <span className="error-text">{errors.mainImage}</span>}
              {/* Main image progress bar */}
              {(mainImageUploading || (mainImageUploadProgress > 0 && mainImageUploadProgress < 100)) && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ height: 8, background: '#eee', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${mainImageUploadProgress}%`, height: '100%', background: '#4caf50', transition: 'width 200ms' }} />
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{mainImageUploadProgress}%</div>
                </div>
              )}
            </div>
            
      <div className="form-group">
        <label>Other Images (up to 4)</label>
        <div className="other-images-container">
                    {otherImagesPreview.map((src, i) => (
                        <div key={i} className="other-image-item">
                            <img src={src} alt={`other preview ${i+1}`} />
                            <button type="button" onClick={() => handleRemoveOtherImage(i)} className="remove-image-btn">&times;</button>
                        </div>
                    ))}
                    {/* Progress bars for currently uploading other images */}
                    {otherUploadsProgress.map((p, idx) => (
                      <div key={`uploading-${idx}`} style={{ width: 120, marginRight: 8, display: 'inline-block' }}>
                        <div style={{ height: 6, background: '#eee', borderRadius: 6, overflow: 'hidden' }}>
                          <div style={{ width: `${p}%`, height: '100%', background: '#2196f3', transition: 'width 200ms' }} />
                        </div>
                        <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>{p}%</div>
                      </div>
                    ))}
          {otherImagesPreview.length < 4 && (
                        <div className="image-uploader-small" onClick={() => otherFilesInputRef.current?.click()}>
                             <input type="file" accept="image/*" multiple ref={otherFilesInputRef} onChange={handleOtherImagesChange} style={{ display: 'none' }} />
                            <span>+ Add</span>
                        </div>
                    )}
                </div>
            </div>
             {errors.form && <div className="error-box">{errors.form}</div>}
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>Cancel</button>
              <button type="button" onClick={handleSave} className="btn btn-primary" disabled={loading || mainImageUploading || mainImage2Uploading || uploadingImages}>
                {loading ? (
                    <span className="spinner"></span>
                ) : (
                    isEditMode ? 'Save Changes' : 'Create Collection'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}