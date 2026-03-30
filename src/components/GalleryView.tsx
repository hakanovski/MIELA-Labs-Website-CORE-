import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import ShaderCanvas from './ShaderCanvas';
import ArtifactModal from './ArtifactModal';

interface DigitalArtifact {
  id: string;
  title: string;
  category: string;
  type: string;
  frag?: string;
  component?: React.ReactNode;
}

interface GalleryViewProps {
  artifacts: DigitalArtifact[];
  onClose: () => void;
  show: boolean;
}

export default function GalleryView({ artifacts, onClose, show }: GalleryViewProps) {
  const [selectedArtifact, setSelectedArtifact] = useState<DigitalArtifact | null>(null);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="gallery-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-[#020202] overflow-y-auto"
          data-lenis-prevent
        >
          <div className="sticky top-0 z-10 flex justify-between items-center p-6 md:p-12 bg-gradient-to-b from-[#020202] to-transparent pointer-events-none">
            <div className="pointer-events-auto">
              <h2 className="text-2xl md:text-4xl font-light tracking-widest text-[#C5A059]">
                DIGITAL ARTIFACTS
              </h2>
              <p className="text-gray-400 tracking-widest text-xs mt-2 uppercase">
                Miela Labs // Interactive Exhibition
              </p>
            </div>
            <button
              onClick={onClose}
              className="pointer-events-auto w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors bg-black/50 backdrop-blur-md"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6 md:px-12 pb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto mt-12">
              {artifacts.map((artifact, index) => (
                <motion.div
                  key={artifact.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  onClick={() => setSelectedArtifact(artifact)}
                  className="group relative aspect-[4/3] w-full overflow-hidden border border-white/10 bg-[#050505] cursor-pointer rounded-[2rem]"
                >
                  {artifact.type === 'shader' ? (
                    <ShaderCanvas fragShader={artifact.frag!} />
                  ) : (
                    artifact.component
                  )}
                  
                  {/* Overlay for interaction hint */}
                  <div className="absolute inset-0 pointer-events-none border border-white/0 group-hover:border-white/20 transition-colors duration-500" />
                </motion.div>
              ))}
            </div>
          </div>

          <ArtifactModal 
            show={!!selectedArtifact}
            artifact={selectedArtifact} 
            onClose={() => setSelectedArtifact(null)} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
