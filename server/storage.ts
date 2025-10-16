import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import { users, type User, type InsertUser, studentAnswers, type StudentAnswer, type InsertStudentAnswer } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Student answer methods
  createAnswer(answer: InsertStudentAnswer): Promise<StudentAnswer>;
  getAllAnswers(): Promise<StudentAnswer[]>;
  getAnswersByStudent(studentName: string): Promise<StudentAnswer[]>;
  getAnswerById(id: number): Promise<StudentAnswer | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Student answer methods
  async createAnswer(insertAnswer: InsertStudentAnswer): Promise<StudentAnswer> {
    const answerData = {
      ...insertAnswer,
      timestamp: insertAnswer.timestamp || new Date().toISOString()
    };
    
    const [answer] = await db.insert(studentAnswers).values(answerData).returning();
    console.log(`Saved answer for ${answer.studentName}: ${answer.isCorrect ? 'Correct' : 'Incorrect'}`);
    return answer;
  }

  async getAllAnswers(): Promise<StudentAnswer[]> {
    return await db.select()
      .from(studentAnswers)
      .orderBy(desc(studentAnswers.timestamp));
  }

  async getAnswersByStudent(studentName: string): Promise<StudentAnswer[]> {
    return await db.select()
      .from(studentAnswers)
      .where(eq(studentAnswers.studentName, studentName))
      .orderBy(desc(studentAnswers.timestamp));
  }

  async getAnswerById(id: number): Promise<StudentAnswer | undefined> {
    const [answer] = await db.select()
      .from(studentAnswers)
      .where(eq(studentAnswers.id, id))
      .limit(1);
    return answer;
  }
}

export const storage = new DatabaseStorage();
