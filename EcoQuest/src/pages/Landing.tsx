import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import EcoCard from "../components/EcoCard";
import {
  BookOpen,
  Target,
  Trophy,
  Users,
  ArrowRight,
  Leaf,
} from "lucide-react";

import { Footer } from "../components/Navigation";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "Quizzes & Lessons",
      description:
        "Interactive environmental education with fun quizzes, engaging lessons, and real-world case studies.",
    },
    {
      icon: Target,
      title: "Real-World Eco Tasks",
      description:
        "Complete meaningful environmental challenges in your community and make a real impact.",
    },
    {
      icon: Trophy,
      title: "Rewards & Leaderboards",
      description:
        "Earn EcoPoints, unlock badges, and compete with students globally for environmental action.",
    },
  ];

  const testimonials = [
    {
      quote:
        "EcoQuest made learning about the environment so much fun! I've already planted 5 trees this month.",
      author: "Sarah Chen",
      role: "High School Student",
    },
    {
      quote:
        "My students are more engaged than ever. The gamification really works!",
      author: "Dr. James Wilson",
      role: "Environmental Science Teacher",
    },
    {
      quote:
        "We've seen amazing results in our community cleanup programs through EcoQuest partnerships.",
      author: "Maria Rodriguez",
      role: "Green Future NGO",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-nature overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Learn. Act. Earn{" "}
                  <span className="bg-gradient-eco bg-clip-text text-transparent">
                    EcoPoints
                  </span>
                  <span className="text-2xl ml-2">🌱</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl">
                  Join thousands of students worldwide in turning environmental
                  education into meaningful action. Learn, complete
                  eco-challenges, and make a real difference in your community.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="default"
                  size="lg"
                  className="group bg-gradient-eco hover:opacity-90"
                  onClick={() => navigate("/classes")}
                >
                  Start Learning
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    navigate({ pathname: "/auth", search: "?type=teacher" })
                  }
                >
                  Join as School
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1,000+</div>
                  <div className="text-sm text-muted-foreground">
                    Active Students
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">
                    Partner Schools
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">2,500+</div>
                  <div className="text-sm text-muted-foreground">
                    Trees Planted
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://ik.imagekit.io/327ynsbjd/hero-eco-learning-nGk64UJm.jpg?updatedAt=1758347286211"
                alt="Students learning about the environment"
                className="rounded-2xl shadow-eco hover:shadow-glow transition-all duration-500"
              />
              <div className="absolute -top-4 -right-4 bg-success text-success-foreground px-4 py-2 rounded-full font-semibold animate-bounce-in">
                Join 1,000+ students! 🌍
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Everything You Need to Make an Impact
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform combines education, action, and rewards to create the
              most engaging environmental learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <EcoCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                variant="featured"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-gradient-nature">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Making Real Environmental Impact
            </h2>
            <p className="text-xl text-muted-foreground">
              Over 1,000 students engaged in eco-action across 50+ schools
              worldwide
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">2,500+</div>
              <div className="text-sm text-muted-foreground">Trees Planted</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">15,000kg</div>
              <div className="text-sm text-muted-foreground">
                Waste Recycled
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">
                Community Cleanups
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">85%</div>
              <div className="text-sm text-muted-foreground">
                Increased Eco-Awareness
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              What Our Community Says
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 shadow-soft hover:shadow-eco transition-all duration-300"
              >
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-eco rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-eco">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to Start Your Eco Journey?
            </h2>
            <p className="text-xl text-white/90">
              Join thousands of students making a real environmental impact.
              Start learning, take action, and earn rewards today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="default"
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => (window.location.href = "/auth")}
              >
                Get Started Now
                <Leaf className="h-5 w-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                onClick={() => (window.location.href = "#about")}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Landing;