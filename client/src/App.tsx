import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import GameModes from "./components/GameModes";
import MatchingGame from "./components/MatchingGame";
import OrderingGame from "./components/OrderingGame";
import MultipleChoiceQuiz from "./components/MultipleChoiceQuiz";
import FillInBlankQuiz from "./components/FillInBlankQuiz";
import StudentForm from "./components/StudentForm";
import TeacherView from "./components/TeacherView";
import { useStudent } from "./lib/stores/useStudent";
import "@fontsource/inter";

const queryClient = new QueryClient();

type GameMode = "menu" | "matching" | "ordering" | "multiple-choice" | "fill-in-blank" | "teacher";

function App() {
  const [gameMode, setGameMode] = useState<GameMode>("menu");
  const { studentName, isStudentSet } = useStudent();

  // Show student form if no student name is set
  if (!isStudentSet && gameMode !== "teacher") {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <StudentForm onComplete={() => setGameMode("menu")} />
          <Toaster position="top-center" />
        </div>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-900 mb-2">
              Mitosis Educational Game
            </h1>
            {isStudentSet && gameMode !== "teacher" && (
              <p className="text-lg text-indigo-700">
                Welcome, {studentName}! Let's learn about cell division.
              </p>
            )}
          </header>

          {gameMode === "menu" && (
            <GameModes onSelectMode={setGameMode} />
          )}

          {gameMode === "matching" && (
            <MatchingGame onBack={() => setGameMode("menu")} />
          )}

          {gameMode === "ordering" && (
            <OrderingGame onBack={() => setGameMode("menu")} />
          )}

          {gameMode === "multiple-choice" && (
            <MultipleChoiceQuiz onBack={() => setGameMode("menu")} />
          )}

          {gameMode === "fill-in-blank" && (
            <FillInBlankQuiz onBack={() => setGameMode("menu")} />
          )}

          {gameMode === "teacher" && (
            <TeacherView onBack={() => setGameMode("menu")} />
          )}
        </div>
        <Toaster position="top-center" />
      </div>
    </QueryClientProvider>
  );
}

export default App;
