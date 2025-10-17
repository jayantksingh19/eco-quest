import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Footer } from "../components/Navigation";
import { allResources } from "../lib/resourceRoutes";
import { cn } from "../lib/utils";

const Resources = () => {
  const navigate = useNavigate();
  const { resourceId } = useParams<{ resourceId?: string }>();

  useEffect(() => {
    if (!resourceId && allResources.length) {
      navigate(`/resources/${allResources[0].id}`, { replace: true });
    }
  }, [resourceId, navigate]);

  const resource = allResources.find((item) => item.id === resourceId);

  if (!resourceId && !resource) {
    return null;
  }

  const handleBack = () => navigate(-1);

  return (
    <>
      <div className="min-h-screen bg-gradient-nature">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack}>
              ← Back
            </Button>
            <span className="text-sm text-muted-foreground">EcoQuest Resources</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <Card className="p-4 h-[70vh]">
              <h2 className="text-lg font-semibold text-foreground mb-4">Browse Resources</h2>
              <ScrollArea className="h-[calc(100%-2rem)] pr-2">
                <nav className="space-y-2">
                  {allResources.map((item) => {
                    const isActive = item.id === resource?.id;
                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "eco" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          !isActive && "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => navigate(`/resources/${item.id}`)}
                      >
                        {item.title}
                      </Button>
                    );
                  })}
                </nav>
              </ScrollArea>
            </Card>

            <Card className="p-6 h-[70vh] flex flex-col">
              {resource ? (
                <div className="flex h-full flex-col">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-foreground">{resource.title}</h1>
                    <Button asChild variant="outline" size="sm">
                      <a href={resource.file} download>
                        Download (.docx)
                      </a>
                    </Button>
                  </div>
                  <ScrollArea className="flex-1 pr-2">
                    <div className="space-y-4 text-muted-foreground whitespace-pre-line pb-16">
                      {resource.body}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-16">
                  Selected resource could not be found.
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      <Footer
        description="Access EcoQuest policies, reports, and support documents in one place."
      />
    </>
  );
};

export default Resources;
