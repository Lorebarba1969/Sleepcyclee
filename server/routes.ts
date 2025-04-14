import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSleepEntrySchema, insertSleepResultSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint per calcolare e salvare i tempi di sonno
  app.post("/api/sleep-calculator", async (req: Request, res: Response) => {
    try {
      const { bedtime, userId } = req.body;
      
      // Crea una nuova entry per il sonno
      const sleepEntry = await storage.createSleepEntry({
        bedtime,
        userId: userId || null // Consenti anche utenti non autenticati
      });
      
      // Calcola i tempi di risveglio (questa logica è sul client, quindi qui si salvano solo i risultati)
      // In un'applicazione reale, potremmo spostare questa logica sul server 
      const wakeTimes = req.body.wakeTimes;
      
      if (wakeTimes && Array.isArray(wakeTimes)) {
        // Salva ogni tempo di risveglio calcolato
        for (const wakeTime of wakeTimes) {
          await storage.createSleepResult({
            entryId: sleepEntry.id,
            wakeupTime: wakeTime.time,
            cycles: wakeTime.cycles,
            hours: wakeTime.hours,
            label: wakeTime.label || null
          });
        }
      }
      
      res.status(201).json({ 
        success: true, 
        entryId: sleepEntry.id
      });
    } catch (error) {
      console.error("Error in sleep-calculator endpoint:", error);
      if (error instanceof ZodError) {
        res.status(400).json({ 
          success: false, 
          error: "Dati non validi", 
          details: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          error: "Errore interno del server" 
        });
      }
    }
  });
  
  // Recupera la cronologia dei calcoli del sonno per un utente
  app.get("/api/sleep-history/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ 
          success: false, 
          error: "ID utente non valido" 
        });
      }
      
      const entries = await storage.getSleepEntriesByUser(userId);
      
      // Per ogni entry, recupera i risultati associati
      const entriesWithResults = await Promise.all(
        entries.map(async (entry) => {
          const results = await storage.getSleepResultsByEntry(entry.id);
          return {
            ...entry,
            results
          };
        })
      );
      
      res.json({ 
        success: true, 
        history: entriesWithResults 
      });
    } catch (error) {
      console.error("Error in sleep-history endpoint:", error);
      res.status(500).json({ 
        success: false, 
        error: "Errore interno del server" 
      });
    }
  });
  
  // Recupera un singolo calcolo del sonno
  app.get("/api/sleep-entry/:entryId", async (req: Request, res: Response) => {
    try {
      const entryId = parseInt(req.params.entryId);
      
      if (isNaN(entryId)) {
        return res.status(400).json({ 
          success: false, 
          error: "ID entry non valido" 
        });
      }
      
      const entry = await storage.getSleepEntry(entryId);
      
      if (!entry) {
        return res.status(404).json({ 
          success: false, 
          error: "Entry non trovata" 
        });
      }
      
      const results = await storage.getSleepResultsByEntry(entryId);
      
      res.json({ 
        success: true, 
        entry: {
          ...entry,
          results
        }
      });
    } catch (error) {
      console.error("Error in sleep-entry endpoint:", error);
      res.status(500).json({ 
        success: false, 
        error: "Errore interno del server" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
