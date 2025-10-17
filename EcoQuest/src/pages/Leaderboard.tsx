import { useState } from "react";
import { Button } from "../components/ui/button";
import EcoBadge from "../components/EcoBadge";
import {
  Trophy,
  Crown,
  Medal,
  Star,
  Users,
  School,
  Globe,
  MessageCircle,
  Send,
  Smartphone,
  Mail,
  Copy as CopyIcon,
} from "lucide-react";
import { Footer } from "../components/Navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { resourceRoute } from "../lib/resourceRoutes";
import { useToast } from "../hooks/use-toast";

const leaderboardFooterSections = (
  onInviteClick: () => void,
) => [
  {
    title: "Compete",
    links: [
      { label: "Join EcoQuest", to: "/auth" },
      { label: "View Dashboard", to: "/dashboard" },
      { label: "Set Weekly Goals", to: "/dashboard#weekly-challenge" },
      { label: "Teacher Challenges", to: "/teacher" },
    ],
  },
  {
    title: "Climb the Ranks",
    links: [
      { label: "Complete Classes", to: "/classes" },
      { label: "Submit Outdoor Task", to: "/submit-task" },
      { label: "Report Hazard", to: "/report-hazard" },
      { label: "Invite Friends", onClick: onInviteClick },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: resourceRoute("help-centre") },
      { label: "Community Blog", to: resourceRoute("blog") },
      { label: "Privacy Policy", to: resourceRoute("privacy-policy") },
      { label: "Terms of Service", to: resourceRoute("terms-of-service") },
    ],
  },
];

const Leaderboard = () => {
  const [activeFilter, setActiveFilter] = useState("global");
  const [isShareOpen, setShareOpen] = useState(false);
  const { toast } = useToast();

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/leaderboard`
      : "https://ecoquest.org/leaderboard";
  const shareMessage =
    "Join me on EcoQuest to climb the environmental action leaderboard! Let's make a real impact together.";
  const shareMessageWithUrl = `${shareMessage} ${shareUrl}`;

  const openShareLink = (url: string, target: string = "_blank") => {
    window.open(url, target, "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareMessageWithUrl);
      toast({
        title: "Link copied",
        description: "Share link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "We couldn't copy the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filters = [
    { id: "school", label: "School Level", icon: School },
    { id: "college", label: "College Level", icon: Users },
    { id: "global", label: "Global", icon: Globe }
  ];

  const leaderboardData = [
    {
      rank: 1,
      name: "Alex Thompson",
      points: 1250,
      badges: ["gold", "eco-warrior", "platinum"],
      school: "Green Valley High",
      level: 8,
      completedTasks: 45
    },
    {
      rank: 2,
      name: "Maria Rodriguez",
      points: 1180,
      badges: ["gold", "eco-warrior", "silver"],
      school: "Riverside College",
      level: 7,
      completedTasks: 42
    },
    {
      rank: 3,
      name: "David Kim",
      points: 1095,
      badges: ["silver", "eco-warrior", "bronze"],
      school: "Oakwood Academy",
      level: 7,
      completedTasks: 38
    },
    {
      rank: 4,
      name: "Sarah Chen",
      points: 985,
      badges: ["silver", "bronze"],
      school: "Pine Creek School",
      level: 6,
      completedTasks: 35
    },
    {
      rank: 5,
      name: "Emma Wilson",
      points: 920,
      badges: ["bronze", "silver"],
      school: "Mountain View High",
      level: 5,
      completedTasks: 32
    },
    {
      rank: 6,
      name: "James Garcia",
      points: 875,
      badges: ["bronze"],
      school: "Sunset Academy",
      level: 5,
      completedTasks: 29
    },
    {
      rank: 7,
      name: "Lisa Chang",
      points: 820,
      badges: ["bronze"],
      school: "Green Valley High",
      level: 4,
      completedTasks: 27
    },
    {
      rank: 8,
      name: "Michael Brown",
      points: 765,
      badges: ["bronze"],
      school: "Riverside College",
      level: 4,
      completedTasks: 24
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-warning" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-orange-600" />;
      default:
        return <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</div>;
    }
  };

  const getRankBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-warning/20 to-warning/10 border-warning/30";
      case 2:
        return "bg-gradient-to-r from-gray-200/50 to-gray-100/30 border-gray-300/50";
      case 3:
        return "bg-gradient-to-r from-orange-200/50 to-orange-100/30 border-orange-300/50";
      default:
        return "bg-card border-border";
    }
  };

  const footerDescription = "Celebrate eco achievements, climb the ranks, and motivate others to join your mission.";

  return (
    <>
    <div className="min-h-screen bg-gradient-nature">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-foreground flex items-center justify-center">
            <Trophy className="h-10 w-10 mr-3 text-primary" />
            EcoQuest Leaderboard
          </h1>
          <p className="text-xl text-muted-foreground">
            See how you rank among eco-champions worldwide!
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "eco" : "outline"}
              onClick={() => setActiveFilter(filter.id)}
              className="flex items-center space-x-2"
            >
              <filter.icon className="h-4 w-4" />
              <span>{filter.label}</span>
            </Button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* 2nd Place */}
          <div className="order-1 md:order-1">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-soft text-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Medal className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <h3 className="font-bold text-lg text-foreground">{leaderboardData[1].name}</h3>
              <p className="text-muted-foreground text-sm">{leaderboardData[1].school}</p>
              <div className="text-2xl font-bold text-primary mt-2">{leaderboardData[1].points}</div>
              <div className="text-sm text-muted-foreground">EcoPoints</div>
            </div>
          </div>

          {/* 1st Place */}
          <div className="order-2 md:order-2">
            <div className="bg-gradient-to-br from-warning/20 to-warning/10 border-2 border-warning/30 rounded-2xl p-6 shadow-eco text-center transform md:scale-110">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-gradient-eco rounded-full mx-auto mb-2 flex items-center justify-center animate-glow-pulse">
                  <Crown className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 bg-warning text-warning-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                  1
                </div>
              </div>
              <h3 className="font-bold text-xl text-foreground">{leaderboardData[0].name}</h3>
              <p className="text-muted-foreground">{leaderboardData[0].school}</p>
              <div className="text-3xl font-bold text-primary mt-2">{leaderboardData[0].points}</div>
              <div className="text-muted-foreground">EcoPoints</div>
              <div className="mt-4">
                <div className="inline-flex items-center space-x-1 bg-success/20 text-success px-3 py-1 rounded-full text-sm font-medium">
                  <Star className="h-3 w-3" />
                  <span>Eco Champion</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="order-3 md:order-3">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-soft text-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Medal className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <h3 className="font-bold text-lg text-foreground">{leaderboardData[2].name}</h3>
              <p className="text-muted-foreground text-sm">{leaderboardData[2].school}</p>
              <div className="text-2xl font-bold text-primary mt-2">{leaderboardData[2].points}</div>
              <div className="text-sm text-muted-foreground">EcoPoints</div>
            </div>
          </div>
        </div>

        {/* Full Leaderboard */}
        <div className="bg-card border border-border rounded-2xl shadow-soft overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-bold text-foreground flex items-center">
              <Trophy className="h-6 w-6 mr-2 text-primary" />
              Complete Rankings
            </h2>
          </div>

          <div className="divide-y divide-border">
            {leaderboardData.map((student) => (
              <div 
                key={student.rank}
                className={`p-6 hover:bg-accent/50 transition-colors ${getRankBackground(student.rank)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(student.rank)}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{student.name}</h3>
                      <p className="text-muted-foreground text-sm">{student.school}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <span>Level {student.level}</span>
                        <span>•</span>
                        <span>{student.completedTasks} tasks completed</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    {/* Badges */}
                    <div className="hidden md:flex items-center space-x-2">
                      {student.badges.slice(0, 3).map((badge, badgeIndex) => (
                        <EcoBadge
                          key={badgeIndex}
                          type={badge as any}
                          title=""
                          size="sm"
                          earned={true}
                        />
                      ))}
                      {student.badges.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{student.badges.length - 3} more
                        </div>
                      )}
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{student.points}</div>
                      <div className="text-sm text-muted-foreground">EcoPoints</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Rank Card */}
        <div className="mt-8 bg-gradient-eco rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Current Rank</h3>
              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold">#4</div>
                <div>
                  <div className="font-medium">Sarah Chen</div>
                  <div className="text-white/80 text-sm">985 EcoPoints • Level 6</div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-white/80 mb-1">Next Rank</div>
              <div className="text-lg font-semibold">110 points to go</div>
              <Button variant="outline" size="sm" className="mt-2 border-white text-white hover:bg-white/10">
                View Progress
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer description={footerDescription} sections={leaderboardFooterSections(() => setShareOpen(true))} />
    <Dialog open={isShareOpen} onOpenChange={setShareOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Friends</DialogTitle>
          <DialogDescription>
            Share EcoQuest with your friends using your favourite app.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          <Button
            variant="outline"
            onClick={() =>
              openShareLink(
                `https://wa.me/?text=${encodeURIComponent(shareMessageWithUrl)}`
              )
            }
          >
            <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              openShareLink(
                `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareMessage)}`
              )
            }
          >
            <Send className="mr-2 h-4 w-4" /> Telegram
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              openShareLink(`sms:&body=${encodeURIComponent(shareMessageWithUrl)}`, "_self")
            }
          >
            <Smartphone className="mr-2 h-4 w-4" /> Messages
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              openShareLink(
                `mailto:?subject=${encodeURIComponent("Join EcoQuest")}&body=${encodeURIComponent(shareMessageWithUrl)}`,
                "_self"
              )
            }
          >
            <Mail className="mr-2 h-4 w-4" /> Email
          </Button>
        </div>
        <Button variant="ghost" onClick={handleCopyLink}>
          <CopyIcon className="mr-2 h-4 w-4" /> Copy Share Link
        </Button>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default Leaderboard;
