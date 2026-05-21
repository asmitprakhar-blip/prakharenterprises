/* 
=========================================
  NEXUS EVENT PLATFORM - CLIENT ENGINE
  Advanced UX, Motion, and Interactivity
=========================================
*/

document.addEventListener('DOMContentLoaded', () => {
  
  // Pro-actively initialize Lucide icons to fix vanished icons bug
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // 1. INITIALIZE LENIS SMOOTH SCROLL (With luxurious inertial kinetics)
  let lenis;
  let tickingScrollY = false;
  const updateScrollY = () => {
    if (!tickingScrollY) {
      window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
        tickingScrollY = false;
      });
      tickingScrollY = true;
    }
  };

  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Luxurious exponential easing
      smoothWheel: true,
      touchMultiplier: 1.5,
      infinite: false
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Bind scroll progress directly to CSS variables for buttery-smooth parallax
    lenis.on('scroll', updateScrollY);
  } else {
    // Fallback standard scroll event for extreme resilience
    window.addEventListener('scroll', updateScrollY, { passive: true });
  }
  document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);

  // 2. LUXURIOUS SMOOTH ANCHOR LINK ROUTING USING LENIS
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') {
        if (lenis) lenis.scrollTo(0, { duration: 1.2 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Scroll exactly to target with a slight comfort offset
        if (lenis) lenis.scrollTo(targetElement, { offset: -30, duration: 1.5 });
        else targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 3. PRELOADER DISMISSAL & INITIATING REVEALS (With Fail-Safe Backup)
  const preloader = document.getElementById('preloader');
  
  const dismissPreloader = () => {
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
      // Kickstart animations for elements already inside the viewport
      document.querySelectorAll('.reveal-node').forEach(node => {
        const rect = node.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          node.classList.add('revealed');
        }
      });
    }
  };

  // Immediate or load-based dismissal (Highly responsive check)
  if (document.readyState === 'complete') {
    setTimeout(dismissPreloader, 200);
  } else {
    window.addEventListener('load', () => {
      setTimeout(dismissPreloader, 200);
    });
  }

  // Fail-Safe: Dismiss after 1.5 seconds max, even if some assets are still loading
  setTimeout(dismissPreloader, 1500);

  // 3b. INTERACTIVE MOBILE NAVIGATION MENU WIRE-UP
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const menuIcon = document.getElementById('menu-icon');

  if (mobileToggle && navMenu && menuIcon) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isActive = navMenu.classList.contains('active');
      
      // Toggle hamburger and close icons dynamically
      if (isActive) {
        menuIcon.setAttribute('data-lucide', 'x');
      } else {
        menuIcon.setAttribute('data-lucide', 'menu');
      }
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });

    // Close mobile menu when nav links are clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuIcon.setAttribute('data-lucide', 'menu');
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      });
    });
  }



  // 6. MAGNETIC HOVER CARDS (SPOTLIGHT LOCALIZERS)
  const spotlightCards = document.querySelectorAll('.spotlight-card');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--card-mouse-x', `${x}px`);
      card.style.setProperty('--card-mouse-y', `${y}px`);
    });
  });

  // 7. 3D PHYSICS TILT EFFECTS (CARD PERSPECTIVE BENDING)
  // Target both the ticket visual and speaker cards for smooth Apple/Figma style tilting
  const tiltElements = document.querySelectorAll('.speaker-card, .ticket-pass');
  
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 768) return; // Disable tilt behaviors on touch and mobile devices
      
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate relative to element
      const y = e.clientY - rect.top;  // y coordinate relative to element
      
      const width = rect.width;
      const height = rect.height;
      
      // Calculate normal vector (-1 to 1) from card center
      const xNormalized = (x / width) * 2 - 1;
      const yNormalized = (y / height) * 2 - 1;
      
      // Set max degree tilt
      const maxTilt = 10;
      const rotateX = (-yNormalized * maxTilt).toFixed(2);
      const rotateY = (xNormalized * maxTilt).toFixed(2);
      
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
 
    el.addEventListener('mouseleave', () => {
      if (window.innerWidth <= 768) return;
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // 8. HERO PARTICLES BACKGROUND CANVAS
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Set sizes
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height + canvas.height * 0.1;
        this.size = Math.random() * 2.2 + 0.5;
        this.speedY = -(Math.random() * 0.4 + 0.1);
        this.speedX = (Math.random() * 0.3 - 0.15);
        this.alpha = Math.random() * 0.5 + 0.1;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        
        // Wrap around edge
        if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
          this.reset();
          this.y = canvas.height;
        }
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.size > 1.8 ? '#ff4fd8' : '#c046ff';
        if (window.innerWidth > 768) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = this.size > 1.8 ? '#ff4fd8' : '#c046ff';
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      const isMobile = window.innerWidth <= 768;
      const baseDivisor = isMobile ? 32 : 16;
      const maxCount = isMobile ? 30 : 80;
      const particleCount = Math.min(Math.floor(canvas.width / baseDivisor), maxCount);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    initParticles();
    window.addEventListener('resize', initParticles);

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  // 9. SCROLL REVEAL OBSERVER FOR STAGE TRANSITIONS
  const revealNodes = document.querySelectorAll('.reveal-node');
  if (revealNodes.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    revealNodes.forEach(node => revealObserver.observe(node));

    // Scroll-active reveal fallback (resiliency for laggy legacy scroll contexts)
    if (!window.IntersectionObserver) {
      const forceRevealOnScroll = () => {
        revealNodes.forEach(node => {
          const rect = node.getBoundingClientRect();
          // If the top of the element is visible, reveal it
          if (rect.top < window.innerHeight - 30) {
            node.classList.add('revealed');
          }
        });
      };
      window.addEventListener('scroll', forceRevealOnScroll, { passive: true });
      // Also run once initially to catch elements already in viewport
      setTimeout(forceRevealOnScroll, 1000);
    }
  }

  // 10. INCREMENTING STATISTICS COUNTER FOR FOUNDERX METRICS
  const stats = document.querySelectorAll('.stat-number');
  if (stats.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          if (target.classList.contains('counted')) return; // Trigger once
          
          target.classList.add('counted');
          const limit = parseInt(target.getAttribute('data-target'));
          let count = 0;
          const duration = 2000; // 2 seconds
          const stepTime = Math.max(Math.floor(duration / limit), 12);
          
          const increment = () => {
            const incrementAmount = Math.ceil(limit / 50); // Fluid scaling
            count += incrementAmount;
            if (count >= limit) {
              if (limit === 3000) {
                target.innerText = '3K+';
              } else {
                target.innerText = limit + '+';
              }
            } else {
              target.innerText = count;
              setTimeout(increment, stepTime);
            }
          };
          increment();
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));
  }

  // 14. E-SUMMIT HERO KEYWORD ROTATOR ENGINE
  const sloganKeyword = document.getElementById('slogan-keyword');
  if (sloganKeyword) {
    const keywords = ['Innovating', 'Collaborating', 'Securing Capital', 'Scaling Up'];
    let index = 0;
    
    setInterval(() => {
      sloganKeyword.classList.add('animating');
      
      setTimeout(() => {
        index = (index + 1) % keywords.length;
        sloganKeyword.innerText = keywords[index];
        sloganKeyword.classList.remove('animating');
      }, 500); // Wait for blur/fade animation out
    }, 3200); // Swap interval
  }

  // 15. INTERACTIVE TIMELINE PROGRESS LINE PATH
  const timelineSection = document.getElementById('schedule');
  const progressLine = document.querySelector('.timeline-progress-line');
  
  if (timelineSection && progressLine) {
    let tickingTimeline = false;
    const updateTimelineProgress = () => {
      const rect = timelineSection.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      // Grow from top middle of timeline down
      const startPoint = viewportHeight * 0.75; // Grow starts when timeline is 75% down
      const endPoint = viewportHeight * 0.35;   // Ends when bottom reaches 35%
      
      const elementTop = rect.top;
      const scrolledAmount = startPoint - elementTop;
      
      // We calculate percentage relative to total height of cards area
      let progress = (scrolledAmount / sectionHeight) * 100;
      
      // Make timeline growth match vertical spacing of elements
      progress = Math.max(0, Math.min(100, progress));
      progressLine.style.height = `${progress}%`;
      
      // Active status on timeline dots as the progress path reaches them
      const items = document.querySelectorAll('.timeline-item');
      items.forEach(item => {
        const dot = item.querySelector('.timeline-dot');
        const itemRect = item.getBoundingClientRect();
        
        // When dot passes 58% of viewport height (where progress line is at), active dot glows
        if (itemRect.top < viewportHeight * 0.58) {
          if (dot) dot.classList.add('active-dot');
        } else {
          if (dot) dot.classList.remove('active-dot');
        }
      });
    };
    
    const onTimelineScroll = () => {
      if (!tickingTimeline) {
        window.requestAnimationFrame(() => {
          updateTimelineProgress();
          tickingTimeline = false;
        });
        tickingTimeline = true;
      }
    };
    
    // Wire events (passive for high performance scrolling frame rate)
    window.addEventListener('scroll', onTimelineScroll, { passive: true });
    window.addEventListener('resize', onTimelineScroll, { passive: true });
    setTimeout(updateTimelineProgress, 600); // Trigger check after preloader vanishes
  }

  // 16. DELEGATE PASS REAL-TIME PREVIEW SYNC
  const fullNameInput = document.getElementById('full-name');
  const designationInput = document.getElementById('designation');
  const organizationInput = document.getElementById('organization');
  const passTierSelect = document.getElementById('pass-tier');

  const previewName = document.getElementById('preview-name');
  const previewDesignation = document.getElementById('preview-designation');
  const previewOrg = document.getElementById('preview-org');
  const ticketPassCard = document.getElementById('ticket-pass-card');

  if (fullNameInput && previewName) {
    fullNameInput.addEventListener('input', (e) => {
      previewName.innerText = e.target.value.trim() !== '' ? e.target.value.toUpperCase() : 'YOUR FULL NAME';
    });
  }

  if (designationInput && previewDesignation) {
    designationInput.addEventListener('input', (e) => {
      previewDesignation.innerText = e.target.value.trim() !== '' ? e.target.value.toUpperCase() : 'DESIGNATION / ROLE';
    });
  }

  if (organizationInput && previewOrg) {
    organizationInput.addEventListener('input', (e) => {
      previewOrg.innerText = e.target.value.trim() !== '' ? e.target.value.toUpperCase() : 'ORGANIZATION';
    });
  }

  if (passTierSelect && ticketPassCard) {
    passTierSelect.addEventListener('change', (e) => {
      const badge = ticketPassCard.querySelector('.neon-badge span');
      if (badge) {
        if (e.target.value === 'Premium VIP Delegate') {
          badge.innerText = 'VIP DELEGATE ACCESS';
          ticketPassCard.style.borderColor = 'var(--accent-orange)';
        } else if (e.target.value === 'Trade Representative') {
          badge.innerText = 'TRADE REP ACCESS';
          ticketPassCard.style.borderColor = 'var(--accent-pink)';
        } else {
          badge.innerText = 'DELEGATE ACCESS';
          ticketPassCard.style.borderColor = 'rgba(176, 94, 194, 0.15)';
        }
      }
    });
  }

  // 17. GLOBAL CONFETTI LAUNCHER ON SUCCESSFUL PASS GENERATION
  window.triggerPassSuccess = () => {
    if (typeof confetti !== 'undefined') {
      const colors = ['#ff6a00', '#ff4fd8', '#c046ff', '#ffffff'];
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: colors
      });
      
      // Secondary staggered bursts for world-class feel
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
      }, 250);
      
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });
      }, 400);
    }
    alert('Congratulations! Your Startup Business Summit 2026 Delegate Pass has been generated successfully.');
  };

});
