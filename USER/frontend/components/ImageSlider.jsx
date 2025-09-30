// components/ImageSlider.jsx

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ImageSlider.module.css';

const images = [
  { src: '/images/offer1.png', alt: 'Image 1' },
  { src: '/images/offer2.png', alt: 'Image 2' },
  { src: '/images/offer3.png', alt: 'Image 3' },
  { src: '/images/offer4.png', alt: 'Image 4' },
  { src: '/images/offer5.png', alt: 'Image 5' },
];

// YEH SAHI VARIANTS HAIN
const variants = {
  left: {
    x: '-70%', // Left card ko left mein rakhega
    scale: 0.8,
    opacity: 0.6,
    zIndex: 2,
  },
  center: {
    x: '0%',
    scale: 1,
    opacity: 1,
    zIndex: 3,
  },
  right: {
    x: '70%', // Right card ko right mein rakhega
    scale: 0.8,
    opacity: 0.6,
    zIndex: 2,
  },
};

const ImageSlider = () => {
  const [centerIndex, setCenterIndex] = useState(0);
  const total = images.length;

  const getVisibleImages = () => {
    const left = images[(centerIndex - 1+ total) % total];
    const center = images[centerIndex];
    const right = images[(centerIndex + 1) % total];
    return [left, center, right];
  };

  const goToNext = () => setCenterIndex((prev) => (prev + 1) % total);
  
  // Yeh bhi theek kar diya hai
  const goToPrevious = () => setCenterIndex((prev) => (prev + total - 1) % total);

  const visibleImages = getVisibleImages();

  return (
    <div className={styles.carouselContainer}>
      <button onClick={goToPrevious} className={`${styles.arrow} ${styles.leftArrow}`}>
        &#10094;
      </button>

      <div className={styles.imageWrapper}>
        <AnimatePresence>
          {visibleImages.map((image, idx) => (
            <motion.div
              key={image.src}
              className={styles.imageCard}
              variants={variants}
              initial={false}
              animate={idx === 0 ? 'left' : idx === 1 ? 'center' : 'right'}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={500}
                height={400}
                className={styles.image}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button onClick={goToNext} className={`${styles.arrow} ${styles.rightArrow}`}>
        &#10095;
      </button>
    </div>
  );
};

export default ImageSlider;