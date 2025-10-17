import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { getOutdoorTaskBundle } from "../data/environmentCurriculum";
import { Footer } from "../components/Navigation";

const verificationLabels: Record<string, string> = {
  photo: "Photo verification required",
  teacher: "Teacher approval required",
  parent: "Parent approval required",
  description: "Submit a short description",
};

const OutdoorTaskPage = () => {
  const navigate = useNavigate();
  const { classId, chapterId } = useParams<{ classId: string; chapterId: string }>();

  const { bundle, error, classNumber, chapterNumber } = useMemo(() => {
    if (!classId || !chapterId) {
      return {
        bundle: null,
        error: "Missing outdoor task details in the URL.",
        classNumber: null,
        chapterNumber: null,
      } as const;
    }

    const parsedClass = Number(classId);
    const parsedChapter = Number(chapterId);

    if (Number.isNaN(parsedClass) || Number.isNaN(parsedChapter)) {
      return {
        bundle: null,
        error: "Outdoor task path contains invalid values.",
        classNumber: null,
        chapterNumber: null,
      } as const;
    }

    return {
      bundle: getOutdoorTaskBundle(parsedClass, parsedChapter),
      error: null,
      classNumber: parsedClass,
      chapterNumber: parsedChapter,
    } as const;
  }, [classId, chapterId]);

  const footerDescription = "Complete real-world eco missions, submit proof, and earn your Outdoor Hero badges.";
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
          Outdoor task not found
        </div>
        {renderFooter()}
      </>
    );
  }

  const verificationMessage =
    verificationLabels[bundle.task.verification_type] ?? "Submit proof to earn points";

  return (
    <>
      <div className="min-h-screen bg-gradient-nature">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="hover:bg-primary/10 transition-colors"
        >
          Back
        </Button>

        <Card className="p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">{bundle.title}</h1>
              <p className="text-muted-foreground">Outdoor Eco Mission</p>
            </div>
            <Badge variant="secondary" className="text-base px-4 py-2">
              Verified Reward: +{bundle.pointsConfig.task_verified} EcoPoints
            </Badge>
          </div>

          <div className="text-muted-foreground leading-relaxed">
            {bundle.task.description}
          </div>

          <Card className="p-4 bg-accent/30 border-accent/40 text-sm">
            <h2 className="font-semibold mb-2">Verification</h2>
            <p className="text-muted-foreground">{verificationMessage}</p>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate("/submit-task")}>Submit Proof</Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/game/${classNumber}/${chapterNumber}`)}
            >
              Play Chapter Game
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate(`/quiz/${classNumber}/${chapterNumber}`)}
            >
              Retry Quiz
            </Button>
          </div>
        </Card>
      </div>
    </div>
      {renderFooter()}
    </>
  );
};

export default OutdoorTaskPage;
