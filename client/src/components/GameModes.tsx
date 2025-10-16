import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowUpDown, GraduationCap, ListChecks, TextCursor, Trophy } from "lucide-react";

interface GameModesProps {
  onSelectMode: (mode: "matching" | "ordering" | "multiple-choice" | "fill-in-blank" | "timed-challenge" | "teacher") => void;
}

export default function GameModes({ onSelectMode }: GameModesProps) {
  return (
    <div className="max-w-6xl mx-auto overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-2" />
            <CardTitle className="text-xl text-gray-800">
              Matching Game
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Match the correct phase names to the mitosis images. Learn to identify each stage of cell division!
            </p>
            <Button 
              onClick={() => onSelectMode("matching")}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Start Matching
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <ArrowUpDown className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <CardTitle className="text-xl text-gray-800">
              Ordering Game
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Arrange the phases of mitosis in the correct chronological order. Understand the sequence of cell division!
            </p>
            <Button 
              onClick={() => onSelectMode("ordering")}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Start Ordering
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <ListChecks className="w-12 h-12 text-orange-600 mx-auto mb-2" />
            <CardTitle className="text-xl text-gray-800">
              Multiple Choice
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Answer questions about mitosis phases and processes. Test your knowledge with detailed explanations!
            </p>
            <Button 
              onClick={() => onSelectMode("multiple-choice")}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              Start Quiz
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <TextCursor className="w-12 h-12 text-pink-600 mx-auto mb-2" />
            <CardTitle className="text-xl text-gray-800">
              Fill in the Blank
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Complete statements about mitosis by typing the correct terms. Get hints when you need them!
            </p>
            <Button 
              onClick={() => onSelectMode("fill-in-blank")}
              className="w-full bg-pink-600 hover:bg-pink-700"
            >
              Start Quiz
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardHeader className="text-center">
            <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
            <CardTitle className="text-xl text-gray-800">
              Timed Challenge
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Race against the clock! Answer questions quickly for bonus points and compete for the highest score!
            </p>
            <Button 
              onClick={() => onSelectMode("timed-challenge")}
              className="w-full bg-yellow-600 hover:bg-yellow-700"
            >
              Start Challenge
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <GraduationCap className="w-12 h-12 text-purple-600 mx-auto mb-2" />
            <CardTitle className="text-xl text-gray-800">
              Teacher View
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Review student progress and performance data. Password required for access.
            </p>
            <Button 
              onClick={() => onSelectMode("teacher")}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Teacher Login
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Card className="max-w-2xl mx-auto bg-indigo-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-indigo-900">About Mitosis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-indigo-800">
              Mitosis is the process by which a single cell divides to produce two identical daughter cells. 
              It consists of four main phases: <strong>Prophase</strong>, <strong>Metaphase</strong>, 
              <strong>Anaphase</strong>, and <strong>Telophase</strong>. Each phase has distinct characteristics 
              involving chromosomes and spindle fibers.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
