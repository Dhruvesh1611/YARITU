// components/HowItWorksTimeline.jsx

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './HowItWorksTimeline.module.css';

// ### CHANGE 1: Har step ke liye image ka path (imgSrc) add kiya gaya hai ###
const stepsData = [
  {
    title: 'Select Your Style',
    description: 'Browse our exquisite collection of traditional and contemporary designs. Each piece is carefully curated to reflect elegance and sophistication.',
    imgSrc: '/images/how-it-works-1.jpg', // Step 1 ki image
  },
  {
    title: 'Visit Our Showroom',
    description: 'Experience our luxurious showrooms with traditional architecture and personalized service. Our experts will help you find the perfect outfit.',
    imgSrc: '/images/how-it-works-2.jpg', // Step 2 ki image
  },
  {
    title: 'Experience Luxury',
    description: 'Enjoy the perfect fit and exquisite craftsmanship. Our garments are designed to make every moment special and memorable.',
    imgSrc: '/images/how-it-works-3.jpg', // Step 3 ki image
  },
  {
    title: 'Hassle-free Returns',
    description: 'Complete satisfaction guaranteed. Our flexible return policy ensures you’re completely happy with your purchase.',
    imgSrc: '/images/how-it-works-4.jpg', // Step 4 ki image
  },
];

const HowItWorksTimeline = () => {
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
        rootMargin: '-50% 0px -50% 0px',
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
      <h2 className={styles.mainHeading}>HOW YARITU WORKS</h2>
      <div className={styles.contentWrapper}>

        {/* === LEFT STICKY COLUMN === */}
        <div className={styles.leftColumn}>
          <div className={styles.imageContainer}>
            {/* ### CHANGE 2: Ab yahan saari images render hongi ### */}
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
                 <div className={styles.frameStands}>
                    <div className={styles.stand}></div>
                    <div className={styles.stand}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === RIGHT SCROLLING COLUMN === */}
        <div className={styles.rightColumn}>
          <div className={styles.timeline}>
            {stepsData.map((step, index) => (
              <div
                key={index}
                ref={(el) => (stepRefs.current[index] = el)}
                data-index={index}
                className={`${styles.timelineItem} ${activeStep === index ? styles.active : ''}`}
              >
                <div className={styles.timelineNumber}>
                  <span>{index + 1}</span>
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

export default HowItWorksTimeline;