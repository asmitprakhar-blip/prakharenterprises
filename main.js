/* 
=========================================
  NEXUS EVENT PLATFORM - CLIENT ENGINE
  Advanced UX, Motion, and Interactivity
=========================================
*/

document.addEventListener('DOMContentLoaded', () => {
  
  // Global Telegram bot configuration for all lead capture and ticket forms
  const TELEGRAM_BOT_TOKEN = '8942733766:AAHelyWJHJ57zf2LGNeX7tCzxNj_X7gqxX4';
  const TELEGRAM_CHAT_ID = '8123459698';
  
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
    }
    // Kickstart animations for elements already inside the viewport
    document.querySelectorAll('.reveal-node').forEach(node => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        node.classList.add('revealed');
      }
    });
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

  // --- INTERACTIVE PILLAR SELECTOR AND TICKET DYNAMICS ---
  const pillarCards = document.querySelectorAll('.tier-pillar-card');
  
  if (passTierSelect && ticketPassCard) {
    // SVGs for the 4 Medallions
    const vvipMedallion = `<svg viewBox="0 0 100 100" style="width: 70px; height: 70px; filter: drop-shadow(0 0 12px rgba(192, 70, 255, 0.5));">
      <circle cx="50" cy="50" r="45" fill="rgba(192, 70, 255, 0.08)" stroke="var(--accent-purple)" stroke-width="2.5" />
      <path d="M50 30 L65 42 L59 65 L41 65 L35 42 Z" fill="none" stroke="var(--accent-purple)" stroke-width="2.5" />
      <path d="M50 30 L50 65 M35 42 L50 42 L65 42 M35 42 L50 65 L65 42" stroke="var(--accent-purple)" stroke-width="1.5" />
      <path d="M38 25 L43 20 L50 24 L57 20 L62 25 Z" fill="var(--accent-pink)" />
    </svg>`;

    const platinumMedallion = `<svg viewBox="0 0 100 100" style="width: 70px; height: 70px; filter: drop-shadow(0 0 10px rgba(0, 229, 255, 0.3));">
      <circle cx="50" cy="50" r="45" fill="rgba(0, 229, 255, 0.05)" stroke="var(--accent-blue)" stroke-width="2" />
      <polygon points="50,22 58,38 76,41 63,54 66,72 50,63 34,72 37,54 24,41 42,38" fill="rgba(0, 229, 255, 0.12)" stroke="var(--accent-blue)" stroke-width="2" />
    </svg>`;

    const goldMedallion = `<svg viewBox="0 0 100 100" style="width: 70px; height: 70px; filter: drop-shadow(0 0 10px rgba(255, 179, 0, 0.4));">
      <circle cx="50" cy="50" r="45" fill="rgba(255, 179, 0, 0.05)" stroke="var(--accent-amber)" stroke-width="2.5" />
      <polygon points="50,22 58,38 76,41 63,54 66,72 50,63 34,72 37,54 24,41 42,38" fill="rgba(255, 179, 0, 0.12)" stroke="var(--accent-amber)" stroke-width="2.5" />
    </svg>`;

    const silverMedallion = `<svg viewBox="0 0 100 100" style="width: 70px; height: 70px; filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));">
      <circle cx="50" cy="50" r="45" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.4)" stroke-width="2" />
      <polygon points="50,22 58,38 76,41 63,54 66,72 50,63 34,72 37,54 24,41 42,38" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.5)" stroke-width="2" />
    </svg>`;

    // Wire up custom clickable pillar cards (CSS active state driven!)
    pillarCards.forEach(card => {
      card.addEventListener('click', () => {
        pillarCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        const selectedTier = card.getAttribute('data-tier');
        passTierSelect.value = selectedTier;
        passTierSelect.dispatchEvent(new Event('change'));
      });
    });

    // Handle ticket changes dynamically on change of hidden select
    passTierSelect.addEventListener('change', (e) => {
      const badge = ticketPassCard.querySelector('.neon-badge');
      const header = ticketPassCard.querySelector('.ticket-header');
      const divider = ticketPassCard.querySelector('.ticket-divider-line');
      const logoOrb = ticketPassCard.querySelector('.logo-glow-orb');
      const previewTierVal = document.getElementById('preview-tier-val');
      const previewPriceVal = document.getElementById('preview-price-val');
      const medallionContainer = document.getElementById('preview-medallion-container');

      const tierValue = e.target.value;

      if (tierValue === 'VVIP') {
        if (badge) {
          badge.innerText = 'VVIP ACCESS';
          badge.style.color = 'var(--accent-purple)';
          badge.style.borderColor = 'rgba(192, 70, 255, 0.35)';
          badge.style.background = 'rgba(192, 70, 255, 0.08)';
        }
        if (logoOrb) logoOrb.style.background = 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))';
        ticketPassCard.style.borderColor = 'var(--accent-purple)';
        ticketPassCard.style.boxShadow = '0 35px 80px -20px rgba(0, 0, 0, 0.95), 0 0 45px rgba(192, 70, 255, 0.25)';
        ticketPassCard.style.background = 'linear-gradient(135deg, rgba(28, 10, 48, 0.95) 0%, rgba(12, 6, 20, 0.98) 100%)';
        if (header) header.style.borderBottomColor = 'rgba(192, 70, 255, 0.25)';
        if (divider) divider.style.borderTopColor = 'rgba(192, 70, 255, 0.25)';
        
        if (previewTierVal) {
          previewTierVal.innerText = 'VVIP PASS';
          previewTierVal.style.color = 'var(--accent-purple)';
        }
        if (previewPriceVal) previewPriceVal.innerText = '';
        if (medallionContainer) medallionContainer.innerHTML = vvipMedallion;

      } else if (tierValue === 'Platinum') {
        if (badge) {
          badge.innerText = 'PLATINUM ACCESS';
          badge.style.color = 'var(--accent-blue)';
          badge.style.borderColor = 'rgba(0, 229, 255, 0.35)';
          badge.style.background = 'rgba(0, 229, 255, 0.08)';
        }
        if (logoOrb) logoOrb.style.background = 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))';
        ticketPassCard.style.borderColor = 'var(--accent-blue)';
        ticketPassCard.style.boxShadow = '0 35px 80px -20px rgba(0, 0, 0, 0.95), 0 0 35px rgba(0, 229, 255, 0.2)';
        ticketPassCard.style.background = 'linear-gradient(135deg, rgba(10, 22, 45, 0.95) 0%, rgba(6, 10, 24, 0.98) 100%)';
        if (header) header.style.borderBottomColor = 'rgba(0, 229, 255, 0.2)';
        if (divider) divider.style.borderTopColor = 'rgba(0, 229, 255, 0.2)';

        if (previewTierVal) {
          previewTierVal.innerText = 'PLATINUM PASS';
          previewTierVal.style.color = 'var(--accent-blue)';
        }
        if (previewPriceVal) previewPriceVal.innerText = '';
        if (medallionContainer) medallionContainer.innerHTML = platinumMedallion;

      } else if (tierValue === 'Gold') {
        if (badge) {
          badge.innerText = 'GOLD ACCESS';
          badge.style.color = 'var(--accent-amber)';
          badge.style.borderColor = 'rgba(255, 179, 0, 0.35)';
          badge.style.background = 'rgba(255, 179, 0, 0.08)';
        }
        if (logoOrb) logoOrb.style.background = 'linear-gradient(135deg, var(--accent-orange), var(--accent-amber))';
        ticketPassCard.style.borderColor = 'var(--accent-amber)';
        ticketPassCard.style.boxShadow = '0 35px 80px -20px rgba(0, 0, 0, 0.95), 0 0 40px rgba(255, 179, 0, 0.22)';
        ticketPassCard.style.background = 'linear-gradient(135deg, rgba(32, 22, 10, 0.95) 0%, rgba(14, 8, 6, 0.98) 100%)';
        if (header) header.style.borderBottomColor = 'rgba(255, 179, 0, 0.2)';
        if (divider) divider.style.borderTopColor = 'rgba(255, 179, 0, 0.2)';

        if (previewTierVal) {
          previewTierVal.innerText = 'GOLD PASS';
          previewTierVal.style.color = 'var(--accent-amber)';
        }
        if (previewPriceVal) previewPriceVal.innerText = '';
        if (medallionContainer) medallionContainer.innerHTML = goldMedallion;

      } else if (tierValue === 'Silver') {
        if (badge) {
          badge.innerText = 'SILVER ACCESS';
          badge.style.color = '#cccccc';
          badge.style.borderColor = 'rgba(255, 255, 255, 0.25)';
          badge.style.background = 'rgba(255, 255, 255, 0.05)';
        }
        if (logoOrb) logoOrb.style.background = 'linear-gradient(135deg, #888888, #cccccc)';
        ticketPassCard.style.borderColor = 'rgba(255, 255, 255, 0.25)';
        ticketPassCard.style.boxShadow = '0 35px 80px -20px rgba(0, 0, 0, 0.95), 0 0 25px rgba(255, 255, 255, 0.08)';
        ticketPassCard.style.background = 'linear-gradient(135deg, rgba(22, 22, 28, 0.95) 0%, rgba(12, 12, 16, 0.98) 100%)';
        if (header) header.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
        if (divider) divider.style.borderTopColor = 'rgba(255, 255, 255, 0.1)';

        if (previewTierVal) {
          previewTierVal.innerText = 'SILVER PASS';
          previewTierVal.style.color = '#cccccc';
        }
        if (previewPriceVal) previewPriceVal.innerText = '';
        if (medallionContainer) medallionContainer.innerHTML = silverMedallion;
      }
    });

    // Initialize the ticket preview visual states on DOM load
    passTierSelect.dispatchEvent(new Event('change'));
  }

  // 17. GLOBAL CONFETTI LAUNCHER ON SUCCESSFUL PASS GENERATION
  window.triggerPassSuccess = () => {
    const activeTier = passTierSelect ? passTierSelect.value : 'VVIP';
    let confettiColors = ['#ff6a00', '#ff4fd8', '#c046ff', '#ffffff'];
    
    if (activeTier === 'VVIP') {
      confettiColors = ['#c046ff', '#ff4fd8', '#ffffff'];
    } else if (activeTier === 'Platinum') {
      confettiColors = ['#00e5ff', '#ffffff', '#0077ff'];
    } else if (activeTier === 'Gold') {
      confettiColors = ['#ffb300', '#ff6a00', '#ffffff'];
    } else if (activeTier === 'Silver') {
      confettiColors = ['#cccccc', '#888888', '#ffffff'];
    }

    if (typeof confetti !== 'undefined') {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: confettiColors
      });
      
      // Secondary staggered bursts for world-class feel
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: confettiColors
        });
      }, 250);
      
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: confettiColors
        });
      }, 400);
    }
    
    setTimeout(() => {
      alert(`Congratulations! Your Startup Business Summit 2026 ${activeTier} Delegate Pass has been generated successfully. Redirecting you to complete your official registration...`);
      window.open('https://forms.gle/C9rwmU8zvQQmxBwy8', '_blank');
    }, 600);
  };

  // --- INTERACTIVE DELEGATE PASS FORM SUBMISSION HANDLER ---
  const delegateForm = document.getElementById('delegate-pass-form');
  if (delegateForm) {
    delegateForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameVal = fullNameInput.value.trim();
      const designationVal = designationInput.value.trim();
      const organizationVal = organizationInput.value.trim();
      const tierVal = passTierSelect ? passTierSelect.value : 'VVIP';

      // 1. Sleek loading state
      const submitBtn = delegateForm.querySelector('.ticket-submit-button');
      let originalBtnHtml = '';
      if (submitBtn) {
        originalBtnHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span>Securing Access Pass...</span>
          <span class="btn-loader" style="margin-left: 8px;"><i data-lucide="loader-2" class="spin-animation" style="width: 16px; height: 16px;"></i></span>
        `;
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }

      const dateTime = new Date().toLocaleString();
      const pageUrl = window.location.href;

      const textMessage = `
🎟️ *NEW TICKET PASS CLAIMED*

👤 *Name:* ${nameVal}
💼 *Designation:* ${designationVal}
🏢 *Organization:* ${organizationVal}
🌟 *Ticket Tier:* ${tierVal}
📅 *Date/Time:* ${dateTime}
🔗 *Source Page:* ${pageUrl}
      `;

      try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: textMessage,
            parse_mode: 'Markdown'
          })
        });

        if (!response.ok) {
          throw new Error('Telegram Bot API response not OK');
        }
      } catch (err) {
        console.error('Failed to dispatch pass generation to Telegram:', err);
      } finally {
        if (submitBtn) {
          // Restore button state
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        }
        // Trigger the success transitions (confetti & redirect)
        window.triggerPassSuccess();
      }
    });
  }

  // --- PREMIUM LEAD CAPTURE SYSTEM ---
  const popupOverlay = document.getElementById('lead-capture-modal');
  const popupForm = document.getElementById('lead-capture-form');
  const successContainer = document.getElementById('popup-success-msg');
  const submitBtn = document.getElementById('popup-submit-btn');

  const STORAGE_KEY = 'summit_lead_captured';
  const STORAGE_EXPIRY_DAYS = 7;
  const POPUP_DELAY_MS = 10000;

  const checkAndLaunchPopup = () => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      const differenceDays = (Date.now() - parsed.timestamp) / (1000 * 60 * 60 * 24);
      if (differenceDays < STORAGE_EXPIRY_DAYS) {
        return;
      }
    }

    setTimeout(() => {
      if (popupOverlay) {
        popupOverlay.style.display = 'flex';
        popupOverlay.offsetHeight;
        popupOverlay.classList.add('active');
        document.body.classList.add('modal-open');
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }
    }, POPUP_DELAY_MS);
  };

  if (popupOverlay && popupForm) {
    checkAndLaunchPopup();

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && popupOverlay.classList.contains('active')) {
        e.preventDefault();
      }
    });

    const nameInput = document.getElementById('popup-name');
    const emailInput = document.getElementById('popup-email');
    const phoneInput = document.getElementById('popup-phone');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const phoneError = document.getElementById('phone-error');

    popupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      nameError.textContent = '';
      emailError.textContent = '';
      phoneError.textContent = '';

      let isValid = true;

      const nameVal = nameInput.value.trim();
      if (!nameVal) {
        nameError.textContent = 'Full Name is required';
        isValid = false;
      }

      const emailVal = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        emailError.textContent = 'Email Address is required';
        isValid = false;
      } else if (!emailRegex.test(emailVal)) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
      }

      const phoneVal = phoneInput.value.trim();
      if (!phoneVal) {
        phoneError.textContent = 'Phone Number is required';
        isValid = false;
      }

      if (!isValid) return;

      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = 'Verifying Access...';
      submitBtn.querySelector('.btn-loader').style.display = 'inline-block';

      const dateTime = new Date().toLocaleString();
      const pageUrl = window.location.href;

      const textMessage = `
🔐 *NEW EXECUTIVE LEAD CAPTURE*

👤 *Name:* ${nameVal}
📧 *Email:* ${emailVal}
📞 *Phone:* ${phoneVal}
📅 *Date/Time:* ${dateTime}
🔗 *Source Page:* ${pageUrl}
      `;

      try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: textMessage,
            parse_mode: 'Markdown'
          })
        });

        if (!response.ok) {
          throw new Error('Telegram bot API request failed');
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          name: nameVal,
          email: emailVal,
          phone: phoneVal,
          timestamp: Date.now()
        }));

        popupForm.style.opacity = '0';
        setTimeout(() => {
          popupForm.style.display = 'none';
          successContainer.style.display = 'flex';
          
          if (typeof confetti !== 'undefined') {
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.65 },
              colors: ['#ff6a00', '#ff4fd8', '#c046ff']
            });
          }
        }, 400);

        setTimeout(() => {
          popupOverlay.classList.remove('active');
          document.body.classList.remove('modal-open');
          setTimeout(() => {
            popupOverlay.style.display = 'none';
          }, 600);
        }, 2200);

      } catch (err) {
        console.error(err);
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Continue to Website';
        submitBtn.querySelector('.btn-loader').style.display = 'none';
        phoneError.textContent = 'Submission failed. Please check internet connection and try again.';
      }
    });
  }

});

