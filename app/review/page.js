"use client";
import React, { useRef, useState, useEffect } from 'react';
import TestimonialsSlider from '../../components/TestimonialsSlider';
import { useSession } from 'next-auth/react';
import uploadFileWithPresign from '../../utils/uploadFileWithPresign';

// Custom video component for review gallery
function VideoReview({ src, className, isPlaying, onPlay, onStop, thumbnail }) {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const observerRef = useRef(null);
  const DEBUG_VIDEO = false;

  const getMimeFromUrl = (u) => {
    if (!u || typeof u !== 'string') return undefined;
    const lower = u.split('?')[0].toLowerCase();
    if (lower.endsWith('.mp4')) return 'video/mp4';
    if (lower.endsWith('.webm')) return 'video/webm';
    if (lower.endsWith('.ogg') || lower.endsWith('.ogv')) return 'video/ogg';
    if (lower.includes('/video/upload/')) return 'video/mp4'; // common Cloudinary path
    return undefined;
  };

  useEffect(() => {
    if (!isPlaying && videoRef.current) {
      const v = videoRef.current;
      try {
        v.pause();
        if (v.currentTime > 0.05) v.currentTime = 0;
      } catch (e) { }
      if (overlayRef.current) overlayRef.current.style.display = 'flex';
    }
  }, [isPlaying]);

  useEffect(() => {
    // Ensure video is not muted
    if (videoRef.current) {
      try { videoRef.current.muted = false; } catch (e) { /* ignore in SSR */ }
    }

    // IntersectionObserver to stop playback when video is mostly out of view
    const node = videoRef.current;
    if (!node) return;

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.intersectionRatio < 0.5 && isPlaying) {
          try {
            if (videoRef.current) {
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
            }
            if (overlayRef.current) overlayRef.current.style.display = 'flex';
            if (typeof onStop === 'function') onStop();
          } catch (err) { }
        }
      });
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });

    observerRef.current.observe(node);

    return () => {
      try { observerRef.current && observerRef.current.disconnect(); } catch (e) { }
    };
  }, [isPlaying]);

  // Auto-play when this card becomes the active one, or when src changes while active
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!src) return;
    // If the source changed, ensure the media element reloads it
    try { v.load(); } catch (e) { }
    if (isPlaying) {
      if (overlayRef.current) overlayRef.current.style.display = 'none';
      const p = v.play();
      if (p && typeof p.then === 'function') {
        p.catch(err => { if (err?.name !== 'AbortError') console.warn('Auto play failed', err); });
      }
    }
  }, [src]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!src) return;
    if (isPlaying) {
      if (overlayRef.current) overlayRef.current.style.display = 'none';
      const p = v.play();
      if (p && typeof p.then === 'function') {
        p.catch(err => { if (err?.name !== 'AbortError') console.warn('Auto play failed', err); });
      }
    }
  }, [isPlaying]);

  // When the video ends or errors, restore thumbnail and inform parent
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const handleEnded = () => {
      try { v.pause(); v.currentTime = 0; } catch (e) { }
      if (overlayRef.current) overlayRef.current.style.display = 'flex';
      if (typeof onStop === 'function') onStop();
    };
    const handleError = () => {
      try { v.pause(); } catch (e) { }
      if (overlayRef.current) overlayRef.current.style.display = 'flex';
      if (typeof onStop === 'function') onStop();
    };
    v.addEventListener('ended', handleEnded);
    v.addEventListener('error', handleError);
    return () => {
      v.removeEventListener('ended', handleEnded);
      v.removeEventListener('error', handleError);
    };
  }, [onStop]);

  const handlePlay = (e) => {
    // Prevent page-level click handlers from firing when user clicks the video
    e.stopPropagation();
    if (!src) return; // no video set yet
    if (videoRef.current) {
      onPlay();
      if (overlayRef.current) overlayRef.current.style.display = 'none';
      const playPromise = videoRef.current.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch((err) => {
          // AbortError happens if play is immediately interrupted by pause(); safe to ignore
          if (err?.name !== 'AbortError') {
            console.warn('Video play failed:', err);
          }
        });
      }
    }
  };

  return (
    <div className={className} style={{ position: 'relative', cursor: 'pointer', borderRadius: '16px', overflow: 'hidden' }} onClick={handlePlay}>
      {!isPlaying && thumbnail && (
        (() => {
          // Detect local thumbnails (relative paths or localhost)
          const isLocal = typeof thumbnail === 'string' && (
            thumbnail.startsWith('/') || thumbnail.startsWith('./') || thumbnail.includes('localhost') || thumbnail.includes('127.0.0.1')
          );
          if (isLocal) {
            // Render a neutral skeleton placeholder instead of loading local image
            return (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(90deg,#efefef,#f6f6f6,#efefef)', animation: 'placeholderShimmer 1.6s linear infinite' }}>
                <style>{`@keyframes placeholderShimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }`}</style>
              </div>
            );
          }
          return (
            <img
              src={thumbnail}
              alt="Video thumbnail"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
            />
          );
        })()
      )}
      <video
        ref={videoRef}
        controls={false}
        muted={false}
        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', background: '#222', zIndex: 2 }}
        controlsList="nodownload noremoteplayback nofullscreen noplaybackrate"
        playsInline
        preload="metadata"
        onError={async (e) => {
          if (!DEBUG_VIDEO) return;
          try {
            const r = await fetch(src, { method: 'HEAD' });
            console.warn('Video HEAD', { status: r.status, type: r.headers.get('content-type'), url: src });
          } catch (err) { console.warn('Video HEAD failed', err); }
        }}
      >
        {src ? <source src={src} type={getMimeFromUrl(src)} /> : null}
      </video>
      <div ref={overlayRef} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.25)',
        display: isPlaying ? 'none' : 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
        pointerEvents: 'none',
      }}>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="28" fill="#fff" fillOpacity="0.7" /><polygon points="22,18 40,28 22,38" fill="#25384d" /></svg>
      </div>
    </div>
  );
}


export default function Review() {
  const [playingIdx, setPlayingIdx] = useState(null);

  const normalizeVideoUrl = (u) => {
    try {
      if (typeof u !== 'string') return u;
      if (u.includes('res.cloudinary.com') && u.includes('/video/upload/')) {
        // ensure mp4 delivery
        return u.replace('/upload/', '/upload/f_mp4/');
      }
      return u;
    } catch { return u; }
  };

  // CHANGE #1: Add a state to track if we are on the client
  const [isClient, setIsClient] = useState(false);

  // CHANGE #2: Use useEffect to set the state to true once the component mounts in the browser
  useEffect(() => {
    console.log("REVIEW PAGE MOUNTED ON CLIENT");
    setIsClient(true);
  }, []);

  const { data: session } = useSession();
  // devAdmin is a temporary localStorage toggle to help debugging if your session doesn't expose admin flag yet
  const [devAdmin, setDevAdmin] = useState(false);
  useEffect(() => {
    try {
      setDevAdmin(localStorage.getItem('devAdmin') === '1');
    } catch (e) { }
  }, []);

  useEffect(() => {
    // helpful debug output — remove when done
    console.log('review page session:', session);
  }, [session]);

  const isAdmin = !!(session?.user?.isAdmin || session?.user?.role === 'admin' || devAdmin);

  // server-backed testimonials
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  useEffect(() => {
    if (!isClient) return;
    (async function fetchTestimonials() {
      try {
        const res = await fetch('/api/testimonials?location=reviews');
        const json = await res.json();
        if (json.success) setTestimonials(json.data);
      } catch (err) {
        console.error(err);
      } finally { setLoadingTestimonials(false); }
    })();
  }, [isClient]);

  // modal state for admin add/edit
  const [editing, setEditing] = useState(null); // null | 'new' | testimonial id
  const [form, setForm] = useState({ name: '', quote: '', rating: 5, avatarUrl: '' });
  const [filePreview, setFilePreview] = useState(null);
  const [fileForUpload, setFileForUpload] = useState(null);
  const prevPreviewRef = React.useRef(null);

  // NOTE: This app now uses the server-side `/api/upload` endpoint (S3-backed).
  // Old Cloudinary env vars were removed — keep the code compatible with
  // both legacy Cloudinary-hosted URLs and newly uploaded S3 URLs.

  // upload progress state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusMessage, setUploadStatusMessage] = useState('');
  // Testimonial avatar upload states
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUploadProgress, setAvatarUploadProgress] = useState(0);
  const [avatarUploadedUrl, setAvatarUploadedUrl] = useState('');

  // New: Use presigned URL helper to upload directly to S3 and report progress.
  // This replaces the old XHR/FormData approach which POSTed FormData to /api/upload.
  // The helper returns a public URL (or key) which we resolve so existing callers keep working.
  function uploadWithProgress(file, onProgress, folder = 'YARITU/review-videos') {
    return new Promise(async (resolve, reject) => {
      try {
        const presign = await uploadFileWithPresign(
          file,
          folder,
          (percent) => typeof onProgress === 'function' && onProgress(percent)
        );

        const url = presign.publicUrl || presign.key;
        if (!url) return reject(new Error('Upload returned no URL'));

        resolve(url);
      } catch (err) {
        console.error('Upload failed:', err);
        reject(err);
      }
    });
  }

  function openNew() {
    // clear any previous preview/url state
    try { if (prevPreviewRef.current) { URL.revokeObjectURL(prevPreviewRef.current); prevPreviewRef.current = null; } } catch (e) { }
    setEditing('new');
    setForm({ name: '', quote: '', rating: 5, avatarUrl: '' });
    setFilePreview(null);
    setFileForUpload(null);
  }

  function openEdit(item) {
    // when editing existing, show the stored avatar but clear file upload buffer
    try { if (prevPreviewRef.current) { URL.revokeObjectURL(prevPreviewRef.current); prevPreviewRef.current = null; } } catch (e) { }
    setEditing(item._id);
    setForm({ name: item.name, quote: item.quote, rating: item.rating || 5, avatarUrl: item.avatarUrl || '' });
    setFilePreview(item.avatarUrl || null);
    setFileForUpload(null);
  }

  async function handleSave() {
  try {
    // --- START OF FIX ---
    // Sahi URL chunein: Pehle naya upload hua URL (avatarUploadedUrl),
    // warna purana URL (form.avatarUrl)
    let avatarUrlToSave = avatarUploadedUrl || form.avatarUrl;

    // client-side validation...
    if (!form.name || !form.quote) {
      alert('Please provide both a name and a review before saving.');
      return;
    }

    // Ab payload mein sahi URL bhejenge
    const payload = { name: form.name, quote: form.quote, rating: form.rating, avatarUrl: avatarUrlToSave, location: 'reviews' };
    // --- END OF FIX ---

    console.debug('saving testimonial payload:', payload);

    if (editing === 'new') {
      const res = await fetch('/api/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const j = await res.json();
      if (!res.ok) {
        console.error('Failed POST /api/testimonials', res.status, j);
        alert(j?.message || j?.error || 'Failed to create testimonial');
        return;
      }
      if (j.success) setTestimonials(prev => [j.data, ...prev]);
    } else {
      const res = await fetch(`/api/testimonials/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const j = await res.json();
      if (!res.ok) {
        console.error('Failed PUT /api/testimonials/' + editing, res.status, j);
        alert(j?.message || j?.error || 'Failed to update testimonial');
        return;
      }
      if (j.success) setTestimonials(prev => prev.map(p => p._id === j.data._id ? j.data : p));
    }
    setEditing(null);
    setAvatarUploadedUrl(''); // Kaam hone ke baad state ko reset karein
  } catch (err) { console.error(err); alert(err.message || 'Save failed'); }
}

  async function handleDelete(id) {
    if (!confirm('Delete this review?')) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      const j = await res.json();
      if (j.success) setTestimonials(prev => prev.filter(p => p._id !== id));
    } catch (err) { console.error(err); }
  }

  function handleCancel() {
    try { if (prevPreviewRef.current) { URL.revokeObjectURL(prevPreviewRef.current); prevPreviewRef.current = null; } } catch (e) { }
    setFilePreview(null);
    setFileForUpload(null);
    setEditing(null);
  }

  const clientReviews = [
    { id: 1, image: 'https://placehold.co/400x560/EAD9C8/4E3629?text=Client+1', alt: 'Client wearing bridal outfit', text: "The craftsmanship and fabric quality exceeded my expectations. The outfit made my pre-wedding shoot truly memorable!", name: 'Aditi Salvi' },
    { id: 2, image: 'https://placehold.co/400x560/D4E2D4/4E3629?text=Client+2', alt: 'Client couple ethnic', text: "We were new to ethnic styling but the staff guided us patiently. Fit was perfect and styling premium.", name: 'David Santucci' },
    { id: 3, image: 'https://placehold.co/400x560/F5DBC1/4E3629?text=Client+3', alt: 'Bridal portrait', text: "Warm hospitality and elite collection. Every outfit felt unique and expressive.", name: 'Shivani Satpute' },
    { id: 4, image: 'https://placehold.co/400x560/C8DCE5/4E3629?text=Client+4', alt: 'Ethnic twirl pose', text: "Loved the vibrant palette and fall of the fabric. Got so many compliments!", name: 'Samruddhi Bora' },
  ];

  const thumbnails = [
    '/images/Featured1.png',
    '/images/reel2.png',
    '/images/reel3.png',
    '/images/reel4.png',
    '/images/reel5.png',
  ];

  // Make the review gallery videos editable in-memory (admin-only). No Add option — only Edit.
  const [videos, setVideos] = useState([
    { src: '', thumbnail: '/images/Featured1.png' },
    { src: '', thumbnail: '/images/reel2.png' },
    { src: '', thumbnail: '/images/reel3.png' },
    { src: '', thumbnail: '/images/reel4.png' },
    { src: '', thumbnail: '/images/reel5.png' },
  ]);

  useEffect(() => {
    if (!isClient) return;
    (async () => {
      try {
        const res = await fetch('/api/review-videos');
        const j = await res.json();
        if (res.ok && j.success && Array.isArray(j.data)) {
          // Ensure we always display 5 slots on the page. Overlay stored items onto a 5-slot default.
          const defaults = [
            { src: '', thumbnail: '/images/Featured1.png' },
            { src: '', thumbnail: '/images/reel2.png' },
            { src: '', thumbnail: '/images/reel3.png' },
            { src: '', thumbnail: '/images/reel4.png' },
            { src: '', thumbnail: '/images/reel5.png' },
          ];
          const stored = j.data.map(x => ({ src: normalizeVideoUrl(x.src || ''), thumbnail: x.thumbnail || '' }));
          const merged = defaults.map((d, i) => stored[i] ? { ...d, ...stored[i] } : d);
          setVideos(merged);
        }
      } catch (e) { console.warn('Failed to load review videos', e); }
    })();
  }, [isClient]);

  // video edit modal state
  const [editingVideoIndex, setEditingVideoIndex] = useState(null);
  const [videoFilePreview, setVideoFilePreview] = useState(null);
  const [videoFileForUpload, setVideoFileForUpload] = useState(null);
  const [thumbFilePreview, setThumbFilePreview] = useState(null);
  const [thumbFileForUpload, setThumbFileForUpload] = useState(null);
  // immediate-upload states for video modal
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [videoUploadedUrl, setVideoUploadedUrl] = useState('');
  const [thumbUploading, setThumbUploading] = useState(false);
  const [thumbUploadProgress, setThumbUploadProgress] = useState(0);
  const [thumbUploadedUrl, setThumbUploadedUrl] = useState('');

  // Prevent background page from scrolling while any modal is open
  useEffect(() => {
    const anyModalOpen = editing !== null || (editingVideoIndex !== null && isAdmin);
    const prevOverflow = typeof document !== 'undefined' ? document.body.style.overflow : '';
    if (anyModalOpen && typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overscrollBehavior = 'none';
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = prevOverflow || '';
        document.documentElement.style.overscrollBehavior = '';
      }
    };
  }, [editing, editingVideoIndex, isAdmin]);

  return (
    <div id="review-page-wrapper" onClick={() => setPlayingIdx(null)}>
      <style>{`
        /* Global Variables (using CSS variables inside the scoped block) */
        #review-page-wrapper :root {
          --font-heading: 'Garamond', serif;
          --font-body: 'Poppins', sans-serif;
          --color-secondary-text: #666;
          --color-background-light: #fff;
        }
        
        /* 1. Base Styles (Desktop) */
        #review-page-wrapper #reviews {
          position: relative;
          /* Default desktop padding */
          padding-top: 168px; 
          margin-top: -88px; 
          background: linear-gradient(180deg, #ffffff 0%, #f0f0f0 73.85%);
          font-family: var(--font-body);
        }
        
        #review-page-wrapper .reviews-content, 
        #review-page-wrapper .testimonials-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        #review-page-wrapper .reviews-content {
          text-align: center;
        }
        #review-page-wrapper .reviews-title {
          font-family: var(--font-heading);
          font-size: 50px;
          font-weight: 600;
        }
        #review-page-wrapper .reviews-subtitle {
          font-family: var(--font-body);
          font-size: 21px;
          font-weight: 400;
          color: var(--color-secondary-text);
          margin-top: 16px;
        }
        #review-page-wrapper .review-gallery {
          margin-top: 78px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 25px;
          flex-wrap: nowrap;
        }
        #review-page-wrapper .gallery-photo {
          position: relative;
          border-radius: 20px;
          box-shadow: 0px 5px 10px 5px rgba(0, 0, 0, 0.49);
          object-fit: cover;
          transition: transform 0.25s ease, z-index 0.25s ease;
          flex-shrink: 0;
        }
        #review-page-wrapper .gallery-photo:hover {
            transform: translateY(-8px) scale(1.03);
            z-index: 10 !important;
        }
        #review-page-wrapper .photo-1, #review-page-wrapper .photo-5 { width: 212px; height: 310px; }
        #review-page-wrapper .photo-3 { width: 212px; height: 310px; z-index: 5; }
        #review-page-wrapper .photo-2, #review-page-wrapper .photo-4 { width: 244px; height: 387px; }

        #review-page-wrapper #testimonials {
          padding: 80px 0;
          background-color: var(--color-background-light);
          font-family: var(--font-body);
        }
        #review-page-wrapper .testimonials-title {
          text-align: center;
          font-family: var(--font-heading);
          font-size: 48px;
          font-weight: 400;
          margin-bottom: 83px;
        }
        #review-page-wrapper .highlight { color: #c5a46d; }
        
        /* --- START OF UPDATED CSS --- */
        #review-page-wrapper .review-testimonials-grid {
          display: grid;
          /* On desktop, we want 4 columns */
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        #review-page-wrapper .testimonial-card {
          /* This is the main card container */
          background-color: #fdfbf8; /* The light beige background from your image */
          border: 1px solid #E0E0E0; /* A light gray border */
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column; /* Stacks items vertically */
          box-shadow: 0 2px 4px rgba(0,0,0,0.05); /* Optional: a very subtle shadow */
          transition: all 0.2s ease-in-out;
        }

        #review-page-wrapper .testimonial-card:hover {
            /* Optional: subtle hover effect */
            transform: translateY(-4px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.08);
        }

        #review-page-wrapper .card-media-placeholder {
          /* This will hold the image or video */
          width: 100%;
          height: 400px; /* A fixed height for the media area */
          background-color: #F5F5F5;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Poppins', sans-serif;
          color: #888;
          font-size: 18px;
          margin-bottom: 16px;
          overflow: hidden; /* Ensures image corners are rounded */
        }
        
        #review-page-wrapper .card-media-placeholder img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        #review-page-wrapper .client-name {
          font-family: 'Poppins', sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin: 0;
        }

        #review-page-wrapper .client-quote {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          color: #666;
          margin: 4px 0 0 0;
        }

        #review-page-wrapper .admin-actions {
          /* This container pushes the buttons to the bottom */
          margin-top: auto; /* This is the key to bottom-aligning */
          padding-top: 16px; /* Space above the buttons */
          display: flex;
          gap: 8px;
        }

        #review-page-wrapper .admin-actions button {
          /* Common styles for both buttons */
          flex-grow: 1; /* Makes both buttons take equal width */
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid transparent;
        }

        #review-page-wrapper .admin-actions .edit-btn {
          background-color: #E7E7E7;
          border-color: #D0D0D0;
          color: #333;
        }

        #review-page-wrapper .admin-actions .delete-btn {
          background-color: #E57373; /* A softer red from your image */
          color: #fff;
        }

        /* Responsive adjustments for the new card style */
        @media (max-width: 1024px) {
          #review-page-wrapper .review-testimonials-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          #review-page-wrapper .review-testimonials-grid {
            grid-template-columns: 1fr;
          }
        }
        /* --- END OF UPDATED CSS --- */

        /* 2. Tablet Optimizations (1200px and below) */
        @media (max-width: 1200px) {
          /* Scale down gallery slightly */
          #review-page-wrapper .review-gallery { transform: scale(0.8); transform-origin: top center; }
        }
        
        @media (max-width: 900px) {
          /* Scale down gallery further */
          #review-page-wrapper .review-gallery { transform: scale(0.6); margin-top: 30px; } 
          #review-page-wrapper .review-gallery {
            margin-top: 48px;
          }
        }

        /* 3. Tablet Layout (1024px and below) */
        @media (max-width: 1024px) {
          /* Adjust Review section padding */
          #review-page-wrapper #reviews { 
             padding-top: 120px; /* Reduced padding-top for tablets */
             margin-top: -88px; /* Remove conflicting margin */
          }
          /* Switch testimonials to 2 columns */
          /* #review-page-wrapper .review-testimonials-grid { grid-template-columns: repeat(2, 1fr); } -- MOVED TO NEW CSS BLOCK */
          #review-page-wrapper .testimonials-title { font-size: 40px; margin-bottom: 60px; }
        }

        /* 4. Mobile Layout (768px and below) */
        @media (max-width: 768px) {
          /* Re-apply safe padding-top for fixed header on mobile */
          #review-page-wrapper #reviews { 
             padding-top: 150px; /* Safe value for small screens */ 
             margin-top: -88px; /* counter header */
          }
          #review-page-wrapper #testimonials { padding: 60px 0; }
          /* Switch testimonials to 1 column */
          #review-page-wrapper .reviews-title { font-size: 32px; }
          #review-page-wrapper .reviews-subtitle { font-size: 18px; }
          /* #review-page-wrapper .review-testimonials-grid { grid-template-columns: 1fr; } -- MOVED TO NEW CSS BLOCK */
          #review-page-wrapper .testimonials-title { font-size: 32px; margin-bottom: 40px; }

          /* Mobile gallery layout: grid with 2 columns */
          #review-page-wrapper .review-gallery {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            transform: none;
            margin-top: 24px;
            padding: 0 12px;
          }
          #review-page-wrapper .gallery-photo {
            width: 100%;
            height: auto;
            aspect-ratio: 3 / 4;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          }
          #review-page-wrapper .photo-5 { grid-column: 1 / -1; }
        }

        /* 5. Small Mobile (600px and below) */
        @media (max-width: 600px) {
          /* Fine-tune typography */
          #review-page-wrapper .reviews-title { font-size: 28px; }
          #review-page-wrapper .reviews-subtitle { font-size: 16px; }
          /* Keep 2-column gallery for small devices */
          #review-page-wrapper .review-gallery { gap: 22px; }
        }

        @media (max-width: 480px) {
          /* Single column gallery for very small screens */
          #review-page-wrapper .review-gallery { grid-template-columns: 1fr; }
          #review-page-wrapper .photo-5 { grid-column: auto; }
        }

        /* 6. Phone Landscape: show 3 testimonial cards per row */
        @media (orientation: landscape) and (max-height: 500px) {
          /* Reduce top padding since header is fixed and height is limited */
          #review-page-wrapper #reviews { 
            padding-top: 110px; 
            margin-top: -88px;
          }

          /* Tighter typography */
          #review-page-wrapper .reviews-title { font-size: 34px; }
          #review-page-wrapper .reviews-subtitle { font-size: 16px; }

          /* Gallery as compact grid */
          #review-page-wrapper .review-gallery {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            padding: 0 16px;
            margin-top: 20px;
            transform: none;
          }
          #review-page-wrapper .gallery-photo { 
            width: 100%;
            height: auto;
            aspect-ratio: 3 / 4; 
            box-shadow: 0 3px 8px rgba(0,0,0,0.18);
          }

          /* Testimonials: 3 cards per row */
          #review-page-wrapper #testimonials { padding: 40px 0; }
          #review-page-wrapper .testimonials-title { font-size: 30px; margin-bottom: 26px; }
          #review-page-wrapper .review-testimonials-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
        }

        /* Ultra-short landscape (e.g., split screen or very small devices) */
        @media (orientation: landscape) and (max-height: 380px) {
          #review-page-wrapper #reviews { padding-top: 96px; }
          #review-page-wrapper .reviews-title { font-size: 28px; }
          #review-page-wrapper .review-gallery { grid-template-columns: repeat(4, 1fr); gap: 10px; }
        }

        /* --- Modal styles for edit dialogs (video + testimonial) --- */
        #review-page-wrapper .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          overscroll-behavior: contain; /* keep scroll within modal on supported browsers */
        }
        #review-page-wrapper .modal-card {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          width: min(760px, 95vw);
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          position: relative;
        }
        #review-page-wrapper .desktop-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
        #review-page-wrapper .mobile-action-bar { display: none; }

        @media (max-width: 640px) {
          #review-page-wrapper .modal-card {
            width: calc(100% - 32px);
            padding: 16px;
            border-radius: 10px;
            /* Leave space for fixed action bar */
            padding-bottom: 120px;
            max-height: calc(100vh - 120px);
          }
          #review-page-wrapper .desktop-actions { display: none; }
          #review-page-wrapper .mobile-action-bar {
            display: block;
            position: fixed;
            left: 0; right: 0; bottom: 0;
            z-index: 250;
            background: #fff;
            box-shadow: 0 -4px 10px rgba(0,0,0,0.1);
            padding: 12px 16px;
          }
          #review-page-wrapper .mobile-action-bar .action-buttons-mobile { display: flex; gap: 8px; }
        }
      `}</style>

      <section id="reviews">
        <div className="reviews-content">
          <h2 className="reviews-title">Customer <span className="highlight">Reviews</span></h2>
          <p className="reviews-subtitle">Real experiences from our satisfied customers</p>

          <div className="review-gallery">
            {videos.map((v, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <VideoReview
                  src={v.src}
                  className={`gallery-photo photo-${idx + 1}`}
                  isPlaying={playingIdx === idx}
                  onPlay={() => setPlayingIdx(prev => (prev === idx ? null : idx))}
                  onStop={() => setPlayingIdx(null)}
                  thumbnail={v.thumbnail}
                />
                {isAdmin && (
                  <button onClick={(e) => { e.stopPropagation(); setEditingVideoIndex(idx); setVideoFilePreview(null); setVideoFileForUpload(null); setThumbFilePreview(v.thumbnail || null); setThumbFileForUpload(null); }} style={{ position: 'absolute', top: 8, right: 8, zIndex: 30, padding: '6px 8px' }}>Edit</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials">
        <div className="testimonials-container">
          <h2 className="testimonials-title">What Our <span className="highlight">Clients Say</span></h2>

          {/* --- START OF UPDATED JSX --- */}
          <div className="review-testimonials-grid">
            {/* Render server-backed testimonials on client only */}
            {isClient && (
              loadingTestimonials ? <p>Loading...</p> : testimonials.map((t) => (
                <div className="testimonial-card" key={t._id}>
                  {/* Media Area */}
                  <div className="card-media-placeholder">
                    {t.avatarUrl ? (
                      <img src={t.avatarUrl} alt={t.name} />
                    ) : (
                      <span>Client</span>
                    )}
                  </div>

                  {/* Text Content */}
                  <p className="client-name">{t.name}</p>
                  <p className="client-quote">{t.quote}</p>

                  {/* Admin Buttons (pushed to the bottom) */}
                  {isAdmin && (
                    <div className="admin-actions">
                      <button className="edit-btn" onClick={() => openEdit(t)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(t._id)}>Delete</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          {/* --- END OF UPDATED JSX --- */}

          {isAdmin && (
            <div style={{ textAlign: 'center', marginTop: 18 }}>
              <button onClick={openNew} style={{ padding: '8px 12px' }}>Add Review</button>
            </div>
          )}
          {/* Modal */}
          {editing !== null && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 80 }}>
              <div style={{ background: '#fff', padding: 20, borderRadius: 8, width: 'min(760px, 95vw)' }}>
                <h3 style={{ marginTop: 0 }}>{editing === 'new' ? 'Add Review' : 'Edit Review'}</h3>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <label>Name</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
                    <label>Review</label>
                    <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} style={{ width: '100%', padding: 8, height: 100, marginBottom: 8 }} />
                    <label>Rating</label>
                    <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} style={{ padding: 8 }}>
                      {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div style={{ width: 220 }}>
                      <div style={{ width: 160, height: 160, borderRadius: '50%', background: '#eee', marginBottom: 8, overflow: 'hidden' }}>
                      <img src={avatarUploadedUrl || filePreview || form.avatarUrl || '/images/Rectangle 4.png'} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        console.debug('avatar input changed, file:', f);
                        if (!f) return;

                        // immediate visible feedback
                        setUploadStatusMessage('Preparing upload...');

                          // We'll upload via the server-side upload route (`/api/upload`) which stores files in S3.
                          // Ensure your server has the required AWS env vars set (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET_NAME).

                        try {
                          // create local preview
                          if (prevPreviewRef.current) { try { URL.revokeObjectURL(prevPreviewRef.current); } catch (err) { } prevPreviewRef.current = null; }
                          const url = URL.createObjectURL(f);
                          prevPreviewRef.current = url;
                          setFilePreview(url);
                          // keep the File in state so we can retry on Save if immediate upload fails
                          setFileForUpload(f);

                          // start immediate upload
                          setAvatarUploading(true);
                          setAvatarUploadProgress(0);
                          setUploadStatusMessage('Uploading avatar...');
                          try {
                            const uploaded = await uploadWithProgress(f, (p) => { setAvatarUploadProgress(p); setUploadStatusMessage(`Uploading avatar: ${p}%`); }, 'YARITU/testimonials');
                            setAvatarUploadedUrl(uploaded);
                            setUploadStatusMessage('Avatar uploaded');
                            // successful upload - clear the staged file
                            setFileForUpload(null);
                          } catch (err) {
                            console.error('Avatar upload failed', err);
                            setUploadStatusMessage('Avatar upload failed: ' + (err.message || ''));
                            setAvatarUploadedUrl('');
                            // keep fileForUpload so Save can retry
                          } finally {
                            setAvatarUploading(false);
                            setFilePreview(null);
                          }
                        } catch (err) { console.error(err); }
                      }}
                    />

                    {avatarUploading && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ height: 8, width: '100%', background: '#eee', borderRadius: 6, overflow: 'hidden' }}>
                          <div style={{ width: `${avatarUploadProgress}%`, height: '100%', background: '#213346' }} />
                        </div>
                        <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>{uploadStatusMessage}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  {uploadStatusMessage && <div style={{ marginBottom: 8 }}>{uploadStatusMessage}</div>}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div style={{ height: 10, width: '100%', background: '#eee', borderRadius: 6, overflow: 'hidden', marginBottom: 8 }}>
                      <div style={{ width: `${uploadProgress}%`, height: '100%', background: '#213346' }} />
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button onClick={handleCancel} style={{ padding: '8px 12px' }}>Cancel</button>
                    <button onClick={handleSave} style={{ padding: '8px 12px', background: '#111', color: '#fff', border: 'none' }}>{editing === 'new' ? 'Add Review' : 'Save'}</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Video Edit Modal (Admin only) */}
          {editingVideoIndex !== null && isAdmin && (
            <div className="modal-backdrop" onClick={() => setEditingVideoIndex(null)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <h3 style={{ marginTop: 0 }}>Edit Review Video</h3>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <label>Replace video</label>
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ width: '100%', height: 220, background: '#f2f2f2', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {videoFilePreview ? (
                          <video src={videoFilePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls />
                        ) : (
                          <p style={{ color: '#666' }}>No new video selected</p>
                        )}
                      </div>
                      <input type="file" accept="video/*" onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        try {
                          const url = URL.createObjectURL(f);
                          setVideoFilePreview(url);
                          // keep file in state so we can retry if upload fails
                          setVideoFileForUpload(f);
                          setVideoUploading(true);
                          setVideoUploadProgress(0);
                          setUploadStatusMessage('Uploading video...');
                          try {
                            const uploaded = await uploadWithProgress(f, (p) => { setVideoUploadProgress(p); setUploadStatusMessage(`Uploading video: ${p}%`); }, 'YARITU/review-videos');
                            setVideoUploadedUrl(uploaded);
                            setUploadStatusMessage('Video uploaded');
                            // successful upload - clear staged file
                            setVideoFileForUpload(null);
                          } catch (err) {
                            console.error('Video upload failed', err);
                            setUploadStatusMessage('Video upload failed: ' + (err.message || ''));
                            setVideoUploadedUrl('');
                            // keep videoFileForUpload for retry on Save
                          } finally {
                            setVideoUploading(false);
                          }
                        } catch (err) { console.error(err); }
                      }} />
                    </div>
                    <label>Replace thumbnail</label>
                    <div style={{ marginBottom: 8 }}>
                      {/* small helper preview for selection area (not the main preview panel) */}
                      <div style={{ width: 160, height: 160, borderRadius: '8px', background: '#eee', overflow: 'hidden' }}>
                        <img src={thumbFilePreview || thumbUploadedUrl || videos[editingVideoIndex]?.thumbnail || '/images/Rectangle 4.png'} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </div>
                    <input type="file" accept="image/*" onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      try {
                        const url = URL.createObjectURL(f);
                        setThumbFilePreview(url);
                        // stage file for upload/retry
                        setThumbFileForUpload(f);
                        setThumbUploading(true);
                        setThumbUploadProgress(0);
                        setUploadStatusMessage('Uploading thumbnail...');
                        try {
                          const uploaded = await uploadWithProgress(f, (p) => { setThumbUploadProgress(p); setUploadStatusMessage(`Uploading thumbnail: ${p}%`); }, 'YARITU/review-videos');
                          setThumbUploadedUrl(uploaded);
                          setUploadStatusMessage('Thumbnail uploaded');
                          // successful upload - clear staged file
                          setThumbFileForUpload(null);
                        } catch (err) {
                          console.error('Thumbnail upload failed', err);
                          setUploadStatusMessage('Thumbnail upload failed: ' + (err.message || ''));
                          setThumbUploadedUrl('');
                          // keep thumbFileForUpload for retry on Save
                        } finally {
                          setThumbUploading(false);
                        }
                      } catch (err) { console.error(err); }
                    }} />
                  </div>
                  <div style={{ width: 260, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <p style={{ fontWeight: 600 }}>Preview</p>
                    {/* Main preview: show either the video OR the thumbnail (not both) depending on what admin selected.
                          Default behaviour: show the video element with poster set to the thumbnail so it resembles the on-page card.
                          If the admin has selected/changed a new video -> show video. Else if admin selected/changed only thumbnail -> show the thumbnail image only. */}
                    {(() => {
                      const hasNewVideo = Boolean(videoUploadedUrl || videoFilePreview);
                      const hasNewThumb = Boolean(thumbUploadedUrl || thumbFilePreview);
                      const displayMode = hasNewVideo ? 'video' : (hasNewThumb ? 'thumb' : 'video');
                      const videoSrc = videoUploadedUrl || videoFilePreview || videos[editingVideoIndex]?.src;
                      const posterSrc = thumbUploadedUrl || thumbFilePreview || videos[editingVideoIndex]?.thumbnail;

                      return (
                        <div style={{ width: '100%', height: 220, background: '#fafafa', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {displayMode === 'video' ? (
                            <video
                              src={videoSrc}
                              poster={posterSrc}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              controls
                              muted
                            />
                          ) : (
                            <img src={posterSrc || '/images/Rectangle 4.png'} alt="thumbnail preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                        </div>
                      );
                    })()}

                    <div style={{ marginTop: 6 }}>
                      <div style={{ marginBottom: 8 }}>{uploadStatusMessage}</div>
                      {(videoUploadProgress > 0 && videoUploadProgress < 100) || (thumbUploadProgress > 0 && thumbUploadProgress < 100) ? (
                        <div>
                          {videoUploadProgress > 0 && videoUploadProgress < 100 && (
                            <div style={{ marginBottom: 6 }}>
                              <div style={{ fontSize: 12 }}>Video: {videoUploadProgress}%</div>
                              <div style={{ height: 8, width: '100%', background: '#eee', borderRadius: 6, overflow: 'hidden' }}>
                                <div style={{ width: `${videoUploadProgress}%`, height: '100%', background: '#213346' }} />
                              </div>
                            </div>
                          )}
                          {thumbUploadProgress > 0 && thumbUploadProgress < 100 && (
                            <div>
                              <div style={{ fontSize: 12 }}>Thumbnail: {thumbUploadProgress}%</div>
                              <div style={{ height: 8, width: '100%', background: '#eee', borderRadius: 6, overflow: 'hidden' }}>
                                <div style={{ width: `${thumbUploadProgress}%`, height: '100%', background: '#213346' }} />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="desktop-actions">
                  <button onClick={() => { setEditingVideoIndex(null); }} style={{ padding: '8px 12px' }}>Cancel</button>
                  <button onClick={async () => {
                    // perform uploads (video then thumb) using uploadWithProgress and update local videos array
                    try {
                      let newSrc = videos[editingVideoIndex].src;
                      let newThumb = videos[editingVideoIndex].thumbnail;
                      // if we uploaded already on selection, use those URLs
                      if (videoUploadedUrl) newSrc = videoUploadedUrl;
                      else if (videoFileForUpload) {
                        setUploadProgress(0); setUploadStatusMessage('Uploading video...');
                        newSrc = await uploadWithProgress(videoFileForUpload, (p) => { setUploadProgress(p); setUploadStatusMessage(`Uploading video: ${p}%`); }, 'YARITU/review-videos');
                      }
                      if (thumbUploadedUrl) newThumb = thumbUploadedUrl;
                      else if (thumbFileForUpload) {
                        setUploadProgress(0); setUploadStatusMessage('Uploading thumbnail...');
                        newThumb = await uploadWithProgress(thumbFileForUpload, (p) => { setUploadProgress(p); setUploadStatusMessage(`Uploading thumbnail: ${p}%`); }, 'YARITU/review-videos');
                      }
                      // update in-memory videos array
                      const updated = videos.map((it, i) => i === editingVideoIndex ? { ...it, src: normalizeVideoUrl(newSrc), thumbnail: newThumb } : it);
                      setVideos(updated);
                      // make the freshly saved video the active one so it plays immediately
                      setPlayingIdx(editingVideoIndex);
                      // Persist only valid items (non-empty src) to backend so it survives reload
                      try {
                        const payloadToPersist = updated
                          .filter(it => it && typeof it.src === 'string' && it.src.trim() !== '')
                          .map((it, idx) => ({ src: it.src, thumbnail: it.thumbnail || '', position: idx }));

                        if (payloadToPersist.length === 0) {
                          // Nothing valid to persist - warn and skip network call
                          console.warn('No valid review videos to persist (all src empty). Skipping PUT.');
                        } else {
                          const r = await fetch('/api/review-videos', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payloadToPersist) });
                          const jr = await r.json();
                          if (!r.ok || !jr.success) {
                            console.warn('Failed to persist review videos', jr);
                            alert('Failed to persist review videos to server. See console for details.');
                          }
                        }
                      } catch (err) { console.warn('Persist error', err); }
                      setUploadStatusMessage('Upload complete');
                      setTimeout(() => { setUploadStatusMessage(''); setUploadProgress(0); }, 1200);
                      setEditingVideoIndex(null);
                    } catch (err) {
                      console.error('Video edit upload failed', err);
                      setUploadStatusMessage('Upload failed: ' + (err.message || ''));
                    }
                  }} disabled={videoUploading || thumbUploading} style={{ padding: '8px 12px', background: (videoUploading || thumbUploading) ? '#999' : '#111', color: '#fff', cursor: (videoUploading || thumbUploading) ? 'not-allowed' : 'pointer' }}>Save</button>
                </div>
                {/* Mobile fixed action bar inside backdrop for stable stacking */}
                <div className="mobile-action-bar">
                  <div className="action-buttons-mobile">
                    <button onClick={() => { setEditingVideoIndex(null); }} style={{ padding: '12px' }}>Cancel</button>
                    <button onClick={async () => {
                      try {
                        let newSrc = videos[editingVideoIndex].src;
                        let newThumb = videos[editingVideoIndex].thumbnail;
                        if (videoUploadedUrl) newSrc = videoUploadedUrl;
                        else if (videoFileForUpload) {
                          setUploadProgress(0); setUploadStatusMessage('Uploading video...');
                          newSrc = await uploadWithProgress(videoFileForUpload, (p) => { setUploadProgress(p); setUploadStatusMessage(`Uploading video: ${p}%`); }, 'YARITU/review-videos');
                        }
                        if (thumbUploadedUrl) newThumb = thumbUploadedUrl;
                        else if (thumbFileForUpload) {
                          setUploadProgress(0); setUploadStatusMessage('Uploading thumbnail...');
                          newThumb = await uploadWithProgress(thumbFileForUpload, (p) => { setUploadProgress(p); setUploadStatusMessage(`Uploading thumbnail: ${p}%`); }, 'YARITU/review-videos');
                        }
                        const updated = videos.map((it, i) => i === editingVideoIndex ? { ...it, src: normalizeVideoUrl(newSrc), thumbnail: newThumb } : it);
                        setVideos(updated);
                        setPlayingIdx(editingVideoIndex);
                        try {
                          const payloadToPersist = updated
                            .filter(it => it && typeof it.src === 'string' && it.src.trim() !== '')
                            .map((it, idx) => ({ src: it.src, thumbnail: it.thumbnail || '', position: idx }));
                          if (payloadToPersist.length > 0) {
                            const r = await fetch('/api/review-videos', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payloadToPersist) });
                            const jr = await r.json();
                            if (!r.ok || !jr.success) {
                              console.warn('Failed to persist review videos', jr);
                              alert('Failed to persist review videos to server. See console for details.');
                            }
                          }
                        } catch (err) { console.warn('Persist error', err); }
                        setUploadStatusMessage('Upload complete');
                        setTimeout(() => { setUploadStatusMessage(''); setUploadProgress(0); }, 1200);
                        setEditingVideoIndex(null);
                      } catch (err) {
                        console.error('Video edit upload failed', err);
                        setUploadStatusMessage('Upload failed: ' + (err.message || ''));
                      }
                    }} disabled={videoUploading || thumbUploading} style={{ padding: '12px', background: (videoUploading || thumbUploading) ? '#999' : '#111', color: '#fff', cursor: (videoUploading || thumbUploading) ? 'not-allowed' : 'pointer' }}>Save</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}