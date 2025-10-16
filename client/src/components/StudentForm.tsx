import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useStudent } from "@/lib/stores/useStudent";

interface StudentFormProps {
  onComplete: () => void;
}

export default function StudentForm({ onComplete }: StudentFormProps) {
  const [name, setName] = useState("");
  const { setStudentName } = useStudent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setStudentName(name.trim());
      onComplete();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-indigo-100 rounded-full w-fit">
            <User className="w-8 h-8 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl text-gray-800">
            Welcome to Mitosis Game!
          </CardTitle>
          <p className="text-gray-600">
            Please enter your name to get started
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="studentName" className="text-gray-700">
                Your Name
              </Label>
              <Input
                id="studentName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-1"
                required
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={!name.trim()}
            >
              Start Learning!
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
