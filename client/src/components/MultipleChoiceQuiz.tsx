import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Info } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { multipleChoiceQuestions } from "@/lib/quizData";
import { useStudent } from "@/lib/stores/useStudent";
import { apiRequest } from "@/lib/queryClient";

interface MultipleChoiceQuizProps {
  onBack: () => void;
}

export default function MultipleChoiceQuiz({ onBack }: MultipleChoiceQuizProps) {
  const { studentName } = useStudent();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showExplanation, setShowExplanation] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const submitAnswerMutation = useMutation({
    mutationFn: async (answerData: any) => {
      await apiRequest("POST", "/api/student-answers", answerData);
    }
  });

  const currentQuestion = multipleChoiceQuestions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setIsAnswered(true);
    setShowExplanation(true);
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    // Submit answer to backend
    const answerData = {
      studentName,
      gameMode: "multiple-choice",
      question: currentQuestion.question,
      studentAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timestamp: new Date().toISOString()
    };

    submitAnswerMutation.mutate(answerData);

    if (isCorrect) {
      toast.success("Correct!");
    } else {
      toast.error("Incorrect. Review the explanation below.");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < multipleChoiceQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowExplanation(false);
    } else {
      setIsQuizComplete(true);
      const percentage = Math.round((score.correct / score.total) * 100);
      if (percentage >= 80) {
        toast.success(`Excellent work! You scored ${percentage}%`);
      } else if (percentage >= 60) {
        toast.success(`Good job! You scored ${percentage}%`);
      } else {
        toast.error(`Keep practicing! You scored ${percentage}%`);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore({ correct: 0, total: 0 });
    setShowExplanation(false);
    setIsQuizComplete(false);
  };

  if (isQuizComplete) {
    return (
      <div className="max-w-3xl mx-auto overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={onBack} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-gray-800">
              Quiz Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                {score.correct} / {score.total}
              </div>
              <p className="text-lg text-gray-600">
                {Math.round((score.correct / score.total) * 100)}% Correct
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={resetQuiz}
                className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </Button>
              <Button 
                onClick={onBack}
                variant="outline"
              >
                Back to Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </Button>
        
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            Question {currentQuestionIndex + 1} of {multipleChoiceQuestions.length}
          </Badge>
          <Badge variant="outline" className="text-sm">
            Score: {score.correct}/{score.total}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-indigo-900">
            Multiple Choice Quiz
          </CardTitle>
          <p className="text-gray-600">
            Select the correct answer for each question about mitosis
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {currentQuestion.question}
            </h3>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuestion.correctAnswer;
                const showCorrect = isAnswered && isCorrect;
                const showIncorrect = isAnswered && isSelected && !isCorrect;

                return (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      showCorrect
                        ? "border-green-500 bg-green-50"
                        : showIncorrect
                        ? "border-red-500 bg-red-50"
                        : isSelected
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300 bg-white hover:border-indigo-300"
                    } ${isAnswered ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {showCorrect && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {showIncorrect && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {showExplanation && (
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900">
                <strong>Explanation:</strong> {currentQuestion.explanation}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center gap-4">
            {!isAnswered ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="bg-green-600 hover:bg-green-700 px-8"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-indigo-600 hover:bg-indigo-700 px-8"
              >
                {currentQuestionIndex < multipleChoiceQuestions.length - 1
                  ? "Next Question"
                  : "Finish Quiz"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
