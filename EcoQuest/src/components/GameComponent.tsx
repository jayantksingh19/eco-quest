import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  Gamepad2, 
  Play,
  RotateCcw,
  Trophy,
  Star,
  Target,
  Timer,
  Zap
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import type { Game } from "../data/environmentCurriculum";

interface GameComponentProps {
  game: Game;
  onComplete: (pointsEarned: number) => void;
}

interface DragItem {
  id: string;
  content: string;
  category: string;
  x: number;
  y: number;
  isDragging: boolean;
}

interface DropZone {
  id: string;
  label: string;
  category: string;
  items: string[];
}

const GameComponent = ({ game, onComplete }: GameComponentProps) => {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'completed' | 'failed'>('ready');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [dragItems, setDragItems] = useState<DragItem[]>([]);
  const [dropZones, setDropZones] = useState<DropZone[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize game based on type
  useEffect(() => {
    initializeGame();
  }, [game]);

  const initializeGame = () => {
    switch (game.type) {
      case 'sorting':
        initializeSortingGame();
        break;
      case 'catch':
        initializeCatchGame();
        break;
      case 'simulation':
        initializeSimulationGame();
        break;
      case 'puzzle':
        initializePuzzleGame();
        break;
      case 'choice':
        initializeChoiceGame();
        break;
      default:
        initializeSortingGame();
    }
  };

  const initializeSortingGame = () => {
    if (game.title.includes('Garbage') || game.title.includes('Waste')) {
      setDragItems([
        { id: '1', content: '🍌 Banana Peel', category: 'compost', x: 50, y: 50, isDragging: false },
        { id: '2', content: '🥤 Plastic Bottle', category: 'recycle', x: 150, y: 50, isDragging: false },
        { id: '3', content: '📰 Newspaper', category: 'recycle', x: 250, y: 50, isDragging: false },
        { id: '4', content: '🍎 Apple Core', category: 'compost', x: 350, y: 50, isDragging: false },
        { id: '5', content: '🗑️ Dirty Diaper', category: 'trash', x: 450, y: 50, isDragging: false },
        { id: '6', content: '📱 Old Phone', category: 'recycle', x: 150, y: 150, isDragging: false },
      ]);
      
      setDropZones([
        { id: 'compost', label: '🌱 Compost Bin', category: 'compost', items: [] },
        { id: 'recycle', label: '♻️ Recycle Bin', category: 'recycle', items: [] },
        { id: 'trash', label: '🗑️ Trash Bin', category: 'trash', items: [] },
      ]);
    } else if (game.title.includes('Food')) {
      setDragItems([
        { id: '1', content: '🌾 Grain', category: 'cow', x: 50, y: 50, isDragging: false },
        { id: '2', content: '🐟 Fish', category: 'cat', x: 150, y: 50, isDragging: false },
        { id: '3', content: '🥩 Meat', category: 'lion', x: 250, y: 50, isDragging: false },
        { id: '4', content: '🥛 Milk', category: 'cat', x: 350, y: 50, isDragging: false },
        { id: '5', content: '🌱 Grass', category: 'cow', x: 450, y: 50, isDragging: false },
      ]);
      
      setDropZones([
        { id: 'cow', label: '🐄 Cow', category: 'cow', items: [] },
        { id: 'cat', label: '🐱 Cat', category: 'cat', items: [] },
        { id: 'lion', label: '🦁 Lion', category: 'lion', items: [] },
      ]);
    }
  };

  const initializeCatchGame = () => {
    // Set up catch game (simplified for this implementation)
    setScore(0);
    setTimeLeft(60); // 60 seconds
  };

  const initializeSimulationGame = () => {
    // Set up simulation game
    setScore(0);
  };

  const initializePuzzleGame = () => {
    // Set up puzzle game
    setScore(0);
  };

  const initializeChoiceGame = () => {
    // Set up choice-based game
    setScore(0);
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    
    if (game.type === 'catch') {
      setTimeLeft(60);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const endGame = () => {
    const success = score >= getRequiredScore();
    setGameState(success ? 'completed' : 'failed');
    
    if (success) {
      onComplete(game.points);
      toast({
        title: "🎮 Game Complete!",
        description: `Awesome! You earned ${game.points} EcoPoints!`,
        className: "bg-success text-success-foreground"
      });
    } else {
      toast({
        title: "Try Again!",
        description: "Don't give up! Practice makes perfect.",
        className: "bg-warning text-warning-foreground"
      });
    }
  };

  const getRequiredScore = () => {
    switch (game.type) {
      case 'sorting':
        return Math.ceil(dragItems.length * 0.7); // 70% correct
      case 'catch':
        return 50; // Catch 50 items
      default:
        return 3;
    }
  };

  const handleDrop = (dropZoneId: string, itemId: string) => {
    const item = dragItems.find(i => i.id === itemId);
    const zone = dropZones.find(z => z.id === dropZoneId);
    
    if (!item || !zone) return;

    const isCorrect = item.category === zone.category;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setDropZones(prev => prev.map(z => 
        z.id === dropZoneId 
          ? { ...z, items: [...z.items, item.content] }
          : z
      ));
      setDragItems(prev => prev.filter(i => i.id !== itemId));
      
      toast({
        title: "✅ Correct!",
        description: "Great sorting!",
        className: "bg-success text-success-foreground"
      });
      
      // Check if game is complete
      if (dragItems.length === 1) {
        setTimeout(endGame, 500);
      }
    } else {
      toast({
        title: "❌ Try again",
        description: "That doesn't belong there!",
        className: "bg-destructive text-destructive-foreground"
      });
    }
  };

  const resetGame = () => {
    setGameState('ready');
    setScore(0);
    setTimeLeft(0);
    initializeGame();
  };

  // Simplified drag and drop for sorting games
  const SortingGameRenderer = () => (
    <div className="space-y-6">
      {/* Drag Items */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {dragItems.map(item => (
          <div
            key={item.id}
            className={`p-4 border-2 border-dashed border-border rounded-lg text-center cursor-move hover:border-primary transition-colors ${
              selectedItem === item.id ? 'border-primary bg-primary/10' : ''
            }`}
            onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
          >
            <div className="text-2xl mb-2">{item.content.split(' ')[0]}</div>
            <div className="text-sm">{item.content.split(' ').slice(1).join(' ')}</div>
          </div>
        ))}
      </div>

      {/* Drop Zones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dropZones.map(zone => (
          <Card
            key={zone.id}
            className={`p-6 text-center min-h-32 cursor-pointer transition-all duration-300 ${
              selectedItem ? 'hover:border-primary hover:shadow-eco' : ''
            }`}
            onClick={() => selectedItem && handleDrop(zone.id, selectedItem)}
          >
            <div className="text-3xl mb-2">{zone.label.split(' ')[0]}</div>
            <div className="font-semibold mb-4">{zone.label.split(' ').slice(1).join(' ')}</div>
            
            <div className="space-y-2">
              {zone.items.map((item, index) => (
                <Badge key={index} variant="secondary" className="mr-1">
                  {item.split(' ')[0]}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {selectedItem && (
        <div className="text-center p-4 bg-primary/10 rounded-lg">
          <p className="text-sm text-primary">
            📱 Selected: {dragItems.find(i => i.id === selectedItem)?.content}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Tap a bin above to sort this item!
          </p>
        </div>
      )}
    </div>
  );

  // Simplified catch game
  const CatchGameRenderer = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center space-x-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">{score}</div>
          <div className="text-sm text-muted-foreground">Caught</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-warning">{timeLeft}s</div>
          <div className="text-sm text-muted-foreground">Time Left</div>
        </div>
      </div>
      
      <div className="bg-gradient-to-b from-sky-200 to-green-200 rounded-lg p-8 min-h-64 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">💧</div>
          <Button onClick={() => setScore(prev => prev + 1)}>
            Catch Clean Water!
          </Button>
        </div>
      </div>
    </div>
  );

  // Game state renderers
  if (gameState === 'ready') {
    return (
      <Card className="p-8 text-center space-y-6">
        <div className="space-y-4">
          <Gamepad2 className="h-16 w-16 mx-auto text-primary animate-float" />
          <h2 className="text-2xl font-bold">{game.title}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">{game.description}</p>
          
          <div className="flex justify-center space-x-6">
            <Badge variant="outline" className="text-sm">
              <Timer className="h-3 w-3 mr-1" />
              {game.duration}
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Target className="h-3 w-3 mr-1" />
              {game.difficulty}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Zap className="h-3 w-3 mr-1" />
              {game.points} points
            </Badge>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-accent/50 rounded-lg">
            <p className="text-sm">{game.instructions}</p>
          </div>
          <Button onClick={startGame} size="lg" className="w-full">
            <Play className="h-4 w-4 mr-2" />
            Start Game
          </Button>
        </div>
      </Card>
    );
  }

  if (gameState === 'completed') {
    return (
      <Card className="p-8 text-center space-y-6 bg-gradient-to-r from-success/10 to-primary/10">
        <div className="space-y-4">
          <Trophy className="h-16 w-16 mx-auto text-warning animate-bounce-in" />
          <h2 className="text-3xl font-bold">Game Complete! 🎉</h2>
          <div className="space-y-2">
            <p className="text-xl">
              Final Score: <span className="font-bold text-primary">{score}</span>
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              +{game.points} EcoPoints Earned!
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={resetGame}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Play Again
          </Button>
          <Button variant="default">
            <Star className="h-4 w-4 mr-2" />
            View Outdoor Task
          </Button>
        </div>
      </Card>
    );
  }

  if (gameState === 'failed') {
    return (
      <Card className="p-8 text-center space-y-6">
        <div className="space-y-4">
          <div className="text-6xl">😅</div>
          <h2 className="text-2xl font-bold">Try Again!</h2>
          <p className="text-muted-foreground">
            Score: {score}/{getRequiredScore()} - You can do better!
          </p>
        </div>
        
        <Button onClick={resetGame} className="w-full">
          <RotateCcw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </Card>
    );
  }

  // Playing state
  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center">
          <Gamepad2 className="h-5 w-5 mr-2 text-primary" />
          {game.title}
        </h3>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">
            Score: {score}
          </Badge>
          {timeLeft > 0 && (
            <Badge variant="outline">
              <Timer className="h-3 w-3 mr-1" />
              {timeLeft}s
            </Badge>
          )}
        </div>
      </div>

      {game.type === 'sorting' && <SortingGameRenderer />}
      {game.type === 'catch' && <CatchGameRenderer />}
      
      {game.type === 'simulation' && (
        <div className="text-center space-y-4">
          <div className="text-6xl animate-float">🌱</div>
          <p>Interactive simulation coming soon!</p>
          <Button onClick={endGame}>Complete Simulation</Button>
        </div>
      )}
    </Card>
  );
};

export default GameComponent;