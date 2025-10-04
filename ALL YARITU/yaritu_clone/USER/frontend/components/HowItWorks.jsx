// components/HowItWorks.jsx (Pichla code hi use hoga)

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './HowItWorks.module.css';

// Har step ka data
const stepsData = [
  {
    title: 'Select Your Style',
    description: 'Browse our exquisite collection of traditional and contemporary designs. Each piece is carefully curated to reflect elegance and sophistication.',
    imgSrc: '/images/step1.png', // Aapki images ka path
    icon: '🎁', 
  },
  {
    title: 'Visit Our Showroom',
    description: 'Experience our luxurious showrooms with traditional architecture and personalized service. Our experts will help you find the perfect outfit.',
    imgSrc: '/images/step2.png',
    icon: '<', // Image mein '<' aur '>' icon hain
  },
  {
    title: 'Experience Luxury',
    description: 'Enjoy the perfect fit and exquisite craftsmanship. Our garments are designed to make every moment special and memorable.',
    imgSrc: '/images/step3.png',
    icon: '>',
  },
  {
    title: 'Hassle-free Returns',
    description: 'Complete satisfaction guaranteed. Our flexible return policy ensures you’re completely happy with your purchase.',
    imgSrc: '/images/step4.png',
    icon: '🎁',
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
        root: null, 
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
        
        {/* === LEFT (STICKY) COLUMN: Image Display === */}
        <div className={styles.leftStickyColumn}>
          <div className={styles.imageContainer}>
            <div className={styles.imageFrameWrapper}>
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
                    width={450} 
                    height={394} // Aspect ratio 4/3.5 se height set ki
                    priority={index === 0}
                    objectFit="cover"
                  />
                </div>
              ))}
            </div>
            {/* इमेज स्टैंड्स */}
            <div className={styles.frameStands}>
              <div className={styles.stand}></div>
              <div className={styles.stand}></div>
            </div>
          </div>
        </div>

        {/* === RIGHT (SCROLLING) COLUMN: Timeline === */}
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
                  {/* Dot sirf non-active state mein dikhega */}
                  <div className={styles.timelineDot}></div> 
                  <div className={styles.timelineNumber}>{index + 1}</div>
                </div>
                <div className={styles.timelineContent}>
                  <div className={styles.icon}>{step.icon}</div>
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