import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

interface TimeInputProps {
  onCalculate: (bedtime: string) => void;
  isLoading: boolean;
}

export function TimeInput({ onCalculate, isLoading }: TimeInputProps) {
  const [bedtime, setBedtime] = useState("23:00");
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Parse the current hours and minutes
  const [hoursStr, minutesStr] = bedtime.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bedtime) {
      onCalculate(bedtime);
    }
  };
  
  const adjustTime = (type: 'hours' | 'minutes', amount: number) => {
    let newHours = hours;
    let newMinutes = minutes;
    
    if (type === 'hours') {
      newHours = (newHours + amount) % 24;
      if (newHours < 0) newHours = 23;
    } else {
      newMinutes = (newMinutes + amount) % 60;
      if (newMinutes < 0) newMinutes = 55;
    }
    
    const formattedHours = newHours.toString().padStart(2, '0');
    const formattedMinutes = newMinutes.toString().padStart(2, '0');
    setBedtime(`${formattedHours}:${formattedMinutes}`);
  };
  
  const handleInputBlur = () => {
    setIsEditing(false);
    // Validate the input format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(bedtime)) {
      setBedtime("23:00"); // Reset to default if invalid
    }
  };
  
  const handleTimeDisplay = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };
  
  return (
    <form className="flex flex-col items-center gap-8" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center">
        <p className="text-sm uppercase tracking-widest text-[#E0E7FF]/70 mb-2">
          A che ora vai a dormire?
        </p>
        
        <div className="flex flex-col items-center justify-center mt-4">
          {/* Hour Controls */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer mb-3"
          >
            <button 
              type="button"
              onClick={() => adjustTime('hours', 1)}
              className="flex items-center justify-center w-12 h-12 text-[#E0E7FF]/70 hover:text-[#9D5CFF] transition-colors bg-[#1F2A43]/50 rounded-full shadow-md"
            >
              <ChevronUp size={24} />
            </button>
          </motion.div>
          
          <div className="mx-2 relative mb-3">
            {isEditing ? (
              <input
                ref={inputRef}
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                onBlur={handleInputBlur}
                className="text-5xl md:text-7xl font-bold bg-transparent border-none text-center text-[#E0E7FF] focus:outline-none w-44 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:hidden"
                autoFocus
              />
            ) : (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                onClick={handleTimeDisplay}
                className="text-5xl md:text-7xl font-bold text-[#E0E7FF] cursor-pointer transition-all duration-200 px-3 py-1"
              >
                <span className="relative">
                  {bedtime}
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#9D5CFF] to-transparent transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                </span>
              </motion.div>
            )}
            
            {/* Subtle Glow Effect */}
            <div className="absolute -inset-4 bg-[#9D5CFF]/5 rounded-full blur-xl -z-10"></div>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
          >
            <button 
              type="button"
              onClick={() => adjustTime('hours', -1)}
              className="flex items-center justify-center w-12 h-12 text-[#E0E7FF]/70 hover:text-[#9D5CFF] transition-colors bg-[#1F2A43]/50 rounded-full shadow-md"
            >
              <ChevronDown size={24} />
            </button>
          </motion.div>
        </div>
        
        <p className="text-xs text-[#E0E7FF]/50 mt-2">
          Clicca sull'orario per modificarlo manualmente
        </p>
      </div>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-[#9D5CFF] to-[#836FFF] hover:from-[#9D5CFF]/95 hover:to-[#836FFF]/95 text-white font-medium py-3 px-10 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9D5CFF]/40 shadow-lg shadow-[#9D5CFF]/20 text-base"
        >
          Calcola
        </Button>
      </motion.div>
    </form>
  );
}
