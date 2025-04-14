import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TimeInput } from "./TimeInput";
import { ResultsDisplay } from "./ResultsDisplay";
import { calculateWakeTimes } from "@/lib/sleepUtils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

// Tipo per i risultati del calcolo del sonno
interface WakeTime {
  time: string;
  cycles: number;
  hours: number;
  displayHours?: number;
  label?: string;
}

interface SleepCalculatorProps {
  initialBedtime?: string | null;
}

export function SleepCalculator({ initialBedtime = null }: SleepCalculatorProps) {
  const [showResults, setShowResults] = useState(false);
  const [wakeTimes, setWakeTimes] = useState<WakeTime[]>([]);
  const [entryId, setEntryId] = useState<number | null>(null);
  const [bedtime, setBedtime] = useState<string>("23:00");
  
  // Utilizziamo useMutation per gestire la chiamata API
  const saveSleepCalculation = useMutation({
    mutationFn: async (data: { bedtime: string; wakeTimes: WakeTime[] }) => {
      const response = await apiRequest("POST", "/api/sleep-calculator", data);
      return response.json();
    },
    onSuccess: (data) => {
      setEntryId(data.entryId);
      // Non è necessario invalidare la query qui perché è la prima volta che salviamo
    },
    onError: (error) => {
      console.error("Errore nel salvataggio del calcolo:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile salvare il calcolo. Riprova.",
        variant: "destructive",
      });
    },
  });

  const handleCalculate = (bedtime: string) => {
    setShowResults(false);
    
    // Calcola i tempi di risveglio
    const times = calculateWakeTimes(bedtime);
    setWakeTimes(times);
    
    // Salva nel database
    saveSleepCalculation.mutate({ 
      bedtime, 
      wakeTimes: times 
    });
    
    setShowResults(true);
  };
  
  // Effetto per gestire il bedtime iniziale quando viene passato da SleepHistory
  useEffect(() => {
    if (initialBedtime) {
      setBedtime(initialBedtime);
      // Calcola automaticamente i risultati con l'orario selezionato dalla cronologia
      handleCalculate(initialBedtime);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialBedtime]);

  const isLoading = saveSleepCalculation.isPending;

  return (
    <div className="bg-[#1F2A43]/40 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-lg border border-white/5">
      <div className="py-6 md:py-10">
        <TimeInput onCalculate={handleCalculate} isLoading={isLoading} />
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-6"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-4 border-[#E0E7FF]/10 border-t-[#9D5CFF] animate-spin mb-4"></div>
              <p className="text-[#E0E7FF]/70">Calcolando e salvando gli orari ottimali...</p>
            </div>
          </motion.div>
        )}

        {showResults && !isLoading && (
          <ResultsDisplay wakeTimes={wakeTimes} />
        )}
      </AnimatePresence>
    </div>
  );
}
