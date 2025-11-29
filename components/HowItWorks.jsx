// components/HowItWorks.jsx

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './HowItWorks.module.css';

// Har step ka data (Isme koi change nahi hai)
const stepsData = [
  {
    title: 'Visit Our Showroom',
    description: 'Step into your nearest Yaritu Showroom and explore our exclusive range of rental outfits for every occasion. Our team helps you find the perfect fit for your style and budget.',
    imgSrc: '/images/step1.png',
    icon: 'location',
  },
  {
    title: 'Select Your Outfit',
    description: 'Choose from our wide collection of designer lehengas, sherwanis, gowns, suits and more. Try them on to find your dream look for weddings, parties, or special events.',
    imgSrc: '/images/step2.png',
    icon: 'hanger',
  },
  {
    title: 'Shine at Your Function',
    description: 'Wear your selected outfit and make a statement at your event. Be confident, stylish, and picture-perfect while enjoying your special moments.',
    imgSrc: '/images/step3.png',
    icon: 'star',
  },
  {
    title: 'Return with Ease',
    description: 'After your event, simply return the outfit to our showroom. We take care of cleaning and maintenance—hassle-free and convenient for you.',
    imgSrc: '/images/step4.png',
    icon: 'return',
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);
  
  // Refs to track scroll direction (Only used for Desktop)
  const scrollDirection = useRef('down');
  const lastScrollY = useRef(0);
  
  // This state checks if the view is mobile
  const [isMobile, setIsMobile] = useState(false);

  // This useEffect checks screen size
  useEffect(() => {
    const checkScreenSize = () => {
      // Check for landscape mobile as well, treat it as desktop
      const isLandscapeMobile = window.innerWidth <= 900 && window.matchMedia("(orientation: landscape)").matches;
      // Original mobile check is portrait
      const isPortraitMobile = window.innerWidth <= 768;
      
      setIsMobile(isPortraitMobile && !isLandscapeMobile);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);


  // This useEffect tracks scroll direction (Only used for Desktop)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        scrollDirection.current = 'down';
      } else {
        scrollDirection.current = 'up';
      }
      lastScrollY.current = currentScrollY;
    };

    // Only add this listener if we are on desktop
    if (!isMobile) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isMobile]); // Re-run if isMobile changes
  

  // === THIS IS THE UPDATED IntersectionObserver LOGIC ===
  useEffect(() => {
    let rootMargin;
    let threshold = 0;

    if (isMobile) {
      // MOBILE LOGIC:
      // The sticky image is 60vh. We create a 1% high "trigger line"
      // right at the 60% mark (top of the text area).
      rootMargin = '-60% 0px -39% 0px';
    } else {
      // DESKTOP LOGIC:
      // The trigger zone is the top 30% of the screen.
      rootMargin = '0px 0px -70% 0px';
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const stepIndex = parseInt(entry.target.dataset.index, 10);

          // === Branching Logic ===
          if (isMobile) {
            // MOBILE: Simple logic. If it's intersecting the "trigger line", it's active.
            if (entry.isIntersecting) {
              setActiveStep(stepIndex);
            }
          } else {
            // DESKTOP: Use the scroll direction logic
            if (entry.isIntersecting) {
              // SCROLLING DOWN
              if (scrollDirection.current === 'down') {
                setActiveStep(stepIndex);
              }
            } else {
              // SCROLLING UP
              if (
                scrollDirection.current === 'up' &&
                stepIndex === activeStep && // Only act on the currently active step
                stepIndex > 0 // Don't go below step 0
              ) {
                setActiveStep(stepIndex - 1);
              }
            }
          }
        });
      },
      {
        root: null,
        rootMargin: rootMargin,
        threshold: threshold,
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
  }, [isMobile, activeStep]); // Re-run if isMobile or activeStep changes

  // Icon component (No changes here)
  const Icon = ({ name, size }) => {
    const fill = '#FFA629';
    const common = { width: 35, height: 35, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };
    switch (name) {
      case 'gem': return ( <svg {...common}><path d="M12 2l3 6 6 1-6 4-3 7-3-7-6-4 6-1 3-6z" fill={fill} /><path d="M12 2l-2 4-4 1 4 2 2 5 2-5 4-2-4-1-2-4z" fill="#FCEABB" opacity="0.1" /></svg> );
      case 'location': return ( <svg {...common}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" fill={fill} /></svg> );
      case 'hanger':
        return <Image src="/images/hanger.png" alt="hanger" width={40} height={40} />;
      case 'star': return ( <svg {...common}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill={fill} /></svg> );
      case 'return':
        return <Image src="/images/return.png" alt="return" width={35} height={35} />;
      default: return null;
    }
  };

  return (
    <div className={styles.mainContainer}>
      <h2 className={styles.mainHeading}>HOW YARITU WORKS</h2>
      <div className={styles.contentWrapper}>
        
        {/* Left (Sticky) Column */}
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
                    height={394}
                    priority={index === 0}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
            <div className={styles.frameStands}>
              <div className={styles.stand}></div>
              <div className={styles.stand}></div>
            </div>
          </div>
        </div>

        {/* Right (Scrolling) Column */}
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
                  <div className={styles.icon}><Icon name={step.icon} size={28} /></div>
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