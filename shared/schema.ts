import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const studentAnswers = pgTable("student_answers", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  teacherName: text("teacher_name").notNull(),
  gameMode: text("game_mode").notNull(), // "matching" or "ordering"
  question: text("question").notNull(),
  studentAnswer: text("student_answer").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertStudentAnswerSchema = createInsertSchema(studentAnswers).pick({
  studentName: true,
  teacherName: true,
  gameMode: true,
  question: true,
  studentAnswer: true,
  correctAnswer: true,
  isCorrect: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertStudentAnswer = z.infer<typeof insertStudentAnswerSchema>;
export type StudentAnswer = typeof studentAnswers.$inferSelect;
