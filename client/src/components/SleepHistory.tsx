import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { History, X } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

// Per ora utilizziamo l'utente ID 1 come utente fittizio, poiché non abbiamo ancora l'autenticazione
const DEFAULT_USER_ID = 1;

// Interfacce per tipi storici
interface SleepResult {
  id: number;
  wakeupTime: string;
  cycles: number;
  hours: number;
  label?: string;
}

interface SleepHistoryEntry {
  id: number;
  bedtime: string;
  createdAt: string;
  results: SleepResult[];
}

interface SleepHistoryResponse {
  success: boolean;
  history: SleepHistoryEntry[];
}

interface SleepHistoryProps {
  onSelectBedtime: (bedtime: string) => void;
}

export function SleepHistory({ onSelectBedtime }: SleepHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Recupero della cronologia dal database
  const { data, isLoading, error } = useQuery<SleepHistoryResponse, Error>({
    queryKey: [`/api/sleep-history/${DEFAULT_USER_ID}`],
    enabled: isOpen // Carica i dati solo quando il pannello è aperto
  });

  const toggleHistory = () => {
    setIsOpen(!isOpen);
  };

  // Formatta la data relativa (es. "2 ore fa")
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { 
      addSuffix: true,
      locale: it 
    });
  };

  return (
    <div className="absolute top-4 right-4">
      <Button
        onClick={toggleHistory}
        variant="ghost"
        size="icon"
        className="w-10 h-10 rounded-full bg-[#1F2A43]/60 hover:bg-[#1F2A43]/80 text-[#E0E7FF]/70 hover:text-[#9D5CFF]"
      >
        <History size={20} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-12 right-0 w-72 md:w-80 bg-[#1F2A43]/90 backdrop-blur-md rounded-xl shadow-lg border border-white/5 p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#E0E7FF] font-semibold">Cronologia</h3>
              <Button
                onClick={toggleHistory}
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-full hover:bg-[#1F2A43] text-[#E0E7FF]/70 hover:text-[#9D5CFF]"
              >
                <X size={16} />
              </Button>
            </div>

            {isLoading && (
              <div className="flex justify-center py-6">
                <div className="w-8 h-8 rounded-full border-2 border-[#E0E7FF]/10 border-t-[#9D5CFF] animate-spin"></div>
              </div>
            )}

            {error && (
              <p className="text-red-400 text-sm text-center py-4">
                Impossibile caricare la cronologia. Riprova più tardi.
              </p>
            )}

            {data?.history?.length === 0 && (
              <p className="text-[#E0E7FF]/50 text-sm text-center py-4">
                Non hai ancora salvato alcun calcolo.
              </p>
            )}

            <ul className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {data?.history?.map((entry: any) => (
                <motion.li
                  key={entry.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#1F2A43]/70 rounded-lg p-3 cursor-pointer hover:border-[#9D5CFF]/30 border border-transparent transition-colors"
                  onClick={() => {
                    onSelectBedtime(entry.bedtime);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-[#E0E7FF]">
                      {entry.bedtime}
                    </span>
                    <span className="text-xs text-[#E0E7FF]/50">
                      {formatRelativeDate(entry.createdAt)}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {entry.results?.slice(0, 3).map((result: any) => (
                      <span
                        key={result.id}
                        className="text-xs bg-[#9D5CFF]/20 text-[#9D5CFF] px-2 py-0.5 rounded-full"
                      >
                        {result.wakeupTime}
                      </span>
                    ))}
                    {entry.results?.length > 3 && (
                      <span className="text-xs text-[#E0E7FF]/40">
                        +{entry.results.length - 3}
                      </span>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}