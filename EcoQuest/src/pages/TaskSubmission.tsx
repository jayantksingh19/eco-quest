import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import { 
  Upload, 
  Camera, 
  FileText, 
  Star, 
  Clock, 
  Zap,
  CheckCircle,
  ArrowLeft,
  Leaf,
  Info,
  Lock
} from "lucide-react";
import { Footer } from "../components/Navigation";
import { resourceRoute } from "../lib/resourceRoutes";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/ui/tooltip";
import { apiFetch, ApiError } from "../lib/apiClient";
import useAuthSession from "../hooks/useAuthSession";
import { ECO_TASKS, type EcoTask } from "../data/ecoTasks";
import { cn } from "../lib/utils";

const taskFooterSections = [
  {
    title: "Keep Completing",
    links: [
      { label: "Find New Tasks", to: "/outdoor-task/1/1" },
      { label: "View Leaderboard", to: "/leaderboard" },
      { label: "Return to Dashboard", to: "/dashboard" },
      { label: "Track Classes", to: "/classes" },
    ],
  },
  {
    title: "Stay Safe",
    links: [
      { label: "Report Hazard", to: "/report-hazard" },
      { label: "Teachers' Guide", to: resourceRoute("teachers-guide") },
      { label: "Learn More", to: resourceRoute("learn-more") },
      { label: "Contact Team", to: resourceRoute("contact") },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: resourceRoute("help-centre") },
      { label: "Impact Report", to: resourceRoute("impact-report") },
      { label: "Privacy Policy", to: resourceRoute("privacy-policy") },
      { label: "Terms of Service", to: resourceRoute("terms-of-service") },
    ],
  },
];

const TaskSubmission = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number>(ECO_TASKS[0]?.id ?? 1);
  const [completedTaskIds, setCompletedTaskIds] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = window.localStorage.getItem("ecoquest_task_completed");
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.map(Number).filter((value) => !Number.isNaN(value)) : [];
    } catch (error) {
      console.warn("Failed to parse task completion history", error);
      return [];
    }
  });
  const { toast } = useToast();
  const { user } = useAuthSession();

  const isLevelUnlocked = (level: number, completed: number[] = completedTaskIds) => {
    if (level === 1) return true;
    return ECO_TASKS.filter((task) => task.level < level).every((task) => completed.includes(task.id));
  };

  const activeTask: EcoTask =
    ECO_TASKS.find((task) => task.id === selectedTaskId && isLevelUnlocked(task.level)) ??
    ECO_TASKS.find((task) => isLevelUnlocked(task.level)) ??
    ECO_TASKS[0];

  const submissionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("ecoquest_task_completed", JSON.stringify(completedTaskIds));
  }, [completedTaskIds]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    const needsFallback =
      !isLevelUnlocked(activeTask.level) || completedTaskIds.includes(activeTask.id);

    if (!needsFallback) return;

    const fallback =
      ECO_TASKS.find(
        (task) =>
          !completedTaskIds.includes(task.id) && isLevelUnlocked(task.level)
      ) ?? ECO_TASKS.find((task) => isLevelUnlocked(task.level));

    if (fallback && fallback.id !== selectedTaskId) {
      setSelectedTaskId(fallback.id);
      setTimeout(() => {
        submissionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
  }, [completedTaskIds, activeTask.id, activeTask.level, selectedTaskId]);

  const handleSelectTask = (task: EcoTask) => {
    if (!isLevelUnlocked(task.level)) {
      toast({
        title: "Level locked",
        description: "Complete the previous tasks to unlock this level.",
        variant: "destructive",
      });
      return;
    }

    submissionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    if (task.id === selectedTaskId) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedTaskId(task.id);
    setSelectedFile(null);
    setPreviewUrl(null);
    setDescription("");
    setLocation("");
    setDriveLink("");
  };

  const tasksByLevel = useMemo(() => {
    const map = new Map<number, EcoTask[]>();
    ECO_TASKS.forEach((task) => {
      const group = map.get(task.level) ?? [];
      group.push(task);
      map.set(task.level, group);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      event.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!user?.email) {
      toast({
        title: "Login required",
        description: "Please sign in to submit your task.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedFile) {
      toast({
        title: "Missing information",
        description: "Please upload a photo of your planting activity.",
        variant: "destructive"
      });
      return;
    }

    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      toast({
        title: "Description required",
        description: "Share what you did and where you did it.",
        variant: "destructive",
      });
      return;
    }

    if (!location.trim()) {
      toast({
        title: "Location required",
        description: "Let us know where you completed the task.",
        variant: "destructive",
      });
      return;
    }

    const normalizedDriveLink = driveLink.trim();
    if (!normalizedDriveLink) {
      toast({
        title: "Drive link required",
        description: "Please paste the public link to your planting video.",
        variant: "destructive",
      });
      return;
    }

    if (!/^https?:\/\//i.test(normalizedDriveLink)) {
      toast({
        title: "Invalid link",
        description: "Drive link should start with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const slugify = (value: string) =>
        value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") || "ecoquest";

      const extension = selectedFile.name.includes(".")
        ? `.${selectedFile.name.split(".").pop()}`
        : "";
      const renamedFile = new File(
        [selectedFile],
        `${slugify(user?.name ?? "ecoquest")}-task-${activeTask.id}-done${extension}`,
        { type: selectedFile.type }
      );

      const formPayload = new FormData();
      formPayload.append("taskTitle", activeTask.title);
      formPayload.append("taskId", String(activeTask.id));
      formPayload.append("points", String(activeTask.points));
      formPayload.append("description", trimmedDescription);
      formPayload.append("location", location.trim());
      formPayload.append("driveLink", normalizedDriveLink);
      formPayload.append("reporterName", user?.name ?? "");
      formPayload.append("reporterEmail", user?.email ?? "");
      if (user?.id) {
        formPayload.append("reporterId", user.id);
      }
      if (user?.role) {
        formPayload.append(
          "reporterRole",
          user.role === "teacher" ? "Teacher" : user.role === "student" ? "Student" : ""
        );
      }
      formPayload.append("photo", renamedFile);

      const response = await apiFetch<{ message: string; reference: string }>(
        "/tasks/submissions",
        {
          method: "POST",
          body: formPayload,
        }
      );

      toast({
        title: "Task submitted successfully! 🌱",
        description: `Reference: ${response.reference}. You've earned ${activeTask.points} EcoPoints!`,
      });

      let nextTaskId: number | null = null;
      setCompletedTaskIds((prev) => {
        if (prev.includes(activeTask.id)) return prev;
        const updated = [...prev, activeTask.id];
        const nextTask = ECO_TASKS.find(
          (task) => !updated.includes(task.id) && isLevelUnlocked(task.level, updated)
        );
        if (nextTask) {
          nextTaskId = nextTask.id;
        }
        return updated;
      });

      if (nextTaskId) {
        setSelectedTaskId(nextTaskId);
        setTimeout(() => {
          submissionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(null);
      setPreviewUrl(null);
      setDescription("");
      setLocation("");
      setDriveLink("");
    } catch (error) {
      const description = error instanceof ApiError
        ? error.data?.message ?? error.message
        : "Failed to submit task. Please try again.";

      toast({
        title: "Submission failed",
        description,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerDescription = "Submit proof of your eco-actions, earn points, and inspire others to take part.";

  return (
    <>
      <div className="min-h-screen bg-gradient-nature">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Task Selector */}
        <Card className="p-6 mb-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Choose Your Task</h2>
            <p className="text-sm text-muted-foreground">
              Complete both tasks in a level to unlock the next one.
            </p>
          </div>

          <div className="space-y-6">
            {tasksByLevel.map(([level, tasks]) => {
              const unlocked = isLevelUnlocked(level);
              const levelCompleted = tasks.every((task) => completedTaskIds.includes(task.id));

              return (
                <div key={level} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-primary/80">Level {level}</p>
                      <p className="text-sm text-muted-foreground">
                        {unlocked
                          ? levelCompleted
                            ? "Level completed!"
                            : "Select a task to get started."
                          : "Complete previous levels to unlock."}
                      </p>
                    </div>
                    {levelCompleted ? (
                      <span className="flex items-center gap-1 text-success text-sm">
                        <CheckCircle className="h-4 w-4" /> Completed
                      </span>
                    ) : !unlocked ? (
                      <span className="flex items-center gap-1 text-muted-foreground text-sm">
                        <Lock className="h-4 w-4" /> Locked
                      </span>
                    ) : (
                      <span className="text-primary text-sm">Unlocked</span>
                    )}
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {tasks.map((task) => {
                      const completed = completedTaskIds.includes(task.id);
                      const selected = task.id === activeTask.id;
                      const disabled = !isLevelUnlocked(task.level);

                      return (
                        <button
                          key={task.id}
                          type="button"
                          onClick={() => handleSelectTask(task)}
                          disabled={disabled}
                          className={cn(
                            "text-left border rounded-xl p-4 transition focus:outline-none",
                            selected
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/60",
                            disabled && "opacity-60 cursor-not-allowed"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <h3 className="text-sm font-semibold text-foreground">{task.title}</h3>
                            {completed ? (
                              <span className="text-success text-xs uppercase font-semibold">Done</span>
                            ) : selected ? (
                              <span className="text-primary text-xs uppercase font-semibold">Selected</span>
                            ) : null}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                            {task.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase text-muted-foreground">
                            <span>Points: {task.points}</span>
                            <span>Difficulty: {task.difficulty}</span>
                            <span>Time: {task.timeEstimate}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Task Header */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-eco mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                {activeTask.title}
              </h1>
              <p className="text-muted-foreground text-lg">
                {activeTask.description}
              </p>
            </div>
            <div className="ml-6 text-center">
              <div className="p-3 bg-gradient-eco rounded-full mb-2">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <div className="text-lg font-bold text-primary">{activeTask.points} pts</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>{activeTask.difficulty}</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{activeTask.timeEstimate}</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Star className="h-4 w-4" />
              <span>{activeTask.points} EcoPoints</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submission Form */}
          <div className="space-y-6" ref={submissionRef}>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Upload className="h-5 w-5 mr-2 text-primary" />
                Submit Your Proof
              </h2>

              {/* File Upload */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Upload Photo Evidence<span className="text-destructive">*</span>
                  </label>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Selected proof"
                          className="h-28 w-full max-w-xs rounded-lg object-cover mb-3"
                        />
                      ) : (
                        <>
                          <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">Click to upload a photo or drag and drop</p>
                          <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                        </>
                      )}
                      {selectedFile ? (
                        <p className="mt-2 text-sm text-primary font-medium">{selectedFile.name}</p>
                      ) : null}
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description of Your Action<span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    placeholder="Describe what you did, where you did it, and any challenges you faced..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px]"
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Location<span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="e.g., Community Park, Downtown Area"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    required
                  />
                </div>

                {/* Drive Link */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      Google Drive Link <span className="text-destructive">*</span>
                    </label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="text-muted-foreground hover:text-primary">
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-sm">
                        Upload your planting video to Google Drive, set the file to “Anyone with the link can view”, and paste the shareable link here.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    placeholder="https://drive.google.com/..."
                    value={driveLink}
                    onChange={(event) => setDriveLink(event.target.value)}
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  variant="eco" 
                  size="lg" 
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Submit Task & Earn {activeTask.points} Points
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Task Guidelines */}
          <div className="space-y-6">
            {/* Requirements */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Task Requirements
              </h3>
              <ul className="space-y-3">
                {activeTask.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-xs font-semibold text-primary">{index + 1}</span>
                    </div>
                    <span className="text-muted-foreground">{requirement}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Tips */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-warning" />
                Helpful Tips
              </h3>
              <ul className="space-y-3">
                {activeTask.tips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Star className="h-4 w-4 text-warning mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Rewards Preview */}
            <Card className="p-6 bg-gradient-eco text-white">
              <h3 className="text-lg font-semibold mb-3">
                Completion Rewards
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>EcoPoints</span>
                  <span className="font-semibold">+{activeTask.points}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Experience</span>
                  <span className="font-semibold">+5 XP</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Progress towards badges</span>
                  <span className="font-semibold">+1 Action</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
    <Footer description={footerDescription} sections={taskFooterSections} />
    </>
  );
};

export default TaskSubmission;
