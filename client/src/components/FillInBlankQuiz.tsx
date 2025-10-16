import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Info, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { fillInBlankQuestions } from "@/lib/quizData";
import { useStudent } from "@/lib/stores/useStudent";
import { apiRequest } from "@/lib/queryClient";

interface FillInBlankQuizProps {
  onBack: () => void;
}

export default function FillInBlankQuiz({ onBack }: FillInBlankQuizProps) {
  const { studentName, teacherName } = useStudent();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const submitAnswerMutation = useMutation({
    mutationFn: async (answerData: any) => {
      await apiRequest("POST", "/api/student-answers", answerData);
    }
  });

  const currentQuestion = fillInBlankQuestions[currentQuestionIndex];

  const normalizeAnswer = (text: string): string => {
    return text.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
  };

  const handleSubmitAnswer = () => {
    if (!answer.trim()) return;

    const userAnswer = normalizeAnswer(answer);
    const correctAnswer = normalizeAnswer(currentQuestion.answer);
    const correct = userAnswer === correctAnswer;

    setIsCorrect(correct);
    setIsAnswered(true);
    setShowExplanation(true);
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));

    // Submit answer to backend
    const answerData = {
      studentName,
      teacherName,
      gameMode: "fill-in-blank",
      question: currentQuestion.question,
      studentAnswer: answer.trim(),
      correctAnswer: currentQuestion.answer,
      isCorrect: correct,
      timestamp: new Date().toISOString()
    };

    submitAnswerMutation.mutate(answerData);

    if (correct) {
      toast.success("Correct!");
    } else {
      toast.error(`Incorrect. The answer was: ${currentQuestion.answer}`);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < fillInBlankQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswer("");
      setIsAnswered(false);
      setIsCorrect(false);
      setShowExplanation(false);
      setShowHint(false);
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
    setAnswer("");
    setIsAnswered(false);
    setIsCorrect(false);
    setScore({ correct: 0, total: 0 });
    setShowHint(false);
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
            Question {currentQuestionIndex + 1} of {fillInBlankQuestions.length}
          </Badge>
          <Badge variant="outline" className="text-sm">
            Score: {score.correct}/{score.total}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-indigo-900">
            Fill in the Blank Quiz
          </CardTitle>
          <p className="text-gray-600">
            Type the correct word or phrase to complete each statement
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-indigo-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {currentQuestion.question}
            </h3>
            
            <div className="space-y-4">
              <Input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isAnswered) {
                    handleSubmitAnswer();
                  }
                }}
                placeholder="Type your answer here..."
                disabled={isAnswered}
                className={`text-lg ${
                  isAnswered
                    ? isCorrect
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : ""
                }`}
                autoFocus
              />

              {isAnswered && (
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-700 font-medium">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="text-red-700 font-medium">
                        Correct answer: {currentQuestion.answer}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {!isAnswered && currentQuestion.hint && (
              <div className="mt-4">
                {showHint ? (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <Lightbulb className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-900">
                      <strong>Hint:</strong> {currentQuestion.hint}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Button
                    onClick={() => setShowHint(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Lightbulb className="w-4 h-4" />
                    Show Hint
                  </Button>
                )}
              </div>
            )}
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
                disabled={!answer.trim()}
                className="bg-green-600 hover:bg-green-700 px-8"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-indigo-600 hover:bg-indigo-700 px-8"
              >
                {currentQuestionIndex < fillInBlankQuestions.length - 1
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
