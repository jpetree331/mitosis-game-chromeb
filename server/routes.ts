import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all student answers (for teacher view)
  app.get("/api/student-answers", async (req, res) => {
    try {
      const answers = await storage.getAllAnswers();
      res.json(answers);
    } catch (error) {
      console.error("Error fetching student answers:", error);
      res.status(500).json({ message: "Failed to fetch student answers" });
    }
  });

  // Submit a student answer
  app.post("/api/student-answers", async (req, res) => {
    try {
      const {
        studentName,
        teacherName,
        gameMode,
        question,
        studentAnswer,
        correctAnswer,
        isCorrect,
        timestamp
      } = req.body;

      // Validate required fields
      if (!studentName || !teacherName || !gameMode || !question || !studentAnswer || !correctAnswer || typeof isCorrect !== "boolean") {
        return res.status(400).json({ 
          message: "Missing required fields: studentName, teacherName, gameMode, question, studentAnswer, correctAnswer, isCorrect" 
        });
      }

      const answer = await storage.createAnswer({
        studentName,
        teacherName,
        gameMode,
        question,
        studentAnswer,
        correctAnswer,
        isCorrect,
        timestamp: timestamp || new Date().toISOString()
      });

      res.status(201).json(answer);
    } catch (error) {
      console.error("Error creating student answer:", error);
      res.status(500).json({ message: "Failed to save student answer" });
    }
  });

  // Get answers by student name
  app.get("/api/student-answers/:studentName", async (req, res) => {
    try {
      const { studentName } = req.params;
      const answers = await storage.getAnswersByStudent(studentName);
      res.json(answers);
    } catch (error) {
      console.error("Error fetching student answers:", error);
      res.status(500).json({ message: "Failed to fetch student answers" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Mitosis game API is running" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
