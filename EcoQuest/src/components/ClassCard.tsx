import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  Brain, 
  Gamepad2, 
  Play, 
  Video
} from "lucide-react";

interface ClassCardProps {
  classNum: number;
  chapters: Array<{
    title: string;
    lessons: Array<{
      title: string;
      description: string;
      type: 'video' | 'reading';
      duration: string;
      points: number;
      link?: string;
    }>;
    quiz: {
      title: string;
      description: string;
      questions: number;
      points: number;
    };
    game: {
      title: string;
      description: string;
      difficulty: string;
      duration: string;
      points: number;
    };
  }>;
  onSelectClass: (classNum: number) => void;
}

const ClassCard = ({ classNum, chapters, onSelectClass }: ClassCardProps) => {
  const getClassEmoji = (num: number) => {
    if (num <= 5) return "🧒";
    if (num <= 8) return "🧑";
    return "👨";
  };

  const totalPoints = chapters.reduce((total, chapter) => {
    return total + 
      chapter.lessons.reduce((sum, lesson) => sum + lesson.points, 0) +
      chapter.quiz.points +
      chapter.game.points;
  }, 0);

  return (
    <Card className="p-6 hover:shadow-eco transition-all duration-300 hover:scale-105 animate-bounce-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{getClassEmoji(classNum)}</div>
          <div>
            <h3 className="text-xl font-bold">Class {classNum}</h3>
            <p className="text-muted-foreground text-sm">{chapters.length} chapters</p>
          </div>
        </div>
        <Badge variant="secondary" className="animate-glow-pulse">
          +{totalPoints} pts
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        {chapters.map((chapter, index) => (
          <div key={index} className="bg-accent/50 rounded-lg p-3">
            <h4 className="font-semibold text-sm mb-2">{chapter.title}</h4>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span className="flex items-center">
                <Video className="h-3 w-3 mr-1" />
                {chapter.lessons.length} lessons
              </span>
              <span className="flex items-center">
                <Brain className="h-3 w-3 mr-1" />
                Quiz
              </span>
              <span className="flex items-center">
                <Gamepad2 className="h-3 w-3 mr-1" />
                Game
              </span>
            </div>
          </div>
        ))}
      </div>

      <Button 
        onClick={() => onSelectClass(classNum)} 
        className="w-full bg-gradient-eco hover:opacity-90 transition-all duration-300"
      >
        <Play className="h-4 w-4 mr-2" />
        Start Learning
      </Button>
    </Card>
  );
};

export default ClassCard;
