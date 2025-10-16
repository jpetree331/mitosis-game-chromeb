import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, GripVertical, Info } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import MitosisPhaseCanvas from "./MitosisPhaseCanvas";
import { mitosisPhases } from "@/lib/mitosisData";
import { useStudent } from "@/lib/stores/useStudent";
import { apiRequest } from "@/lib/queryClient";

interface OrderingGameProps {
  onBack: () => void;
}

export default function OrderingGame({ onBack }: OrderingGameProps) {
  const { studentName } = useStudent();
  
  // Shuffle the phases initially
  const [orderedPhases, setOrderedPhases] = useState(() => 
    [...mitosisPhases].sort(() => Math.random() - 0.5)
  );
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [checkedOrder, setCheckedOrder] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const submitAnswerMutation = useMutation({
    mutationFn: async (answerData: any) => {
      await apiRequest("POST", "/api/student-answers", answerData);
    }
  });

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null) return;

    const newOrder = [...orderedPhases];
    const draggedItem = newOrder[draggedIndex];
    
    // Remove the dragged item
    newOrder.splice(draggedIndex, 1);
    // Insert at new position
    newOrder.splice(dropIndex, 0, draggedItem);
    
    setOrderedPhases(newOrder);
    setDraggedIndex(null);
  };

  const checkOrder = () => {
    const correctOrder = ["prophase", "metaphase", "anaphase", "telophase"];
    const studentOrder = orderedPhases.map(phase => phase.id);
    
    let correct = 0;
    const orderResults = studentOrder.map((phaseId, index) => {
      const isCorrect = phaseId === correctOrder[index];
      if (isCorrect) correct++;
      return isCorrect;
    });

    setCheckedOrder(studentOrder);
    setIsCompleted(true);

    // Submit answer to backend
    const answerData = {
      studentName,
      gameMode: "ordering",
      question: "Order the phases of mitosis",
      studentAnswer: orderedPhases.map(p => p.name).join(" → "),
      correctAnswer: mitosisPhases
        .sort((a, b) => ["prophase", "metaphase", "anaphase", "telophase"].indexOf(a.id) - 
                        ["prophase", "metaphase", "anaphase", "telophase"].indexOf(b.id))
        .map(p => p.name).join(" → "),
      isCorrect: correct === 4,
      timestamp: new Date().toISOString()
    };

    submitAnswerMutation.mutate(answerData);

    const percentage = Math.round((correct / 4) * 100);
    if (percentage === 100) {
      toast.success("Perfect! You got the order exactly right!");
    } else if (percentage >= 50) {
      toast.success(`Good attempt! You got ${correct} out of 4 positions correct.`);
    } else {
      toast.error(`Keep practicing! You got ${correct} out of 4 positions correct.`);
    }
  };

  const resetGame = () => {
    setOrderedPhases([...mitosisPhases].sort(() => Math.random() - 0.5));
    setIsCompleted(false);
    setCheckedOrder([]);
  };

  const getPositionStatus = (index: number) => {
    if (!isCompleted) return null;
    
    const correctOrder = ["prophase", "metaphase", "anaphase", "telophase"];
    const currentPhaseId = orderedPhases[index].id;
    return currentPhaseId === correctOrder[index];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </Button>
        
        {isCompleted && (
          <Button 
            onClick={resetGame} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-indigo-900">
            Mitosis Ordering Game
          </CardTitle>
          <p className="text-center text-gray-600">
            Arrange the phases of mitosis in the correct chronological order by dragging and dropping
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-indigo-800 text-center">
              <strong>Hint:</strong> Think about the sequence of events during cell division. 
              What happens first? How do the chromosomes move? When does the cell finally split?
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Ordering Interface */}
      <div className="space-y-4 mb-8">
        {orderedPhases.map((phase, index) => {
          const positionStatus = getPositionStatus(index);
          
          return (
            <Card
              key={`${phase.id}-${index}`}
              className={`transition-all ${
                positionStatus === true 
                  ? "ring-2 ring-green-500 bg-green-50" 
                  : positionStatus === false 
                  ? "ring-2 ring-red-500 bg-red-50"
                  : "hover:shadow-md"
              }`}
              draggable={!isCompleted}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Position Number */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                    positionStatus === true 
                      ? "bg-green-500 text-white" 
                      : positionStatus === false 
                      ? "bg-red-500 text-white"
                      : "bg-indigo-500 text-white"
                  }`}>
                    {index + 1}
                  </div>

                  {/* Phase Image */}
                  <div className="flex-shrink-0 w-24 h-24 border rounded-lg overflow-hidden">
                    <MitosisPhaseCanvas phase={phase} />
                  </div>

                  {/* Phase Info */}
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {phase.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {phase.description}
                    </p>
                  </div>

                  {/* Drag Handle and Status */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {positionStatus === true && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                    {positionStatus === false && (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    {!isCompleted && (
                      <GripVertical className="w-6 h-6 text-gray-400 cursor-move" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Check Order Button */}
      <div className="text-center">
        <Button
          onClick={checkOrder}
          disabled={isCompleted}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
        >
          {isCompleted ? "Order Checked!" : "Check Order"}
        </Button>
      </div>

      {/* Correct Order Reference and Explanations (shown after completion) */}
      {isCompleted && (
        <>
          <Card className="mt-6 bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">Correct Order:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-2">
                {["Prophase", "Metaphase", "Anaphase", "Telophase"].map((name, index) => (
                  <Badge key={name} variant="secondary" className="text-sm">
                    {index + 1}. {name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed explanation of the sequence */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Understanding the Mitosis Sequence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert className="bg-white border-blue-300">
                <AlertDescription className="text-gray-800">
                  <strong className="text-blue-900">Why this order?</strong> Mitosis follows a logical progression where each phase prepares for the next:
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li><strong>Prophase</strong> - Chromosomes condense and become visible, nuclear envelope breaks down</li>
                    <li><strong>Metaphase</strong> - Chromosomes line up at the cell's center, ready to be separated</li>
                    <li><strong>Anaphase</strong> - Sister chromatids are pulled apart to opposite poles</li>
                    <li><strong>Telophase</strong> - Nuclear envelopes reform and the cell divides</li>
                  </ol>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
