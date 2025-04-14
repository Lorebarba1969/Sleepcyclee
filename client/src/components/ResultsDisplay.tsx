import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface WakeTime {
  time: string;
  cycles: number;
  hours: number;
  displayHours?: number;
  label?: string;
}

interface ResultsDisplayProps {
  wakeTimes: WakeTime[];
}

export function ResultsDisplay({ wakeTimes }: ResultsDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-6">
        <h2 className="font-['Quicksand'] font-medium text-xl mb-2">Orari ottimali per svegliarti</h2>
        <p className="text-sm text-[#E0E7FF]/70">
          Basati su cicli completi di sonno di 90 minuti, considerando 15 minuti per addormentarsi.
        </p>
      </div>

      {/* Decorative element */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          {/* Moon */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E0E7FF] to-[#E0E7FF]/80 shadow-lg shadow-[#E0E7FF]/20 animate-[float_3s_ease-in-out_infinite]"></div>
          {/* Orbit */}
          <div className="absolute -inset-4 border border-[#E0E7FF]/10 rounded-full"></div>
        </div>
      </div>

      {/* Sleep cycles visualization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {wakeTimes.map((wakeTime, index) => (
          <motion.div
            key={index}
            className="flex items-center p-4 bg-[#2C3E5D]/40 rounded-xl border border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#9D5CFF]/20 mr-4">
              <Clock className="h-6 w-6 text-[#9D5CFF]" />
            </div>
            <div>
              <p className="font-['Quicksand'] font-bold text-xl">{wakeTime.time}</p>
              <p className="text-xs text-[#E0E7FF]/60">
                {wakeTime.cycles} cicli · {wakeTime.displayHours || (wakeTime.hours / 60).toFixed(1)} ore di sonno
              </p>
            </div>
            {wakeTime.label && (
              <div className="ml-auto">
                <span 
                  className={`inline-block px-2 py-1 text-xs rounded-full
                    ${wakeTime.label === 'Minimo' ? 'bg-yellow-500/20 text-yellow-300' : ''}
                    ${wakeTime.label === 'Ideale' ? 'bg-green-500/20 text-green-300' : ''}
                  `}
                >
                  {wakeTime.label}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5">
        <div className="flex flex-wrap gap-4 justify-around">
          {/* Bed icon */}
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E0E7FF]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <p className="text-xs text-[#E0E7FF]/50">Riposo</p>
          </div>
          
          {/* Moon icon */}
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E0E7FF]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <p className="text-xs text-[#E0E7FF]/50">Sonno</p>
          </div>
          
          {/* Clock icon */}
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E0E7FF]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-[#E0E7FF]/50">Cicli</p>
          </div>
          
          {/* Stars icon */}
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E0E7FF]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <p className="text-xs text-[#E0E7FF]/50">Benessere</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
