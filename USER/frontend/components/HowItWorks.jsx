// components/HowItWorks.jsx

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './HowItWorks.module.css';

// Har step ka data (image, title, description)
const stepsData = [
  {
    title: 'Select Your Style',
    description: 'Browse our exquisite collection of traditional and contemporary designs. Each piece is carefully curated to reflect elegance and sophistication.',
    imgSrc: '/images/step1.png',
  },
  {
    title: 'Visit Our Showroom',
    description: 'Experience our luxurious showrooms with traditional architecture and personalized service. Our experts will help you find the perfect outfit.',
    imgSrc: '/images/step2.png',
  },
  {
    title: 'Experience Luxury',
    description: 'Enjoy the perfect fit and exquisite craftsmanship. Our garments are designed to make every moment special and memorable.',
    imgSrc: '/images/step3.png',
  },
  {
    title: 'Hassle-free Returns',
    description: 'Complete satisfaction guaranteed. Our flexible return policy ensures you’re completely happy with your purchase.',
    imgSrc: '/images/step4.png',
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = parseInt(entry.target.dataset.index, 10);
            setActiveStep(stepIndex);
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px', // Jab step screen ke vertical center mein aaye
        threshold: 0,
      }
    );

    const currentRefs = stepRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentWrapper}>
        {/* === LEFT (STICKY) COLUMN === */}
        <div className={styles.leftStickyColumn}>
          {/* Fullscreen Background Image */}
          <div className={styles.fullscreenBackground}>
            <Image
              src="/images/HOW YARITU WORKS.png" // Background image ka path
              alt="Yaritu Store Background"
              layout="fill"
              objectFit="cover"
              quality={80}
            />
          </div>

          {/* "HOW YARITU WORKS" Heading */}
          <h2 className={styles.stickyHeading}>HOW YARITU WORKS</h2>

          {/* Changing Image Frame */}
          <div className={styles.imageContainer}>
            {stepsData.map((step, index) => (
              <div
                key={index}
                className={`${styles.imageFrame} ${
                  activeStep === index ? styles.visible : styles.hidden
                }`}
              >
                <Image
                  src={step.imgSrc}
                  alt={step.title}
                  width={500}
                  height={600}
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* === RIGHT (SCROLLING) COLUMN === */}
        <div className={styles.rightScrollingColumn}>
          <div className={styles.timeline}>
            {stepsData.map((step, index) => (
              <div
                key={index}
                ref={(el) => (stepRefs.current[index] = el)}
                data-index={index}
                className={`${styles.timelineItem} ${activeStep === index ? styles.active : ''}`}
              >
                <div className={styles.timelineNumberWrapper}>
                  <div className={styles.timelineDot}></div>
                  <div className={styles.timelineNumber}>{index + 1}</div>
                </div>
                <div className={styles.timelineContent}>
                  <div className={styles.icon}>🎁</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;