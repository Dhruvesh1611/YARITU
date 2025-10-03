// components/ImageSlider.jsx

"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ImageSlider.module.css';

// Aap yahan apni images daal sakte hain
const images = [
  { src: '/images/offer1.png', alt: 'Image 1' },
  { src: '/images/offer2.png', alt: 'Image 2' },
  { src: '/images/offer3.png', alt: 'Image 3' },
  { src: '/images/offer4.png', alt: 'Image 4' },
  { src: '/images/offer5.png', alt: 'Image 5' },
];

const variants = {
  left: { x: '-70%', scale: 0.8, opacity: 0.6, zIndex: 2 },
  center: { x: '0%', scale: 1, opacity: 1, zIndex: 3 },
  right: { x: '70%', scale: 0.8, opacity: 0.6, zIndex: 2 },
};

const ImageSlider = () => {
  const [centerIndex, setCenterIndex] = useState(0);
  const totalImages = images.length;

  // Previous button ka logic bilkul sahi hai
  // Is function ko replace karein
  const goToPrevious = () => {
    console.log("--- Left Arrow Clicked! ---"); // Step A: Check if function is running
    setCenterIndex((prevIndex) => {
      console.log("Current (old) index was:", prevIndex); // Step B: Check old index
      const newIndex = (prevIndex - 1 + totalImages) % totalImages;
      console.log("Calculated (new) index is:", newIndex); // Step C: Check new calculated index
      return newIndex;
    });
  };

  // Next button ka logic bhi bilkul sahi hai
  const goToNext = () => {
    setCenterIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  const leftIndex = (centerIndex - 1 + totalImages) % totalImages;
  const rightIndex = (centerIndex + 1) % totalImages;

  // Sirf 3 images render karenge: left, center, aur right
  const visibleImages = [
    { ...images[leftIndex], position: 'left' },
    { ...images[centerIndex], position: 'center' },
    { ...images[rightIndex], position: 'right' },
  ];

  return (
    <div className={styles.carouselContainer}>
      <button onClick={goToPrevious} className={`${styles.arrow} ${styles.leftArrow}`}>
        &#10094;
      </button>

      <div className={styles.imageWrapper}>
        <AnimatePresence>
          {visibleImages.map((image) => (
            <motion.div
              key={image.src} // Key hamesha unique honi chahiye
              className={styles.imageCard}
              variants={variants}
              initial={false} // Initial animation disable karein
              animate={image.position} // 'left', 'center', ya 'right'
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