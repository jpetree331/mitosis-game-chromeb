import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Timer, Trophy, Zap } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { multipleChoiceQuestions } from "@/lib/quizData";
import { useStudent } from "@/lib/stores/useStudent";
import { apiRequest } from "@/lib/queryClient";

interface TimedChallengeProps {
  onBack: () => void;
}

export default function TimedChallenge({ onBack }: TimedChallengeProps) {
  const { studentName, teacherName } = useStudent();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per challenge
  const [isGameActive, setIsGameActive] = useState(true);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const submitAnswerMutation = useMutation({
    mutationFn: async (answerData: any) => {
      await apiRequest("POST", "/api/student-answers", answerData);
    }
  });

  // Randomly select 5 questions for the challenge
  const [challengeQuestions] = useState(() => 
    [...multipleChoiceQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
  );

  const currentQuestion = challengeQuestions[currentQuestionIndex];

  // Timer countdown
  useEffect(() => {
    if (!isGameActive || isGameComplete) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsGameActive(false);
          setIsGameComplete(true);
          toast.error("Time's up!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive, isGameComplete]);

  const calculateQuestionScore = (isCorrect: boolean, timeSpent: number): number => {
    if (!isCorrect) return 0;
    
    // Base points for correct answer
    const basePoints = 100;
    
    // Time bonus: faster answers get more points (max 50 bonus points)
    const maxTimeBonus = 50;
    const timeBonus = Math.max(0, maxTimeBonus - (timeSpent * 2));
    
    return Math.round(basePoints + timeBonus);
  };

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !isGameActive) return;

    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const questionScore = calculateQuestionScore(isCorrect, timeSpent);
    
    setIsAnswered(true);
    setScore(prev => prev + questionScore);
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    // Submit answer to backend
    const answerData = {
      studentName,
      teacherName,
      gameMode: "timed-challenge",
      question: currentQuestion.question,
      studentAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timestamp: new Date().toISOString()
    };

    submitAnswerMutation.mutate(answerData);

    if (isCorrect) {
      toast.success(`Correct! +${questionScore} points`);
    } else {
      toast.error("Incorrect!");
    }

    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < challengeQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setQuestionStartTime(Date.now());
      } else {
        setIsGameActive(false);
        setIsGameComplete(true);
      }
    }, 1500);
  };

  const resetChallenge = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setCorrectCount(0);
    setTimeLeft(60);
    setIsGameActive(true);
    setIsGameComplete(false);
    setQuestionStartTime(Date.now());
  };

  if (isGameComplete) {
    const finalPercentage = Math.round((correctCount / challengeQuestions.length) * 100);
    const getRank = (score: number) => {
      if (score >= 600) return { rank: "Master", color: "text-purple-600", bg: "bg-purple-100" };
      if (score >= 500) return { rank: "Expert", color: "text-blue-600", bg: "bg-blue-100" };
      if (score >= 400) return { rank: "Advanced", color: "text-green-600", bg: "bg-green-100" };
      if (score >= 300) return { rank: "Intermediate", color: "text-yellow-600", bg: "bg-yellow-100" };
      return { rank: "Beginner", color: "text-gray-600", bg: "bg-gray-100" };
    };

    const rankInfo = getRank(score);

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
            <div className="mx-auto mb-4 p-3 bg-yellow-100 rounded-full w-fit">
              <Trophy className="w-12 h-12 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl text-gray-800">
              Challenge Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className="text-5xl font-bold text-indigo-600 mb-2">
                {score}
              </div>
              <p className="text-lg text-gray-600 mb-4">Total Score</p>
              
              <div className={`inline-block px-6 py-3 rounded-lg ${rankInfo.bg} mb-4`}>
                <p className={`text-2xl font-bold ${rankInfo.color}`}>{rankInfo.rank}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Correct Answers</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {correctCount}/{challengeQuestions.length}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Accuracy</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {finalPercentage}%
                  </p>
                </div>
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200 mb-6 text-left">
              <AlertDescription className="text-blue-900">
                <strong>Tip:</strong> Answer quickly and accurately to maximize your score! 
                Each correct answer earns base points plus a time bonus for fast responses.
              </AlertDescription>
            </Alert>

            <div className="flex gap-4 justify-center">
              <Button 
                onClick={resetChallenge}
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
          <Badge 
            variant={timeLeft <= 10 ? "destructive" : "secondary"} 
            className="text-lg px-4 py-2 flex items-center gap-2"
          >
            <Timer className="w-5 h-5" />
            {timeLeft}s
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            {score}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-indigo-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Timed Challenge
          </CardTitle>
          <p className="text-gray-600">
            Answer as many questions correctly as you can before time runs out!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              Question {currentQuestionIndex + 1} of {challengeQuestions.length}
            </Badge>
            <Badge variant="outline">
              {correctCount} Correct
            </Badge>
          </div>

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
                    disabled={isAnswered || !isGameActive}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      showCorrect
                        ? "border-green-500 bg-green-50"
                        : showIncorrect
                        ? "border-red-500 bg-red-50"
                        : isSelected
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300 bg-white hover:border-indigo-300"
                    } ${isAnswered || !isGameActive ? "cursor-not-allowed" : "cursor-pointer"}`}
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

          <div className="flex justify-center">
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer || isAnswered || !isGameActive}
              className="bg-green-600 hover:bg-green-700 px-8"
            >
              Submit Answer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
