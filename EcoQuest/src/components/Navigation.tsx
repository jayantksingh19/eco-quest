import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useTheme } from "../components/ThemeProvider";
import { Leaf, Menu, X, User, Trophy, BookOpen, AlertTriangle, Sun, Moon, Monitor } from "lucide-react";
import { resourceRoute } from "../lib/resourceRoutes";
import useAuthSession from "../hooks/useAuthSession";
import { clearSession } from "../lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const { user } = useAuthSession();
  const userInitial = user?.name?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? "?";
  const userAvatarUrl = user?.profileImageUrl ? user.profileImageUrl : undefined;

    const navItems = [
    { name: "Home", path: "/", icon: Leaf },
    { name: "Classes", path: "/classes", icon: BookOpen },
    { name: "Dashboard", path: user ? "/dashboard" : "/auth", icon: User },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { name: "Report Hazard", path: "/report-hazard", icon: AlertTriangle },
  ];
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    clearSession();
    window.location.href = '/';
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return Sun;
      case "dark":
        return Moon;
      default:
        return Monitor;
    }
  };

  const ThemeIcon = getThemeIcon();

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-eco rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">EcoQuest</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-primary hover:bg-accent"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light")}
              className="mr-2"
            >
              <ThemeIcon className="h-4 w-4" />
            </Button>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  aria-label="Open profile settings"
                  className="outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full"
                >
                  <Avatar className="h-10 w-10 border-2 border-primary/60 bg-primary/10 text-primary">
                    {userAvatarUrl ? (
                      <AvatarImage src={userAvatarUrl} alt={user.name} />
                    ) : null}
                    <AvatarFallback className="font-semibold text-primary">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="eco" size="sm" asChild>
                <Link to="/auth">Join EcoQuest</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-primary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-primary hover:bg-accent"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light")}
                    className="flex items-center space-x-2"
                  >
                    <ThemeIcon className="h-4 w-4" />
                    <span>Theme</span>
                  </Button>
                </div>
                
                {user ? (
                  <div className="space-y-3">
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      aria-label="Open profile settings"
                      className="flex items-center space-x-3 px-3"
                    >
                      <Avatar className="h-10 w-10 border-2 border-primary/60 bg-primary/10 text-primary">
                        {userAvatarUrl ? <AvatarImage src={userAvatarUrl} alt={user.name} /> : null}
                        <AvatarFallback className="font-semibold text-primary">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{user.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                      </div>
                    </Link>
                    <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button variant="eco" size="sm" className="w-full" asChild>
                    <Link to="/auth">Join EcoQuest</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

interface FooterLink {
  label: string;
  to?: string;
  href?: string;
  isExternal?: boolean;
  onClick?: () => void;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  title?: string;
  description?: string;
  sections?: FooterSection[];
  className?: string;
}

const defaultFooterSections: FooterSection[] = [
  {
    title: "Platform",
    links: [
      { label: "For Students", to: "/classes" },
      { label: "For Teachers", to: "/auth?type=teacher" },
      { label: "For NGOs", to: "/auth?type=teacher" },
      { label: "Leaderboards", to: "/leaderboard" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", to: resourceRoute("help-centre") },
      { label: "Teacher Guides", to: resourceRoute("teachers-guide") },
      {
        label: "Impact Reports",
        to: resourceRoute("impact-report"),
      },
      {
        label: "Blog",
        to: resourceRoute("blog"),
      },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: resourceRoute("about-us") },
      { label: "Contact", to: resourceRoute("contact") },
      {
        label: "Privacy Policy",
        to: resourceRoute("privacy-policy"),
      },
      {
        label: "Terms of Service",
        to: resourceRoute("terms-of-service"),
      },
    ],
  },
];

export const Footer = ({
  title = "EcoQuest",
  description = "Turning environmental education into meaningful action, one student at a time.",
  sections = defaultFooterSections,
  className = "",
}: FooterProps) => {
  const footerClasses = [
    "bg-background",
    "border-t",
    "border-border",
    "text-muted-foreground",
    "py-12",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const linkClass = "hover:text-foreground transition-colors";

  return (
    <footer className={footerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-eco rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">{title}</span>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 text-foreground">{section.title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link) => {
                  const content = <span className={linkClass}>{link.label}</span>;

                  if (link.onClick) {
                    return (
                      <li key={link.label}>
                        <button
                          type="button"
                          onClick={link.onClick}
                          className="w-full text-left"
                        >
                          {content}
                        </button>
                      </li>
                    );
                  }

                  if (link.to) {
                    return (
                      <li key={link.label}>
                        <Link to={link.to}>{content}</Link>
                      </li>
                    );
                  }

                  if (link.href) {
                    return (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target={link.isExternal ? "_blank" : undefined}
                          rel={link.isExternal ? "noreferrer" : undefined}
                        >
                          {content}
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={link.label} className="text-muted-foreground/70">
                      {link.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {title}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Navigation;
