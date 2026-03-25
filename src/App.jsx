import React, { useLayoutEffect, useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import SplitType from 'split-type';
import 'lenis/dist/lenis.css';
import './index.css';
import transitAiImg from './assets/transit_ai.png';
import luminalibImg from './assets/luminalib.png';
import hrmsBackendImg from './assets/hrms_backend.png';
import airQualityImg from './assets/air_quality.png';
import educationImg from './assets/education.png';
import profileImg from './assets/hero.png';

gsap.registerPlugin(ScrollTrigger);

// --- 1. Custom Trailing Cursor (Event Delegation) ---
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if device is touch-only (no hover capability)
    if (window.matchMedia('(hover: none)').matches) {
      setIsTouch(true);
      return;
    }
    const moveCursor = (e) => {
      gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "power2.out" });
      gsap.to(dotRef.current, { x: e.clientX, y: e.clientY, duration: 0, ease: "none" });
    };

    // Event delegation: check closest match on any mouseover/mouseout
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, .card-explore, .project-card-v2, .skill-bento-card, .magnetic-card, .horizontal-project-item');
      if (!target) return;
      const isMagnetic = target.closest('.magnetic-card') || target.closest('.horizontal-project-item');
      gsap.to(cursorRef.current, { 
        scale: isMagnetic ? 3.5 : 2.5, 
        backgroundColor: isMagnetic ? "rgba(255, 85, 0, 0.15)" : "rgba(255,255,255,0.1)", 
        borderColor: isMagnetic ? "#ff5500" : "rgba(255,255,255,0.5)",
        duration: 0.3 
      });
      gsap.to(dotRef.current, { scale: 0, duration: 0.2 });
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, .card-explore, .project-card-v2, .skill-bento-card, .magnetic-card, .horizontal-project-item');
      if (!target) return;
      // Only reset if we're actually leaving the element (not entering a child)
      const related = e.relatedTarget;
      if (related && target.contains(related)) return;
      gsap.to(cursorRef.current, { scale: 1, backgroundColor: "transparent", borderColor: "rgba(255,255,255,0.5)", duration: 0.3 });
      gsap.to(dotRef.current, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      <div className="cursor-ring" ref={cursorRef} />
      <div className="cursor-dot" ref={dotRef} />
    </>
  );
};

// --- 2. Cinematic Preloader ---
// --- 2. Cinematic Preloader ---
const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing Models...");
  const containerRef = useRef();
  const topPanelRef = useRef();
  const bottomPanelRef = useRef();
  const contentRef = useRef();

  useEffect(() => {
    const statuses = [
      "Initializing Models...",
      "Loading Datasets...",
      "Processing Neural Kernels...",
      "Optimizing Algorithm Paths...",
      "Syncing Data Science Hub...",
      "Portfolio Ready."
    ];

    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 12) + 1;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        
        setStatus(statuses[statuses.length - 1]);

        const tl = gsap.timeline({
            onComplete: onComplete,
            delay: 0.6
        });

        tl.to(contentRef.current, {
            opacity: 0,
            y: -30,
            duration: 0.6,
            ease: "power2.in"
        })
        .to(topPanelRef.current, {
            yPercent: -100,
            duration: 1.2,
            ease: "power4.inOut"
        }, "-=0.3")
        .to(bottomPanelRef.current, {
            yPercent: 100,
            duration: 1.2,
            ease: "power4.inOut"
        }, "<")
        .to(containerRef.current, {
            display: 'none',
            duration: 0
        });
      }
      setProgress(p);
      
      const statusIdx = Math.min(Math.floor((p / 100) * (statuses.length - 1)), statuses.length - 2);
      if (p < 100) setStatus(statuses[statusIdx]);

    }, 70);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="preloader" ref={containerRef}>
      <div className="preloader-panel panel-top" ref={topPanelRef}></div>
      <div className="preloader-panel panel-bottom" ref={bottomPanelRef}></div>
      
      <div className="preloader-content" ref={contentRef}>
        <div className="preloader-brand" style={{ 
            filter: `drop-shadow(0 0 ${progress / 4}px rgba(255, 85, 0, ${progress / 200}))`
          }}>
          &lt;<span>Ayush</span>Katewa/&gt;
        </div>
        
        <div className="preloader-bar-container">
          <div className="preloader-bar" style={{ width: `${progress}%` }}></div>
        </div>
        
        <div className="preloader-status">{status}</div>
      </div>
    </div>
  );
};

// --- 3. Scroll Progress Indicator ---
const ScrollProgress = () => {
  useEffect(() => {
    gsap.to(".scroll-progress", {
      scaleX: 1,
      transformOrigin: "left",
      ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true }
    });
  }, []);
  return <div className="scroll-progress" />;
};

// --- 4. Matrix Scramble Text ---
const ScrambleText = ({ text }) => {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    setDisplay(text);
  }, [text]);

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const handleHover = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(text.split('').map((char, i) => {
        if(i < iteration || char === ' ') return text[i];
        return letters[Math.floor(Math.random() * 26)];
      }).join(''));
      
      if(iteration >= text.length) clearInterval(interval);
      iteration += 1 / 2; // Speed of resolving
    }, 30);
  };

  return <span onMouseEnter={handleHover}>{display}</span>;
};

// --- Elastic Bouncing Text Physics ---
const BouncingText = ({ text }) => {
  const textRef = useRef();
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".bounce-char", {
        y: -80,
        opacity: 0,
        rotationX: 90,
        stagger: 0.05,
        duration: 1.5,
        ease: "elastic.out(1, 0.4)",
        scrollTrigger: { trigger: textRef.current, start: "top 80%" }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <h1 ref={textRef} style={{ display: 'inline-block', perspective: 400 }}>
      {text.split('').map((char, index) => (
        <span 
           key={index} 
           className="bounce-char gradient-text" 
           style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal', margin: 0 }}
        >
          {char}
        </span>
      ))}
    </h1>
  );
};

// --- Infinite Dual-Directional Marquee ---
const InfiniteMarquee = ({ items, reverse = false }) => {
  return (
    <div className="marquee-wrapper">
      <div className={`marquee-content ${reverse ? 'reverse' : ''}`}>
        {[...items, ...items, ...items, ...items].map((item, i) => (
           <div className="skill-chip glow-chip" key={i}>{item}</div>
        ))}
      </div>
    </div>
  );
};

// --- Magnetic Element Logic (uses wrapper div to avoid ref conflicts) ---
const Magnetic = ({ children, className = '' }) => {
  const magneticRef = useRef(null);

  useEffect(() => {
    const el = magneticRef.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = el.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x * 0.35);
      yTo(y * 0.35);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={magneticRef} className={`magnetic-wrapper ${className}`} style={{ display: 'inline-block' }}>
      {children}
    </div>
  );
};

// --- UI Sound Synthesizer ---
const playTick = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
        
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    } catch(e) {}
};

// --- Universal Card Wrapper (Enhanced Tilt) ---
const TiltCard = ({ children, className, style, href, glow = true, imageSrc }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
    const rotateY = ((x - centerX) / centerX) * 10;

    gsap.to(cardRef.current, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 1000
    });

    if (glow || imageSrc) {
      cardRef.current.style.setProperty('--mouse-x', `${x}px`);
      cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playTick();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out"
    });
  };

  const Component = href ? 'a' : 'div';
  const props = href ? { href, target: "_blank", rel: "noreferrer" } : {};

  return (
    <Component 
      ref={cardRef} 
      className={className + (glow ? " glow-card" : "")} 
      onMouseMove={handleMouseMove} 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, position: 'relative', transformStyle: 'preserve-3d' }}
      {...props}
    >
      {imageSrc && (
        <img 
           src={imageSrc} 
           alt="Preview reveal" 
           className={`hover-reveal-img ${isHovered ? 'visible' : ''}`} 
        />
      )}
      {children}
    </Component>
  );
};

// --- 6. About Section Interactive Wrapper ---
const AboutCard = () => {
  const cardRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        gsap.from(".about-paragraph", {
            opacity: 0,
            y: 20,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: { trigger: cardRef.current, start: "top 85%" }
        });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={cardRef} className="about-grid">
      
      {/* Left Column Text */}
      <div className="about-text">
        <p className="about-paragraph">
          I'm <span style={{ color: '#ff5500', fontWeight: 'bold' }}>Ayush Katewa</span>, a versatile engineer with a primary focus on <span style={{ color: '#ff5500' }}>Data Science</span> and <span style={{ color: '#ff5500' }}>AI/ML</span>. My expertise spans across Full-Stack Web Development, Backend Architecture, and Cloud Computing, allowing me to build intelligent, scalable, and data-driven solutions from the ground up.
        </p>
        
        <p className="about-paragraph">
          I bridge the gap between complex data analysis and high-performance software engineering. Whether it's architecting a robust backend with FastAPI, deploying scalable infrastructure on the Cloud, or training advanced ML models with Scikit-learn and PyTorch, I ensure every line of code is optimized for performance and impact.
        </p>
        
        <p className="about-paragraph">
          As a Data Analyst and AI Enthusiast, I am passionate about uncovering deep insights from complex datasets and turning them into automated, intelligent systems. My technical foundation is built on rigorous academic training and a competitive drive to solve real-world algorithmic challenges.
        </p>

        <p className="about-paragraph">
          I am driven by continuous innovation, aiming to create meaningful high-value impact at the intersection of Data, Engineering, and Design.
        </p>
      </div>
      
      {/* Right Column Illustration */}
      <Magnetic>
        <div className="about-image-wrapper about-paragraph">
          <img src={educationImg} alt="Developer at work" />
        </div>
      </Magnetic>

    </div>
  );
};

// --- Main App ---
function App() {
  const [loaded, setLoaded] = useState(false);
  const roles = ["Data Scientist", "AI/ML Engineer", "Full Stack Developer", "Cloud Architect", "Data Analyst", "Backend Specialist"];
  const [roleIndex, setRoleIndex] = useState(0);

  const certificates = [
    {
      title: "Generative AI & LLM",
      issuer: "Infosys",
      link: "https://drive.google.com/file/d/15wB01TyKquCkXQ5ViTJFMya20mjNCRwx/view?usp=drive_link",
      icon: <i className="fas fa-brain"></i>
    },
    {
      title: "Computational Theory: Language Principle & FA",
      issuer: "Infosys",
      link: "https://drive.google.com/file/d/1YQ3N1wB_qaannP99K9SpFSVP8majvR39/view?usp=drive_link",
      icon: <i className="fas fa-microchip"></i>
    },
    {
      title: "Cloud Computing",
      issuer: "NPTEL – IIT Kharagpur",
      link: "https://drive.google.com/file/d/1xxVPc3JQw_DcCXa9XseNzl3f4RehVDcZ/view?usp=drive_link",
      icon: <i className="fas fa-cloud"></i>
    },
    {
      title: "Introduction to Python",
      issuer: "Infosys",
      link: "https://drive.google.com/file/d/1JTIHryHN6Tn2Sn7AThuTB83BIpHZ2hXp/view?usp=drive_link",
      icon: <i className="devicon-python-plain colored"></i>
    },
    {
      title: "Build GenAI Apps with No-Code Tools",
      issuer: "Udemy",
      link: "https://drive.google.com/file/d/1MGzz-K9zrcRkqIGWzxd3gy2uAiZ_rf2o/view?usp=sharing",
      icon: <i className="fas fa-layer-group"></i>
    },
    {
      title: "Data Structures & Algorithms Training",
      issuer: "CipherSchools",
      link: "https://drive.google.com/file/d/1Y7FxIqOfk1-5_PWIzKW9PDiSQ4rHTcIx/view?usp=drive_link",
      icon: <i className="fas fa-code"></i>
    },
    {
      title: "Computer Programming (72 Hours)",
      issuer: "NeoColab – LPU",
      link: "https://drive.google.com/file/d/1zZfcB36TjnLoV0bEMinwDQY4Q-oNaV7R/view?usp=drive_link",
      icon: <i className="fas fa-laptop-code"></i>
    },
    {
      title: "Unrevealing Basic Python towards ML/AI",
      issuer: "CSE Pathshala",
      link: "https://drive.google.com/file/d/1fqky_prFXP_U_bKdbI1P6GQjC6R1h8nQ/view?usp=drive_link",
      icon: <i className="fas fa-network-wired"></i>
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // GSAP Main Reveals & Scroll Velocity Physics
  const lenisRef = useRef(null);

  useLayoutEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Always return cleanup for Lenis (fixes leak when loaded=false)
    if (!loaded) {
      return () => {
        lenis.destroy();
        lenisRef.current = null;
      };
    }
    
    // Trigger reveals ONLY after preloader finishes
    const ctx = gsap.context(() => {
        // Split-Type Reveals (Guarded by font load to ensure correct metrics)
        document.fonts.ready.then(() => {
          const splitHeadings = document.querySelectorAll('.split-heading');
          splitHeadings.forEach(heading => {
            const split = new SplitType(heading, { types: 'lines,words' });
            gsap.from(split.words, {
              y: 100,
              opacity: 0,
              duration: 1,
              stagger: 0.05,
              ease: "power4.out",
              scrollTrigger: {
                trigger: heading,
                start: "top 90%",
                toggleActions: "play none none reverse"
              }
            });
          });
        });

        // Horizontal Scroll for Projects (with guard for small screens)
        const projectsWrapper = document.querySelector('.projects-horizontal-wrapper');
        if (projectsWrapper) {
            const totalWidth = projectsWrapper.scrollWidth;
            const windowWidth = window.innerWidth;
            const scrollDistance = totalWidth - windowWidth;

            // Only enable horizontal scroll if there's content to scroll
            if (scrollDistance > 100) {
                gsap.to(projectsWrapper, {
                    x: -scrollDistance,
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".projects-section-container",
                        pin: true,
                        scrub: 1,
                        start: "top top",
                        end: () => `+=${scrollDistance}`,
                        invalidateOnRefresh: true,
                    }
                });
            }
        }

        gsap.from(".fade-up", {
            y: 60,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: { trigger: ".container", start: "top 90%" }
        });

    });
    return () => {
      ctx.revert();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [loaded]);

  // Anchor navigation handler using Lenis smooth scroll
  const handleAnchorClick = useCallback((e) => {
    const href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#') && lenisRef.current) {
      e.preventDefault();
      lenisRef.current.scrollTo(href, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    }
  }, []);

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Preloader onComplete={() => setLoaded(true)} />

      {/* Marquee bg */}

      {/* Infinite Marquee bg */}
      <div className="bg-marquee">
        <h1>CREATOR ENGINEER DEVELOPER CREATOR ENGINEER DEVELOPER</h1>
      </div>

      {/* SPILT FRONTPAGE LAYOUT */}
      <div className="frontpage-split" id="home">
        {/* Left Side (Accent Color) */}
        <div className="split-left">
          <div className="nav-brand-container">
            <a href="#home" className="nav-brand-split">&lt;AyushKatewa/&gt;</a>
          </div>
          
          <div className="social-icons-split">
            <a href="https://www.linkedin.com/in/ayushkatewa23/" target="_blank" rel="noreferrer"><i className="devicon-linkedin-plain"></i></a>
            <a href="https://github.com/ayushkatewa" target="_blank" rel="noreferrer"><i className="devicon-github-original"></i></a>
            <a href="mailto:katewaayush23@gmail.com"><i className="fas fa-envelope"></i></a>
          </div>
        </div>

        {/* Right Side (Dark Theme + 3D Canvas) */}
        <div className="split-right">
          <nav className="nav-split">
            <Magnetic><a href="#home" onClick={handleAnchorClick}>Home</a></Magnetic>
            <Magnetic><a href="#about" onClick={handleAnchorClick}>About</a></Magnetic>
            <Magnetic><a href="#education" onClick={handleAnchorClick}>Education</a></Magnetic>
            <Magnetic><a href="#skills" onClick={handleAnchorClick}>Skills</a></Magnetic>
            <Magnetic><a href="#projects" onClick={handleAnchorClick}>Projects</a></Magnetic>
            <Magnetic><a href="#certificates" onClick={handleAnchorClick}>Certificates</a></Magnetic>
            <Magnetic><a href="#connect" onClick={handleAnchorClick} className="nav-contact-split">Contact</a></Magnetic>
          </nav>

          <div className="hero-content-split fade-up">
            <h4 className="hero-role-split fade-up">Data Science & AI/ML Engineering</h4>
            <h1 className="hero-name-split split-heading">Ayush Katewa</h1>
            <p className="hero-desc-split fade-up">
              The future is data-driven. I specialize in turning complex datasets into actionable insights through advanced Machine Learning and AI.<br/>
              With deep expertise in Full Stack Development and Cloud Computing, I build scalable end-to-end solutions that drive real-world impact.<br/>
              Data Science is my focus; Engineering is my foundation.
            </p>
            
            <div className="hero-buttons-split fade-up">
              <Magnetic>
                <a href="/Ayush_CV.pdf" download="Ayush_Katewa_CV.pdf" className="btn-outline-split"><i className="fas fa-eye"></i> Download CV</a>
              </Magnetic>
              <Magnetic>
                <a href="#connect" onClick={handleAnchorClick} className="btn-solid-split">Contact</a>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* Center Profile Object over mapping */}
        <Magnetic>
          <div className="profile-center-circle">
            <img src={profileImg} alt="Ayush Katewa" />
          </div>
        </Magnetic>
      </div>

      <div className="container" style={{paddingTop: '6rem'}}>

        {/* ABOUT */}
        <section id="about" className="fade-up">
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '3rem', WebkitAlignItems: 'flex-start', alignItems: 'flex-start' }}>
            <h2 className="split-heading" style={{ fontSize: '3.5rem', color: '#ff5500', fontWeight: '800', marginBottom: '0.8rem', letterSpacing: '-1.5px', fontFamily: 'Space Grotesk, sans-serif' }}>Who I Am</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: '500' }}>Get to know me better</p>
          </div>
          <AboutCard />
        </section>

        {/* ACADEMICS */}
        <section id="education" className="fade-up">
          <div className="section-header">
            <h2 className="gradient-text split-heading">Academics</h2>
            <p>My educational journey and academic foundational milestones.</p>
          </div>
          
          <div className="academics-timeline-v2">
            
            {/* 1. BTech */}
            <div className="academics-item reversed">
              <div className="academics-dot"></div>
              <Magnetic>
                <div className="academics-card">
                  <div className="academics-header">
                    <i className="fas fa-graduation-cap academics-icon"></i>
                    <div className="academics-meta">
                      <span className="academics-year">Aug' 23 - Present</span>
                      <span className="academics-location"><i className="fas fa-location-dot"></i> Phagwara, Punjab</span>
                    </div>
                  </div>
                  <h3>B.Tech CSE</h3>
                  <p className="academics-school">Lovely Professional University</p>
                  <div className="academics-badge">CGPA: 7.24</div>
                </div>
              </Magnetic>
            </div>

            {/* 2. Intermediate */}
            <div className="academics-item">
              <div className="academics-dot"></div>
              <Magnetic>
                <div className="academics-card">
                  <div className="academics-header">
                    <i className="fas fa-graduation-cap academics-icon"></i>
                    <div className="academics-meta">
                      <span className="academics-year">Apr' 21 - Mar' 22</span>
                      <span className="academics-location"><i className="fas fa-location-dot"></i> Jhunjhunu, Rajasthan</span>
                    </div>
                  </div>
                  <h3>Intermediate</h3>
                  <p className="academics-school">Aakash Academy School</p>
                  <div className="academics-badge">PERCENTAGE: 86.80%</div>
                </div>
              </Magnetic>
            </div>

            {/* 3. Matriculation */}
            <div className="academics-item reversed">
              <div className="academics-dot"></div>
              <Magnetic>
                <div className="academics-card">
                  <div className="academics-header">
                    <i className="fas fa-graduation-cap academics-icon"></i>
                    <div className="academics-meta">
                      <span className="academics-year">Apr' 19 - Mar' 20</span>
                      <span className="academics-location"><i className="fas fa-location-dot"></i> Jhunjhunu, Rajasthan</span>
                    </div>
                  </div>
                  <h3>Matriculation</h3>
                  <p className="academics-school">Kissan Public School</p>
                  <div className="academics-badge">PERCENTAGE: 86.80%</div>
                </div>
              </Magnetic>
            </div>

          </div>
        </section>

        <section id="experience" className="exp-training-section fade-up">
          <div className="section-header">
            <h2 className="gradient-text split-heading">Experience & <span style={{ color: 'var(--accent-orange)' }}>Training.</span></h2>
            <p>Continuous learning and professional algorithmic progression.</p>
          </div>

          <div className="exp-training-item">
            <div className="exp-left">
              <span className="exp-date">Jun' 25 - Jul' 25</span>
              <div className="exp-badge-outline">PEP Program</div>
            </div>
            
            <div className="exp-timeline">
              <div className="exp-dot"></div>
              <div className="exp-line"></div>
            </div>

            <div className="exp-card">
              <div className="exp-card-header">
                <i className="fas fa-bolt exp-bolt"></i>
                <h3 className="exp-card-title">Data Structures & Algorithms</h3>
              </div>
              <span className="exp-card-subtitle">PEP Program</span>
              
              <ul className="exp-list">
                <li className="exp-list-item">
                  <span className="exp-bullet">&gt;</span>
                  <span>Completed intensive DSA training covering Pointers, Arrays, Linked Lists, Stacks, Queues, Trees, Heaps, Graphs, Recursion, Backtracking, Greedy, and Dynamic Programming.</span>
                </li>
                <li className="exp-list-item">
                  <span className="exp-bullet">&gt;</span>
                   <span>Applied patterns including Sliding Window, Prefix Sum, Monotonic Stack/Queue, Fast-Slow Pointers, Merge Intervals, and Top-K Heaps to solve competitive programming problems.</span>
                </li>
              </ul>

              <a href="https://drive.google.com/file/d/1iOWPUeXDcpoBoI6OpENVKu06tgZuNzOV/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="btn-certificate">
                <i className="fas fa-certificate"></i>
                View Training Certificate
              </a>
            </div>
          </div>
        </section>

        {/* PROJECTS (Horizontal Scroll) */}
        <section id="projects" className="projects-section-container">
          <div className="section-header container" style={{ paddingBottom: '2rem' }}>
            <h2 className="gradient-text split-heading">Featured Projects</h2>
            <p>A curated selection of projects that made me confident in building software.</p>
          </div>
          
          <div className="projects-horizontal-wrapper">
            
            {/* 1. TransitAI */}
            <div className="horizontal-project-item">
                <TiltCard glow={true}>
                    <div className="project-card-v2">
                        <div className="project-card-inner">
                        <div className="project-image-box">
                            <img src={transitAiImg} alt="TransitAI" />
                        </div>
                        <div className="project-info">
                            <h3>TransitAI</h3>
                            <p>End-to-end ML pipeline predicting NYC MTA bus delays (R² {'>'} 0.7) with multi-source data integration and interactive Streamlit dashboard.</p>
                            
                            <div className="tech-pills">
                            <span className="tech-pill"><i className="devicon-python-plain"></i> Python</span>
                            <span className="tech-pill"><i className="devicon-scikitlearn-plain"></i> Scikit-learn</span>
                            <span className="tech-pill"><i className="fas fa-chart-line"></i> Streamlit</span>
                            </div>
                        </div>
                        </div>
                        <a href="https://github.com/ayushkatewa/Public-Transport-Delays-with-Weather-Events" target="_blank" rel="noreferrer" className="github-btn-full">
                        <i className="devicon-github-original"></i> View on GitHub
                        </a>
                    </div>
                </TiltCard>
            </div>

            {/* 2. Library Management System */}
            <div className="horizontal-project-item">
                <TiltCard glow={true}>
                    <div className="project-card-v2">
                        <div className="project-card-inner">
                        <div className="project-image-box">
                            <img src={luminalibImg} alt="Library Management System" />
                        </div>
                        <div className="project-info">
                            <h3>Library Management System</h3>
                            <p>Built a full-stack, GUI-based Library Management System that manages books, members, borrowing, returning, and fines. Implemented core structures like Arrays and Linked Lists for real-time visualization of CRUD operations.</p>
                            
                            <div className="tech-pills">
                            <span className="tech-pill"><i className="devicon-react-original"></i> React</span>
                            <span className="tech-pill"><i className="devicon-typescript-plain"></i> TypeScript</span>
                            <span className="tech-pill"><i className="devicon-tailwindcss-plain"></i> Tailwind</span>
                            </div>
                        </div>
                        </div>
                        <a href="https://github.com/ayushkatewa/Library-Management-System" target="_blank" rel="noreferrer" className="github-btn-full">
                        <i className="devicon-github-original"></i> View on GitHub
                        </a>
                    </div>
                </TiltCard>
            </div>

            {/* 3. HRMS Backend */}
            <div className="horizontal-project-item">
                <TiltCard glow={true}>
                    <div className="project-card-v2">
                        <div className="project-card-inner">
                        <div className="project-image-box">
                            <img src={hrmsBackendImg} alt="HRMS Backend" />
                        </div>
                        <div className="project-info">
                            <h3>HRMS Backend</h3>
                            <p>Modular REST API with 9 HR modules exposing 30+ endpoints, integrated with Supabase PostgreSQL spanning 12 relational tables.</p>
                            
                            <div className="tech-pills">
                            <span className="tech-pill"><i className="devicon-fastapi-plain"></i> FastAPI</span>
                            <span className="tech-pill"><i className="devicon-supabase-plain"></i> Supabase</span>
                            <span className="tech-pill"><i className="devicon-postgresql-plain"></i> PostgreSQL</span>
                            </div>
                        </div>
                        </div>
                        <a href="https://github.com/ayushkatewa/hrms-backend" target="_blank" rel="noreferrer" className="github-btn-full">
                        <i className="devicon-github-original"></i> View on GitHub
                        </a>
                    </div>
                </TiltCard>
            </div>

            {/* 6. Air Quality Tracker */}
            <div className="horizontal-project-item">
                <TiltCard glow={true}>
                    <div className="project-card-v2">
                        <div className="project-card-inner">
                        <div className="project-image-box">
                            <img src={airQualityImg} alt="Air Quality Tracker" />
                        </div>
                        <div className="project-info">
                            <h3>Air Quality Tracker</h3>
                            <p>React application tracking real-time air quality metrics via API integration.</p>
                            
                            <div className="tech-pills">
                            <span className="tech-pill"><i className="devicon-react-original"></i> React</span>
                            <span className="tech-pill"><i className="fas fa-cloud"></i> API</span>
                            </div>
                        </div>
                        </div>
                        <a href="https://github.com/ayushkatewa/air-quality" target="_blank" rel="noreferrer" className="github-btn-full">
                        <i className="devicon-github-original"></i> View on GitHub
                        </a>
                    </div>
                </TiltCard>
            </div>

          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="fade-up">
          <div className="section-header">
            <h2 className="gradient-text split-heading">Skills</h2>
            <p>Technologies, Frameworks, and Architectures I specialize in</p>
          </div>

          <div className="skills-bento">
            <div className="skill-bento-card span-2 magnetic-card">
              <h4 className="skill-cat-title">Programming Languages</h4>
              <p className="skill-cat-desc">Core foundation for building scalable, high-performance systems.</p>
              <div className="skill-icons-grid">
                <div className="skill-icon-item"><i className="devicon-cplusplus-plain colored"></i> <span>C++</span></div>
                <div className="skill-icon-item"><i className="devicon-c-plain colored"></i> <span>C</span></div>
                <div className="skill-icon-item"><i className="devicon-python-plain colored"></i> <span>Python</span></div>
                <div className="skill-icon-item"><i className="devicon-java-plain colored"></i> <span>Java</span></div>
                <div className="skill-icon-item"><i className="fas fa-database" style={{color: '#4479A1'}}></i> <span>SQL</span></div>
              </div>
            </div>

            <div className="skill-bento-card magnetic-card">
              <h4 className="skill-cat-title">Frameworks</h4>
              <p className="skill-cat-desc">Architecting robust full-stack & ML solutions.</p>
              <div className="skill-icons-grid compact">
                <div className="skill-icon-item"><i className="devicon-react-original colored"></i> <span>React</span></div>
                <div className="skill-icon-item"><i className="devicon-nextjs-plain" style={{filter: 'invert(1)'}}></i> <span>Next.js</span></div>
                <div className="skill-icon-item"><i className="devicon-fastapi-plain colored"></i> <span>FastAPI</span></div>
                <div className="skill-icon-item"><i className="devicon-scikitlearn-plain colored"></i> <span>Scikit-learn</span></div>
                <div className="skill-icon-item"><i className="devicon-numpy-plain colored"></i> <span>NumPy</span></div>
                <div className="skill-icon-item"><i className="devicon-pandas-plain colored"></i> <span>Pandas</span></div>
              </div>
            </div>

            <div className="skill-bento-card magnetic-card">
              <h4 className="skill-cat-title">Tools & Databases</h4>
              <p className="skill-cat-desc">Infrastructure & Data Management</p>
              <div className="skill-icons-grid compact">
                <div className="skill-icon-item"><i className="devicon-docker-plain colored"></i> <span>Docker</span></div>
                <div className="skill-icon-item"><i className="devicon-git-plain colored"></i> <span>Git</span></div>
                <div className="skill-icon-item"><i className="devicon-github-original" style={{filter: 'invert(1)'}}></i> <span>GitHub</span></div>
                <div className="skill-icon-item"><i className="devicon-mysql-plain colored"></i> <span>MySQL</span></div>
                <div className="skill-icon-item"><i className="devicon-postgresql-plain colored"></i> <span>PostgreSQL</span></div>
                <div className="skill-icon-item"><i className="fas fa-chart-pie" style={{color: '#F2C811'}}></i> <span>Power BI</span></div>
              </div>
            </div>

            <div className="skill-bento-card span-2 magnetic-card">
              <h4 className="skill-cat-title">Soft Skills & Capabilities</h4>
              <div className="skill-icons-grid flat-grid">
                <div className="skill-flat"><i className="fas fa-lightbulb" style={{color: '#4C8CBF'}}></i> Complex Problem-Solving</div>
                <div className="skill-flat"><i className="fas fa-project-diagram" style={{color: '#4C8CBF'}}></i> System Architecture</div>
                <div className="skill-flat"><i className="fas fa-clock" style={{color: '#4C8CBF'}}></i> Time Management</div>
                <div className="skill-flat"><i className="fas fa-crown" style={{color: '#4C8CBF'}}></i> Technical Leadership</div>
              </div>
            </div>
          </div>
        </section>

        {/* CERTIFICATES */}
        <section id="certificates" className="fade-up" style={{ paddingBottom: '4rem' }}>
          <div className="section-header">
            <h2 className="gradient-text split-heading">Certificates</h2>
            <p>Done some important Certifications</p>
          </div>
          
          <div className="certificates-scroll-container">
            <div className="certificates-track">
              {certificates.map((cert, index) => (
                <div key={index} className="cert-card magnetic-card">
                  <div className="cert-image-placeholder">
                    <span className="cert-icon">{cert.icon}</span>
                    <span className="cert-issuer-badge">{cert.issuer}</span>
                  </div>
                  <div className="cert-content">
                    <h4>{cert.title}</h4>
                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="view-cert-btn">View Certificate</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GET IN TOUCH */}
        <section id="connect" className="fade-up" style={{ paddingBottom: '6rem' }}>
          <div className="section-header">
            <h2 className="gradient-text split-heading">Get In Touch</h2>
            <p>Find me on LinkedIn and other platforms</p>
          </div>
          
          <div className="contact-split-v2">
            
            {/* Left Column: Info */}
            <div className="contact-info-panel">
              <h3 className="premium-subtitle">Let's build something amazing together.</h3>
              <p className="contact-desc">
                Whether you have a question, a project opportunity, or just want to explore AI, ML, and scalable architecture, my inbox is always open!
              </p>
              
              <div className="address-items">
                <div className="address-item">
                  <div className="address-icon"><i className="fas fa-envelope"></i></div>
                  <div className="address-text">
                    <span>Email Me</span>
                    <p>katewaayush23@gmail.com</p>
                  </div>
                </div>
                <div className="address-item">
                  <div className="address-icon"><i className="fas fa-location-dot"></i></div>
                  <div className="address-text">
                    <span>Location</span>
                    <p>India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="contact-form-panel magnetic-card">
              <form className="premium-contact-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name</label>
                    <input type="text" placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label>Your Email</label>
                    <input type="email" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Your Message</label>
                  <textarea rows="5" placeholder="Hey Ayush, let's collaborate on..."></textarea>
                </div>
                <button type="submit" className="send-msg-btn">
                  Send Message <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>

          </div>
        </section>

      </div>
    </>
  );
}

export default App;
