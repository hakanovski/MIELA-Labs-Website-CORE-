import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, Terminal } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  link: string;
  icon: 'external' | 'github' | 'terminal';
  color: string;
}

export default function ProjectCard({ title, description, tags, link, icon, color }: ProjectCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const IconComponent = icon === 'github' ? Github : icon === 'terminal' ? Terminal : ExternalLink;

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      ref={cardRef as any}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ y: -10 }}
      className="group relative rounded-3xl overflow-hidden glass-panel border border-white/10 cursor-pointer block"
    >
      {/* Spotlight effect */}
      <motion.div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${color}15, transparent 40%)`,
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none" />
      
      <div className="relative z-10 p-10 h-full flex flex-col pointer-events-none">
        <div className="flex justify-between items-start mb-8">
          <h3 className="text-4xl font-bold">{title}</h3>
          <div 
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors"
          >
            <IconComponent className="w-5 h-5" />
          </div>
        </div>
        <p className="text-lg text-white/60 mb-8 flex-grow">
          {description}
        </p>
        <div className="flex flex-wrap gap-3 font-mono text-sm" style={{ color }}>
          {tags.map(tag => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}
