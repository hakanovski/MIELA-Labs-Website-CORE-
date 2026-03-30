import { motion } from 'motion/react';

export default function MysticAura() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#030305] pointer-events-none">
      {/* Deep Void Purple */}
      <motion.div
        animate={{
          transform: ['translate(0%, 0%) scale(1)', 'translate(10%, 10%) scale(1.2)', 'translate(0%, 0%) scale(1)'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(74,0,224,0.12)_0%,transparent_60%)] blur-[120px]"
      />
      {/* Ethereal Cyan */}
      <motion.div
        animate={{
          transform: ['translate(0%, 0%) scale(1)', 'translate(-10%, 15%) scale(1.1)', 'translate(0%, 0%) scale(1)'],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.08)_0%,transparent_60%)] blur-[120px]"
      />
      {/* Mystical Gold */}
      <motion.div
        animate={{
          transform: ['translate(0%, 0%) scale(1)', 'translate(15%, -10%) scale(1.3)', 'translate(0%, 0%) scale(1)'],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-20%] left-[15%] w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.06)_0%,transparent_60%)] blur-[150px]"
      />
      {/* Crimson Core */}
      <motion.div
        animate={{
          transform: ['translate(0%, 0%) scale(1)', 'translate(-5%, -5%) scale(1.2)', 'translate(0%, 0%) scale(1)'],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] left-[40%] w-[40vw] h-[40vw] rounded-full bg-[radial-gradient(circle,rgba(255,51,102,0.04)_0%,transparent_60%)] blur-[100px]"
      />
      
      {/* High-end Noise Texture for that chic, cinematic grain */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
    </div>
  );
}
