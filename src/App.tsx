import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Terminal, Code2, Cpu, Globe, ArrowRight, Github, ExternalLink, Sparkles, Hexagon, Network, BrainCircuit, Palette, Maximize2, X, Mail, Phone, Send } from 'lucide-react';
import { useRef, useState } from 'react';
import MysticAura from './components/MysticAura';
import ProjectCard from './components/ProjectCard';
import ShaderCanvas from './components/ShaderCanvas';
import { ayahuascaFrag } from './shaders/ayahuasca';

const digitalArtifacts = [
  { 
    id: 'ayahuasca', 
    title: "The Shipibo Gateway", 
    category: "Generative Art / WebGL", 
    frag: ayahuascaFrag 
  }
];

const PillarHeader = ({ title, subtitle, number, color = "#C5A059" }: { title: string, subtitle: string, number: string, color?: string }) => (
  <div className="mb-24 relative">
    <div className="absolute -top-16 -left-8 md:-top-32 md:-left-16 text-[10rem] md:text-[20rem] font-magick font-bold text-white/[0.02] select-none pointer-events-none leading-none">
      {number}
    </div>
    <div className="relative z-10 flex items-center gap-4 mb-6">
      <div className="w-12 h-[1px]" style={{ backgroundColor: color }} />
      <h2 className="text-xs tracking-[0.4em] uppercase font-bold" style={{ color }}>{subtitle}</h2>
    </div>
    <h3 className="text-5xl md:text-7xl lg:text-8xl font-magick font-bold relative z-10 uppercase tracking-tighter leading-[0.9]">
      {title}
    </h3>
  </div>
);

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<typeof digitalArtifacts[0] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);
    // ⚠️ IMPORTANT: Replace this with your actual Web3Forms Access Key
    formData.append("access_key", "632bd755-fd91-4e73-a36f-c2d735f7b1e8");
    formData.append("subject", "New Transmission from MIELA Labs Contact Form");
    formData.append("from_name", "MIELA Labs Portal");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setSubmitStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    }
    setIsSubmitting(false);
    setTimeout(() => setSubmitStatus('idle'), 5000);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div ref={containerRef} className="relative min-h-screen text-[#e0e0e0] selection:bg-[#8B5CF6]/30 selection:text-white font-sans bg-[#1E1C22]">
      {/* Digital Sorcery: SVG Filter to remove white background mathematically */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <filter id="remove-white" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            -3 -3 -3 0 8.5
          " />
        </filter>
      </svg>

      <MysticAura />
      
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative flex items-center"
          >
            <img 
              src="https://i.imgur.com/Y8QaoPd.png" 
              alt="MIELA Labs Official Logo" 
              className="relative z-10 h-24 md:h-32 lg:h-40 w-auto object-contain"
              style={{ filter: 'url(#remove-white)' }}
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="hidden md:flex gap-8 text-[10px] tracking-[0.3em] uppercase text-white/60 font-medium">
            <a href="#art" className="hover:text-[#4C1D95] transition-colors">01. Digital Art</a>
            <a href="#community" className="hover:text-[#f7931a] transition-colors">02. Community</a>
            <a href="#ai" className="hover:text-[#9D4EDD] transition-colors">03. Intelligence</a>
            <a href="#contact" className="hover:text-[#D4AF37] transition-colors">04. Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <div className="w-12 h-[1px] bg-[#C5A059]/50" />
              <h2 className="text-[#C5A059] text-[10px] md:text-xs tracking-[0.5em] uppercase font-medium drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]">
                The Technomancy Institute
              </h2>
              <div className="w-12 h-[1px] bg-[#8B5CF6]/50" />
            </motion.div>
            
            <h1 className="text-7xl md:text-[10rem] lg:text-[12rem] font-magick font-bold tracking-tighter leading-[0.8] mb-8">
              <span className="text-miela">MIELA</span> <br />
              <span className="text-gradient-gold text-5xl md:text-[6rem] lg:text-[7rem] tracking-[0.15em] block mt-2">
                LABS
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-white/40 max-w-3xl mx-auto font-light leading-relaxed mb-16 tracking-wide">
              Forging digital artifacts at the intersection of esoteric wisdom and edge technology. 
              A foundry where code becomes an incantation.
            </p>
            
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#art"
              className="glow-effect px-12 py-5 bg-white/5 border border-white/10 text-white font-medium tracking-[0.2em] text-xs uppercase rounded-full inline-flex items-center gap-4 hover:bg-white/10 transition-all"
            >
              Initiate Sequence <ArrowRight className="w-4 h-4 text-[#8B5CF6]" />
            </motion.a>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 15, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <div className="text-[9px] tracking-[0.4em] uppercase text-white/30 rotate-90 mb-8">Scroll</div>
          <div className="w-[1px] h-16 bg-gradient-to-b from-[#C5A059] via-[#8B5CF6] to-transparent" />
        </motion.div>
      </section>

      {/* PILLAR 01: DIGITAL ART & INNOVATION */}
      <section id="art" className="py-32 px-6 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <PillarHeader number="01" subtitle="Esoteric Engineering" title="Digital Art" color="#4C1D95" />
          
          {/* The Digital Sorcery (Portfolio Grid) */}
          <div className="mt-20">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <Palette className="w-5 h-5 text-[#D4AF37]" />
                  <h2 className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] font-bold">Custom Digital Media Design</h2>
                </div>
                <h3 className="text-5xl md:text-6xl font-magick font-bold mb-6">The Digital Sorcery</h3>
                <p className="text-xl text-white/70 font-light leading-relaxed mb-8">
                  We don't just build websites; we forge digital artifacts. Whether you need to inject cutting-edge WebGL effects into your existing business platform, architect a complex web application from scratch, or code your wildest visions into reality, we are the catalyst. 
                </p>
                <p className="text-lg text-white/50 font-light leading-relaxed mb-8">
                  These are closed-source, high-end digital architectures tailored for visionaries.
                </p>
                <a 
                  href="#contact"
                  className="glow-effect inline-flex items-center gap-4 px-8 py-4 rounded-full bg-white/5 border border-[#D4AF37]/30 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#D4AF37]/20 transition-all group/link text-[#D4AF37]"
                >
                  Initiate Project
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-2 transition-transform" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {digitalArtifacts.map(project => (
                <motion.div 
                  layoutId={`project-container-${project.id}`}
                  key={project.id} 
                  onClick={() => setSelectedProject(project)}
                  className="group relative rounded-[2rem] overflow-hidden bg-[#13111A] border border-white/10 aspect-[4/3] cursor-pointer shadow-2xl"
                >
                  <motion.div layoutId={`project-shader-${project.id}`} className="absolute inset-0 w-full h-full">
                    <ShaderCanvas fragShader={project.frag} />
                  </motion.div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E1C22] via-[#1E1C22]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                  
                  <div className="absolute bottom-0 left-0 p-8 w-full z-10 flex justify-between items-end">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ml-auto">
                      <Maximize2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* MPL Section */}
          <motion.a 
            href="https://github.com/hakanovski/MPL"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mt-32 glass-panel p-12 md:p-20 rounded-[3rem] border border-white/5 relative overflow-hidden group mb-12 cursor-pointer block"
          >
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(76, 29, 149,0.15)_0%,transparent_70%)] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            
            <div className="relative z-10 max-w-4xl">
              <div className="flex items-center gap-3 mb-6">
                <Code2 className="w-6 h-6 text-[#4C1D95]" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#4C1D95] font-bold">Flagship Protocol</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-magick font-bold mb-8 leading-[0.9]">
                Magick Programming <br/>Language <span className="text-white/30 text-4xl">(MPL)</span>
              </h2>
              <p className="text-xl text-white/70 leading-relaxed mb-8 font-light">
                A highly experimental, visionary, and esoteric programming project. Merging ancient magick systems—John Dee, Austin Osman Spare, Kabbalah, and Hermeticism—with modern silicon and electricity.
              </p>
              <p className="text-lg text-white/50 leading-relaxed mb-12 font-light">
                Originally prototyped in Python, MPL is now being architected from the ground up in <span className="text-white font-medium">Rust</span> and <span className="text-white font-medium">C</span>. The ultimate goal is to build an esoteric framework to create mystical, tech-driven applications.
              </p>
              <div 
                className="glow-effect inline-flex items-center gap-4 px-8 py-4 rounded-full bg-white/5 border border-[#4C1D95]/30 text-xs tracking-[0.2em] uppercase font-bold group-hover:bg-[#4C1D95]/20 transition-all group/link"
              >
                <Github className="w-5 h-5" />
                View Grimoire (Source)
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
              </div>
            </div>
          </motion.a>
        </div>
      </section>

      {/* PILLAR 02: COMMUNITY */}
      <section id="community" className="py-32 px-6 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <PillarHeader number="02" subtitle="Human Connection Protocol" title="Community" color="#f7931a" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-20">
            {/* BitVid */}
            <motion.a 
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="glass-panel p-12 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-[#f7931a]/30 transition-colors duration-500 flex flex-col justify-between cursor-pointer block"
            >
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(247,147,26,0.08)_0%,transparent_70%)] rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3 pointer-events-none group-hover:bg-[radial-gradient(circle,rgba(247,147,26,0.15)_0%,transparent_70%)] transition-all duration-700" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-16">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Network className="w-5 h-5 text-[#f7931a]" />
                      <span className="text-[10px] tracking-[0.3em] uppercase text-[#f7931a] font-bold">Decentralized Media</span>
                    </div>
                    <h3 className="text-5xl font-magick font-bold">BitVid</h3>
                  </div>
                </div>
                <p className="text-xl text-white/70 leading-relaxed mb-10 font-light">
                  A revolutionary, decentralized video platform framework running entirely on <span className="text-white font-medium">Bitcoin (BTC)</span>. No fiat. No middlemen. Pure peer-to-peer value exchange.
                </p>
                <ul className="space-y-5 mb-12 text-sm text-white/50 font-light">
                  <li className="flex items-start gap-4"><div className="w-1.5 h-1.5 rounded-full bg-[#f7931a] mt-1.5 shadow-[0_0_10px_rgba(247,147,26,0.8)]" /> ZERO barriers to entry. No subscriber thresholds.</li>
                  <li className="flex items-start gap-4"><div className="w-1.5 h-1.5 rounded-full bg-[#f7931a] mt-1.5 shadow-[0_0_10px_rgba(247,147,26,0.8)]" /> Every creator earns fractional BTC based on pure engagement.</li>
                  <li className="flex items-start gap-4"><div className="w-1.5 h-1.5 rounded-full bg-[#f7931a] mt-1.5 shadow-[0_0_10px_rgba(247,147,26,0.8)]" /> Supported by BitVid Plus ($1.99/mo) converted instantly to BTC.</li>
                </ul>
              </div>
              <div className="relative z-10 inline-flex items-center justify-between w-full p-6 rounded-xl bg-white/[0.03] border border-white/10 group-hover:bg-white/10 transition-colors group/btn mt-auto">
                <span className="text-xs tracking-[0.2em] uppercase font-bold text-white/80">Explore Protocol</span>
                <ExternalLink className="w-5 h-5 text-[#f7931a] group-hover/btn:scale-110 transition-transform" />
              </div>
            </motion.a>

            {/* Shiloh Market */}
            <motion.a 
              href="https://shilohmarket.us"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-12 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-[#9D4EDD]/30 transition-colors duration-500 flex flex-col justify-between cursor-pointer block"
            >
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(157, 78, 221,0.08)_0%,transparent_70%)] rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3 pointer-events-none group-hover:bg-[radial-gradient(circle,rgba(157, 78, 221,0.15)_0%,transparent_70%)] transition-all duration-700" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-16">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Globe className="w-5 h-5 text-[#9D4EDD]" />
                      <span className="text-[10px] tracking-[0.3em] uppercase text-[#9D4EDD] font-bold">Hyper-Local Commerce</span>
                    </div>
                    <h3 className="text-5xl font-magick font-bold">Shiloh Market</h3>
                  </div>
                </div>
                <p className="text-xl text-white/70 leading-relaxed mb-8 font-light">
                  A hyper-local web, iOS, and Android application built exclusively for the Shiloh Lakes community in McKinney, Texas.
                </p>
                <p className="text-white/50 leading-relaxed text-base font-light mb-12">
                  A platform where verified local residents can share and sell their homemade food directly to neighbors, strictly following Texas cottage food laws. A simple, effective, and socially impactful community tool.
                </p>
              </div>
              <div className="relative z-10 inline-flex items-center justify-between w-full p-6 rounded-xl bg-white/[0.03] border border-white/10 group-hover:bg-white/10 transition-colors group/btn">
                <span className="text-xs tracking-[0.2em] uppercase font-bold text-white/80">Visit Marketplace</span>
                <ExternalLink className="w-5 h-5 text-[#9D4EDD] group-hover/btn:scale-110 transition-transform" />
              </div>
            </motion.a>
          </div>
        </div>
      </section>

      {/* PILLAR 03: ARTIFICIAL INTELLIGENCE */}
      <section id="ai" className="py-32 px-6 relative z-10 border-t border-white/5 bg-[#1E1C22]/40">
        <div className="max-w-7xl mx-auto">
          <PillarHeader number="03" subtitle="Cognitive Architecture" title="Intelligence" color="#9D4EDD" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="mt-20 relative rounded-[3rem] border border-[#9D4EDD]/20 bg-gradient-to-b from-[#9D4EDD]/5 to-transparent overflow-hidden p-12 md:p-24"
          >
            {/* Abstract AI Background */}
            <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[800px] max-h-[800px] bg-[radial-gradient(circle,rgba(157, 78, 221,0.15)_0%,transparent_60%)] blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#9D4EDD]/30 bg-[#9D4EDD]/10 mb-8">
                <BrainCircuit className="w-4 h-4 text-[#9D4EDD] animate-pulse" />
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#9D4EDD] font-bold">Classified R&D</span>
              </div>
              <h3 className="text-4xl md:text-6xl font-magick font-bold mb-8 leading-tight">
                Architecting <br/>Invisible Systems
              </h3>
              <p className="text-xl text-white/70 leading-relaxed mb-8 font-light">
                MIELA Labs is currently developing a suite of disruptive, niche AI applications. We don't just build wrappers; we engineer cognitive systems that operate seamlessly in the background.
              </p>
              <p className="text-lg text-white/50 leading-relaxed font-light">
                Our focus is on hyper-specialized autonomous agents, predictive market models, and generative systems that redefine human-computer symbiosis. <span className="text-[#9D4EDD] italic">Projects currently in stealth mode.</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Full Screen Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-2xl"
          >
            <motion.div 
              layoutId={`project-container-${selectedProject.id}`}
              className="relative w-full h-full max-w-7xl mx-auto rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-[#13111A] border border-white/10 shadow-[0_0_100px_rgba(157,78,221,0.2)]"
            >
              <motion.div layoutId={`project-shader-${selectedProject.id}`} className="absolute inset-0 w-full h-full">
                <ShaderCanvas fragShader={selectedProject.frag} />
              </motion.div>
              
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all z-20"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PILLAR 04: CONTACT */}
      <section id="contact" className="py-32 px-6 relative z-10 border-t border-white/5 bg-[#13111A]">
        <div className="max-w-7xl mx-auto">
          <PillarHeader number="04" subtitle="Secure Channel" title="Initiate Contact" color="#D4AF37" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-20">
            {/* Contact Info */}
            <div>
              <h3 className="text-4xl font-magick font-bold mb-6">Let's Build The Future.</h3>
              <p className="text-xl text-white/60 font-light leading-relaxed mb-12">
                Have an application idea? Need a mind-blowing website? Or want to inject high-end digital effects into your brand? Drop your vision below, and we'll code it into reality.
              </p>
              
              <div className="space-y-8">
                <a href="mailto:hakanyorganci@gmail.com" className="flex items-center gap-6 group">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#D4AF37]/20 group-hover:border-[#D4AF37]/50 transition-all">
                    <Mail className="w-6 h-6 text-white/70 group-hover:text-[#D4AF37] transition-colors" />
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-bold mb-1">Direct Email</div>
                    <div className="text-xl font-light text-white/90 group-hover:text-white transition-colors">hakanyorganci@gmail.com</div>
                  </div>
                </a>
                
                <a href="tel:+14694009630" className="flex items-center gap-6 group">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#D4AF37]/20 group-hover:border-[#D4AF37]/50 transition-all">
                    <Phone className="w-6 h-6 text-white/70 group-hover:text-[#D4AF37] transition-colors" />
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-bold mb-1">Direct Line</div>
                    <div className="text-xl font-light text-white/90 group-hover:text-white transition-colors">+1 (469) 400-9630</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-panel p-8 md:p-12 rounded-[2rem] border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(212,175,55,0.1)_0%,transparent_70%)] rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              
              <form className="relative z-10 space-y-6" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-white/50 font-bold ml-2">First Name *</label>
                    <input type="text" name="first_name" required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all font-light" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-white/50 font-bold ml-2">Last Name *</label>
                    <input type="text" name="last_name" required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all font-light" placeholder="Doe" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-white/50 font-bold ml-2">Email Address *</label>
                    <input type="email" name="email" required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all font-light" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-white/50 font-bold ml-2">Phone (Optional)</label>
                    <input type="tel" name="phone" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all font-light" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-white/50 font-bold ml-2">Your Vision / Project Details *</label>
                  <textarea name="message" required rows={5} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all font-light resize-none" placeholder="Tell us about the application, website, or digital effect you want to build..."></textarea>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full glow-effect flex items-center justify-center gap-4 px-8 py-5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#D4AF37]/20 transition-all text-[#D4AF37] group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Transmitting...' : 
                   submitStatus === 'success' ? 'Transmission Successful!' : 
                   submitStatus === 'error' ? 'Transmission Failed - Try Again' : 
                   'Transmit Message'}
                  {!isSubmitting && submitStatus === 'idle' && <Send className="w-4 h-4 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/10 relative z-10 bg-[#1E1C22]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center">
            <img 
              src="https://i.imgur.com/Y8QaoPd.png" 
              alt="MIELA Labs Official Logo" 
              className="h-20 md:h-24 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              style={{ filter: 'url(#remove-white)' }}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-medium">
            EST. 2025 // MCKINNEY, TX
          </div>
          <div className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-medium">
            © 2026 All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}



