import React, { useLayoutEffect, useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/all';
import { Canvas } from '@react-three/fiber';
import { Stars, MeshDistortMaterial, Sphere } from '@react-three/drei';
import './index.css';

gsap.registerPlugin(ScrollTrigger, Draggable);

// --- 1. Custom Trailing Cursor ---
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const moveCursor = (e) => {
      gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "power2.out" });
      gsap.to(dotRef.current, { x: e.clientX, y: e.clientY, duration: 0, ease: "none" });
    };

    const addHover = () => {
      gsap.to(cursorRef.current, { scale: 2.5, backgroundColor: "rgba(255,255,255,0.1)", duration: 0.2 });
      gsap.to(dotRef.current, { scale: 0, duration: 0.2 });
    };
    const removeHover = () => {
      gsap.to(cursorRef.current, { scale: 1, backgroundColor: "transparent", duration: 0.2 });
      gsap.to(dotRef.current, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', moveCursor);
    
    // Attach hover effects to interactables
    document.querySelectorAll('a, button, .card-explore, .project-card, .skill-chip').forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.querySelectorAll('a, button, .card-explore, .project-card, .skill-chip').forEach(el => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
      });
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" ref={cursorRef} />
      <div className="cursor-dot" ref={dotRef} />
    </>
  );
};

// --- 2. Cinematic Preloader ---
const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef();

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 10) + 2;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        // Animate out
        gsap.to(containerRef.current, {
           yPercent: -100,
           duration: 1.2,
           ease: "power4.inOut",
           delay: 0.2,
           onComplete: onComplete
        });
      }
      setProgress(p);
    }, 50);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="preloader" ref={containerRef}>
      <h1 className="preloader-text">{progress}%</h1>
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
           <div className="skill-chip glow-chip" key={i}><ScrambleText text={item} /></div>
        ))}
      </div>
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

// --- WebGL Liquid Background ---
const LiquidBackground = () => {
  return (
    <Sphere args={[2, 64, 64]} scale={5} position={[0, 0, -2]}>
      <MeshDistortMaterial 
         color="#060606" 
         attach="material" 
         distort={0.5} 
         speed={1.5} 
         roughness={0.2} 
         metalness={0.8}
      />
    </Sphere>
  );
};

// --- 5. Universal Card Wrapper ---
const TiltCard = ({ children, className, style, href, glow = true, imageSrc }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
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
      style={{ ...style, position: 'relative' }}
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
            y: 30,
            duration: 1,
            stagger: 0.25,
            ease: "power2.out",
            scrollTrigger: { trigger: cardRef.current, start: "top 85%" }
        });
    });
    return () => ctx.revert();
  }, []);

  return (
    <TiltCard 
      className="bento-card magnetic-card" 
      style={{ padding: '4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <div ref={cardRef}>
        <h3 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: '700', letterSpacing: '-1px', lineHeight: '1.2', maxWidth: '80%', zIndex: 1, position: 'relative' }}>
          <ScrambleText text="Building more than just software." />
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', fontSize: '1.15rem', lineHeight: '1.8', color: 'var(--text-muted)', zIndex: 1, position: 'relative', marginTop: '1rem' }}>
          <div>
            <p className="about-paragraph">Problem-solving is my core passion. It provides the unwavering discipline and intense focus I need to continuously grow as an engineer.</p>
            <br/>
            <p className="about-paragraph">I specialize in building scalable applications, architecting robust backend infrastructures, and utilizing the most efficient data structures possible. By understanding exactly what advantages modern tech stacks provide, I deliver the absolute best system design solutions for complex problems.</p>
          </div>
          <div>
            <p className="about-paragraph">Beyond traditional full-stack development, I am an active competitive programming participant, a hackathon competitor, and a student constantly striving to master algorithms.</p>
            <br/>
            <p className="about-paragraph" style={{ color: 'var(--text-primary)' }}>I believe mastering deep system logic is the ultimate path to true excellence in software development. Feel free to reach out and invite me to collaborate.</p>
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// --- Main App ---
function App() {
  const [loaded, setLoaded] = useState(false);
  const roles = ["C++ Specialist", "Full Stack Developer", "Algorithms Enthusiast", "System Architect"];
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // GSAP Main Reveals & Scroll Velocity Physics
  useLayoutEffect(() => {
    if (!loaded) return;
    
    // Trigger reveals ONLY after preloader finishes
    const ctx = gsap.context(() => {
        gsap.from(".fade-up", {
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: { trigger: ".container", start: "top 90%" }
        });

    });
    return () => ctx.revert();
  }, [loaded]);

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Preloader onComplete={() => setLoaded(true)} />

      {/* 3D Stars & Liquid Background */}
      <Canvas className="three-bg" camera={{ position: [0, 0, 1] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <LiquidBackground />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>

      {/* Infinite Marquee bg */}
      <div className="bg-marquee">
        <h1>CREATOR ENGINEER DEVELOPER CREATOR ENGINEER DEVELOPER</h1>
      </div>

      <nav className="nav-links">
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#skills">Skills</a>
        <a href="#explore">Other</a>
      </nav>

      <div className="container" id="home">
        
        {/* HERO */}
        <section className="hero fade-up">
          <BouncingText text="Hi, I'm Ayush Katewa" />
          <h2 className="animated-role" key={roleIndex}><ScrambleText text={roles[roleIndex]} /></h2>
        </section>

        {/* ABOUT */}
        <section id="about" className="fade-up">
          <div className="section-header">
            <h2 className="gradient-text"><ScrambleText text="About" /></h2>
            <p>Driven by logic, obsessed with performance.</p>
          </div>
          <AboutCard />
        </section>

        {/* PROJECTS */}
        <section id="projects" className="fade-up">
          <div className="section-header">
            <h2 className="gradient-text"><ScrambleText text="Featured Projects" /></h2>
            <p>A curated selection of projects that made me confident in building software.</p>
          </div>
          
          <div className="projects-grid">
            <TiltCard 
              href="https://github.com/ayushkatewa/air-quality" 
              className="project-card magnetic-card"
              imageSrc="https://plus.unsplash.com/premium_photo-1661288599407-30e4ac4aace2?auto=format&fit=crop&q=80&w=400"
            >
              <div className="project-header" style={{ position: 'relative', zIndex: 1 }}>
                <h3><ScrambleText text="Air Quality Tracker" /></h3>
                <span className="star-badge">★ 12</span>
              </div>
              <p style={{ position: 'relative', zIndex: 1 }}>React application tracking real-time air quality metrics via API integration.</p>
            </TiltCard>

            <TiltCard 
              href="https://github.com/ayushkatewa/Sales-Tax-Analytics-Dashboard" 
              className="project-card magnetic-card"
              imageSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400"
            >
              <div className="project-header" style={{ position: 'relative', zIndex: 1 }}>
                <h3><ScrambleText text="Sales Tax Analytics" /></h3>
                <span className="star-badge">★</span>
              </div>
              <p style={{ position: 'relative', zIndex: 1 }}>Professional dashboard for visualizing and managing complex sales tax data pipelines.</p>
            </TiltCard>

            <TiltCard 
              href="https://github.com/ayushkatewa/Intelligent-CPU-Scheduler-Simulator" 
              className="project-card magnetic-card"
              imageSrc="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400"
            >
              <div className="project-header" style={{ position: 'relative', zIndex: 1 }}>
                <h3><ScrambleText text="CPU Scheduler Simulator" /></h3>
                <span className="star-badge">★</span>
              </div>
              <p style={{ position: 'relative', zIndex: 1 }}>Simulating intelligent CPU scheduling algorithms to optimize process execution times.</p>
            </TiltCard>

            <TiltCard 
              href="#" 
              className="project-card magnetic-card"
              imageSrc="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=400"
            >
              <div className="project-header" style={{ position: 'relative', zIndex: 1 }}>
                <h3><ScrambleText text="Library System Backend" /></h3>
                <span className="star-badge">C++</span>
              </div>
              <p style={{ position: 'relative', zIndex: 1 }}>Efficiently managed book records and transactions ensuring zero data loss via persistent storage.</p>
            </TiltCard>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="fade-up">
          <h2 className="gradient-text"><ScrambleText text="Tech Arsenal" /></h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100vw', marginLeft: 'calc(-50vw + 50%)', overflow: 'hidden', padding: '2rem 0' }}>
            <InfiniteMarquee items={['C++', 'Java', 'Python', 'Go', 'JavaScript', 'HTML/CSS']} />
            <InfiniteMarquee items={['React', 'Node.js', 'Express', 'SQL', 'MongoDB']} reverse={true} />
            <InfiniteMarquee items={['Data Structures', 'Algorithms', 'System Design', 'Git/GitHub']} />
          </div>
        </section>

        {/* EXPLORE / OTHER */}
        <section id="explore" className="fade-up" style={{ paddingBottom: '6rem' }}>
          <h2 className="gradient-text"><ScrambleText text="More to Explore" /></h2>
          <p>Check out these additional resources and connect with me</p>
          
          <div className="explore-bento">
            <div className="explore-col">
              <TiltCard href="https://www.linkedin.com/in/ayush-katewa" className="card-explore magnetic-card">
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3><ScrambleText text="My Links" /></h3>
                  <p>Find me across the web and LinkedIn</p>
                </div>
                <div className="arrow-icon" style={{ position: 'relative', zIndex: 1 }}>↗</div>
              </TiltCard>
              <TiltCard className="card-explore magnetic-card">
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3><ScrambleText text="Achievements" /></h3>
                  <p>Top 10 Rank InnovateX Hackathon, LPU C Programming Certification</p>
                </div>
                <div className="arrow-icon" style={{ position: 'relative', zIndex: 1 }}>★</div>
              </TiltCard>
            </div>

            <TiltCard href="mailto:katewaayush23@gmail.com" className="card-explore card-contact magnetic-card">
              <div className="contact-content">
                <h3><ScrambleText text="Let's Talk" /></h3>
                <p>Ready to build scalable architectures? Send me an email to start collaborating.</p>
              </div>
              <div className="arrow-icon large-icon" style={{ zIndex: 0 }}>✉</div>
            </TiltCard>
          </div>
        </section>

      </div>
    </>
  );
}

export default App;
