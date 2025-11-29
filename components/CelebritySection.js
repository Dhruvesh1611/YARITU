"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import CelebrityVideoCard from './CelebrityVideoCard';
import AddCelebrityModal from './AddCelebrityModal';
import uploadFileWithPresign from '../utils/uploadFileWithPresign';
import SkeletonLoader from './SkeletonLoader';

const CelebritySection = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [videos, setVideos] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { data: session } = useSession();
  const isAdmin = !!session;
  const fileInputRef = useRef(null);
  const [replacing, setReplacing] = useState(false);

  // === NEW: Scrollable container ke liye ek Ref banaya hai ===
  const scrollContainerRef = useRef(null);
  // refs to each video element so we can control play/pause programmatically
  const videoRefs = useRef([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/celebrity');
        const json = await res.json().catch(() => null);
        if (json && json.success) setVideos(json.data);
      } catch (err) {
        console.error('Failed to fetch celebrity videos', err);
      }
    };
    fetchVideos();
  }, []);

  // viewport detection (client-side)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    setMounted(true);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // derive filtered videos by visibility (client-side)
  const filteredVideos = videos && videos.length > 0
    ? videos.filter(v => {
      const vis = v.visibility || 'both';
      if (vis === 'both') return true;
      if (vis === 'mobile') return isMobile;
      if (vis === 'desktop') return !isMobile;
      return true;
    })
    : [];

  // displayed list is either the filtered (client) list after mount, or the server-provided videos (SSR)
  const displayed = mounted ? filteredVideos : videos;

  const isRemote = (url) => {
    if (!url) return false;
    try {
      if (url.startsWith('http://') || url.startsWith('https://')) return true;
      // S3-hosted files are served via https URLs; no Cloudinary-specific checks needed.
    } catch (e) { }
    return false;
  };

  // Keep currentVideo in-bounds when displayed list changes
  useEffect(() => {
    if (!displayed || displayed.length === 0) {
      setCurrentVideo(0);
      return;
    }
    if (currentVideo >= displayed.length) {
      setCurrentVideo(0);
      goToVideo(0);
    }
  }, [displayed.length]);

  // Play/pause logic: pause all videos then play the current one
  useEffect(() => {
    const refs = videoRefs.current || [];
    refs.forEach((v, i) => {
      try {
        if (!v) return;
        if (i === currentVideo) {
          // attempt to play; browsers may block autoplay if not muted
          v.muted = true;
          const playPromise = v.play && v.play();
          if (playPromise && playPromise.then) {
            playPromise.catch(() => { /* ignore autoplay block */ });
          }
        } else {
          v.pause && v.pause();
          try { v.currentTime = 0; } catch (e) { }
        }
      } catch (err) {
        // ignore
      }
    });
  }, [currentVideo, displayed.length]);

  // === NEW: Jab user swipe/scroll kare, toh state ko update karne ke liye ===
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Jo video screen par dikh raha hai, uska index state me set karo
            const index = parseInt(entry.target.getAttribute('data-index'), 10);
            if (!isNaN(index)) {
              setCurrentVideo(index);
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.5, // Video 50% dikhne par active maano
      }
    );

    const slides = Array.from(container.children);
    slides.forEach(slide => {
      if (slide.classList.contains('video-slide')) {
        observer.observe(slide);
      }
    });

    return () => {
      slides.forEach(slide => {
        if (slide.classList.contains('video-slide')) {
          observer.unobserve(slide);
        }
      });
    };
  }, [mounted, filteredVideos]); // Re-run when displayed list changes or after mount

  // === UPDATED: Arrows/dots click karne par programmatically scroll karwane ke liye ===
  const goToVideo = (index) => {
    const container = scrollContainerRef.current;
    const len = displayed.length || 0;
    if (container && len > 0) {
      const targetIndex = (index + len) % len;
      const scrollLeft = container.offsetWidth * targetIndex;
      // update state immediately so controls and playback react without waiting for observer
      setCurrentVideo(targetIndex);
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  // Reset video refs when the displayed list length changes to avoid stale refs
  useEffect(() => {
    videoRefs.current = [];
  }, [displayed.length]);

  const goToPrevious = () => {
    const len = displayed.length || 0;
    if (len === 0) return;
    const newIndex = currentVideo === 0 ? len - 1 : currentVideo - 1;
    goToVideo(newIndex);
  };

  const goToNext = () => {
    const len = displayed.length || 0;
    if (len === 0) return;
    const newIndex = (currentVideo + 1) % len;
    goToVideo(newIndex);
  };

  // Baaki ke functions (handleFileChange, handleDelete) waise hi rahenge
  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const current = displayed[currentVideo];
    if (!current) {
      alert('No video selected to replace');
      e.target.value = '';
      return;
    }
    setReplacing(true);
    try {
      const { publicUrl } = await uploadFileWithPresign(file, 'YARITU/celebrity', (pct) => { });
      if (!publicUrl) throw new Error('Upload missing URL');

      const putRes = await fetch(`/api/celebrity/${current._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: publicUrl }),
      });
      if (!putRes.ok) throw new Error('Update failed');
      const updated = (await putRes.json()).data;
      if (updated) {
        setVideos((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      }
    } catch (err) {
      console.error('Replace video error', err);
      alert('Failed to replace video. See console for details.');
    } finally {
      setReplacing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    const current = displayed[currentVideo];
    if (!current || !confirm('Delete this video?')) return;
    try {
      const res = await fetch(`/api/celebrity/${current._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      const deleted = (await res.json()).data;
      if (deleted) {
        setVideos((prev) => prev.filter((x) => x._id !== deleted._id));
        // After deleting, ensure we land on a valid slide index
        const newLen = (displayed.length - 1);
        if (newLen <= 0) {
          goToVideo(0);
        } else {
          const newIndex = Math.min(currentVideo, newLen - 1);
          goToVideo(newIndex);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };


  return (
    <>
      <div className="celebrity-section">
        <div className="section-header">
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="section-title">Worn by <span className="highlight">Celebrities</span></h2>
            <p className="section-subtitle">Trusted by the stars for their most important moments</p>
          </div>
          {isAdmin && (
            <div style={{ marginLeft: 'auto' }}>
              <button onClick={() => setIsAddOpen(true)} className="admin-btn add-new" style={{ marginLeft: 12 }}>
                + Add Video
              </button>
            </div>
          )}
        </div>

        {isAdmin && (
          <input ref={fileInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={handleFileChange} />
        )}

        <div className="video-carousel-container">
          <button className="video-nav-arrow prev" onClick={goToPrevious} aria-label="Previous video">&#8249;</button>

          {/* === CHANGED: Ab yeh container scroll hoga aur isme saare videos honge === */}
          <div className="video-container" ref={scrollContainerRef}>
            {displayed.length > 0 ? (
              displayed.map((video, index) => (
                <div className="video-slide" key={video._id} data-index={index} style={{ position: 'relative' }}>
                  {isRemote(video.videoUrl) ? (
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      src={video.videoUrl}
                      muted
                      playsInline
                      loop
                      // leave autoplay attribute off and control playback programmatically
                      className="main-video"
                    >
                      <source src={video.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    // show skeleton placeholder instead of attempting to load a local video
                    <div style={{ position: 'absolute', inset: 0 }}>
                      <SkeletonLoader variant="video" style={{ width: '100%', height: '100%' }} />
                    </div>
                  )}

                  {/* Admin controls tethered to the active slide so they move with it */}
                  {isAdmin && index === currentVideo && (
                    <div className="slide-admin-controls">
                      <button onClick={() => fileInputRef.current?.click()} className="admin-btn" disabled={replacing}>
                        Replace
                      </button>
                      <button onClick={handleDelete} className="admin-btn delete" disabled={replacing}>
                        Delete
                      </button>
                    </div>
                  )}

                  {isAdmin && index === currentVideo && (
                    <div className="slide-add-button">
                      <button onClick={() => setIsAddOpen(true)} className="admin-btn add-new">
                        + Add Video
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-videos-placeholder">No videos yet</div>
            )}

            {replacing && (
              <div className="replacing-overlay">
                <div className="spinner"></div>
                <span>Replacing...</span>
              </div>
            )}
          </div>

          <button className="video-nav-arrow next" onClick={goToNext} aria-label="Next video">&#8250;</button>
        </div>

        <div className="video-dots">
          {displayed.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentVideo ? 'active' : ''}`}
              onClick={() => goToVideo(index)}
              aria-label={`Go to video ${index + 1}`}
            />
          ))}
        </div>

        {isAdmin && (
          <div style={{ paddingTop: 24 }}>
            <h3 style={{ marginBottom: 8 }}>Desktop Celebrity Videos</h3>
            <div className="admin-grid-container">
              {videos.filter(v => (v.visibility || 'both') === 'desktop' || (v.visibility || 'both') === 'both').map((v) => (
                <CelebrityVideoCard
                  key={v._id}
                  item={v}
                  onUpdate={(updated) => setVideos((prev) => prev.map((x) => (x._id === updated._id ? updated : x)))}
                  onDelete={(id) => setVideos((prev) => prev.filter((x) => x._id !== id))}
                />
              ))}
            </div>

            <h3 style={{ margin: '20px 0 8px' }}>Mobile Celebrity Videos</h3>
            <div className="admin-grid-container">
              {videos.filter(v => (v.visibility || 'both') === 'mobile').map((v) => (
                <CelebrityVideoCard
                  key={v._id}
                  item={v}
                  onUpdate={(updated) => setVideos((prev) => prev.map((x) => (x._id === updated._id ? updated : x)))}
                  onDelete={(id) => setVideos((prev) => prev.filter((x) => x._id !== id))}
                />
              ))}
            </div>
          </div>
        )}

        {isAddOpen && (
          <AddCelebrityModal onClose={() => setIsAddOpen(false)} onAdd={(newItem) => setVideos((prev) => [newItem, ...prev])} />
        )}
      </div>

      <style jsx>{`
      @media (max-width: 768px) {
  .section-title {
    font-size: 28px !important;
    line-height: 1.25 !important;
    margin-bottom: 8px !important;
  }

  .section-subtitle {
    font-size: 14px !important;
    line-height: 1.4 !important;
  }
}

        .celebrity-section {
            width: 100%;
            padding: 40px 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 16px;
      margin-bottom: 32px;
    }
    /* Mobile tweaks: stack header vertically and center title & controls */
      @media (max-width: 768px) {
      .section-header {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 20px;
        text-align: center;
      }
      /* Match global section-title sizing on mobile */
      .section-title {
        font-size: 32px;
      }
      .section-subtitle {
        font-size: 15px;
      }
      .admin-btn.add-new {
        margin-left: 0 !important;
      }
    }

        /* Use the global homepage section heading styles to ensure consistency */
        .section-title {
            font-weight: 700;
            font-size: 42px;
            color: var(--color-black);
            margin-bottom: 16px;
            margin: 0;
        }
        .highlight {
            color: var(--color-highlight); /* Use brand accent */
        }
        .section-subtitle {
            font-family: var(--font-body);
            font-weight: 600;
            font-size: 21px;
            color: var(--color-text-light);
            margin-top: 8px;
        }
        .video-carousel-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .video-container {
            width: 100%;
            height: 80vh;
            max-height: 720px;
            overflow: hidden;
            border-radius: 16px;
            position: relative;
            background-color: #f0f0f0;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            
            /* === NEW: Saare videos ko side-by-side rakhega === */
            display: flex;
        }

        /* === NEW: Har video slide ke liye style === */
        .video-slide {
            width: 100%;
            height: 100%;
            flex: 0 0 100%; /* Zaroori: Har slide poori width lega */
            position: relative;
        }

        .main-video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .no-videos-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #888;
            font-size: 18px;
            /* === NEW: Yeh zaroori hai taaki placeholder scroll na ho === */
            flex: 0 0 100%;
        }
        .replacing-overlay {
            position: absolute;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            z-index: 10;
            font-size: 18px;
            gap: 12px;
        }
        .spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-left-color: #fff;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .video-nav-arrow {
            background: rgba(255, 255, 255, 0.8);
            border: 1px solid #ddd;
            border-radius: 50%;
            width: 44px;
            height: 44px;
            font-size: 24px;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 20; /* Ensure arrows are on top */
        }
        .video-nav-arrow:hover {
            background: white;
            transform: scale(1.1);
        }
        .video-dots {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 24px;
        }
        .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid #ccc;
            background-color: transparent;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .dot.active {
            background-color: #333;
            border-color: #333;
            transform: scale(1.1);
        }
        
        /* Admin Controls */
        .admin-video-controls {
            position: absolute;
            right: 16px;
            top: 16px;
            z-index: 20;
            display: flex;
            gap: 8px;
        }
        .admin-add-button-container {
            position: absolute;
            right: 16px;
            bottom: 16px;
            z-index: 20;
        }
        .admin-btn {
            padding: 8px 14px;
            border-radius: 8px;
            border: 1px solid rgba(0,0,0,0.1);
            background-color: rgba(255, 255, 255, 0.9);
            color: #333;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
        }
        .admin-btn:hover {
            background-color: white;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .admin-btn.delete {
            background-color: #fee2e2;
            color: #b91c1c;
        }
         .admin-btn.delete:hover {
            background-color: #fecaca;
        }
        .admin-btn.add-new {
            background-color: #111;
            color: #fff;
        }
        .admin-btn.add-new:hover {
            background-color: #333;
        }
        
        .admin-grid-container {
            margin-top: 32px;
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
            justify-content: center;
        }
    .slide-admin-controls {
      position: absolute;
      right: 12px;
      top: 12px;
      z-index: 30;
      display: flex;
      gap: 8px;
    }
    .slide-add-button {
      position: absolute;
      right: 12px;
      bottom: 12px;
      z-index: 30;
    }
        .no-videos-message {
            padding: 20px;
            background: #f5f5f5;
            border-radius: 8px;
            color: #666;
            width: 100%;
            text-align: center;
        }
        
        /* === NEW & UPDATED: Mobile-specific scroll snap styles === */
        @media (max-width: 768px) {
            .video-nav-arrow { 
                display: none; /* Mobile par arrows hide karo */
            }

            .video-container {
                /* 1. Horizontal scroll on karo */
                overflow-x: scroll;
                
                /* 2. Scroll Snap activate karo */
                scroll-snap-type: x mandatory;

                /* 3. Mobile par design theek karo */
                border-radius: 0;
                box-shadow: none;

                /* 4. Scrollbar ko chupa do */
                -ms-overflow-style: none;
                scrollbar-width: none;
            }

            .video-container::-webkit-scrollbar {
                display: none; /* Chrome, Safari ke liye */
            }

            .video-slide {
                /* 5. Snap point set karo */
                scroll-snap-align: start;
            }
        }
      `}</style>
    </>
  );
};

export default CelebritySection;