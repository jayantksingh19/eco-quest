import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GameComponent from "../components/GameComponent";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { getGameBundle } from "../data/environmentCurriculum";
import { Footer } from "../components/Navigation";
import { useToast } from "../hooks/use-toast";

const EMBEDDED_GAMES: Record<
  string,
  {
    title: string;
    description: string;
    duration: string;
    difficulty: string;
    objectives: string[];
    src: string;
  }
> = {
  "3-2": {
    title: "Energy at Home",
    description:
      "Explore how everyday actions consume energy and learn smart ways to save it inside your home.",
    duration: "10-15 minutes",
    difficulty: "Easy",
    objectives: [
      "Spot appliances that use the most energy",
      "Make choices that lower electricity use",
      "Discover fun eco-habits you can start today",
    ],
    src: new URL("../games/energy-at-home.html", import.meta.url).href,
  },
  "5-1": {
    title: "Water Cycle Adventure",
    description:
      "Travel with a water droplet through clouds, rivers, and soil to understand the full water cycle.",
    duration: "12-15 minutes",
    difficulty: "Medium",
    objectives: [
      "Experience evaporation, condensation, and precipitation",
      "Match each stage with its real-world example",
      "See why clean water needs our protection",
    ],
    src: new URL("../games/water-cycle-adventure.html", import.meta.url).href,
  },
  "7-2": {
    title: "Natural Disaster Simulator",
    description:
      "Prepare towns for floods, earthquakes, and hurricanes by making smart planning decisions.",
    duration: "15-20 minutes",
    difficulty: "Hard",
    objectives: [
      "Predict how different disasters affect communities",
      "Choose the best safety actions in each scenario",
      "Learn how early planning saves lives",
    ],
    src: new URL("../games/natural-disaster.html", import.meta.url).href,
  },
};

const ChapterGamePage = () => {
  const navigate = useNavigate();
  const { classId, chapterId } = useParams<{ classId: string; chapterId: string }>();

  const { bundle, error, classNumber, chapterNumber } = useMemo(() => {
    if (!classId || !chapterId) {
      return {
        bundle: null,
        error: "Missing game details in the URL.",
        classNumber: null,
        chapterNumber: null,
      } as const;
    }

    const parsedClass = Number(classId);
    const parsedChapter = Number(chapterId);

    if (Number.isNaN(parsedClass) || Number.isNaN(parsedChapter)) {
      return {
        bundle: null,
        error: "Game path contains invalid values.",
        classNumber: null,
        chapterNumber: null,
      } as const;
    }

    return {
      bundle: getGameBundle(parsedClass, parsedChapter),
      error: null,
      classNumber: parsedClass,
      chapterNumber: parsedChapter,
    } as const;
  }, [classId, chapterId]);

  const [gameStarted, setGameStarted] = useState(false);
  const [finishAvailable, setFinishAvailable] = useState(false);
  const iframeContainerRef = useRef<HTMLDivElement | null>(null);
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toast } = useToast();

  const embeddedGameKey = classNumber && chapterNumber ? `${classNumber}-${chapterNumber}` : null;
  const embeddedGame = embeddedGameKey ? EMBEDDED_GAMES[embeddedGameKey] : undefined;

  useEffect(() => {
    setGameStarted(false);
  }, [embeddedGameKey]);

  useEffect(() => {
    if (gameStarted) {
      setTimeout(() => {
        iframeContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } else {
      setFinishAvailable(false);
      if (finishTimerRef.current) {
        clearTimeout(finishTimerRef.current);
        finishTimerRef.current = null;
      }
    }
  }, [gameStarted]);

  useEffect(() => {
    return () => {
      if (finishTimerRef.current) {
        clearTimeout(finishTimerRef.current);
      }
    };
  }, []);

  const footerDescription = "Play interactive eco games, earn bonus points, and take your learning offline.";
  const renderFooter = () => <Footer description={footerDescription} />;

  if (error) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gradient-nature text-foreground">
          {error}
        </div>
        {renderFooter()}
      </>
    );
  }

  if (!bundle || classNumber === null || chapterNumber === null) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gradient-nature text-foreground">
          Game not found
        </div>
        {renderFooter()}
      </>
    );
  }

  const handleEmbeddedStart = () => {
    setGameStarted(true);
    setFinishAvailable(false);
    if (finishTimerRef.current) {
      clearTimeout(finishTimerRef.current);
    }
    finishTimerRef.current = setTimeout(() => {
      setFinishAvailable(true);
    }, 20_000);
  };

  const handleEmbeddedFinish = () => {
    toast({
      title: "Game complete!",
      description: "Great job exploring the chapter. Ready for the next challenge?",
    });
    setGameStarted(false);
    setFinishAvailable(false);
    if (finishTimerRef.current) {
      clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
    navigate(-1);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-nature">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="hover:bg-primary/10 transition-colors"
          >
            Back
          </Button>

          <Card className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">
                  {embeddedGame?.title ?? bundle.title}
                </h1>
                <p className="text-muted-foreground">Interactive Chapter Game</p>
              </div>
              <Badge variant="secondary" className="text-base px-4 py-2">
                Win Reward: +{bundle.pointsConfig.game_win} EcoPoints
              </Badge>
            </div>

            <div className="leading-relaxed text-muted-foreground">
              {embeddedGame?.description ?? bundle.game.description}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>
                Difficulty: <strong className="capitalize">
                  {embeddedGame?.difficulty ?? bundle.game.difficulty}
                </strong>
              </span>
              <span>Estimated time: {embeddedGame?.duration ?? bundle.game.duration}</span>
            </div>

            {embeddedGame ? (
              <div className="bg-accent/40 border border-accent/30 rounded-lg p-4 text-sm leading-relaxed space-y-3">
                <h2 className="font-semibold">What you'll do</h2>
                <ul className="list-disc list-inside space-y-2">
                  {embeddedGame.objectives.map((objective) => (
                    <li key={objective}>{objective}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-accent/40 border border-accent/30 rounded-lg p-4 text-sm leading-relaxed">
                <h2 className="font-semibold mb-2">How to play</h2>
                <p>{bundle.game.instructions}</p>
              </div>
            )}
          </Card>

          {embeddedGame ? (
            <>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleEmbeddedStart} disabled={gameStarted}>
                  {gameStarted ? "Game Running" : "Start Game"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/outdoor-task/${classNumber}/${chapterNumber}`)}
                >
                  View Outdoor Task
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate(`/quiz/${classNumber}/${chapterNumber}`)}
                >
                  Try Quiz
                </Button>
              </div>

              {gameStarted && (
                <Card ref={iframeContainerRef} className="p-4 space-y-4">
                  <div
                    className={`w-full overflow-hidden rounded-lg border ${
                      embeddedGameKey === "3-2" || embeddedGameKey === "7-2"
                        ? "h-[900px]"
                        : "h-[600px]"
                    }`}
                  >
                    <iframe
                      src={embeddedGame.src}
                      title={embeddedGame.title}
                      className="h-full w-full"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex flex-wrap gap-3 justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setGameStarted(false);
                        setFinishAvailable(false);
                        if (finishTimerRef.current) {
                          clearTimeout(finishTimerRef.current);
                          finishTimerRef.current = null;
                        }
                        setTimeout(() => {
                          handleEmbeddedStart();
                        }, 150);
                      }}
                    >
                      Restart
                    </Button>
                    <Button onClick={handleEmbeddedFinish} disabled={!finishAvailable}>
                      {finishAvailable ? "Finish Game" : "Finish available in 20s"}
                    </Button>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <>
              <GameComponent
                game={bundle.game}
                onComplete={(pointsEarned) => {
                  console.log("Game finished:", {
                    class: classNumber,
                    chapter: chapterNumber,
                    pointsEarned,
                  });
                }}
              />

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/outdoor-task/${classNumber}/${chapterNumber}`)}
                >
                  View Outdoor Task
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate(`/quiz/${classNumber}/${chapterNumber}`)}
                >
                  Retry Quiz
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {renderFooter()}
    </>
  );
};

export default ChapterGamePage;
