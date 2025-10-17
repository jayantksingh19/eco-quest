import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import EcoCard from "../components/EcoCard";
import ProgressBar from "../components/ProgressBar";
import { 
  Users,  
  Trophy, 
  CheckCircle, 
  Clock, 
  BarChart3,
  Download,
  Plus,
  Eye,
  MessageSquare,
  Award,
  TrendingUp
} from "lucide-react";
import { Footer } from "../components/Navigation";
import { resourceRoute } from "../lib/resourceRoutes";
import useAuthSession from "../hooks/useAuthSession";
import type { StudentSummary, TeacherUser } from "../lib/auth";

const teacherFooterSections = [
  {
    title: "Manage Classes",
    links: [
      { label: "View All Classes", to: "/classes" },
      { label: "Student Dashboard", to: "/dashboard" },
      { label: "Review Submissions", to: "/submit-task" },
      { label: "Report Hazards", to: "/report-hazard" },
    ],
  },
  {
    title: "Engage Students",
    links: [
      { label: "Start a Challenge", to: "/dashboard#weekly-challenge" },
      { label: "Assign Outdoor Task", to: "/outdoor-task/1/1" },
      { label: "Track Leaderboard", to: "/leaderboard" },
      { label: "Invite NGOs", href: "mailto:partners@ecoquest.org" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Teacher Guides", to: resourceRoute("teachers-guide") },
      { label: "Help Center", to: resourceRoute("help-centre") },
      { label: "Privacy Policy", to: resourceRoute("privacy-policy") },
      { label: "Terms of Service", to: resourceRoute("terms-of-service") },
    ],
  },
];

const TeacherDashboard = () => {
  const { user: authUser, students: sessionStudents } = useAuthSession();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!authUser) {
      navigate("/auth", { replace: true });
      return;
    }

    if (authUser.role !== "teacher") {
      navigate("/dashboard", { replace: true });
    }
  }, [authUser, navigate]);

  if (!authUser || authUser.role !== "teacher") {
    return null;
  }

  const teacherUser = authUser as TeacherUser;
  const students: StudentSummary[] = sessionStudents ?? [];

  const defaultClassStats = {
    totalStudents: 32,
    activeStudents: 28,
    completedTasks: 156,
    totalPoints: 12450,
    averageProgress: 78
  };

  const classStats = {
    ...defaultClassStats,
    totalStudents: students.length || defaultClassStats.totalStudents,
    activeStudents: students.length || defaultClassStats.activeStudents,
  };

  const pendingSubmissions = [
    {
      id: 1,
      student: "Alex Thompson",
      task: "Plant a sapling",
      submittedAt: "2 hours ago",
      points: 15,
      status: "pending"
    },
    {
      id: 2,
      student: "Sarah Chen",
      task: "Waste segregation project",
      submittedAt: "4 hours ago",
      points: 25,
      status: "pending"
    },
    {
      id: 3,
      student: "David Kim",
      task: "Community cleanup",
      submittedAt: "1 day ago",
      points: 50,
      status: "pending"
    }
  ];

  const defaultTopPerformers = [
    { name: "Alex Thompson", points: 245, tasks: 12, rank: 1, grade: undefined, email: undefined },
    { name: "Maria Rodriguez", points: 230, tasks: 11, rank: 2, grade: undefined, email: undefined },
    { name: "David Kim", points: 215, tasks: 10, rank: 3, grade: undefined, email: undefined },
    { name: "Sarah Chen", points: 200, tasks: 9, rank: 4, grade: undefined, email: undefined },
    { name: "Emma Wilson", points: 185, tasks: 8, rank: 5, grade: undefined, email: undefined }
  ];

  const toNumber = (value: unknown, fallback: number) =>
    typeof value === "number" && Number.isFinite(value) ? value : fallback;

  const topPerformers = students.length
    ? students.map((student, index) => {
        const progress = (student.progress ?? {}) as Record<string, unknown>;
        return {
          name: student.name,
          points: toNumber(progress["ecoPoints"], 0),
          tasks: toNumber(progress["tasksCompleted"], 0),
          rank: index + 1,
          grade: student.grade,
          email: student.email,
        };
      })
    : defaultTopPerformers;

  const weeklyProgress = [
    { week: "Week 1", completed: 15, total: 20 },
    { week: "Week 2", completed: 18, total: 20 },
    { week: "Week 3", completed: 22, total: 25 },
    { week: "Week 4", completed: 20, total: 25 }
  ];

  const footerDescription = "Guide your classes, verify submissions, and amplify environmental impact.";

  return (
    <>
      <div className="min-h-screen bg-gradient-nature">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-eco mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {teacherUser.name}! 📚
              </h1>
              <p className="text-muted-foreground">
                Monitor student progress and manage eco-challenges for {teacherUser.school?.name ?? "your school"}
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="eco">
                <Plus className="h-4 w-4 mr-2" />
                Create Challenge
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <EcoCard
                icon={Users}
                title="Active Students"
                description={`${classStats.activeStudents}/${classStats.totalStudents} engaged`}
                variant="compact"
              />
              <EcoCard
                icon={CheckCircle}
                title="Tasks Completed"
                description={`${classStats.completedTasks} total submissions`}
                variant="compact"
              />
              <EcoCard
                icon={Trophy}
                title="Class Points"
                description={`${classStats.totalPoints.toLocaleString()} EcoPoints earned`}
                variant="compact"
              />
              <EcoCard
                icon={TrendingUp}
                title="Average Progress"
                description={`${classStats.averageProgress}% completion rate`}
                variant="compact"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Submissions */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    Pending Reviews
                  </h3>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
                <div className="space-y-3">
                  {pendingSubmissions.slice(0, 3).map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{submission.student}</p>
                        <p className="text-sm text-muted-foreground">{submission.task}</p>
                        <p className="text-xs text-muted-foreground">{submission.submittedAt}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-primary">+{submission.points} pts</span>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Top Performers */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Top Performers
                </h3>
                <div className="space-y-3">
                  {topPerformers.slice(0, 5).map((student) => (
                    <div key={student.rank} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">#{student.rank}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.tasks} tasks completed</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{student.points}</p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Weekly Progress */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Weekly Progress Overview
              </h3>
              <div className="space-y-4">
                {weeklyProgress.map((week, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground">{week.week}</span>
                      <span className="text-muted-foreground">{week.completed}/{week.total} tasks</span>
                    </div>
                    <ProgressBar
                      value={week.completed}
                      max={week.total}
                      variant="eco"
                      showValue={false}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
              <h2 className="text-xl font-semibold mb-6">Student Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topPerformers.map((student) => (
                  <Card key={student.rank} className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-eco rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{student.name}</h4>
                      <p className="text-sm text-muted-foreground">Rank #{student.rank}</p>
                      {student.grade && (
                        <p className="text-xs text-muted-foreground">Grade {student.grade}</p>
                      )}
                      {student.email && (
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      )}
                    </div>
                  </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>EcoPoints:</span>
                        <span className="font-medium text-primary">{student.points}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tasks:</span>
                        <span className="font-medium">{student.tasks}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      View Profile
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
              <h2 className="text-xl font-semibold mb-6">Task Submissions</h2>
              <div className="space-y-4">
                {pendingSubmissions.map((submission) => (
                  <div key={submission.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-foreground">{submission.student}</h4>
                        <p className="text-muted-foreground">{submission.task}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{submission.submittedAt}</p>
                        <p className="font-medium text-primary">+{submission.points} points</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="eco" size="sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Comment
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Daily Active Students</span>
                      <span>87%</span>
                    </div>
                    <ProgressBar value={87} variant="eco" showValue={false} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Task Completion Rate</span>
                      <span>78%</span>
                    </div>
                    <ProgressBar value={78} variant="success" showValue={false} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Session Time</span>
                      <span>25 min</span>
                    </div>
                    <ProgressBar value={65} variant="default" showValue={false} />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Impact Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Trees Planted</span>
                    <span className="text-xl font-bold text-success">47</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Waste Recycled</span>
                    <span className="text-xl font-bold text-primary">156kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Community Actions</span>
                    <span className="text-xl font-bold text-warning">23</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    <Footer description={footerDescription} sections={teacherFooterSections} />
    </>
  );
};

export default TeacherDashboard;
