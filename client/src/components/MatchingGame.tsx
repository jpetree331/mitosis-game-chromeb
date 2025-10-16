import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import MitosisPhaseCanvas from "./MitosisPhaseCanvas";
import { mitosisPhases } from "@/lib/mitosisData";
import { useStudent } from "@/lib/stores/useStudent";
import { apiRequest } from "@/lib/queryClient";

interface MatchingGameProps {
  onBack: () => void;
}

interface DropZone {
  phaseId: string;
  droppedName: string | null;
  isCorrect: boolean | null;
}

export default function MatchingGame({ onBack }: MatchingGameProps) {
  const { studentName } = useStudent();
  const [dropZones, setDropZones] = useState<DropZone[]>(
    mitosisPhases.map(phase => ({
      phaseId: phase.id,
      droppedName: null,
      isCorrect: null
    }))
  );
  
  const [availableNames] = useState(
    [...mitosisPhases.map(p => p.name)].sort(() => Math.random() - 0.5)
  );
  
  const [usedNames, setUsedNames] = useState<string[]>([]);
  const [draggedName, setDraggedName] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const submitAnswerMutation = useMutation({
    mutationFn: async (answerData: any) => {
      await apiRequest("POST", "/api/student-answers", answerData);
    }
  });

  const handleDragStart = (e: React.DragEvent, name: string) => {
    setDraggedName(name);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = useCallback((e: React.DragEvent, phaseId: string) => {
    e.preventDefault();
    
    if (!draggedName) return;

    // Remove from previous drop zone if it exists
    setDropZones(prev => prev.map(zone => 
      zone.droppedName === draggedName 
        ? { ...zone, droppedName: null, isCorrect: null }
        : zone
    ));

    // Add to new drop zone
    setDropZones(prev => prev.map(zone => 
      zone.phaseId === phaseId 
        ? { 
            ...zone, 
            droppedName: draggedName,
            isCorrect: null // Reset correctness when dropping
          }
        : zone
    ));

    setUsedNames(prev => [...new Set([...prev, draggedName])]);
    setDraggedName(null);
  }, [draggedName]);

  const checkAnswers = () => {
    let correct = 0;
    const answers: any[] = [];

    const updatedZones = dropZones.map(zone => {
      const phase = mitosisPhases.find(p => p.id === zone.phaseId)!;
      const isCorrect = zone.droppedName === phase.name;
      
      if (isCorrect) correct++;
      
      // Record the answer
      answers.push({
        studentName,
        gameMode: "matching",
        question: `Match phase: ${phase.name}`,
        studentAnswer: zone.droppedName || "No answer",
        correctAnswer: phase.name,
        isCorrect,
        timestamp: new Date().toISOString()
      });

      return { ...zone, isCorrect };
    });

    setDropZones(updatedZones);
    setScore({ correct, total: mitosisPhases.length });
    setIsCompleted(true);

    // Submit all answers to backend
    answers.forEach(answer => {
      submitAnswerMutation.mutate(answer);
    });

    const percentage = Math.round((correct / mitosisPhases.length) * 100);
    if (percentage >= 80) {
      toast.success(`Excellent work! You scored ${percentage}%`);
    } else if (percentage >= 60) {
      toast.success(`Good job! You scored ${percentage}%`);
    } else {
      toast.error(`Keep practicing! You scored ${percentage}%`);
    }
  };

  const resetGame = () => {
    setDropZones(mitosisPhases.map(phase => ({
      phaseId: phase.id,
      droppedName: null,
      isCorrect: null
    })));
    setUsedNames([]);
    setIsCompleted(false);
    setScore({ correct: 0, total: 0 });
  };

  const canCheck = dropZones.every(zone => zone.droppedName !== null);

  return (
    <div className="max-w-6xl mx-auto">
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
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Score: {score.correct}/{score.total}
            </Badge>
            <Button 
              onClick={resetGame} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-indigo-900">
            Mitosis Matching Game
          </CardTitle>
          <p className="text-center text-gray-600">
            Drag the phase names below to match them with the correct mitosis images
          </p>
        </CardHeader>
      </Card>

      {/* Phase Images with Drop Zones */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mitosisPhases.map((phase) => {
          const dropZone = dropZones.find(z => z.phaseId === phase.id)!;
          
          return (
            <Card key={phase.id} className="relative">
              <CardHeader className="pb-2">
                <div className="h-48 border-2 border-dashed border-gray-300 rounded-lg">
                  <MitosisPhaseCanvas phase={phase} />
                </div>
              </CardHeader>
              <CardContent>
                {/* Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, phase.id)}
                  className={`min-h-12 border-2 border-dashed rounded-lg p-3 text-center transition-colors ${
                    dropZone.droppedName 
                      ? dropZone.isCorrect === true
                        ? "border-green-500 bg-green-50"
                        : dropZone.isCorrect === false
                        ? "border-red-500 bg-red-50" 
                        : "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {dropZone.droppedName ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-medium">{dropZone.droppedName}</span>
                      {dropZone.isCorrect === true && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {dropZone.isCorrect === false && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500">Drop phase name here</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Available Names */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Phase Names</CardTitle>
          <p className="text-sm text-gray-600">
            Drag these names to match with the images above
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {availableNames
              .filter(name => !usedNames.includes(name) || 
                dropZones.find(z => z.droppedName === name && z.isCorrect === false))
              .map((name) => (
                <div
                  key={name}
                  draggable
                  onDragStart={(e) => handleDragStart(e, name)}
                  className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-4 py-2 rounded-lg cursor-move select-none transition-colors border-2 border-indigo-300 hover:border-indigo-400"
                >
                  {name}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Check Answers Button */}
      <div className="text-center mt-6">
        <Button
          onClick={checkAnswers}
          disabled={!canCheck || isCompleted}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
        >
          {isCompleted ? "Completed!" : "Check Answers"}
        </Button>
      </div>
    </div>
  );
}
