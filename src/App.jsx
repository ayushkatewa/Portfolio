import React, { useEffect, useState, useRef } from 'react';
import './index.css';
import transitAiImg from './assets/transit_ai.png';
import luminalibImg from './assets/luminalib.png';
import hrmsBackendImg from './assets/hrms_backend.png';
import airQualityImg from './assets/air_quality.png';
import educationImg from './assets/education.png';
import profileImg from './assets/hero.png';

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

// --- Static Wrappers ---
const Magnetic = ({ children, className = '' }) => <div className={className}>{children}</div>;
const TiltCard = ({ children, className = '', style = {}, href, glow = true }) => {
  const Component = href ? 'a' : 'div';
  const props = href ? { href, target: "_blank", rel: "noreferrer" } : {};
  return (
    <Component className={`${className} ${glow ? 'glow-card' : ''}`} style={{ ...style, position: 'relative' }} {...props}>
      {children}
    </Component>
  );
};

const AboutCard = () => (
  <div className="about-grid">
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
    <div className="about-image-wrapper">
        <img src={educationImg} alt="Developer at work" />
    </div>
  </div>
);

const scrambleText = (text, setText) => {
  const chars = "!<>-_\\/[]{}—=+*^?#________";
  let iteration = 0;
  const interval = setInterval(() => {
    setText(text.split("").map((letter, index) => {
      if (index < iteration) return text[index];
      return chars[Math.floor(Math.random() * chars.length)];
    }).join(""));
    if (iteration >= text.length) clearInterval(interval);
    iteration += 1 / 3;
  }, 30);
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [preloaderText, setPreloaderText] = useState("Initializing...");
  const [scrolled, setScrolled] = useState(false);
  
  const [formStatus, setFormStatus] = useState('idle');
  const [scrambledName, setScrambledName] = useState("Ayush Katewa");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const roles = ["Full Stack Developer", "Data Engineer", "AI/ML Enthusiast", "Problem Solver"];
  const [roleIndex, setRoleIndex] = useState(0);

  const certificates = [
    { title: "ChatGPT, Generative AI & LLM", issuer: "Infosys", link: "https://drive.google.com/file/d/15wB01TyKquCkXQ5ViTJFMya20mjNCRwx/view?usp=drive_link", icon: <i className="fas fa-brain"></i> },
    { title: "Computational Theory: Language Principle & FA", issuer: "Infosys", link: "https://drive.google.com/file/d/1YQ3N1wB_qaannP99K9SpFSVP8majvR39/view?usp=drive_link", icon: <i className="fas fa-microchip"></i> },
    { title: "Cloud Computing", issuer: "NPTEL – IIT Kharagpur", link: "https://drive.google.com/file/d/1xxVPc3JQw_DcCXa9XseNzl3f4RehVDcZ/view?usp=drive_link", icon: <i className="fas fa-cloud"></i> },
    { title: "Introduction to Python", issuer: "Infosys", link: "https://drive.google.com/file/d/1JTIHryHN6Tn2Sn7AThuTB83BIpHZ2hXp/view?usp=drive_link", icon: <i className="devicon-python-plain colored"></i> },
    { title: "Build Generative AI Apps with No-Code Tools", issuer: "Udemy", link: "https://drive.google.com/file/d/1MGzz-K9zrcRkqIGWzxd3gy2uAiZ_rf2o/view?usp=sharing", icon: <i className="fas fa-layer-group"></i> },
    { title: "Data Structures & Algorithms Training", issuer: "CipherSchools", link: "https://drive.google.com/file/d/1Y7FxIqOfk1-5_PWIzKW9PDiSQ4rHTcIx/view?usp=drive_link", icon: <i className="fas fa-code"></i> },
    { title: "Computer Programming (72 Hours)", issuer: "NeoColab – LPU", link: "https://drive.google.com/file/d/1zZfcB36TjnLoV0bEMinwDQY4Q-oNaV7R/view?usp=drive_link", icon: <i className="fas fa-laptop-code"></i> },
    { title: "Unrevealing Basic Python towards ML/AI", issuer: "CSE Pathshala", link: "https://drive.google.com/file/d/1fqky_prFXP_U_bKdbI1P6GQjC6R1h8nQ/view?usp=drive_link", icon: <i className="fas fa-dna"></i> }
  ];

  useEffect(() => {
    const observerOptions = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.glow-card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    scrambleText("Ayush Katewa", setScrambledName);
    scrambleText("Ayush Katewa", setPreloaderText);
    
    // Topbar scroll logic
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Preloader exit logic
    const preloaderTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => setIsLoading(false), 1000); // Wait for exit animation
    }, 2500);

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(preloaderTimer);
    };
  }, []);

  const handleAnchorClick = (e) => {
    const href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
      // Browsers handle this natively
      playTick();
    }
  };

  return (
    <>
      {isLoading && (
        <div className={`preloader ${isExiting ? 'exiting' : ''}`}>
          <div className="preloader-panel panel-top"></div>
          <div className="preloader-panel panel-bottom"></div>
          <div className="preloader-content">
            <h1 className="preloader-brand">
              <span>{preloaderText}</span>
            </h1>
            <div className="preloader-bar-container">
              <div className="preloader-bar"></div>
            </div>
            <div className="preloader-status">System Initializing...</div>
          </div>
        </div>
      )}

      {/* Full-width Premium Topbar */}
      <header className={`premium-topbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="topbar-brand">
          <a href="#home" className="nav-brand-split" onClick={handleAnchorClick}>&lt;AyushKatewa/&gt;</a>
        </div>
        <nav className="topbar-nav">
          <a href="#home" onClick={handleAnchorClick}>Home</a>
          <a href="#about" onClick={handleAnchorClick}>About</a>
          <a href="#skills" onClick={handleAnchorClick}>Skills</a>
          <a href="#projects" onClick={handleAnchorClick}>Projects</a>
          <a href="#experience" onClick={handleAnchorClick}>Experience</a>
          <a href="#education" onClick={handleAnchorClick}>Education</a>
          <a href="#certificates" onClick={handleAnchorClick}>Certificates</a>
          <a href="#connect" onClick={handleAnchorClick} className="nav-contact-btn">Contact</a>
        </nav>
      </header>

      <div className="bg-marquee">
        <h1>CREATOR ENGINEER DEVELOPER CREATOR ENGINEER DEVELOPER</h1>
      </div>

      <div className="frontpage-split" id="home">
        <div className="split-left">
          {/* Removed nav brand container and placed it in topbar */}
          <div className="social-icons-split" style={{position: 'absolute', bottom: '3rem', left: '3rem'}}>
            <a href="https://www.linkedin.com/in/ayushkatewa23/" target="_blank" rel="noreferrer"><i className="devicon-linkedin-plain"></i></a>
            <a href="https://github.com/ayushkatewa" target="_blank" rel="noreferrer"><i className="devicon-github-original"></i></a>
            <a href="mailto:katewaayush23@gmail.com"><i className="fas fa-envelope"></i></a>
          </div>
        </div>

        <div className="split-right">
          {/* Topbar navigation moved to <header> */}

          <div className="hero-content">
            <h2 className="hero-greeting reveal fade-up">Hello, I'm</h2>
            <h1 className="hero-name reveal fade-in" style={{ fontSize: 'clamp(3rem, 10vw, 7rem)' }}>{scrambledName}</h1>
            <div className="hero-role-container reveal fade-up stagger-1">
              <p className="hero-desc-split">
                The future is data-driven. I specialize in turning complex datasets into actionable insights through advanced Machine Learning and AI.<br/>
                With deep expertise in Full Stack Development and Cloud Computing, I build scalable end-to-end solutions that drive real-world impact.<br/>
                Data Science is my focus; Engineering is my foundation.
              </p>
            </div>
            <div className="hero-buttons-split">
              <a href="/AyushCV_26.pdf" download="Ayush_Katewa_CV.pdf" className="btn-outline-split"><i className="fas fa-download"></i> Download CV</a>
              <a href="#connect" onClick={handleAnchorClick} className="btn-solid-split">Contact</a>
            </div>
          </div>
        </div>
      </div>
      <div className="container" style={{paddingTop: '6rem'}}>
        <section id="about" className="reveal fade-up">
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '3.5rem', color: '#ff5500', fontWeight: '800', marginBottom: '0.8rem', letterSpacing: '-1.5px' }}>Who I Am</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: '500' }}>Get to know me better</p>
          </div>
          <AboutCard />
        </section>

        <section id="skills" className="skills-section reveal fade-up" style={{ marginTop: '4rem' }}>
          <div className="section-header">
            <h2 className="gradient-text">Skills</h2>
            <p>Technologies, Frameworks, and Architectures I specialize in</p>
          </div>
          <div className="skills-bento">
            <div className="skill-bento-card reveal fade-up stagger-1">
              <h4 className="skill-cat-title">Languages</h4>
              <div className="skill-icons-grid compact">
                <div className="skill-icon-item"><i className="devicon-cplusplus-plain colored"></i> <span>C++</span></div>
                <div className="skill-icon-item"><i className="devicon-c-plain colored"></i> <span>C</span></div>
                <div className="skill-icon-item"><i className="devicon-python-plain colored"></i> <span>Python</span></div>
                <div className="skill-icon-item"><i className="devicon-java-plain colored"></i> <span>Java</span></div>
                <div className="skill-icon-item"><i className="fas fa-database"></i> <span>SQL</span></div>
              </div>
            </div>

            <div className="skill-bento-card reveal fade-up stagger-2">
              <h4 className="skill-cat-title">Frameworks</h4>
              <div className="skill-icons-grid compact">
                <div className="skill-icon-item"><i className="devicon-html5-plain colored"></i> <span>HTML</span></div>
                <div className="skill-icon-item"><i className="devicon-css3-plain colored"></i> <span>CSS</span></div>
                <div className="skill-icon-item"><i className="devicon-numpy-plain colored"></i> <span>NumPy</span></div>
                <div className="skill-icon-item"><i className="devicon-pandas-plain colored"></i> <span>Pandas</span></div>
                <div className="skill-icon-item"><span>Matplotlib</span></div>
                <div className="skill-icon-item"><span>Seaborn</span></div>
                <div className="skill-icon-item"><i className="devicon-fastapi-plain colored"></i> <span>FastAPI</span></div>
                <div className="skill-icon-item"><i className="devicon-scikitlearn-plain colored"></i> <span>Scikit-learn</span></div>
              </div>
            </div>

            <div className="skill-bento-card reveal fade-up stagger-3">
              <h4 className="skill-cat-title">Tools & Platforms</h4>
              <div className="skill-icons-grid compact">
                <div className="skill-icon-item"><i className="fas fa-file-excel" style={{color: '#217346'}}></i> <span>MS Excel</span></div>
                <div className="skill-icon-item"><i className="fas fa-chart-bar" style={{color: '#F2C811'}}></i> <span>Power BI</span></div>
                <div className="skill-icon-item"><i className="devicon-git-plain colored"></i> <span>Git & GitHub</span></div>
                <div className="skill-icon-item"><i className="devicon-vscode-plain colored"></i> <span>VS Code</span></div>
                <div className="skill-icon-item"><i className="devicon-mysql-plain colored"></i> <span>MySQL</span></div>
                <div className="skill-icon-item"><i className="devicon-docker-plain colored"></i> <span>Docker</span></div>
              </div>
            </div>

            <div className="skill-bento-card reveal fade-up stagger-4">
              <h4 className="skill-cat-title">Soft Skills</h4>
              <div className="skill-icons-grid flat-grid">
                <div className="skill-flat"><i className="fas fa-lightbulb"></i> Problem-Solving</div>
                <div className="skill-flat"><i className="fas fa-clock"></i> Time Management</div>
                <div className="skill-flat"><i className="fas fa-users"></i> Leadership</div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="projects-section-container reveal fade-up" style={{ marginTop: '4rem' }}>
          <div className="section-header" style={{ paddingBottom: '2rem' }}>
            <h2 className="gradient-text">Featured Projects</h2>
            <p>A curated selection of projects that made me confident in building software.</p>
          </div>
          <div className="projects-grid">
            <TiltCard className="project-card-v2 reveal fade-up stagger-1">
                <div className="project-card-inner">
                <div className="project-image-box"><img src={transitAiImg} alt="TransitAI" /></div>
                <div className="project-info">
                    <h3>TransitAI: Public Transport Delay Analyzer</h3>
                    <p>Architected an end-to-end Machine Learning pipeline to predict NYC MTA bus delays (R² {'>'} 0.7). Integrated multi-source REST APIs including Open-Meteo weather data, enriching 150,000+ records.</p>
                    <div className="tech-pills">
                    <span className="tech-pill"><i className="devicon-python-plain"></i> Python</span>
                    <span className="tech-pill"><i className="devicon-scikitlearn-plain"></i> Scikit-learn</span>
                    <span className="tech-pill"><i className="fas fa-chart-line"></i> Streamlit</span>
                    <span className="tech-pill">Plotly</span>
                    <span className="tech-pill">SHAP</span>
                    </div>
                </div>
                </div>
                <a href="https://github.com/ayushkatewa/Public-Transport-Delays-with-Weather-Events" target="_blank" rel="noreferrer" className="github-btn-full"><i className="devicon-github-original"></i> View on GitHub | Mar’ 26</a>
            </TiltCard>

            <TiltCard className="project-card-v2 reveal fade-up stagger-2">
                <div className="project-card-inner">
                <div className="project-image-box"><img src={hrmsBackendImg} alt="HRMS Backend" /></div>
                <div className="project-info">
                    <h3>HRMS Backend Architecture</h3>
                    <p>Modular REST API with 9 HR modules exposing 30+ endpoints. Integrated Supabase (PostgreSQL) with 12 relational tables, UUID indexing, and optimized queries for real-time analytics.</p>
                    <div className="tech-pills">
                    <span className="tech-pill"><i className="devicon-fastapi-plain"></i> FastAPI</span>
                    <span className="tech-pill"><i className="devicon-supabase-plain"></i> Supabase</span>
                    <span className="tech-pill">Pydantic</span>
                    <span className="tech-pill">Uvicorn</span>
                    </div>
                </div>
                </div>
                <a href="https://github.com/ayushkatewa/hrms-backend" target="_blank" rel="noreferrer" className="github-btn-full"><i className="devicon-github-original"></i> View on GitHub | Feb’ 26</a>
            </TiltCard>

            <TiltCard className="project-card-v2 reveal fade-up stagger-3">
                <div className="project-card-inner">
                <div className="project-image-box"><img src={luminalibImg} alt="Library Management System" /></div>
                <div className="project-info">
                    <h3>LuminaLib: Unified Enterprise Ecosystem</h3>
                    <p>High-performance cross-platform ecosystem bridging C++ Terminal UI with Next.js 15 portal, handling 10,000+ synchronized records via a SQLite DAL.</p>
                    <div className="tech-pills">
                    <span className="tech-pill"><i className="devicon-cplusplus-plain"></i> C++</span>
                    <span className="tech-pill"><i className="devicon-nextjs-plain"></i> Next.js 15</span>
                    <span className="tech-pill"><i className="devicon-tailwindcss-plain"></i> Tailwind CSS 4</span>
                    <span className="tech-pill">Lucide</span>
                    </div>
                </div>
                </div>
                <a href="https://github.com/ayushkatewa/Library-Management-System" target="_blank" rel="noreferrer" className="github-btn-full"><i className="devicon-github-original"></i> View on GitHub | June’ 25– July’ 25</a>
            </TiltCard>
          </div>
        </section>

        <section id="experience" className="exp-training-section reveal fade-up" style={{ marginTop: '4rem' }}>
          <div className="section-header">
            <h2 className="gradient-text">Experience & <span style={{ color: 'var(--accent-orange)' }}>Training.</span></h2>
            <p>Continuous learning and professional algorithmic progression.</p>
          </div>
          <div className="exp-training-item reveal fade-up stagger-1">
            <div className="exp-left">
              <span className="exp-date">May' 25 - July' 25</span>
              <div className="exp-badge-outline">CipherSchools</div>
            </div>
            <div className="exp-timeline">
              <div className="exp-dot"></div>
              <div className="exp-line"></div>
            </div>
            <div className="exp-card glow-card">
              <div className="exp-card-header">
                <i className="fas fa-bolt exp-bolt"></i>
                <h3 className="exp-card-title">C++ / DSA Training</h3>
              </div>
              <span className="exp-card-subtitle">Summer Training</span>
              <ul className="exp-list">
                <li className="exp-list-item"><span className="exp-bullet">&gt;</span><span>Completed an intensive academic training program focused on C++ programming, Object-Oriented Programming (OOP), and Data Structures & Algorithms (DSA).</span></li>
                <li className="exp-list-item"><span className="exp-bullet">&gt;</span><span>Gained a strong foundation in core programming concepts including variables, control structures, functions, pointers, and memory management.</span></li>
                <li className="exp-list-item"><span className="exp-bullet">&gt;</span><span>Learned and applied OOP principles such as encapsulation, inheritance, polymorphism, and abstraction to build scalable and maintainable applications.</span></li>
              </ul>
            </div>
          </div>

          <div className="exp-training-item reveal fade-up stagger-2" style={{ marginTop: '4rem' }}>
            <div className="exp-left">
              <span className="exp-date">Mar' 2024</span>
              <div className="exp-badge-outline">InnovateX</div>
            </div>
            <div className="exp-timeline">
              <div className="exp-dot"></div>
              <div className="exp-line"></div>
            </div>
            <div className="exp-card glow-card">
              <div className="exp-card-header">
                <i className="fas fa-trophy exp-bolt" style={{ color: '#FFD700' }}></i>
                <h3 className="exp-card-title">Hackathon Achievement</h3>
              </div>
              <span className="exp-card-subtitle">InnovateX: Top 10 Rank</span>
              <p className="exp-list-item" style={{ padding: '0 1rem' }}>
                Participated in a 24-hour coding hackathon and secured a position in the top 10 finalists.
              </p>
            </div>
          </div>
        </section>

        <section id="education" className="academics-section reveal fade-up" style={{ marginTop: '4rem' }}>
          <div className="academics-background-text">LEARN</div>
          <div className="section-header">
            <h2 className="gradient-text">Academic Journey</h2>
            <p>Timeline of my educational milestones and research foundations.</p>
          </div>
          <div className="academics-timeline">
            <div className="academics-item active reveal fade-up stagger-1">
              <div className="academics-dot"></div>
              <div className="academics-card">
                <div className="academics-header">
                  <div className="academics-icon-wrapper"><i className="fas fa-university academics-icon"></i></div>
                  <div className="academics-meta">
                    <div className="academics-year-row">
                      <span className="academics-year">Since Aug' 23</span>
                      <span className="academics-separator">|</span>
                      <span className="academics-location">Phagwara, Punjab</span>
                    </div>
                  </div>
                </div>
                <h3>BTech CSE</h3>
                <p className="academics-school">Lovely Professional University</p>
                <div className="academics-badge">CGPA: 7.24</div>
              </div>
            </div>
            <div className="academics-item reveal fade-up stagger-2">
              <div className="academics-dot"></div>
              <div className="academics-card">
                <div className="academics-header">
                  <div className="academics-icon-wrapper"><i className="fas fa-graduation-cap academics-icon"></i></div>
                  <div className="academics-meta">
                    <div className="academics-year-row">
                      <span className="academics-year">Apr' 21 - Mar' 22</span>
                      <span className="academics-separator">|</span>
                      <span className="academics-location">Jhunjhunu, Rajasthan</span>
                    </div>
                  </div>
                </div>
                <h3>Intermediate</h3>
                <p className="academics-school">Aakash Academy School</p>
                <div className="academics-badge">PERCENTAGE: 86.80%</div>
              </div>
            </div>
            <div className="academics-item reversed reveal fade-up stagger-3">
              <div className="academics-dot"></div>
              <div className="academics-card">
                <div className="academics-header">
                  <div className="academics-icon-wrapper"><i className="fas fa-graduation-cap academics-icon"></i></div>
                  <div className="academics-meta">
                    <div className="academics-year-row">
                      <span className="academics-year">Apr' 19 - Mar' 20</span>
                      <span className="academics-separator">|</span>
                      <span className="academics-location">Jhunjhunu, Rajasthan</span>
                    </div>
                  </div>
                </div>
                <h3>Matriculation</h3>
                <p className="academics-school">Kissan public School</p>
                <div className="academics-badge">PERCENTAGE: 86.80%</div>
              </div>
            </div>
          </div>
        </section>

        <section id="certificates" className="reveal fade-up" style={{ paddingBottom: '4rem', marginTop: '4rem' }}>
          <div className="section-header">
            <h2 className="gradient-text">Certificates</h2>
            <p>Professional Certifications & Academic Credentials</p>
          </div>
          
          <div className="certificates-scroll-container reveal fade-in stagger-2">
            <div className="certificates-track">
              {certificates.map((cert, index) => (
                <div key={index} className="cert-card glow-card">
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

        <section id="connect" className="reveal fade-up">
          <div className="section-header">
            <h2 className="gradient-text">Get In Touch</h2>
            <p>Find me on LinkedIn and other platforms</p>
          </div>
          <div className="contact-split-v2">
            <div className="contact-info-panel">
              <h3 className="premium-subtitle">Let's build something amazing together.</h3>
              <div className="address-items">
                <div className="address-item">
                  <div className="address-icon"><i className="fas fa-envelope"></i></div>
                  <div className="address-text"><span>Email Me</span><p>katewaayush23@gmail.com</p></div>
                </div>
                <div className="address-item">
                  <div className="address-icon"><i className="fas fa-phone"></i></div>
                  <div className="address-text"><span>Mobile</span><p>+91-9664177985</p></div>
                </div>
                <div className="address-item">
                  <div className="address-icon"><i className="fab fa-linkedin"></i></div>
                  <div className="address-text"><span>LinkedIn</span><p><a href="https://www.linkedin.com/in/ayushkatewa23/" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>ayushkatewa23</a></p></div>
                </div>
              </div>
            </div>
            <div className="contact-form-panel reveal fade-in stagger-2">
              <form className="premium-contact-form" onSubmit={(e) => { e.preventDefault(); setFormStatus('loading'); setTimeout(() => setFormStatus('success'), 2000); }}>
                {formStatus === 'success' ? (
                  <div className="form-success-message">
                    <i className="fas fa-check-circle"></i>
                    <h3>Message Sent!</h3>
                    <p>I'll get back to you shortly.</p>
                  </div>
                ) : (
                  <>
                    <div className="form-group-row">
                      <div className="form-group">
                        <label>Your Name</label>
                        <input type="text" placeholder="John Doe" required />
                      </div>
                      <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="john@example.com" required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Message</label>
                      <textarea rows="5" placeholder="Tell me about your project..." required></textarea>
                    </div>
                    <button type="submit" className="submit-btn-premium pulse-btn" disabled={formStatus === 'loading'}>
                      {formStatus === 'loading' ? 'Sending...' : 'Send Message'}
                      <i className="fas fa-paper-plane"></i>
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
