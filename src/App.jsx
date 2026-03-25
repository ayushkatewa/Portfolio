import React, { useEffect, useState, useRef } from 'react';
import './index.css';
import transitAiImg from './assets/transit_ai.png';
import luminalibImg from './assets/luminalib.png';
import hrmsBackendImg from './assets/hrms_backend.png';
import airQualityImg from './assets/air_quality.png';
import educationImg from './assets/education.png';
import profileImg from './assets/hero.png';

// --- UI Sound Synthesizer (Keep for subtle interaction) ---
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

// --- Empty Wrapper for Magnetic (to avoid breaking JSX) ---
const Magnetic = ({ children, className = '' }) => <div className={className}>{children}</div>;

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
  const [formStatus, setFormStatus] = useState('idle'); // idle, loading, success
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

  // Simple anchor navigation
  const handleAnchorClick = (e) => {
    const href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
      // Browsers handle this natively well now
    }
  };

  return (
    <>
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
            <a href="#home" onClick={handleAnchorClick}>Home</a>
            <a href="#about" onClick={handleAnchorClick}>About</a>
            <a href="#education" onClick={handleAnchorClick}>Education</a>
            <a href="#skills" onClick={handleAnchorClick}>Skills</a>
            <a href="#projects" onClick={handleAnchorClick}>Projects</a>
            <a href="#certificates" onClick={handleAnchorClick}>Certificates</a>
            <a href="#connect" onClick={handleAnchorClick} className="nav-contact-split">Contact</a>
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
              <a href="https://drive.google.com/file/d/1yZ-e5A9M_W-K_B_0S_G_I_H_E/view?usp=sharing" target="_blank" rel="noreferrer" className="btn-outline-split"><i className="fas fa-eye"></i> View CV</a>
              <a href="#connect" onClick={handleAnchorClick} className="btn-solid-split">Contact</a>
            </div>
          </div>
        </div>

        {/* Center Profile Object over mapping */}
        <div className="profile-center-circle">
          <img src={profileImg} alt="Ayush Katewa" />
        </div>
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
        <section id="education" className="fade-up academics-section">
          {/* Subtle Background Watermark */}
          <div className="academics-background-text">LEARN</div>
          
          <div className="section-header">
            <h2 className="gradient-text split-heading">Academics</h2>
            <p>My educational journey and academic foundational milestones.</p>
          </div>
          
          <div className="academics-timeline-v2">
            
            {/* 1. BTech */}
            <div className="academics-item reversed">
              <div className="academics-dot"></div>
              <div className="academics-card">
                <div className="academics-header">
                  <div className="academics-icon-wrapper">
                    <i className="fas fa-graduation-cap academics-icon"></i>
                  </div>
                  <div className="academics-meta">
                    <div className="academics-year-row">
                      <span className="academics-year">Aug' 23 - Present</span>
                    </div>
                    <span className="academics-location"><i className="fas fa-location-dot"></i> Phagwara, Punjab</span>
                  </div>
                </div>
                <h3>BTech CSE</h3>
                <p className="academics-school">Lovely Professional University</p>
                <div className="academics-badge">CGPA: 6.97</div>
              </div>
            </div>

            {/* 2. Intermediate */}
            <div className="academics-item">
              <div className="academics-dot"></div>
              <div className="academics-card">
                <div className="academics-header">
                  <div className="academics-icon-wrapper">
                    <i className="fas fa-graduation-cap academics-icon"></i>
                  </div>
                  <div className="academics-meta">
                    <div className="academics-year-row">
                      <span className="academics-year">Apr' 21 - Mar' 22</span>
                      <span className="academics-separator">|</span>
                      <span className="academics-location">Kanpur, Uttar Pradesh</span>
                    </div>
                  </div>
                </div>
                <h3>Intermediate</h3>
                <p className="academics-school">The Jain International School</p>
                <div className="academics-badge">PERCENTAGE: 62%</div>
              </div>
            </div>

            {/* 3. Matriculation */}
            <div className="academics-item reversed">
              <div className="academics-dot"></div>
              <div className="academics-card">
                <div className="academics-header">
                  <div className="academics-icon-wrapper">
                    <i className="fas fa-graduation-cap academics-icon"></i>
                  </div>
                  <div className="academics-meta">
                    <div className="academics-year-row">
                      <span className="academics-year">Apr' 19 - Mar' 20</span>
                      <span className="academics-separator">|</span>
                      <span className="academics-location">Kanpur, Uttar Pradesh</span>
                    </div>
                  </div>
                </div>
                <h3>Matriculation</h3>
                <p className="academics-school">The Jain International School</p>
                <div className="academics-badge">PERCENTAGE: 89%</div>
              </div>
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

        {/* PROJECTS (Static Grid) */}
        <section id="projects" className="projects-section-container">
          <div className="section-header container" style={{ paddingBottom: '2rem' }}>
            <h2 className="gradient-text">Featured Projects</h2>
            <p>A curated selection of projects that made me confident in building software.</p>
          </div>
          
          <div className="projects-grid container">
            
            {/* 1. TransitAI */}
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

            {/* 2. Library Management System */}
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

            {/* 3. HRMS Backend */}
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

            {/* 6. Air Quality Tracker */}
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
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="skills-section">
          <div className="section-header">
            <h2 className="gradient-text">Skills</h2>
            <p>Technologies, Frameworks, and Architectures I specialize in</p>
          </div>

          <div className="skills-bento">
            <div className="skill-bento-card span-2">
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

            <div className="skill-bento-card">
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

            <div className="skill-bento-card">
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

            <div className="skill-bento-card span-2">
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
            <h2 className="gradient-text">Certificates</h2>
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
            <h2 className="gradient-text">Get In Touch</h2>
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
              <form className="premium-contact-form" onSubmit={(e) => {
                  e.preventDefault();
                  setFormStatus('loading');
                  setTimeout(() => setFormStatus('success'), 2000);
              }}>
                {formStatus === 'success' ? (
                  <div className="form-success-message">
                    <i className="fas fa-check-circle"></i>
                    <h3>Message Sent!</h3>
                    <p>Thanks for reaching out. I'll get back to you soon.</p>
                    <button onClick={() => setFormStatus('idle')} className="send-msg-btn">Send Another</button>
                  </div>
                ) : (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Your Name</label>
                        <input type="text" placeholder="John Doe" required />
                      </div>
                      <div className="form-group">
                        <label>Your Email</label>
                        <input type="email" placeholder="john@example.com" required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Your Message</label>
                      <textarea rows="5" placeholder="Hey Ayush, let's collaborate on..." required></textarea>
                    </div>
                    <button type="submit" className="send-msg-btn" disabled={formStatus === 'loading'}>
                      {formStatus === 'loading' ? 'Sending...' : 'Send Message'} <i className="fas fa-paper-plane"></i>
                    </button>
                  </>
                )}
              </form>
            </div>

          </div>
        </section>

      </div>
    </>
  );
}

export default App;
