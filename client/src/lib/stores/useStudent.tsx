import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StudentState {
  studentName: string;
  isStudentSet: boolean;
  
  // Actions
  setStudentName: (name: string) => void;
  clearStudent: () => void;
}

export const useStudent = create<StudentState>()(
  persist(
    (set) => ({
      studentName: "",
      isStudentSet: false,
      
      setStudentName: (name: string) => {
        set({ 
          studentName: name, 
          isStudentSet: true 
        });
      },
      
      clearStudent: () => {
        set({ 
          studentName: "", 
          isStudentSet: false 
        });
      }
    }),
    {
      name: "student-storage", // unique name for localStorage key
    }
  )
);
