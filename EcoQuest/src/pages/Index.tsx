// Update this page (the content is just a fallback if you fail to update the page)
import { Footer } from "../components/Navigation";

const Index = () => {
  const footerDescription = "Explore EcoQuest's landing page to start learning about sustainability.";

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome to EcoQuest</h1>
          <p className="text-xl text-muted-foreground">Head back to the home page to continue your sustainability adventure.</p>
          <a href="/" className="inline-block rounded-lg bg-primary px-5 py-3 text-white font-semibold hover:bg-primary/90">
            Go to Landing Page
          </a>
        </div>
      </div>
      <Footer description={footerDescription} />
    </>
  );
};

export default Index;
