import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useToast } from "../hooks/use-toast";
import { Footer } from "../components/Navigation";
import { resourceRoute } from "../lib/resourceRoutes";
import {
  login,
  registerStudent,
  registerTeacher,
  requestLoginOtp,
  verifyLoginOtp,
  requestPasswordResetOtp,
  resetPasswordWithOtp,
  type UserRole,
} from "../lib/auth";
import { ApiError } from "../lib/apiClient";
import { 
  Leaf, 
  Mail, 
  Lock, 
  User, 
  School, 
  Users, 
  Play, 
  BookOpen, 
  Trophy,
  Star,
  Clock,
  ArrowRight,
  Gamepad2,
  Video,
  Target,
  Zap
} from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";

const authFooterSections = [
  {
    title: "Accounts",
    links: [
      { label: "Student Login", to: "/auth?type=student" },
      { label: "Teacher Sign Up", to: "/auth?type=teacher" },
      { label: "NGO Partnerships", to: "/auth?type=teacher#ngo" },
      { label: "Reset Password", href: "mailto:support@ecoquest.org" },
    ],
  },
  {
    title: "Getting Started",
    links: [
      { label: "Explore Classes", to: "/classes" },
      { label: "See Rewards", to: "/leaderboard" },
      { label: "Submit Tasks", to: "/submit-task" },
      { label: "Report Hazard", to: "/report-hazard" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Team", to: resourceRoute("contact") },
      { label: "Teacher Handbook", to: resourceRoute("teachers-guide") },
      { label: "Privacy Policy", to: resourceRoute("privacy-policy") },
      { label: "Terms of Service", to: resourceRoute("terms-of-service") },
    ],
  },
];

const defaultFormState = {
  email: "",
  password: "",
  name: "",
  schoolName: "",
  schoolCode: "",
  grade: "",
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<UserRole>("student");
  const [showContent, setShowContent] = useState(false);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");
  const [loginOtpIdentifier, setLoginOtpIdentifier] = useState("");
  const [loginOtpRequested, setLoginOtpRequested] = useState(false);
  const [loginOtpChannel, setLoginOtpChannel] = useState<"sms" | "email" | null>(null);
  const [loginOtpExpiresAt, setLoginOtpExpiresAt] = useState<string | null>(null);
  const [loginOtpCode, setLoginOtpCode] = useState("");
  const [isRequestingLoginOtp, setIsRequestingLoginOtp] = useState(false);
  const [isVerifyingLoginOtp, setIsVerifyingLoginOtp] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [passwordResetIdentifier, setPasswordResetIdentifier] = useState("");
  const [passwordResetOtpSent, setPasswordResetOtpSent] = useState(false);
  const [passwordResetOtpCode, setPasswordResetOtpCode] = useState("");
  const [passwordResetNewPassword, setPasswordResetNewPassword] = useState("");
  const [passwordResetConfirm, setPasswordResetConfirm] = useState("");
  const [isSendingPasswordOtp, setIsSendingPasswordOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [passwordResetChannels, setPasswordResetChannels] = useState<Array<"sms" | "email">>([]);
  const [passwordResetExpiresAt, setPasswordResetExpiresAt] = useState<string | null>(null);

  const handleClosePreview = () => {
    setActiveLessonIndex(null);
    setShowContent(false);
  };
  const [formData, setFormData] = useState(defaultFormState);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get("type");

    if (typeParam === "teacher") {
      setUserType("teacher");
    }
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      grade: userType === "student" ? prev.grade : "",
      schoolName: userType === "teacher" ? prev.schoolName : "",
    }));
  }, [userType]);

  useEffect(() => {
    if (loginMode === "password") {
      resetLoginOtpState();
      setLoginOtpIdentifier("");
      setIsRequestingLoginOtp(false);
      setIsVerifyingLoginOtp(false);
    }
  }, [loginMode]);

  useEffect(() => {
    if (!showPasswordReset) {
      resetPasswordResetState();
    }
  }, [showPasswordReset]);

  useEffect(() => {
    if (!isLogin) {
      setLoginMode("password");
    }
  }, [isLogin]);

  const resetLoginOtpState = () => {
    setLoginOtpRequested(false);
    setLoginOtpChannel(null);
    setLoginOtpExpiresAt(null);
    setLoginOtpCode("");
  };

  const resetPasswordResetState = () => {
    setPasswordResetOtpSent(false);
    setPasswordResetOtpCode("");
    setPasswordResetNewPassword("");
    setPasswordResetConfirm("");
    setPasswordResetChannels([]);
    setPasswordResetExpiresAt(null);
  };

  const openPasswordResetDialog = (identifier?: string) => {
    resetPasswordResetState();
    setPasswordResetIdentifier(identifier?.trim() ?? "");
    setShowPasswordReset(true);
  };

  const handlePasswordLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const normalizedEmail = formData.email.trim().toLowerCase();
    const sanitizedPassword = formData.password.trim();

    if (!normalizedEmail || !sanitizedPassword) {
      toast({
        title: "Missing details",
        description: "Email and password are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const session = await login({
        email: normalizedEmail,
        password: sanitizedPassword,
        role: userType,
      });

      setFormData({ ...defaultFormState });

      toast({
        title: `Welcome to EcoQuest, ${session.user.name}! 🌱`,
        description: "Logged in successfully.",
      });

      navigate(session.user.role === "teacher" ? "/teacher" : "/dashboard", {
        replace: true,
      });
    } catch (error) {
      const message = error instanceof ApiError ? error.data?.message ?? error.message : "Something went wrong. Please try again.";

      if (error instanceof ApiError && error.data?.canResetPassword) {
        setPasswordResetIdentifier(formData.email.trim());
      }

      toast({
        title: "Authentication failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const normalizedEmail = formData.email.trim().toLowerCase();
    const sanitizedPassword = formData.password.trim();

    if (!normalizedEmail || !sanitizedPassword) {
      toast({
        title: "Missing details",
        description: "Email and password are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      let session;
      if (userType === "teacher") {
        if (!formData.name.trim() || !formData.schoolName.trim() || !formData.schoolCode.trim()) {
          toast({
            title: "Missing details",
            description: "Name, school name, and school code are required for teachers.",
            variant: "destructive",
          });
          return;
        }

        session = await registerTeacher({
          name: formData.name.trim(),
          email: normalizedEmail,
          password: sanitizedPassword,
          schoolName: formData.schoolName.trim(),
          schoolCode: formData.schoolCode.trim().toUpperCase(),
        });
      } else {
        if (!formData.name.trim() || !formData.grade || !formData.schoolCode.trim()) {
          toast({
            title: "Missing details",
            description: "Name, grade, and school code are required for students.",
            variant: "destructive",
          });
          return;
        }

        session = await registerStudent({
          name: formData.name.trim(),
          email: normalizedEmail,
          password: sanitizedPassword,
          grade: formData.grade,
          schoolCode: formData.schoolCode.trim().toUpperCase(),
        });
      }

      if (!session) return;

      setFormData({ ...defaultFormState });

      toast({
        title: `Welcome to EcoQuest, ${session.user.name}! 🌱`,
        description: "Account created successfully.",
      });

      navigate(session.user.role === "teacher" ? "/teacher" : "/dashboard", {
        replace: true,
      });
    } catch (error) {
      const message = error instanceof ApiError ? error.data?.message ?? error.message : "Something went wrong. Please try again.";

      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendLoginOtp = async (identifier: string) => {
    if (isRequestingLoginOtp) return;

    try {
      setIsRequestingLoginOtp(true);
      const response = await requestLoginOtp({ identifier });
      setLoginOtpRequested(true);
      setLoginOtpChannel(response.channel);
      setLoginOtpExpiresAt(response.expiresAt ?? null);
      setLoginOtpCode("");
      toast({
        title: "OTP sent",
        description: response.message,
      });
    } catch (error) {
      const message = error instanceof ApiError ? error.data?.message ?? error.message : "Failed to send OTP.";
      toast({ title: "OTP request failed", description: message, variant: "destructive" });
    } finally {
      setIsRequestingLoginOtp(false);
    }
  };

  const handleLoginOtpRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const identifier = loginOtpIdentifier.trim();
    if (!identifier) {
      toast({
        title: "Missing details",
        description: "Please enter your email or verified phone number.",
        variant: "destructive",
      });
      return;
    }

    await sendLoginOtp(identifier);
  };

  const handleResendLoginOtp = async () => {
    const identifier = loginOtpIdentifier.trim();
    if (!identifier) {
      toast({
        title: "Missing details",
        description: "Please enter your email or verified phone number first.",
        variant: "destructive",
      });
      return;
    }

    await sendLoginOtp(identifier);
  };

  const handleVerifyLoginOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isVerifyingLoginOtp) return;

    const identifier = loginOtpIdentifier.trim();
    if (!identifier || loginOtpCode.trim().length === 0) {
      toast({
        title: "Missing details",
        description: "Enter the OTP you received to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsVerifyingLoginOtp(true);
      const session = await verifyLoginOtp({ identifier, code: loginOtpCode.trim() });

      resetLoginOtpState();
      setLoginOtpIdentifier("");
      setLoginMode("password");

      toast({
        title: `Welcome back, ${session.user.name}!`,
        description: "OTP login successful.",
      });

      navigate(session.user.role === "teacher" ? "/teacher" : "/dashboard", {
        replace: true,
      });
    } catch (error) {
      const message = error instanceof ApiError ? error.data?.message ?? error.message : "Failed to verify OTP.";
      toast({ title: "OTP verification failed", description: message, variant: "destructive" });
    } finally {
      setIsVerifyingLoginOtp(false);
    }
  };

  const sendPasswordResetOtp = async (identifier: string) => {
    try {
      setIsSendingPasswordOtp(true);
      const response = await requestPasswordResetOtp({ identifier });
      setPasswordResetOtpSent(true);
      setPasswordResetOtpCode("");
      setPasswordResetNewPassword("");
      setPasswordResetConfirm("");
      setPasswordResetChannels(response.channels);
      setPasswordResetExpiresAt(response.expiresAt ?? null);
      toast({ title: "OTP sent", description: response.message });
    } catch (error) {
      const message = error instanceof ApiError ? error.data?.message ?? error.message : "Failed to send password reset OTP.";
      toast({ title: "Could not send OTP", description: message, variant: "destructive" });
    } finally {
      setIsSendingPasswordOtp(false);
    }
  };

  const handleRequestPasswordReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const identifier = passwordResetIdentifier.trim();
    if (!identifier) {
      toast({
        title: "Missing details",
        description: "Please enter the email or verified phone number on your account.",
        variant: "destructive",
      });
      return;
    }

    if (isSendingPasswordOtp) return;
    await sendPasswordResetOtp(identifier);
  };

  const handleResendPasswordResetOtp = async () => {
    const identifier = passwordResetIdentifier.trim();
    if (!identifier) {
      toast({
        title: "Missing details",
        description: "Please enter your email or phone number first.",
        variant: "destructive",
      });
      return;
    }
    if (isSendingPasswordOtp) return;
    await sendPasswordResetOtp(identifier);
  };

  const handlePasswordReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isResettingPassword) return;

    const identifier = passwordResetIdentifier.trim();
    const code = passwordResetOtpCode.trim();
    const newPassword = passwordResetNewPassword.trim();
    const confirmPassword = passwordResetConfirm.trim();

    if (!identifier || !code || !newPassword || !confirmPassword) {
      toast({
        title: "Missing details",
        description: "Complete all fields to reset your password.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Make sure the new password and confirmation match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Choose a password with at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsResettingPassword(true);
      await resetPasswordWithOtp({ identifier, code, newPassword });
      toast({
        title: "Password updated",
        description: "Your password was reset successfully. You can now log in with it.",
      });
      resetPasswordResetState();
      setShowPasswordReset(false);
    } catch (error) {
      const message = error instanceof ApiError ? error.data?.message ?? error.message : "Failed to reset password.";
      toast({ title: "Reset failed", description: message, variant: "destructive" });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleInputChange = (field: keyof typeof defaultFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const featuredGames = [
    {
      title: "Compost Adventure",
      description: "Join Apple the character in teaching kids about composting! Drag and drop food scraps into the right bins.",
      image: "https://ik.imagekit.io/327ynsbjd/game-compost-adventure.jpg?updatedAt=1758347286262",
      grade: "Grades 1-5",
      points: 20,
      duration: "10 min",
      difficulty: "Easy",
      type: "Sorting Game"
    },
    {
      title: "Water Saver Challenge",
      description: "Race against time to turn off taps and fix leaks! Learn water conservation through interactive gameplay.",
      image: "https://ik.imagekit.io/327ynsbjd/game-water-saver.jpg?updatedAt=1758347286272",
      grade: "Grades 6-8",
      points: 30,
      duration: "15 min",
      difficulty: "Medium",
      type: "Timer Challenge"
    },
    {
      title: "Eco City Mayor",
      description: "Manage a virtual city's environment as mayor! Balance budget with pollution control and green initiatives.",
      image: "https://ik.imagekit.io/327ynsbjd/game-city-simulation.jpg?updatedAt=1758347286299",
      grade: "Grades 9-12",
      points: 60,
      duration: "30 min",
      difficulty: "Hard",
      type: "Strategy Game"
    }
  ];

  const featuredLessons = [
    {
      title: "Food Waste",
      description: "An animated video showing how leftover food sadly ends up in overflowing bins, creating pollution, and then shifting to solutions like composting, sharing, and mindful eating to save the planet.",
      image: "https://ik.imagekit.io/327ynsbjd/food%20waste%20thumbnail?updatedAt=1758292654590",
      grade: "All Grades",
      points: 40,
      duration: "4 min",
      type: "Animated Video",
      videoUrl: "https://ik.imagekit.io/327ynsbjd/food%20waste?updatedAt=1758291638363"
    },
    {
      title: "Air Purifier",
      description: "An animated video showing dirty air filled with smoke and dust turning people sad, then shifting to an air purifier that cleans the air, bringing fresh breeze, happy faces, and a healthier environment.",
      image: "https://ik.imagekit.io/327ynsbjd/Air%20Purifier?updatedAt=1758259535926",
      grade: "All Grades",
      points: 30,
      duration: "3 min",
      type: "Animated Video",
      videoUrl: "https://ik.imagekit.io/327ynsbjd/WhatsApp%20Video%202025-09-17%20at%2011.14.18_22703354.mp4?updatedAt=1758312745543"
    }
  ];

  const footerDescription = "Sign in or create an EcoQuest account to track your impact and unlock classroom missions.";

  const selectedLesson = activeLessonIndex !== null ? featuredLessons[activeLessonIndex] : null;

  const passwordResetDialog = (
    <Dialog open={showPasswordReset} onOpenChange={setShowPasswordReset}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset password</DialogTitle>
          <DialogDescription>
            We will send a one-time code to your email and verified phone number (if available).
          </DialogDescription>
        </DialogHeader>

        {!passwordResetOtpSent ? (
          <form onSubmit={handleRequestPasswordReset} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email or verified phone number</label>
              <Input
                type="text"
                placeholder="Enter your email or phone number"
                value={passwordResetIdentifier}
                onChange={(event) => setPasswordResetIdentifier(event.target.value)}
                disabled={isSendingPasswordOtp}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSendingPasswordOtp}>
              {isSendingPasswordOtp ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-4 mt-4">
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                {passwordResetChannels.length > 1
                  ? "Check your email and phone for the reset code."
                  : passwordResetChannels[0] === "sms"
                    ? "Enter the code from the SMS we sent."
                    : "Enter the code from the email we sent."}
              </p>
              {passwordResetExpiresAt ? (
                <p className="text-xs">
                  {`Code expires at ${new Date(passwordResetExpiresAt).toLocaleTimeString()}.`}
                </p>
              ) : null}
            </div>

            <InputOTP value={passwordResetOtpCode} onChange={setPasswordResetOtpCode} maxLength={6}>
              <InputOTPGroup className="flex w-full justify-between gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot key={index} index={index} className="flex-1" />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="New password"
                value={passwordResetNewPassword}
                onChange={(event) => setPasswordResetNewPassword(event.target.value)}
                disabled={isResettingPassword}
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                value={passwordResetConfirm}
                onChange={(event) => setPasswordResetConfirm(event.target.value)}
                disabled={isResettingPassword}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isResettingPassword}>
              {isResettingPassword ? "Updating..." : "Reset password"}
            </Button>

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={handleResendPasswordResetOtp}
                disabled={isSendingPasswordOtp}
              >
                {isSendingPasswordOtp ? "Sending..." : "Resend OTP"}
              </button>
              <button
                type="button"
                className="text-muted-foreground hover:text-primary"
                onClick={resetPasswordResetState}
              >
                Change email or phone
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );

  if (showContent) {
    return (
      <>
        <div className="min-h-screen bg-gradient-nature">
          {/* Header */}
          <div className="bg-card border-b border-border">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-eco rounded-lg">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground">EcoQuest Preview</h1>
                </div>
                <Button onClick={handleClosePreview} variant="outline">
                  Back to Sign Up
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Games Section */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
                  <Gamepad2 className="h-10 w-10 mr-3 text-primary" />
                  Interactive Learning Games
                </h2>
                <p className="text-xl text-muted-foreground">
                  Age-appropriate games that make environmental education fun and engaging
                </p>
              </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredGames.map((game, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-eco transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={game.image} 
                      alt={game.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-gradient-eco text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {game.type}
                    </div>
                    <div className="absolute top-4 right-4 bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-semibold">
                      +{game.points} pts
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{game.title}</h3>
                      <span className="text-sm text-primary font-medium">{game.grade}</span>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{game.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {game.duration}
                      </span>
                      <span className="flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        {game.difficulty}
                      </span>
                    </div>
                    
                    <Button variant="eco" className="w-full" disabled>
                      <Play className="h-4 w-4 mr-2" />
                      Sign up to play!
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Lessons Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
                <Video className="h-10 w-10 mr-3 text-primary" />
                Animated Video Lessons
              </h2>
              <p className="text-xl text-muted-foreground">
                Beautiful animated lessons that bring environmental concepts to life
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredLessons.map((lesson, index) => {
                const hasVideo = Boolean(lesson.videoUrl);

                return (
                  <Card key={index} className="overflow-hidden hover:shadow-eco transition-all duration-300">
                    <div className="relative">
                      {hasVideo ? (
                        <video
                          className="w-full h-56 object-cover"
                          controls
                          preload="metadata"
                          playsInline
                          poster={lesson.image && lesson.image !== lesson.videoUrl ? lesson.image : undefined}
                        >
                          <source src={lesson.videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <>
                          <img
                            src={lesson.image}
                            alt={lesson.title}
                            className="w-full h-56 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                              <Play className="h-8 w-8 text-primary ml-1" />
                            </div>
                          </div>
                        </>
                      )}
                      <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                        {lesson.type}
                      </div>
                      <div className="absolute top-4 right-4 bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-semibold">
                        +{lesson.points} pts
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{lesson.title}</h3>
                        <span className="text-sm text-primary font-medium">{lesson.grade}</span>
                      </div>

                      <p className="text-muted-foreground mb-4">{lesson.description}</p>

                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {lesson.duration}
                        </span>
                        <span className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          Interactive
                        </span>
                      </div>

                      <Button
                        variant={hasVideo ? "eco" : "outline"}
                        className="w-full"
                        disabled={!hasVideo}
                        onClick={() => {
                          if (hasVideo) {
                            setActiveLessonIndex(index);
                          }
                        }}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        {hasVideo ? "Watch lesson" : "Sign up to watch!"}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Real-world Tasks Preview */}
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center">
              <Trophy className="h-8 w-8 mr-3 text-primary" />
              Real-World Environmental Tasks
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Complete actual environmental actions in your community and earn bonus EcoPoints!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-accent rounded-xl">
                <Target className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Plant a Tree</h3>
                <p className="text-sm text-muted-foreground">Upload photo proof and earn 50 EcoPoints</p>
              </div>
              <div className="p-6 bg-accent rounded-xl">
                <Zap className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Community Cleanup</h3>
                <p className="text-sm text-muted-foreground">Organize cleanup events for 100 EcoPoints</p>
              </div>
              <div className="p-6 bg-accent rounded-xl">
                <Leaf className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Report Hazards</h3>
                <p className="text-sm text-muted-foreground">Help fix environmental issues for 25 EcoPoints</p>
              </div>
            </div>

            <Button variant="eco" size="lg" onClick={handleClosePreview}>
              Join EcoQuest Now!
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {passwordResetDialog}

      {selectedLesson?.videoUrl && (
        <Dialog open={activeLessonIndex !== null} onOpenChange={(open) => {
          if (!open) {
            setActiveLessonIndex(null);
          }
        }}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedLesson.title}</DialogTitle>
              <DialogDescription>{selectedLesson.description}</DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <video
                className="w-full rounded-xl"
                controls
                autoPlay
                playsInline
              >
                <source src={selectedLesson.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Footer description={footerDescription} sections={authFooterSections} />
      </>
    );
  }

  return (
    <>
      {passwordResetDialog}

      <div className="min-h-screen bg-gradient-nature flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Preview Content */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <div className="p-3 bg-gradient-eco rounded-full">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-foreground ml-3">EcoQuest</h1>
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Learn Through <span className="text-primary">Play</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                Experience environmental education like never before with interactive games, 
                animated lessons, and real-world impact challenges.
              </p>
            </div>

            {/* Quick Preview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-4 hover:shadow-eco transition-all duration-300 cursor-pointer" 
                    onClick={() => setShowContent(true)}>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-eco rounded-lg">
                    <Gamepad2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">15+ Games</h3>
                    <p className="text-sm text-muted-foreground">Interactive learning</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 hover:shadow-eco transition-all duration-300 cursor-pointer"
                    onClick={() => setShowContent(true)}>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-secondary rounded-lg">
                    <Video className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">30+ Lessons</h3>
                    <p className="text-sm text-muted-foreground">Animated videos</p>
                  </div>
                </div>
              </Card>
            </div>

            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={() => setShowContent(true)}
            >
              <Play className="h-5 w-5 mr-2" />
              Preview Games & Lessons
            </Button>
          </div>

          {/* Right side - Auth Form */}
          <Card className="p-8 shadow-eco">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">Join EcoQuest</h3>
              <p className="text-muted-foreground">Start your environmental learning journey</p>
            </div>

            <Tabs value={isLogin ? "login" : "signup"} onValueChange={(value) => setIsLogin(value === "login")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                {loginMode === "password" ? (
                  <form onSubmit={handlePasswordLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">I am a...</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant={userType === "student" ? "eco" : "outline"}
                          onClick={() => setUserType("student")}
                          className="flex items-center space-x-2"
                          disabled={isSubmitting}
                        >
                          <User className="h-4 w-4" />
                          <span>Student</span>
                        </Button>
                        <Button
                          type="button"
                          variant={userType === "teacher" ? "eco" : "outline"}
                          onClick={() => setUserType("teacher")}
                          className="flex items-center space-x-2"
                          disabled={isSubmitting}
                        >
                          <Users className="h-4 w-4" />
                          <span>Teacher</span>
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          value={formData.email}
                          onChange={(event) => handleInputChange("email", event.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10"
                          value={formData.password}
                          onChange={(event) => handleInputChange("password", event.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <Button type="submit" variant="eco" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Signing in..." : "Login to EcoQuest"}
                    </Button>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => {
                          setLoginMode("otp");
                          setLoginOtpIdentifier(formData.email.trim());
                          resetLoginOtpState();
                        }}
                      >
                        Use OTP login instead
                      </button>
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => openPasswordResetDialog(formData.email.trim())}
                      >
                        Forgot password?
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => {
                          setLoginMode("password");
                          setFormData((prev) => ({ ...prev, password: "" }));
                        }}
                      >
                        Use password login
                      </button>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => openPasswordResetDialog(loginOtpIdentifier || formData.email.trim())}
                      >
                        Forgot password?
                      </button>
                    </div>

                    {!loginOtpRequested ? (
                      <form onSubmit={handleLoginOtpRequest} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email or verified phone number</label>
                          <Input
                            type="text"
                            placeholder="Enter your email or phone number"
                            value={loginOtpIdentifier}
                            onChange={(event) => setLoginOtpIdentifier(event.target.value)}
                            disabled={isRequestingLoginOtp || isVerifyingLoginOtp}
                          />
                        </div>
                        <Button type="submit" variant="eco" className="w-full" disabled={isRequestingLoginOtp}>
                          {isRequestingLoginOtp ? "Sending..." : "Send OTP"}
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyLoginOtp} className="space-y-4">
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>
                            {`Enter the code sent to your ${loginOtpChannel === "sms" ? "mobile number" : "email address"}.`}
                          </p>
                          {loginOtpExpiresAt ? (
                            <p className="text-xs">
                              {`Code expires at ${new Date(loginOtpExpiresAt).toLocaleTimeString()}.`}
                            </p>
                          ) : null}
                        </div>
                        <InputOTP value={loginOtpCode} onChange={setLoginOtpCode} maxLength={6}>
                          <InputOTPGroup className="flex w-full justify-between gap-2">
                            {Array.from({ length: 6 }).map((_, index) => (
                              <InputOTPSlot key={index} index={index} className="flex-1" />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                        <Button
                          type="submit"
                          variant="eco"
                          className="w-full"
                          disabled={isVerifyingLoginOtp || loginOtpCode.trim().length !== 6}
                        >
                          {isVerifyingLoginOtp ? "Verifying..." : "Login with OTP"}
                        </Button>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                          <button
                            type="button"
                            className="text-primary hover:underline"
                            onClick={handleResendLoginOtp}
                            disabled={isRequestingLoginOtp}
                          >
                            {isRequestingLoginOtp ? "Sending..." : "Resend OTP"}
                          </button>
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-primary"
                            onClick={() => resetLoginOtpState()}
                          >
                            Change email or phone
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">I am a...</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={userType === "student" ? "eco" : "outline"}
                        onClick={() => setUserType("student")}
                        className="flex items-center space-x-2"
                        disabled={isSubmitting}
                      >
                        <User className="h-4 w-4" />
                        <span>Student</span>
                      </Button>
                      <Button
                        type="button"
                        variant={userType === "teacher" ? "eco" : "outline"}
                        onClick={() => setUserType("teacher")}
                        className="flex items-center space-x-2"
                        disabled={isSubmitting}
                      >
                        <Users className="h-4 w-4" />
                        <span>Teacher</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {userType === "teacher" ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">School Name</label>
                        <div className="relative">
                          <School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Enter your school name"
                            className="pl-10"
                            value={formData.schoolName}
                            onChange={(e) => handleInputChange("schoolName", e.target.value)}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">School Code</label>
                        <div className="relative">
                          <School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Create or enter a unique code"
                            className="pl-10 uppercase"
                            value={formData.schoolCode}
                            onChange={(e) => handleInputChange("schoolCode", e.target.value)}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">School Code</label>
                      <div className="relative">
                        <School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Ask your teacher for the code"
                          className="pl-10 uppercase"
                          value={formData.schoolCode}
                          onChange={(e) => handleInputChange("schoolCode", e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  )}

                  {userType === "student" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Grade</label>
                      <select 
                        className="w-full p-3 border border-input rounded-md bg-background"
                        value={formData.grade}
                        onChange={(e) => handleInputChange("grade", e.target.value)}
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">Select your grade</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Create a password"
                        className="pl-10"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="eco" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Join EcoQuest"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
    <Footer description={footerDescription} sections={authFooterSections} />
    </>
  );
};

export default Auth;
