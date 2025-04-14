import { useState } from "react";
import { Stars } from "@/components/Stars";
import { Logo } from "@/components/Logo";
import { SleepCalculator } from "@/components/SleepCalculator";
import { InfoSection } from "@/components/InfoSection";
import { SleepHistory } from "@/components/SleepHistory";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export default function Home() {
  const [selectedBedtime, setSelectedBedtime] = useState<string | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen w-full bg-gradient-to-b from-[#030E21] to-[#05142E] text-[#E0E7FF] font-sans">
        {/* Stars background */}
        <Stars />

        <div className="container mx-auto px-4 py-8 max-w-3xl relative">
          {/* Cronologia */}
          <SleepHistory onSelectBedtime={(bedtime) => setSelectedBedtime(bedtime)} />
          
          {/* Header */}
          <header className="flex flex-col items-center mb-10 pt-4">
            <Logo />
            
            <h1 className="font-['Quicksand'] font-bold text-3xl md:text-4xl text-center bg-clip-text text-transparent bg-gradient-to-r from-[#E0E7FF] to-white">
              SleepCycle
            </h1>
            <p className="text-sm md:text-base text-center mt-2 text-[#E0E7FF]/70 max-w-md">
              Calcola gli orari ideali per svegliarti in base ai cicli del sonno
            </p>
          </header>

          {/* Main Content */}
          <main>
            <SleepCalculator initialBedtime={selectedBedtime} />
            <InfoSection />
          </main>

          {/* Footer */}
          <footer className="mt-16 mb-4 text-center text-xs text-[#E0E7FF]/50">
            <p>SleepCycle &copy; {new Date().getFullYear()} - Per un sonno migliore</p>
          </footer>
        </div>
      </div>
    </QueryClientProvider>
  );
}
