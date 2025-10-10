function initSectionEntryAnimations() {
  const sectionEntry = document.querySelector(".section-entry-new");
  const sectionIcon = document.querySelector(".section-entry-new .icon-text-center");

  console.log("=== SECTION ENTRY ANIMATION INIT ===");
  console.log("Section found:", !!sectionEntry);

  if (!sectionEntry) {
    console.error("Section .section-entry-new not found!");
    return;
  }

  // Animate section icon and heading
  if (sectionIcon) {
    gsap.fromTo(sectionIcon.children, {
      opacity: 0,
      y: 30
    }, {
      opacity: 1,
      y: 0,
      duration: ANIMATION_CONFIG.duration.medium,
      ease: ANIMATION_CONFIG.ease.smooth,
      stagger: 0.2,
      scrollTrigger: {
        trigger: sectionIcon,
        start: "top 80%"
      }
    });
  }

  const images = gsap.utils.toArray(".entry-image");
  const contents = gsap.utils.toArray(".entry-content");

  if (images.length === 0 || contents.length === 0) {
    return;
  }

  let currentIndex = 0;
  let isAnimating = false;

  // Initialize image stack
  images.forEach((image, index) => {
    const zIndex = images.length - index + 10;
    const translateY = index * -20;
    const translateZ = index * -25;
    const rotateY = index * 3;
    const scale = 1 - (index * 0.03);
    const opacity = 1 - (index * 0.1);

    gsap.set(image, {
      zIndex: zIndex,
      opacity: opacity,
      scale: scale,
      rotationY: rotateY,
      transform: `translate(-50%, -50%) translateZ(${translateZ}px) translateY(${translateY}px) rotateY(${rotateY}deg)`
    });
  });

  // Initialize content
  contents.forEach((content, index) => {
    if (index === 0) {
      content.classList.add('active');
      gsap.set(content, { opacity: 1 });
    } else {
      content.classList.remove('active');
      gsap.set(content, { opacity: 0 });
    }
  });

  // ScrollTrigger to drive active index
  ScrollTrigger.create({
    trigger: sectionEntry,
    start: "top top",
    end: "+=300%",
    pin: true,
    scrub: true,
    anticipatePin: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      const totalImages = images.length;
      const segment = 1 / totalImages;

      const targetIndex = Math.min(
        Math.floor(progress / segment),
        totalImages - 1
      );

      if (targetIndex !== currentIndex && !isAnimating) {
        switchToIndex(targetIndex);
      }
    }
  });

  function switchToIndex(targetIndex) {
    if (targetIndex === currentIndex || targetIndex >= images.length) return;

    isAnimating = true;

    // Update content
    contents.forEach((content, index) => {
      content.classList.remove('active');
      gsap.set(content, { opacity: 0, visibility: 'hidden' });
    });

    if (contents[targetIndex]) {
      gsap.set(contents[targetIndex], { visibility: 'visible' });
      contents[targetIndex].classList.add('active');
      gsap.to(contents[targetIndex], {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }

    // Animate images
    images.forEach((image, index) => {
      if (index === targetIndex) {
        gsap.to(image, {
          scale: 1,
          opacity: 1,
          rotationY: 0,
          zIndex: 30,
          transform: "translate(-50%, -50%) translateZ(0px) translateY(0px) rotateY(0deg)",
          duration: 0.6,
          ease: "power2.out"
        });
      } else if (index < targetIndex) {
        const backIndex = targetIndex - index;
        gsap.to(image, {
          scale: 0.8 - (backIndex * 0.05),
          opacity: 0.5 - (backIndex * 0.1),
          rotationY: 10 + (backIndex * 3),
          zIndex: 5 - backIndex,
          transform: `translate(-50%, -50%) translateZ(-${100 + (backIndex * 25)}px) translateY(${50 + (backIndex * 15)}px) rotateY(${10 + (backIndex * 3)}deg)`,
          duration: 0.6,
          ease: "power2.out"
        });
      } else {
        const stackIndex = index - targetIndex;
        const stackY = stackIndex * -20;
        const stackZ = stackIndex * -25;
        const stackRotation = stackIndex * 3;
        const stackScale = 1 - (stackIndex * 0.03);
        const stackOpacity = 1 - (stackIndex * 0.1);

        gsap.to(image, {
          scale: stackScale,
          opacity: stackOpacity,
          rotationY: stackRotation,
          zIndex: images.length - stackIndex + 10,
          transform: `translate(-50%, -50%) translateZ(${stackZ}px) translateY(${stackY}px) rotateY(${stackRotation}deg)`,
          duration: 0.6,
          ease: "power2.out"
        });
      }
    });

    currentIndex = targetIndex;

    setTimeout(() => {
      isAnimating = false;
    }, 650);
  }
}

  function initExperienceAnimations() {
    const experienceSection = document.querySelector(".section-experience");
    const experienceIcon = document.querySelector(".section-experience .experience-icon-center");

    console.log("=== EXPERIENCE ANIMATION INIT ===");
    console.log("Section found:", !!experienceSection);
    
    if (!experienceSection) {
      console.error("Section .section-experience not found!");
      return;
    }

    // Animate section icon and heading
    if (experienceIcon) {
      gsap.fromTo(experienceIcon.children, {
        opacity: 0,
        y: 30
      }, {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.duration.medium,
        ease: ANIMATION_CONFIG.ease.smooth,
        stagger: 0.2,
        scrollTrigger: {
          trigger: experienceIcon,
          start: "top 80%"
        }
      });
    }

    const experienceImages = gsap.utils.toArray(".experience-image");
    const experienceContents = gsap.utils.toArray(".experience-content");
    
    if (experienceImages.length === 0 || experienceContents.length === 0) {
      return;
    }

    // Check if mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Mobile: Simple touch-based navigation
      initMobileExperienceNavigation(experienceImages, experienceContents);
    } else {
      // Desktop: GSAP sticky scroll animation
      initDesktopExperienceAnimation(experienceSection, experienceImages, experienceContents);
    }
  }
