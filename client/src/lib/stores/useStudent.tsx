import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StudentState {
  studentName: string;
  teacherName: string;
  isStudentSet: boolean;
  
  // Actions
  setStudentName: (name: string) => void;
  setTeacherName: (name: string) => void;
  clearStudent: () => void;
}

export const useStudent = create<StudentState>()(
  persist(
    (set) => ({
      studentName: "",
      teacherName: "",
      isStudentSet: false,
      
      setStudentName: (name: string) => {
        set({ 
          studentName: name, 
          isStudentSet: true 
        });
      },
      
      setTeacherName: (name: string) => {
        set({ 
          teacherName: name 
        });
      },
      
      clearStudent: () => {
        set({ 
          studentName: "", 
          teacherName: "",
          isStudentSet: false 
        });
      }
    }),
    {
      name: "student-storage", // unique name for localStorage key
    }
  )
);
