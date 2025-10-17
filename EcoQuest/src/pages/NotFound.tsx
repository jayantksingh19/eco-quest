import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Footer } from "../components/Navigation";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const footerDescription = "The page you requested couldn't be found. Explore EcoQuest resources to get back on track.";

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-16">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <p className="text-xl text-gray-600">Oops! The page you're looking for has sprouted legs and wandered off.</p>
          <a href="/" className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow hover:bg-primary/90">
            Return to Home
          </a>
        </div>
      </div>
      <Footer description={footerDescription} />
    </>
  );
};

export default NotFound;
