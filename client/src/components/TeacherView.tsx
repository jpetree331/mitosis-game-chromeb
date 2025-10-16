import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Lock, Eye, CheckCircle, XCircle, User, Calendar, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

interface TeacherViewProps {
  onBack: () => void;
}

interface StudentAnswer {
  id: number;
  studentName: string;
  gameMode: string;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timestamp: string;
}

export default function TeacherView({ onBack }: TeacherViewProps) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { data: answers, isLoading } = useQuery({
    queryKey: ["/api/student-answers"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: isAuthenticated,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production, this should be server-side
    if (password === "teacher123") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password. Hint: teacher123");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
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
            <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
            <CardTitle className="text-2xl text-gray-800">
              Teacher Authentication
            </CardTitle>
            <p className="text-gray-600">
              Please enter the admin password to view student data
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading student data...</p>
      </div>
    );
  }

  const studentData: StudentAnswer[] = answers || [];
  
  // Group answers by student
  const studentStats = studentData.reduce((acc: any, answer: StudentAnswer) => {
    if (!acc[answer.studentName]) {
      acc[answer.studentName] = {
        name: answer.studentName,
        totalAnswers: 0,
        correctAnswers: 0,
        matchingAttempts: 0,
        orderingAttempts: 0,
        multipleChoiceAttempts: 0,
        fillInBlankAttempts: 0,
        lastActivity: answer.timestamp
      };
    }
    
    acc[answer.studentName].totalAnswers++;
    if (answer.isCorrect) acc[answer.studentName].correctAnswers++;
    if (answer.gameMode === "matching") acc[answer.studentName].matchingAttempts++;
    if (answer.gameMode === "ordering") acc[answer.studentName].orderingAttempts++;
    if (answer.gameMode === "multiple-choice") acc[answer.studentName].multipleChoiceAttempts++;
    if (answer.gameMode === "fill-in-blank") acc[answer.studentName].fillInBlankAttempts++;
    
    // Update last activity if this is more recent
    if (new Date(answer.timestamp) > new Date(acc[answer.studentName].lastActivity)) {
      acc[answer.studentName].lastActivity = answer.timestamp;
    }
    
    return acc;
  }, {});

  const students = Object.values(studentStats);
  
  // Calculate class-wide statistics
  const classStats = {
    averageScore: students.length > 0 
      ? Math.round(students.reduce((sum: number, s: any) => 
          sum + (s.totalAnswers > 0 ? (s.correctAnswers / s.totalAnswers) * 100 : 0), 0) / students.length)
      : 0,
    totalAttempts: studentData.length,
    topPerformer: students.length > 0
      ? students.reduce((top: any, curr: any) => {
          const currRate = curr.totalAnswers > 0 ? curr.correctAnswers / curr.totalAnswers : 0;
          const topRate = top.totalAnswers > 0 ? top.correctAnswers / top.totalAnswers : 0;
          return currRate > topRate ? curr : top;
        }, students[0])
      : null,
    gameModeStats: {
      matching: studentData.filter((a: StudentAnswer) => a.gameMode === "matching").length,
      ordering: studentData.filter((a: StudentAnswer) => a.gameMode === "ordering").length,
      multipleChoice: studentData.filter((a: StudentAnswer) => a.gameMode === "multiple-choice").length,
      fillInBlank: studentData.filter((a: StudentAnswer) => a.gameMode === "fill-in-blank").length,
      timedChallenge: studentData.filter((a: StudentAnswer) => a.gameMode === "timed-challenge").length
    }
  };

  return (
    <div className="max-w-6xl mx-auto overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </Button>
        <Badge variant="secondary" className="text-sm">
          Logged in as Teacher
        </Badge>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-900 flex items-center gap-2">
            <User className="w-6 h-6" />
            Student Performance Dashboard
          </CardTitle>
          <p className="text-gray-600">
            Overview of student activity and performance in mitosis games
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-800">Total Students</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {students.length}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800">Total Correct</span>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {studentData.filter((a: StudentAnswer) => a.isCorrect).length}
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-orange-800">Total Attempts</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">
                {studentData.length}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-purple-800">Class Average</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {classStats.averageScore}%
              </div>
            </div>
          </div>

          {/* Class-wide insights */}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-indigo-900 mb-2">Top Performer</h4>
              {classStats.topPerformer ? (
                <div>
                  <p className="text-lg font-bold text-indigo-800">{classStats.topPerformer.name}</p>
                  <p className="text-sm text-indigo-600">
                    {Math.round((classStats.topPerformer.correctAnswers / classStats.topPerformer.totalAnswers) * 100)}% accuracy
                  </p>
                </div>
              ) : (
                <p className="text-sm text-indigo-600">No data yet</p>
              )}
            </div>
            
            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-teal-900 mb-2">Game Mode Usage</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-teal-700">Matching:</span>
                  <span className="font-semibold text-teal-900">{classStats.gameModeStats.matching}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-700">Ordering:</span>
                  <span className="font-semibold text-teal-900">{classStats.gameModeStats.ordering}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-700">Multiple Choice:</span>
                  <span className="font-semibold text-teal-900">{classStats.gameModeStats.multipleChoice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-700">Fill in Blank:</span>
                  <span className="font-semibold text-teal-900">{classStats.gameModeStats.fillInBlank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-700">Timed Challenge:</span>
                  <span className="font-semibold text-teal-900">{classStats.gameModeStats.timedChallenge}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Summary Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Student Summary</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Total Attempts</TableHead>
                <TableHead>Correct Answers</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead className="text-xs">Match</TableHead>
                <TableHead className="text-xs">Order</TableHead>
                <TableHead className="text-xs">MC</TableHead>
                <TableHead className="text-xs">FIB</TableHead>
                <TableHead>Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student: any) => (
                <TableRow key={student.name}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.totalAnswers}</TableCell>
                  <TableCell>{student.correctAnswers}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        student.totalAnswers > 0 && 
                        (student.correctAnswers / student.totalAnswers) >= 0.8 
                          ? "default" 
                          : "secondary"
                      }
                    >
                      {student.totalAnswers > 0 
                        ? Math.round((student.correctAnswers / student.totalAnswers) * 100) 
                        : 0}%
                    </Badge>
                  </TableCell>
                  <TableCell>{student.matchingAttempts}</TableCell>
                  <TableCell>{student.orderingAttempts}</TableCell>
                  <TableCell>{student.multipleChoiceAttempts}</TableCell>
                  <TableCell>{student.fillInBlankAttempts}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(student.lastActivity).toLocaleDateString()} {" "}
                    {new Date(student.lastActivity).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detailed Answers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Detailed Answer Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Game Mode</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Student Answer</TableHead>
                  <TableHead>Correct Answer</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentData
                  .sort((a: StudentAnswer, b: StudentAnswer) => 
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                  )
                  .map((answer: StudentAnswer) => (
                    <TableRow key={answer.id}>
                      <TableCell className="font-medium">{answer.studentName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {answer.gameMode}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {answer.question}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {answer.studentAnswer}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {answer.correctAnswer}
                      </TableCell>
                      <TableCell>
                        {answer.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(answer.timestamp).toLocaleDateString()} {" "}
                        {new Date(answer.timestamp).toLocaleTimeString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
