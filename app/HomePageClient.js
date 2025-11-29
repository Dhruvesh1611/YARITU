// app/HomePageClient.js

"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './home.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import uploadFileWithPresign from '../utils/uploadFileWithPresign';

// Components
import MultipleOffers from '../components/MultipleOffers';
import StayClassy from '../components/StayClassy';
import CelebritySection from '../components/CelebritySection';
import TestimonialsSlider from '../components/TestimonialsSlider';
import ImageSlider from '../components/ImageSlider';
import HowItWorks from '../components/HowItWorks';
import StoreCard from '../components/StoreCard';
import AddStoreModal from '../components/AddStoreModal';
import HeroImageCard from '../components/HeroImageCard';
import AddHeroModal from '../components/AddHeroModal';
import TrendingVideoCard from '../components/TrendingVideoCard';
import SkeletonLoader from '../components/SkeletonLoader';

// Yeh local fallback array abhi bhi zaroori hai agar server se data na aaye
const heroImages = [
  '/images/hero1.png',
  '/images/hero2.png',
  '/images/hero3.png'
];

export default function HomePageClient({ initialHeroItems, initialStores, initialTrendingVideos }) {
  const router = useRouter();
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  
  // State ko server se mile initial data se shuru karein
  const [stores, setStores] = useState(initialStores || []);
  const [isStoresLoading, setIsStoresLoading] = useState(!(initialStores && initialStores.length > 0));
  const [heroItems, setHeroItems] = useState(initialHeroItems || []);
  const [isHeroLoading, setIsHeroLoading] = useState(!(initialHeroItems && initialHeroItems.length > 0));
  const [trendingVideos, setTrendingVideos] = useState(initialTrendingVideos || []);
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);

  const { data: session } = useSession();
  const isAdmin = !!(session?.user?.isAdmin || session?.user?.role === 'admin');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAddHeroOpen, setIsAddHeroOpen] = useState(false);
  const [replacePosition, setReplacePosition] = useState(null);
  const fileInputRef = useRef(null);
  const [replacing, setReplacing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const trendingContainerRef = useRef(null);
  const centerImageRef = useRef(null); 
  const featuredContainerRef = useRef(null);

  // Client-side fallback: if no stores came from SSR, fetch once on mount
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIsMobile();
    // mark mounted once we have an accurate viewport
    setMounted(true);
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [trendingVideos, isTrendingLoading, isMobile]);

  // Fetch hero items on the client if we didn't receive them from the server
  useEffect(() => {
    let mounted = true;
    const loadHero = async () => {
      if (initialHeroItems && initialHeroItems.length > 0) {
        setIsHeroLoading(false);
        return;
      }
      setIsHeroLoading(true);
      try {
        const res = await fetch('/api/hero', { cache: 'no-store' });
        if (res.ok) {
          const j = await res.json().catch(() => null);
          if (j?.success && Array.isArray(j.data) && mounted) {
            setHeroItems(j.data);
            // debug log so we can inspect what was returned on deployed site
            console.info('HomePageClient: fetched hero items', j.data);
          }
        }
      } catch (err) {
        // ignore and show empty state
      } finally {
        if (mounted) setIsHeroLoading(false);
      }
    };

    loadHero();
    return () => { mounted = false; };
  }, [initialHeroItems]);

  // derive filtered hero items based on visibility flag
  const filteredHeroItems = heroItems && heroItems.length > 0
    ? heroItems.filter(h => {
        const v = (h.visibility || 'both');
        if (v === 'both') return true;
        if (v === 'mobile') return isMobile;
        if (v === 'desktop') return !isMobile;
        return true;
      })
    : [];
  useEffect(() => {
    let mounted = true;
    const doFetch = async () => {
      if (!mounted) return;
      if (!stores || stores.length === 0) {
        setIsStoresLoading(true);
        try {
          const r = await fetch('/api/stores', { cache: 'no-store' });
          if (r.ok) {
            const j = await r.json().catch(() => null);
            if (j?.success && Array.isArray(j.data) && mounted) setStores(j.data);
          }
        } catch (err) {
          // ignore
        } finally {
          if (mounted) setIsStoresLoading(false);
        }
      } else {
        // we already had stores from SSR
        setIsStoresLoading(false);
      }
    };

    doFetch();
    return () => { mounted = false; };
  }, []);

  // When stores finish loading, add a loaded class to reveal cards with a fade-in
  useEffect(() => {
    if (isStoresLoading) return;
    const timer = setTimeout(() => {
      try {
        const cards = document.querySelectorAll('.home-store-card');
        cards.forEach((c) => c.classList.add('loaded'));
      } catch (err) {}
    }, 80);
    return () => clearTimeout(timer);
  }, [isStoresLoading, stores]);

  // Helper to upload files using presigned PUTs (requests a presign from /api/upload then PUTs to S3)
  // Returns an object shaped like the old server response to preserve compatibility: { url, secure_url }
  const uploadToServer = async (file, folder = 'YARITU/trending', onProgress) => {
    // uploadFileWithPresign returns { publicUrl, key }
    const res = await uploadFileWithPresign(file, folder, onProgress);
    const url = res.publicUrl || res.key || null;
    if (!url) throw new Error('Upload did not return a URL');
    return { url, secure_url: url };
  };

  // Data fetching wala useEffect hata diya gaya hai, baki sab waisa hi hai
  useEffect(() => {
    // when filtered list changes, reset index to 0 to avoid showing an out-of-range or filtered-out item
    setCurrentHeroImage(0);
    const heroInterval = setInterval(() => {
      const len = (filteredHeroItems.length > 0 ? filteredHeroItems.length : heroImages.length);
      setCurrentHeroImage(prev => (prev + 1) % len);
    }, 3000);

    const initializeScrollPositions = () => {
      if (featuredContainerRef.current) {
        featuredContainerRef.current.scrollLeft = 300; 
      }
    };

    const timer = setTimeout(initializeScrollPositions, 100);

    return () => {
      clearInterval(heroInterval);
      clearTimeout(timer);
    };
  }, [filteredHeroItems.length, isMobile]);

  // Effect to center trending section when it comes into view
  useEffect(() => {
    const trendingContainer = trendingContainerRef.current;
    const imageToCenter = centerImageRef.current;

    if (!trendingContainer || !imageToCenter) return;

    // Helper which centers the given element inside the scroll container
    const centerTrendingView = (elem) => {
      try {
        const containerRect = trendingContainer.getBoundingClientRect();
        const elemRect = elem.getBoundingClientRect();
        // compute element center relative to container scrollLeft
        const containerCenterX = containerRect.width / 2;
        const elemCenterOffset = (elemRect.left - containerRect.left) + (elemRect.width / 2);
        const scrollPosition = Math.max(0, elemCenterOffset - containerCenterX + trendingContainer.scrollLeft);
        trendingContainer.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      } catch (err) {
        // fallback: compute using offsets
        const containerCenter = trendingContainer.offsetWidth / 2;
        const imageCenter = (elem.offsetLeft || 0) + (elem.offsetWidth || 0) / 2;
        const scrollPosition = imageCenter - containerCenter;
        trendingContainer.scrollLeft = scrollPosition;
      }
    };

    // On mobile we want the 3rd video to be centered initially
    // give a slightly longer delay to ensure layout & media have settled
    const initialTimeout = setTimeout(() => {
      // prefer the explicit centerImageRef (pos === 3), otherwise pick the 3rd child
      const el = centerImageRef.current || trendingContainer.querySelector('.trending-img.pos3') || trendingContainer.children[2];
      if (el) centerTrendingView(el);
    }, 300);

    // When the trending container becomes visible again (re-entry), recenter to the 3rd video
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const el = centerImageRef.current || trendingContainer.querySelector('.trending-img.pos3') || trendingContainer.children[2];
          if (el) centerTrendingView(el);
        }
      },
      { threshold: 0.5 }
    );

    if (trendingContainer) {
      observer.observe(trendingContainer);
    }
    
    return () => {
      if (trendingContainer) {
        observer.unobserve(trendingContainer);
      }
      clearTimeout(initialTimeout);
    };
  }, []);

  // Load trending videos if not provided by SSR
  useEffect(() => {
    let mounted = true;
    const loadTrending = async () => {
      try {
        if (initialTrendingVideos && Array.isArray(initialTrendingVideos) && initialTrendingVideos.length > 0) {
          if (mounted) setTrendingVideos(initialTrendingVideos);
          return;
        }

        const res = await fetch('/api/trending', { cache: 'no-store' });
        if (res.ok) {
          const j = await res.json();
          if (j?.success && Array.isArray(j.data)) {
            if (mounted) setTrendingVideos(j.data);
          }
        }
      } catch (err) {
        // ignore errors and show empty state
      } finally {
        if (mounted) setIsTrendingLoading(false);
      }
    };

    loadTrending();
    return () => { mounted = false; };
  }, [initialTrendingVideos]);

  // Video playback logic for trending section
  useEffect(() => {
    const container = trendingContainerRef.current;
    if (!container) return;

    const videos = Array.from(container.querySelectorAll('.trending-video'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.8) {
            video.play().catch(error => console.log("Autoplay was prevented: ", error));
          } else {
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      {
        root: container,
        threshold: 0.8,
      }
    );

    videos.forEach((video) => observer.observe(video));

    return () => {
      videos.forEach((video) => observer.unobserve(video));
    };
  }, [trendingVideos]); // Added trendingVideos dependency to re-run when videos change

  return (
    <>
      <section id="section-hero" className="hero-section">
        {session && (
          <div style={{ position: 'absolute', right: 16, bottom: 16, zIndex: 40 }}>
            <button onClick={() => setIsAddHeroOpen(true)} style={{ padding: '6px 10px' }}>Add Hero Image</button>
          </div>
        )}
        <AnimatePresence>
          <motion.div
            key={currentHeroImage}
            className="hero-bg-image"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.5 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            {(() => {
              const list = (mounted ? filteredHeroItems : heroItems) || [];
              const hasItem = list.length > 0;
              const currentItem = hasItem ? list[currentHeroImage % list.length] : null;
              const imageUrl = currentItem?.imageUrl;

              // Treat absolute http(s) URLs as remote. Cloudinary build-time envs
              // were removed during the S3 migration so we only rely on protocol.
              const isRemote = (url) => {
                if (!url) return false;
                try {
                  if (url.startsWith('http://') || url.startsWith('https://')) return true;
                } catch (e) {}
                return false;
              };

              if (isRemote(imageUrl)) {
                return (
                  <Image
                    src={imageUrl}
                    alt={currentItem?.title || `Hero ${currentHeroImage + 1}`}
                    fill
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                );
              }

              // No remote image yet — render skeleton placeholder but keep layout
              return (
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <SkeletonLoader variant="video" style={{ width: '100%', height: '100%' }} />
                </div>
              );
            })()}
          </motion.div>
        </AnimatePresence>
        <div className="hero-dots">
          {((mounted ? filteredHeroItems : heroItems).length > 0 ? (mounted ? filteredHeroItems : heroItems) : heroImages).map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentHeroImage ? 'active' : ''}`}
              onClick={() => setCurrentHeroImage(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {session && (
        <section style={{ padding: 12, borderTop: '1px solid #eee', background: '#fafafa' }}>
          <h3 style={{ margin: '8px 0' }}>Desktop Hero Images</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8, justifyContent: 'center' }}>
            {heroItems.filter(h => (h.visibility || 'both') === 'desktop' || (h.visibility || 'both') === 'both').map((h) => (
              <HeroImageCard
                key={h._id}
                item={h}
                onUpdate={(updated) => setHeroItems((prev) => prev.map((x) => (x._id === updated._id ? updated : x)))}
                onDelete={(id) => setHeroItems((prev) => prev.filter((x) => x._id !== id))}
              />
            ))}
          </div>

          <h3 style={{ margin: '16px 0 8px 0' }}>Mobile Hero Images</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8, justifyContent: 'center' }}>
            {heroItems.filter(h => (h.visibility || 'both') === 'mobile').map((h) => (
              <HeroImageCard
                key={h._id}
                item={h}
                onUpdate={(updated) => setHeroItems((prev) => prev.map((x) => (x._id === updated._id ? updated : x)))}
                onDelete={(id) => setHeroItems((prev) => prev.filter((x) => x._id !== id))}
              />
            ))}
          </div>
        </section>
      )}

      {isAddHeroOpen && (
        <AddHeroModal
          onClose={() => setIsAddHeroOpen(false)}
          onAdd={(newItem) => setHeroItems((prev) => [newItem, ...prev])}
        />
      )}
      
      <div className="page-content-wrapper">
        <CelebritySection />
        <section id="section-featured" className="section-container">
          <div className="featured-header" onClick={() => router.push('/collection')} style={{ cursor: 'pointer' }} role="link" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') router.push('/collection'); }}>
            <h2 className="section-title">Featured <span className="highlight">Collection</span></h2>
            <p className="section-subtitle">Handpicked designs that define luxury and elegance</p>
          </div>
          <div ref={featuredContainerRef} className="featured-gallery-wrapper">
             <ImageSlider />
          </div>
        </section>

        <section id="section-trending" className="section-container">
          <h2 className="section-title" style={{ cursor: 'pointer' }} onClick={() => router.push('/collection')}>Trending <span className="highlight">Now</span></h2>
          <p className="section-subtitle">Where style meets the spotlight — the moments everyone’s talking about.</p>
          <div ref={trendingContainerRef} className="trending-images-container" style={{ cursor: 'default' }}>
              <Image src="/images/background_shape.png" className="trending-bg" alt="background shape" fill sizes="(max-width: 1024px) 100vw, 1200px" style={{ objectFit: 'cover' }} />

              {isAdmin && (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file || replacePosition === null) return;
                    setReplacing(true);
                  
                    try {
                      // Upload to local server (S3-backed /api/upload) instead of Cloudinary
                      setUploadProgress(0);
                      let uploadResp;
                      try {
                        uploadResp = await uploadToServer(file, 'YARITU/trending', (pct) => setUploadProgress(pct));
                      } catch (err) {
                        throw err;
                      }
                      const videoUrl = uploadResp?.url || uploadResp?.secure_url || uploadResp?.secureUrl;
                  
                      if (!videoUrl) {
                        throw new Error('Upload endpoint did not return a URL.');
                      }
                  
                      const itemToUpdate = trendingVideos.find((t) => t.position === replacePosition);
                  
                      let finalResponse;
                      if (itemToUpdate) {
                        finalResponse = await fetch(`/api/trending/${itemToUpdate._id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ videoUrl: videoUrl }),
                        });
                      } else {
                        finalResponse = await fetch('/api/trending', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ title: '', videoUrl: videoUrl, position: replacePosition }),
                        });
                      }
                  
                      if (!finalResponse.ok) {
                        const errorBody = await finalResponse.json().catch(() => ({}));
                        throw new Error(errorBody?.error || 'Failed to save the new video URL to the database.');
                      }
                  
                      const { data: savedData } = await finalResponse.json();
                  
                      if (itemToUpdate) {
                        setTrendingVideos((prev) => prev.map((p) => (p._id === savedData._id ? savedData : p)));
                      } else {
                        setTrendingVideos((prev) => [...prev.filter(p => p.position !== savedData.position), savedData].sort((a,b) => (a.position || 0) - (b.position || 0)));
                      }
                      
                    } catch (err) {
                      console.error('Replace video error:', err);
                      alert(`Failed to replace video: ${err.message}`);
                    } finally {
                      // finalize UI
                      setUploadProgress(0);
                      setReplacing(false);
                      setReplacePosition(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }
                  }}
                />
              )}

              {/* Admin upload progress overlay */}
              {isAdmin && (replacing || uploadProgress > 0) && (
                <div style={{ position: 'absolute', right: 12, top: 12, zIndex: 60, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '8px 12px', borderRadius: 8 }}>
                  <div style={{ fontSize: 13, marginBottom: 6 }}>{replacing ? 'Uploading...' : 'Upload progress'}</div>
                  <div style={{ width: 220, height: 10, background: '#222', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${uploadProgress}%`, height: '100%', background: '#4caf50', transition: 'width 0.2s' }} />
                  </div>
                </div>
              )}

            {isTrendingLoading ? (
              [1,2,3,4,5].map(pos => (
                <div key={`skeleton-${pos}`} style={{ position: 'absolute', left: 66 + (pos - 1) * 233, top: pos === 3 ? 67 : (pos === 2 || pos === 4 ? 106 : 145), width: pos === 3 ? 245 : (pos === 2 || pos === 4 ? 224 : 204), height: pos === 3 ? 527 : (pos === 2 || pos === 4 ? 441 : 363), zIndex: pos === 3 ? 4 : (pos === 2 || pos === 4 ? 3 : 2) }}>
                  <SkeletonLoader variant="video" />
                </div>
              ))
            ) : (
              [1,2,3,4,5].map(pos => {
                const videoItem = trendingVideos.find(t => t.position === pos);
                const videoSrc = videoItem ? (videoItem.video || videoItem.videoUrl || videoItem.url) : null;

                const styles = {
                  1: { position: 'absolute', left: '66px', top: '145px', width: '204px', height: '363px', zIndex: 2 },
                  2: { position: 'absolute', left: '279px', top: '106px', width: '224px', height: '441px', zIndex: 3 },
                  3: { position: 'absolute', left: '512px', top: '67px', width: '245px', height: '527px', zIndex: 4 },
                  4: { position: 'absolute', left: '766px', top: '106px', width: '224px', height: '441px', zIndex: 3 },
                  5: { position: 'absolute', left: '999px', top: '145px', width: '204px', height: '363px', zIndex: 2 },
                };

                return (
                  <div key={pos} style={styles[pos]}>
                    {videoSrc ? (
                      <video
                        key={videoSrc}
                        ref={pos === 3 ? centerImageRef : null}
                        className={`trending-video trending-img pos${pos} ${pos === 3 ? 'center' : ''}`}
                        playsInline
                        muted
                        loop
                        autoPlay
                        preload="metadata"
                        src={videoSrc}
                        onLoadedData={(e) => {
                          try {
                            e.currentTarget.play().catch(() => {});
                          } catch (err) {}
                          // add loaded class to trigger CSS fade-in
                          try { e.currentTarget.classList.add('loaded'); } catch (err) {}
                          // hide placeholder if present
                          try {
                            const ph = e.currentTarget.parentElement && e.currentTarget.parentElement.querySelector('.trending-placeholder');
                            if (ph) ph.classList.add('hidden');
                          } catch (err) {}
                        }}
                        style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="trending-placeholder" />
                    )}
                    {isAdmin && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', padding: 8, pointerEvents: 'none' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setReplacePosition(pos); fileInputRef.current && fileInputRef.current.click(); }}
                          style={{ pointerEvents: 'auto', marginBottom: 6, zIndex: 20, padding: '6px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.95)', border: '1px solid #ccc', cursor: 'pointer' }}
                        >
                          {replacing && replacePosition === pos ? 'Replacing...' : 'Edit'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
        
        <MultipleOffers />
        <StayClassy />

        <section id="home-stores" className="section-container home-stores">
          <h2 className="section-title">Visit Our <span className="highlight">Stores</span></h2>
          {session && (
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <button onClick={() => setIsAddOpen(true)} style={{ padding: '8px 12px' }}>
                Add Store
              </button>
            </div>
          )}
          <div className="stores-grid">
            {isStoresLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={`store-skel-${i}`} className="home-store-card" style={{ opacity: 0 }}>
                  <SkeletonLoader variant="video" style={{ width: 230, height: 180 }} />
                </div>
              ))
            ) : (
              (() => {
                const sortedStores = Array.isArray(stores)
                  ? [...stores].sort((a, b) => (String(a?.name || '').localeCompare(String(b?.name || ''))))
                  : stores;
                return sortedStores.map((store, index) => (
                <StoreCard
                  key={store._id}
                  store={store}
                  index={index}
                  onUpdate={(updated) => setStores((prev) => prev.map((s) => (s._id === updated._id ? updated : s)))}
                  onDelete={(id) => setStores((prev) => prev.filter((s) => s._id !== id))}
                />
                ));
              })()
            )}
          </div>
        </section>

        {isAddOpen && (
          <AddStoreModal
            onClose={() => setIsAddOpen(false)}
            onAdd={(newStore) => setStores((prev) => [newStore, ...prev])}
          />
        )}

        <HowItWorks />

        <section id="section-testimonials" className="section-container">
          <h2 className="section-title">What Our <span className="highlight">Clients Say</span></h2>
          <p className="section-subtitle">Real experiences from our satisfied customers</p>
          <TestimonialsSlider location="home" />
        </section>
      </div>
    </>
  );
}

