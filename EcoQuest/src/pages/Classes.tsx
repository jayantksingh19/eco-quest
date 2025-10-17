import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import ClassCard from "../components/ClassCard";
import ChapterContent from "../components/ChapterContent";
import { classesData } from "../data/classesData";
import {
  getCurriculumByClass,
  getAllClasses,
} from "../data/environmentCurriculum";

import {
  BookOpen,
  Gamepad2,
  Play,
  ArrowLeft,
  Sparkles,
  Target,
} from "lucide-react";
import { Footer } from "../components/Navigation";
import { resourceRoute } from "../lib/resourceRoutes";

const classesFooterSections = [
  {
    title: "Learning Paths",
    links: [
      { label: "All Classes", to: "/classes" },
      { label: "My Dashboard", to: "/dashboard" },
      { label: "Outdoor Missions", to: "/outdoor-task/1/1" },
      { label: "Teacher Dashboard", to: "/teacher" },
    ],
  },
  {
    title: "Student Actions",
    links: [
      { label: "Submit Task", to: "/submit-task" },
      { label: "Report Hazard", to: "/report-hazard" },
      { label: "View Leaderboard", to: "/leaderboard" },
      { label: "Join Challenges", to: "/auth?type=student" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: resourceRoute("help-centre") },
      { label: "Teacher Guides", to: resourceRoute("teachers-guide") },
      { label: "Privacy Policy", to: resourceRoute("privacy-policy") },
      { label: "Terms of Service", to: resourceRoute("terms-of-service") },
    ],
  },
];

const Classes = () => {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const footerDescription = "Browse the full EcoQuest curriculum and jump into lessons, quizzes, and outdoor missions for any class.";
  // const { EcoPointsDisplay, addPoints } = EcoPointsSystem({ userId: 'current-user' });

  // Show individual chapter content
  if (selectedClass !== null && selectedChapter !== null) {
    const classNumber = selectedClass;
    const classData = classesData[classNumber as keyof typeof classesData];
    const chapter = classData?.chapters[selectedChapter];

    if (!chapter) return null;

    return (
      <>
        <div className="min-h-screen bg-gradient-nature">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Button
              variant="ghost"
              onClick={() => setSelectedChapter(null)}
              className="mb-6 hover:bg-primary/10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Class {classNumber}
            </Button>

            <ChapterContent
              chapter={chapter}
              chapterIndex={selectedChapter}
              classNumber={classNumber}
            />
          </div>
        </div>
        <Footer description={footerDescription} sections={classesFooterSections} />
      </>
    );
  }

  // Show chapters for selected class
  if (selectedClass !== null) {
    const classNumber = selectedClass;
    const classData = classesData[classNumber as keyof typeof classesData];

    if (!classData) return null;

    return (
      <>
        <div className="min-h-screen bg-gradient-nature">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Button
              variant="ghost"
              onClick={() => setSelectedClass(null)}
              className="mb-6 hover:bg-primary/10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Classes
            </Button>

            <div className="text-center mb-12">
              <div className="text-6xl mb-4">
                {classNumber <= 5 ? "🧒" : classNumber <= 8 ? "🧑" : "👨"}
              </div>
              <h1 className="text-4xl font-bold mb-4 animate-bounce-in">
                Class {classNumber} - Gamified Learning
              </h1>
              <p className="text-xl text-muted-foreground">
                Choose a chapter to start your learning adventure
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {classData.chapters.map((chapter, index) => (
                <Card
                  key={index}
                  className="p-8 hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer animate-bounce-in"
                  onClick={() => setSelectedChapter(index)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="text-2xl font-bold mb-2">
                      Chapter {index + 1}
                    </h3>
                    <h4 className="text-xl text-primary font-semibold">
                      {chapter.title}
                    </h4>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-sm font-medium">
                        {chapter.lessons.length}
                      </div>
                      <div className="text-xs text-muted-foreground">Lessons</div>
                    </div>
                    <div className="text-center p-3 bg-secondary/20 rounded-lg">
                      <Target className="h-6 w-6 mx-auto mb-2 text-secondary-accent" />
                      <div className="text-sm font-medium">1</div>
                      <div className="text-xs text-muted-foreground">Quiz</div>
                    </div>
                    <div className="text-center p-3 bg-success/10 rounded-lg">
                      <Gamepad2 className="h-6 w-6 mx-auto mb-2 text-success" />
                      <div className="text-sm font-medium">1</div>
                      <div className="text-xs text-muted-foreground">Game</div>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-eco hover:opacity-90 text-lg py-6">
                    <Play className="h-5 w-5 mr-2" />
                    Start Chapter {index + 1}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <Footer description={footerDescription} sections={classesFooterSections} />
      </>
    );
  }

  // Main classes overview
  return (
    <>
      <div className="min-h-screen bg-gradient-nature">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4 animate-float">🎮</div>
          <h1 className="text-5xl font-bold mb-4 animate-bounce-in">
            Gamified Learning Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Complete curriculum from Class 1-12 with interactive lessons,
            engaging quizzes, and fun games designed for every learning level.
          </p>
        </div>

        {/* Environment Curriculum Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {getAllClasses()
            .sort((a, b) => a - b) // Sort numbers in ascending order
            .map((classNum) => {
              const chapters = getCurriculumByClass(classNum);
              return (
                <ClassCard
                  key={classNum}
                  classNum={classNum}
                  chapters={chapters.map((ch) => ({
                    title: ch.title,
                    lessons: [
                      {
                        title: "Environment Lesson",
                        description: ch.lesson,
                        type: "reading" as const,
                        duration: "10 min",
                        points: ch.eco_points_config.quiz_completion_bonus,
                      },
                    ],
                    quiz: {
                      title: "Quiz",
                      description: `${ch.quiz.length} questions`,
                      questions: ch.quiz.length,
                      points: ch.eco_points_config.quiz_completion_bonus,
                    },
                    game: {
                      title: ch.game.title,
                      description: ch.game.description,
                      difficulty: ch.game.difficulty,
                      duration: ch.game.duration,
                      points: ch.game.points,
                    },
                  }))}
                  onSelectClass={setSelectedClass}
                />
              );
            })}
        </div>

        {/* Platform Features */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-eco">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
              <Sparkles className="h-8 w-8 mr-3 text-primary" />
              Learning Features
            </h2>
            <p className="text-muted-foreground">
              Experience education like never before
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-4 bg-gradient-eco rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center animate-float">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Interactive Lessons
              </h3>
              <p className="text-muted-foreground">
                Animated videos and engaging content that makes complex topics
                easy to understand.
              </p>
            </div>

            <div className="text-center">
              <div
                className="p-4 bg-secondary-accent rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center animate-float"
                style={{ animationDelay: "0.5s" }}
              >
                <Target className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Quizzes</h3>
              <p className="text-muted-foreground">
                Adaptive quizzes that test your knowledge and help reinforce
                learning.
              </p>
            </div>

            <div className="text-center">
              <div
                className="p-4 bg-success rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center animate-float"
                style={{ animationDelay: "1s" }}
              >
                <Gamepad2 className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Educational Games</h3>
              <p className="text-muted-foreground">
                Fun, interactive games that make learning memorable and
                enjoyable.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <div className="text-center p-6 bg-card rounded-lg shadow-soft">
            <div className="text-4xl font-bold text-primary mb-2">
              24
            </div>
            <div className="text-muted-foreground">Total Chapters</div>
          </div>
          <div className="text-center p-6 bg-card rounded-lg shadow-soft">
            <div className="text-4xl font-bold text-secondary-accent mb-2">
              72+
            </div>
            <div className="text-muted-foreground">Video Lessons</div>
          </div>
          <div className="text-center p-6 bg-card rounded-lg shadow-soft">
            <div className="text-4xl font-bold text-success mb-2">24</div>
            <div className="text-muted-foreground">Interactive Games</div>
          </div>
          <div className="text-center p-6 bg-card rounded-lg shadow-soft">
            <div className="text-4xl font-bold text-warning mb-2">2000+</div>
            <div className="text-muted-foreground">Points to Earn</div>
          </div>
        </div>
      </div>
    </div>
      <Footer description={footerDescription} sections={classesFooterSections} />
    </>
  );
};

export default Classes;
