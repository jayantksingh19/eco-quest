import { useParams } from "react-router-dom";
import QuizComponent from "../components/QuizComponent";
import { getQuizBundle } from "../data/environmentCurriculum";
// import { Footer } from "../components/Navigation";

export default function ChapterQuizPage() {
  const { classId, chapterId } = useParams<{ classId: string; chapterId: string }>();

  let error: string | null = null;
  let bundle: ReturnType<typeof getQuizBundle> = null;
  let classNumber: number | null = null;
  let chapterNumber: number | null = null;

  if (!classId || !chapterId) {
    error = "Missing quiz details in the URL.";
  } else {
    const parsedClass = Number(classId);
    const parsedChapter = Number(chapterId);

    if (Number.isNaN(parsedClass) || Number.isNaN(parsedChapter)) {
      error = "Quiz path contains invalid values.";
    } else {
      classNumber = parsedClass;
      chapterNumber = parsedChapter;
      bundle = getQuizBundle(parsedClass, parsedChapter);
    }
  }

  // const footerDescription = "Keep testing your eco knowledge and level up by exploring more chapters.";

  // const renderFooter = () => <Footer description={footerDescription} />;

  if (error) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gradient-nature text-foreground">
          {error}
        </div>
        {/* {renderFooter()} */}
      </>
    );
  }

  if (!bundle) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gradient-nature text-foreground">
          Chapter not found
        </div>
        {/* {renderFooter()} */}
      </>
    );
  }

  return (
    <>
      <QuizComponent
        chapterTitle={bundle.title}
        questions={bundle.questions}
        pointsConfig={bundle.pointsConfig}
        classNumber={classNumber ?? undefined}
        chapterNumber={chapterNumber ?? undefined}
        onComplete={(score, points) => {
          console.log("Quiz finished:", { score, points });
          // TODO: award EcoPoints, navigate, etc.
        }}
      />
      {/* {renderFooter()} */}
    </>
  );
}
