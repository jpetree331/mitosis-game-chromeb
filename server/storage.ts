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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private answers: Map<number, StudentAnswer>;
  private currentUserId: number;
  private currentAnswerId: number;

  constructor() {
    this.users = new Map();
    this.answers = new Map();
    this.currentUserId = 1;
    this.currentAnswerId = 1;
  }

  // User methods (existing)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Student answer methods
  async createAnswer(insertAnswer: InsertStudentAnswer): Promise<StudentAnswer> {
    const id = this.currentAnswerId++;
    const answer: StudentAnswer = { 
      id, 
      ...insertAnswer,
      timestamp: insertAnswer.timestamp || new Date().toISOString()
    };
    this.answers.set(id, answer);
    console.log(`Saved answer for ${answer.studentName}: ${answer.isCorrect ? 'Correct' : 'Incorrect'}`);
    return answer;
  }

  async getAllAnswers(): Promise<StudentAnswer[]> {
    return Array.from(this.answers.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getAnswersByStudent(studentName: string): Promise<StudentAnswer[]> {
    return Array.from(this.answers.values())
      .filter(answer => answer.studentName === studentName)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async getAnswerById(id: number): Promise<StudentAnswer | undefined> {
    return this.answers.get(id);
  }
}

export const storage = new MemStorage();
