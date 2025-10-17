import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  CheckCircle,
  XCircle,
  Brain,
  Trophy,
  Star,
  ArrowRight,
  RotateCcw,
  Lightbulb,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import type { QuizQuestion } from "../data/environmentCurriculum";

interface QuizComponentProps {
  questions: QuizQuestion[];
  onComplete: (score: number, pointsEarned: number) => void;
  pointsConfig: {
    quiz_correct: number;
    quiz_incorrect: number;
    quiz_completion_bonus: number;
  };
  chapterTitle?: string;
  classNumber?: number;
  chapterNumber?: number;
}

const QuizComponent = ({
  questions,
  onComplete,
  pointsConfig,
  chapterTitle,
  classNumber,
  chapterNumber,
}: QuizComponentProps) => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | boolean | null>(null);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [attempts, setAttempts] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const { toast } = useToast();

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const questionAttempts = attempts[currentQuestion] || 0;
  const hasFollowUps = typeof classNumber === "number" && typeof chapterNumber === "number";

  const navigateToGame = () => {
    if (typeof classNumber !== "number" || typeof chapterNumber !== "number") return;
    navigate(`/game/${classNumber}/${chapterNumber}`);
  };

  const navigateToOutdoorTask = () => {
    if (typeof classNumber !== "number" || typeof chapterNumber !== "number") return;
    navigate(`/outdoor-task/${classNumber}/${chapterNumber}`);
  };

  // helper for case-insensitive text compare (fill_blank)
  const eqText = (a: string, b: string) =>
    a.trim().toLowerCase() === b.trim().toLowerCase();

  const checkAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect =
      (question.type === "mcq" && selectedAnswer === question.answer) ||
      (question.type === "true_false" && selectedAnswer === question.answer) ||
      (question.type === "fill_blank" &&
        typeof selectedAnswer === "string" &&
        eqText(String(selectedAnswer), String(question.answer))) ||
      (question.type === "match" && selectedAnswer === question.answer);

    setShowFeedback(true);
    setAnswers((prev) => ({ ...prev, [currentQuestion]: { answer: selectedAnswer, correct: isCorrect } }));

    if (isCorrect) {
      const points =
        questionAttempts === 0
          ? pointsConfig.quiz_correct
          : Math.floor(pointsConfig.quiz_correct / 2);
      setScore((prev) => prev + 1);
      setPointsEarned((prev) => prev + points);

      toast({
        title: "✅ Correct!",
        description: `Great job! +${points} EcoPoints`,
        className: "bg-success text-success-foreground border-success",
      });
    } else {
      const newAttempts = questionAttempts + 1;
      setAttempts((prev) => ({ ...prev, [currentQuestion]: newAttempts }));

      if (newAttempts < 2) {
        toast({
          title: "❌ Try again",
          description: question.hint || "Think about it once more!",
          className: "bg-destructive text-destructive-foreground border-destructive",
        });
      } else {
        toast({
          title: "💡 Learning moment",
          description: question.explanation || "Don't worry, you'll get it next time!",
          className: "bg-warning text-warning-foreground border-warning",
        });
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Quiz complete
      const finalScore = score;
      const passed = finalScore >= Math.ceil(questions.length * 0.8);
      const bonusPoints = passed ? pointsConfig.quiz_completion_bonus : 0;
      const totalPoints = pointsEarned + bonusPoints;

      setIsComplete(true);
      onComplete(finalScore, totalPoints);

      if (bonusPoints > 0) {
        toast({
          title: "🏆 Bonus Achievement!",
          description: `Excellent score! +${bonusPoints} bonus EcoPoints`,
          className: "bg-warning text-warning-foreground border-warning",
        });
      }
    }
  };

  const retryQuestion = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  // Render inline to avoid remounting inputs (keeps focus during typing)
  const renderQuestion = () => {
    switch (question.type) {
      case "mcq":
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className="w-full text-left justify-start p-4 h-auto whitespace-normal"
                onClick={() => !showFeedback && setSelectedAnswer(index)}
                disabled={showFeedback}
                aria-pressed={selectedAnswer === index}
              >
                <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </div>
        );

      case "true_false":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant={selectedAnswer === true ? "default" : "outline"}
              className="p-6 h-auto"
              onClick={() => !showFeedback && setSelectedAnswer(true)}
              disabled={showFeedback}
              aria-pressed={selectedAnswer === true}
            >
              <CheckCircle className="h-6 w-6 mr-3" />
              True
            </Button>
            <Button
              variant={selectedAnswer === false ? "default" : "outline"}
              className="p-6 h-auto"
              onClick={() => !showFeedback && setSelectedAnswer(false)}
              disabled={showFeedback}
              aria-pressed={selectedAnswer === false}
            >
              <XCircle className="h-6 w-6 mr-3" />
              False
            </Button>
          </div>
        );

      case "fill_blank":
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Type your answer here..."
              className="w-full p-4 border border-border rounded-lg text-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={typeof selectedAnswer === "string" ? selectedAnswer : ""}
              onChange={(e) => !showFeedback && setSelectedAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !showFeedback && selectedAnswer !== null) {
                  checkAnswer();
                }
              }}
              disabled={showFeedback}
              aria-label="Answer input"
            />
          </div>
        );

      case "match":
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">Match the items correctly:</p>
            <div className="p-4 bg-accent/50 rounded-lg">
              <p className="font-medium">{question.question}</p>
            </div>
            <Button
              variant={selectedAnswer === "correct" ? "default" : "outline"}
              className="w-full p-4 h-auto"
              onClick={() => !showFeedback && setSelectedAnswer("correct")}
              disabled={showFeedback}
              aria-pressed={selectedAnswer === "correct"}
            >
              These matches are correct
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  if (isComplete) {
    const passed = score >= Math.ceil(questions.length * 0.8);
    const displayPoints = pointsEarned + (passed ? pointsConfig.quiz_completion_bonus : 0);

    return (
      <Card className="p-8 text-center space-y-6 bg-gradient-to-r from-success/10 to-primary/10">
        <div className="space-y-4">
          <Trophy className="h-16 w-16 mx-auto text-warning animate-bounce-in" />
          <h2 className="text-3xl font-bold">Quiz Complete! 🎉</h2>
          <div className="space-y-2">
            <p className="text-xl">
              Score: <span className="font-bold text-primary">{score}/{questions.length}</span>
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              +{displayPoints} EcoPoints Earned!
            </Badge>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="default"
            className="flex items-center"
            onClick={navigateToGame}
            disabled={!hasFollowUps}
          >
            <Star className="h-4 w-4 mr-2" />
            Play Chapter Game
          </Button>
          <Button
            variant="outline"
            className="flex items-center"
            onClick={navigateToOutdoorTask}
            disabled={!hasFollowUps}
          >
            <Trophy className="h-4 w-4 mr-2" />
            View Outdoor Task
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        {chapterTitle && (
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold leading-relaxed">{chapterTitle}</h2>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-sm">
            Question {currentQuestion + 1} of {questions.length}
          </Badge>
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Quiz in Progress</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold leading-relaxed">{question.question}</h3>
          {questionAttempts > 0 && question.hint && (
            <div className="flex items-start space-x-2 p-3 bg-warning/10 rounded-lg border border-warning/20">
              <Lightbulb className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
              <p className="text-sm text-warning-foreground">{question.hint}</p>
            </div>
          )}
        </div>

        {renderQuestion()}

        {/* Feedback */}
        {showFeedback && (
          <Card
            className={`p-4 ${
              answers[currentQuestion]?.correct
                ? "bg-success/10 border-success/20"
                : "bg-destructive/10 border-destructive/20"
            }`}
          >
            <div className="flex items-start space-x-3">
              {answers[currentQuestion]?.correct ? (
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive mt-0.5" />
              )}
              <div className="space-y-2">
                <p className="font-medium">
                  {answers[currentQuestion]?.correct ? "Correct!" : "Not quite right"}
                </p>
                {question.explanation && (
                  <p className="text-sm text-muted-foreground">{question.explanation}</p>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {!showFeedback ? (
          <Button onClick={checkAnswer} disabled={selectedAnswer === null} className="flex-1">
            Check Answer
          </Button>
        ) : (
          <>
            {!answers[currentQuestion]?.correct && questionAttempts < 2 && (
              <Button variant="outline" onClick={retryQuestion} className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            <Button onClick={nextQuestion} className="flex-1">
              {currentQuestion < questions.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                "Complete Quiz"
              )}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default QuizComponent;
