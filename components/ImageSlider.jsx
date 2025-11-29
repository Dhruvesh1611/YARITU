"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ImageSlider.module.css';
import { useRouter } from 'next/navigation';
import AddFeaturedModal from './AddFeaturedModal';
import { useSession } from 'next-auth/react';
// SkeletonLoader is no longer needed in the complex loading flow, keeping imports clean.
import FeaturedImageCard from './FeaturedImageCard';

// === ICONS (SVG FOR EDIT AND DELETE) ===
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

// === MAIN IMAGE SLIDER COMPONENT ===

const mobileVariants = {
    left: { x: '-70%', scale: 0.8, opacity: 0.6, zIndex: 2 },
    center: { x: '0%', scale: 1, opacity: 1, zIndex: 3 },
    right: { x: '70%', scale: 0.8, opacity: 0.6, zIndex: 2 },
};

const desktopVariants = {
    left: { x: '-95%', scale: 0.8, opacity: 0.8, zIndex: 2 },
    center: { x: '0%', scale: 1, opacity: 1, zIndex: 3 },
    right: { x: '95%', scale: 0.8, opacity: 0.8, zIndex: 2 },
};

const ImageSlider = () => {
    const router = useRouter();
    const [centerIndex, setCenterIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const { data: session } = useSession();
    const [images, setImages] = useState([]);

    // Complex state management removed (refreshKey, waitForSrc, isLoading)
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    // Placeholder for pointer ref/handlers (if swipe is still needed)
    const pointer = useRef({ startX: 0, startY: 0, isDown: false, moved: false });

    // ... (useEffect for media query and initial data fetch)
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)');
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await fetch('/api/featured');
                const json = await res.json().catch(() => null);
                if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
                    setImages(json.data.map((i) => ({ src: i.src, alt: i.alt || '', _id: i._id })));
                    setCenterIndex(0);
                } else {
                    setImages([]);
                }
            } catch (err) {
                console.error('Failed to fetch featured images', err);
                setImages([]);
            }
        };
        fetchFeatured();
    }, []);


    // ✅ Simple function logic
    const goToPrevious = useCallback(() => {
        if (images.length === 0) return;
        setCenterIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }, [images.length]);

    const goToNext = useCallback(() => {
        if (images.length === 0) return;
        setCenterIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, [images.length]);

    const handleUpdate = useCallback((item) => {
        setCurrentItem(item);
        setIsEditOpen(true);
    }, []);

    const handleDelete = useCallback((idToDelete) => {
        setImages((prev) => prev.filter((image) => image._id !== idToDelete));
        setCenterIndex((prev) => (prev) % (images.length - 1 || 1));
    }, [images.length]);

    // ✅ Simple Add logic (No complex state management)
    const handleAdd = useCallback((newItem) => {
        setImages((prev) => [{ src: newItem.src, alt: newItem.alt || '', _id: newItem._id }, ...prev]);
        setCenterIndex(0);
    }, []);

    const handleUpdateInList = useCallback((updatedItem) => {
        setImages((p) => p.map((x) => (x._id === updatedItem._id ? { src: updatedItem.src, alt: updatedItem.alt, _id: updatedItem._id } : x)));
    }, []);


    const total = images.length;

    if (total === 0 && !session) {
        return null;
    }

    // Index calculation (Total 0 hone par yeh run nahi hoga, jo theek hai)
    const leftIndex = (centerIndex - 1 + total) % total;
    const rightIndex = (centerIndex + 1) % total;

    const visibleImages = total > 0 ? [
        { ...images[leftIndex], position: 'left' },
        { ...images[centerIndex], position: 'center' },
        { ...images[rightIndex], position: 'right' },
    ] : [];

    // Pointer handlers (swipe functionality)
    const onPointerDown = (e) => { /* ... */ };
    const onPointerMove = (e) => { /* ... */ };
    const onPointerUp = (e) => { /* ... */ };


    return (
        <>
            <div className={styles.carouselContainer}>

                {total > 0 && (
                    <>
                        {/* ✅ goToPrevious aur goToNext ab available hain */}
                        <button onClick={goToPrevious} className={`${styles.arrow} ${styles.leftArrow}`}>
                            &#10094;
                        </button>

                        <div className={styles.imageWrapper}
                            onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
                            onTouchStart={onPointerDown} onTouchMove={onPointerMove} onTouchEnd={onPointerUp}
                        >
                            <AnimatePresence key={total}>
                                {visibleImages.map((image) => (
                                <motion.div
                                        // Use a stable key per image so AnimatePresence can animate src changes
                                        // prefer unique _id, fallback to src, fallback to position
                                        key={image._id || image.src || image.position}
                                        className={styles.imageCard}
                                        variants={isMobile ? mobileVariants : desktopVariants}
                                        initial={false}
                                        animate={image.position}
                                        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                                        // Only the center image should navigate to the collection page
                                        onClick={image.position === 'center' ? () => router.push('/collection') : undefined}
                                        role={image.position === 'center' ? 'link' : undefined}
                                        tabIndex={image.position === 'center' ? 0 : -1}
                                        onKeyDown={(e) => {
                                            if (image.position !== 'center') return;
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                router.push('/collection');
                                            }
                                        }}
                                        style={{ cursor: image.position === 'center' ? 'pointer' : 'default' }}
                                    >
                                        {image.src ? (
                                            <Image
                                                src={image.src}
                                                alt={image.alt || 'Featured image'}
                                                fill
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                                className={`${styles.image} ${styles.initialHidden}`} // InitialHidden class diya
                                                priority={image.position === 'center'}
                                                onLoadingComplete={(img) => {
                                                    // ✅ FIX: Image load hone par CSS class add karo
                                                    try { img.classList.add(styles.loaded); } catch (err) { }
                                                }}
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', background: '#eee' }} />
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <button onClick={goToNext} className={`${styles.arrow} ${styles.rightArrow}`}>
                            &#10095;
                        </button>
                    </>
                )}

                {session && (
                    <div className={styles.addFeaturedContainer}>
                        <button onClick={() => setIsAddOpen(true)} className={styles.addFeaturedBtn}>
                            + Add New
                        </button>
                    </div>
                )}

                {isAddOpen && (
                    <AddFeaturedModal
                        onClose={() => setIsAddOpen(false)}
                        onAdd={handleAdd}
                    />
                )}
                {isEditOpen && currentItem && (
                    <AddFeaturedModal
                        isEditing={true}
                        item={currentItem}
                        onClose={() => { setIsEditOpen(false); setCurrentItem(null); }}
                        onUpdate={handleUpdateInList}
                    />
                )}
            </div>

            {session && images && images.length > 0 && (
                <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {images.map((img, idx) => (
                        <FeaturedImageCard
                            key={img._id || `featured-${idx}`}
                            item={{ src: img.src, alt: img.alt, _id: img._id }}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
            {session && images.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px 0', color: '#888' }}>
                    No featured images found. Click "+ Add New" to add one.
                </div>
            )}
        </>
    );
};

export default ImageSlider;