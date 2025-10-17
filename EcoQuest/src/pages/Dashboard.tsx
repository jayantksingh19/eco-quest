import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import ProgressBar from "../components/ProgressBar";
import EcoBadge from "../components/EcoBadge";
import { 
  BookOpen, 
  Target, 
  Trophy, 
  Star, 
  ArrowRight, 
  Leaf,
  Zap,
  Clock,
  Users,
  AlertTriangle
} from "lucide-react";
import { Footer } from "../components/Navigation";
import { resourceRoute } from "../lib/resourceRoutes";
import useAuthSession from "../hooks/useAuthSession";
import type { StudentUser } from "../lib/auth";

const dashboardFooterSections = [
  {
    title: "Continue Learning",
    links: [
      { label: "Resume Classes", to: "/classes" },
      { label: "Today's Quiz", to: "/quiz/1/1" },
      { label: "Play a Game", to: "/game/1/1" },
      { label: "View Leaderboard", to: "/leaderboard" },
    ],
  },
  {
    title: "Earn More Points",
    links: [
      { label: "Submit Outdoor Task", to: "/submit-task" },
      { label: "Report a Hazard", to: "/report-hazard" },
      { label: "Weekly Challenge", href: "#weekly-challenge" },
      { label: "Teacher Tools", to: "/teacher" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: resourceRoute("help-centre") },
      { label: "Contact Coach", to: resourceRoute("contact") },
      { label: "Privacy Policy", to: resourceRoute("privacy-policy") },
      { label: "Terms of Service", to: resourceRoute("terms-of-service") },
    ],
  },
];

const Dashboard = () => {
  const { user: authUser } = useAuthSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authUser) {
      navigate("/auth", { replace: true });
      return;
    }

    if (authUser.role !== "student") {
      navigate("/teacher", { replace: true });
    }
  }, [authUser, navigate]);

  if (!authUser || authUser.role !== "student") {
    return null;
  }

  const studentUser = authUser as StudentUser;

  const defaultStats = {
    name: "Eco Explorer",
    ecoPoints: 245,
    level: 3,
    badges: ["bronze", "silver", "eco-warrior"],
    completedLessons: 12,
    totalLessons: 20,
    weeklyGoal: 5,
    completedThisWeek: 3,
  };

  const progressData = (studentUser.progress ?? {}) as Record<string, unknown>;

  const coerceNumber = (value: unknown, fallback: number) =>
    typeof value === "number" && Number.isFinite(value) ? value : fallback;

  const coerceStringArray = (value: unknown, fallback: string[]) =>
    Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : fallback;

  const user = {
    ...defaultStats,
    name: studentUser.name,
    ecoPoints: coerceNumber(progressData["ecoPoints"], defaultStats.ecoPoints),
    level: coerceNumber(progressData["level"], defaultStats.level),
    badges: coerceStringArray(progressData["badges"], defaultStats.badges),
  };

  const todaysTasks = [
    {
      id: 1,
      title: "Plant a sapling in your garden",
      points: 10,
      difficulty: "Easy",
      timeEstimate: "30 min"
    },
    {
      id: 2,
      title: "Segregate waste for a week",
      points: 25,
      difficulty: "Medium",
      timeEstimate: "Ongoing"
    },
    {
      id: 3,
      title: "Organize a community cleanup",
      points: 50,
      difficulty: "Hard",
      timeEstimate: "2-3 hours"
    },
    {
      id: 4,
      title: "Report a local environmental hazard",
      points: 25,
      difficulty: "Easy",
      timeEstimate: "5-10 min"
    }
  ];

  const recentAchievements = [
    { type: "lesson", title: "Completed Climate Change Basics", points: 15 },
    { type: "task", title: "Recycled 10kg of paper", points: 20 },
    { type: "badge", title: "Earned Eco-Warrior Badge", points: 50 }
  ];

  const footerDescription = "Stay on track with your eco goals, earn points, and explore new challenges.";

  return (
    <>
      <div className="min-h-screen bg-gradient-nature">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-eco mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Welcome, {user.name} 🌍
              </h1>
              <p className="text-muted-foreground">
                Ready to make a positive impact today? You're level {user.level} with {user.ecoPoints} EcoPoints!
              </p>
            </div>
            
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{user.ecoPoints}</div>
                <div className="text-sm text-muted-foreground">EcoPoints</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">Level {user.level}</div>
                <div className="text-sm text-muted-foreground">Eco Student</div>
              </div>
              <Button variant="eco" asChild>
                <a href="/report-hazard">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Report Hazard
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Section */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Your Learning Progress
              </h2>
              
              <div className="space-y-6">
                <div>
                  <ProgressBar
                    value={user.completedLessons}
                    max={user.totalLessons}
                    label="Lessons Completed"
                    variant="eco"
                    size="lg"
                  />
                </div>
                
                <div>
                  <ProgressBar
                    value={user.completedThisWeek}
                    max={user.weeklyGoal}
                    label="Weekly Goal"
                    variant="success"
                    size="md"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button variant="eco" className="flex-1">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Continue Learning
                </Button>
                <Button variant="outline" className="flex-1">
                  <Trophy className="h-4 w-4 mr-2" />
                  Take Quiz
                </Button>
              </div>
            </div>

            {/* Today's Tasks */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary" />
                Today's Eco Challenges
              </h2>
              
              <div className="space-y-4">
                {todaysTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="flex items-center justify-between p-4 bg-accent rounded-xl hover:bg-accent/80 transition-colors group cursor-pointer"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {task.title}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          {task.points} points
                        </span>
                        <span className="flex items-center">
                          <Zap className="h-3 w-3 mr-1" />
                          {task.difficulty}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {task.timeEstimate}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Star className="h-5 w-5 mr-2 text-primary" />
                Recent Achievements
              </h2>
              
              <div className="space-y-3">
                {recentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-accent rounded-lg">
                    <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-success-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{achievement.title}</p>
                      <p className="text-sm text-success">+{achievement.points} EcoPoints</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Badges Collection */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-primary" />
                Your Badges
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <EcoBadge 
                  type="bronze" 
                  title="First Steps" 
                  size="sm"
                  earned={true}
                />
                <EcoBadge 
                  type="silver" 
                  title="Learner" 
                  size="sm"
                  earned={true}
                />
                <EcoBadge 
                  type="eco-warrior" 
                  title="Eco Warrior" 
                  size="sm"
                  earned={true}
                />
                <EcoBadge 
                  type="gold" 
                  title="Leader" 
                  size="sm"
                  earned={false}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View All Quizzes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Trophy className="h-4 w-4 mr-2" />
                  See Leaderboard
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Join Study Group
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Submit Task
                </Button>
              </div>
            </div>

            {/* Weekly Challenge */}
        <div id="weekly-challenge" className="bg-gradient-eco rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Leaf className="h-5 w-5 mr-2" />
            Weekly Challenge
              </h3>
              <p className="text-white/90 mb-4 text-sm">
                Complete 5 eco-actions this week and earn a special "Week Warrior" badge!
              </p>
              <div className="bg-white/20 rounded-lg p-3 mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{user.completedThisWeek}/{user.weeklyGoal}</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(user.completedThisWeek / user.weeklyGoal) * 100}%` }}
                  />
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full border-white text-white hover:bg-white/10">
                Join Challenge
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer description={footerDescription} sections={dashboardFooterSections} />
    </>
  );
};

export default Dashboard;
