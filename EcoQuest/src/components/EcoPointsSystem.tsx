import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { 
  Trophy, 
  Star, 
  Target, 
  Gift,
  Award,
  Sparkles,
  Zap
} from "lucide-react";
import { useToast } from "../hooks/use-toast";

interface EcoPointsData {
  current_points: number;
  total_earned: number;
  level: string;
  next_level_points: number;
  badges: string[];
  certificates: string[];
}

interface RewardTier {
  name: string;
  points: number;
  icon: React.ComponentType<any>;
  color: string;
  rewards: string[];
}

const REWARD_TIERS: RewardTier[] = [
  {
    name: "Bronze Eco-Warrior",
    points: 250,
    icon: Award,
    color: "bg-amber-600",
    rewards: ["Printable certificate", "Digital badge", "Eco-tips newsletter"]
  },
  {
    name: "Silver Nature Guardian",
    points: 500,
    icon: Star,
    color: "bg-gray-400",
    rewards: ["Certificate", "Eco-stickers pack", "Plant care guide"]
  },
  {
    name: "Gold Environmental Hero",
    points: 1000,
    icon: Trophy,
    color: "bg-yellow-500",
    rewards: ["Certificate", "Eco-friendly toy/book", "School store coupon"]
  },
  {
    name: "Platinum Planet Saver",
    points: 2500,
    icon: Sparkles,
    color: "bg-purple-600",
    rewards: ["Certificate", "NGO field trip", "Group eco-adventure"]
  }
];

const EcoPointsSystem = () => {
  const [pointsData, setPointsData] = useState<EcoPointsData>({
    current_points: 0,
    total_earned: 0,
    level: "Beginner",
    next_level_points: 250,
    badges: [],
    certificates: []
  });
  const { toast } = useToast();

  const getCurrentTier = () => {
    return REWARD_TIERS.find(tier => pointsData.current_points < tier.points) || REWARD_TIERS[REWARD_TIERS.length - 1];
  };

  const getProgressToNextTier = () => {
    const currentTier = getCurrentTier();
    const previousTier = REWARD_TIERS[REWARD_TIERS.indexOf(currentTier) - 1];
    const previousPoints = previousTier ? previousTier.points : 0;
    const progress = ((pointsData.current_points - previousPoints) / (currentTier.points - previousPoints)) * 100;
    return Math.min(progress, 100);
  };

  const addPoints = (points: number, source: string) => {
    setPointsData(prev => ({
      ...prev,
      current_points: prev.current_points + points,
      total_earned: prev.total_earned + points
    }));

    toast({
      title: "🌱 EcoPoints Earned!",
      description: `+${points} points from ${source}`,
      className: "bg-success text-success-foreground"
    });

    // Check for tier advancement
    const newTier = REWARD_TIERS.find(tier => pointsData.current_points + points >= tier.points && pointsData.current_points < tier.points);
    if (newTier) {
      setTimeout(() => {
        toast({
          title: "🏆 Level Up!",
          description: `Congratulations! You've reached ${newTier.name}!`,
          className: "bg-warning text-warning-foreground"
        });
      }, 1000);
    }
  };

  const EcoPointsDisplay = () => (
    <Card className="p-6 bg-gradient-to-r from-success/10 to-primary/10 border-2 border-success/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-success rounded-full animate-glow-pulse">
            <Zap className="h-6 w-6 text-success-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">EcoPoints</h3>
            <p className="text-muted-foreground">Your environmental impact score</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-2xl font-bold px-4 py-2 animate-bounce-in">
          {pointsData.current_points}
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progress to {getCurrentTier().name}</span>
            <span>{pointsData.current_points}/{getCurrentTier().points}</span>
          </div>
          <Progress value={getProgressToNextTier()} className="h-3" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-card rounded-lg">
            <div className="text-lg font-bold text-primary">{pointsData.total_earned}</div>
            <div className="text-xs text-muted-foreground">Total Earned</div>
          </div>
          <div className="p-3 bg-card rounded-lg">
            <div className="text-lg font-bold text-secondary-accent">{pointsData.badges.length}</div>
            <div className="text-xs text-muted-foreground">Badges Earned</div>
          </div>
        </div>
      </div>
    </Card>
  );

  const RewardTiers = () => (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <Target className="h-5 w-5 mr-2 text-primary" />
        Reward Tiers
      </h3>
      
      <div className="space-y-4">
        {REWARD_TIERS.map((tier) => {
          const isUnlocked = pointsData.current_points >= tier.points;
          const isCurrent = getCurrentTier() === tier;
          const IconComponent = tier.icon;
          
          return (
            <div
              key={tier.name}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                isUnlocked 
                  ? 'border-success bg-success/5' 
                  : isCurrent 
                    ? 'border-primary bg-primary/5 scale-105' 
                    : 'border-border bg-card'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${tier.color} ${isUnlocked ? 'animate-glow-pulse' : ''}`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{tier.name}</h4>
                    <p className="text-sm text-muted-foreground">{tier.points} EcoPoints</p>
                  </div>
                </div>
                
                <div className="text-right">
                  {isUnlocked && (
                    <Badge variant="secondary" className="text-xs">
                      Unlocked!
                    </Badge>
                  )}
                  {isCurrent && !isUnlocked && (
                    <Badge variant="outline" className="text-xs animate-glow-pulse">
                      {tier.points - pointsData.current_points} to go
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="mt-3 ml-11">
                <ul className="text-sm text-muted-foreground space-y-1">
                  {tier.rewards.map((reward, i) => (
                    <li key={i} className="flex items-center">
                      <Gift className="h-3 w-3 mr-2 text-success" />
                      {reward}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );

  return {
    EcoPointsDisplay,
    RewardTiers,
    addPoints,
    pointsData
  };
};

export default EcoPointsSystem;
