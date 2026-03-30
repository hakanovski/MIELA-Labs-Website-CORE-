import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import ShaderCanvas from './ShaderCanvas';

interface ArtifactModalProps {
  artifact: any;
  onClose: () => void;
  show: boolean;
}

export default function ArtifactModal({ artifact, onClose, show }: ArtifactModalProps) {
  return (
    <AnimatePresence>
      {show && artifact && (
        <motion.div
          key={`artifact-modal-${artifact.id}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[300] bg-[#000] flex items-center justify-center"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors bg-black/50 backdrop-blur-md"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-full h-full">
            {artifact.type === 'shader' ? (
              <ShaderCanvas fragShader={artifact.frag} />
            ) : (
              artifact.component
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
