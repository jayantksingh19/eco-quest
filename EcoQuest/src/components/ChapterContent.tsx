import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  BookOpen,
  Brain,
  Gamepad2,
  Play,
  Star,
  Clock,
  Trophy,
  Video,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { environmentCurriculum } from "../data/environmentCurriculum";

interface Lesson {
  title: string;
  description: string;
  type: 'video' | 'reading';
  duration: string;
  points: number;
  link?: string;
}

interface Quiz {
  title: string;
  description: string;
  questions: number;
  points: number;
}

interface Game {
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  points: number;
}

interface Chapter {
  title: string;
  lessons: Lesson[];
  quiz: Quiz;
  game: Game;
}

interface ChapterContentProps {
  chapter: Chapter;
  chapterIndex: number;
  classNumber: number;
}

const ChapterContent = ({ chapter, chapterIndex, classNumber }: ChapterContentProps) => {
  const navigate = useNavigate();
  const [isLessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number | null>(null);
  const [showDocumentation, setShowDocumentation] = useState(false);

  const selectedLesson =
    selectedLessonIndex !== null ? chapter.lessons[selectedLessonIndex] : null;

  const documentationContent = useMemo(() => {
    const entry = environmentCurriculum.find(
      (item) => item.class === classNumber && item.chapter_number === chapterIndex + 1
    );
    return entry?.lesson ?? null;
  }, [classNumber, chapterIndex]);

  const openLesson = (link?: string) => {
    if (!link) {
      console.warn('No lesson link configured for this lesson.');
      return;
    }

    if (/^https?:\/\//i.test(link)) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      navigate(link);
    }
  };

  const handleLessonStart = (lessonIndex: number) => {
    setSelectedLessonIndex(lessonIndex);
    setShowDocumentation(false);
    setLessonDialogOpen(true);
  };

  const handleLessonDialogClose = () => {
    setLessonDialogOpen(false);
    setShowDocumentation(false);
    setSelectedLessonIndex(null);
  };

  const handleVideoStart = () => {
    if (!selectedLesson) return;
    const link = selectedLesson.link;
    handleLessonDialogClose();
    openLesson(link);
  };

  const handleShowDocumentation = () => {
    setShowDocumentation(true);
  };
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-success/20 text-success';
      case 'medium':
        return 'bg-warning/20 text-warning';
      case 'hard':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-secondary/20 text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-8">
      {/* Chapter Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 animate-bounce-in">
          Chapter {chapterIndex + 1}: {chapter.title}
        </h2>
        <div className="flex justify-center items-center space-x-4 text-sm text-muted-foreground">
          <span className="flex items-center">
            <Video className="h-4 w-4 mr-1" />
            {chapter.lessons.length} Lessons
          </span>
          <span className="flex items-center">
            <Brain className="h-4 w-4 mr-1" />
            1 Quiz
          </span>
          <span className="flex items-center">
            <Gamepad2 className="h-4 w-4 mr-1" />
            1 Game
          </span>
        </div>
      </div>

      {/* Lessons Section */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Video className="h-5 w-5 mr-2 text-primary" />
          Interactive Lessons
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chapter.lessons.map((lesson, index) => (
            <Card key={index} className="p-4 hover:shadow-eco transition-all duration-300 hover:scale-105">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  {lesson.type === 'video' ? 
                    <Video className="h-4 w-4 text-primary" /> : 
                    <BookOpen className="h-4 w-4 text-primary" />
                  }
                </div>
                <Badge variant="outline" className="text-xs">
                  +{lesson.points} pts
                </Badge>
              </div>
              
              <h4 className="font-semibold mb-2">{lesson.title}</h4>
              <p className="text-muted-foreground text-sm mb-3">{lesson.description}</p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {lesson.duration}
                </span>
                <span className="capitalize">{lesson.type}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleLessonStart(index)}
                title="Choose how you'd like to learn this lesson"
              >
                <Play className="h-3 w-3 mr-2" />
                Start Lesson
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Quiz Section */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Brain className="h-5 w-5 mr-2 text-secondary-accent" />
          Knowledge Quiz
        </h3>
        <Card className="p-6 bg-gradient-to-r from-secondary/10 to-secondary/5 hover:shadow-eco transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-secondary rounded-full">
              <Brain className="h-6 w-6 text-secondary-foreground" />
            </div>
            <Badge className="bg-secondary-accent text-white">
              +{chapter.quiz.points} pts
            </Badge>
          </div>
          
          <h4 className="text-lg font-semibold mb-2">{chapter.quiz.title}</h4>
          <p className="text-muted-foreground mb-4">{chapter.quiz.description}</p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span>{chapter.quiz.questions} questions</span>
            <span className="flex items-center">
              <Star className="h-3 w-3 mr-1" />
              Knowledge Test
            </span>
          </div>
          
          <Button
            className="w-full bg-secondary-accent hover:bg-secondary-accent/90"
            onClick={() => navigate(`/quiz/${classNumber}/${chapterIndex + 1}`)}
          >
            <Brain className="h-4 w-4 mr-2" />
            Take Quiz
          </Button>
        </Card>
      </div>

      {/* Game Section */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Gamepad2 className="h-5 w-5 mr-2 text-success" />
          Fun Learning Game
        </h3>
        <Card className="p-6 bg-gradient-to-r from-success/10 to-success/5 hover:shadow-glow transition-all duration-300 hover:scale-105">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-success rounded-full animate-float">
              <Gamepad2 className="h-6 w-6 text-success-foreground" />
            </div>
            <div className="text-right">
              <Badge className="bg-success text-success-foreground mb-2">
                +{chapter.game.points} pts
              </Badge>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(chapter.game.difficulty)}`}>
                {chapter.game.difficulty}
              </div>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold mb-2">{chapter.game.title}</h4>
          <p className="text-muted-foreground mb-4">{chapter.game.description}</p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {chapter.game.duration}
            </span>
            <span className="flex items-center">
              <Trophy className="h-3 w-3 mr-1" />
              Interactive Game
            </span>
          </div>
          
          <Button
            className="w-full bg-success hover:bg-success/90 animate-glow-pulse"
            onClick={() => navigate(`/game/${classNumber}/${chapterIndex + 1}`)}
          >
            <Play className="h-4 w-4 mr-2" />
            Play Game
          </Button>
        </Card>
      </div>

      <Dialog
        open={isLessonDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleLessonDialogClose();
          } else {
            setLessonDialogOpen(true);
          }
        }}
      >
        <DialogContent className="max-w-md">
          {showDocumentation ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedLesson?.title ?? `Chapter ${chapterIndex + 1} Documentation`}
                </DialogTitle>
                <DialogDescription>
                  Review the lesson notes for this chapter.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 max-h-72 overflow-y-auto rounded-lg border border-border bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {documentationContent ?? 'Documentation coming soon.'}
              </div>
              <DialogFooter className="mt-4 gap-2 sm:justify-end">
                <Button variant="outline" onClick={() => setShowDocumentation(false)}>
                  Back
                </Button>
                <Button onClick={handleLessonDialogClose}>Close</Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedLesson?.title ? `Start ${selectedLesson.title}` : 'Start Lesson'}
                </DialogTitle>
                <DialogDescription>
                  Choose how you want to learn this lesson.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-4">
                <Button
                  className="w-full justify-start gap-2"
                  onClick={handleVideoStart}
                  disabled={!selectedLesson?.link}
                >
                  <Play className="h-4 w-4" />
                  Video Lesson
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={handleShowDocumentation}
                  disabled={!documentationContent}
                >
                  <BookOpen className="h-4 w-4" />
                  Documentation
                </Button>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={handleLessonDialogClose}>
                  Cancel
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChapterContent;
