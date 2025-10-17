import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";
import { useToast } from "../hooks/use-toast";
import useAuthSession from "../hooks/useAuthSession";
import { ApiError } from "../lib/apiClient";
import {
  fetchProfile,
  sendPhoneOtp as requestPhoneOtp,
  updatePassword as updatePasswordRequest,
  updateProfile as updateProfileRequest,
  verifyPhoneOtp as verifyPhoneOtpRequest,
  type UpdateProfilePayload,
} from "../lib/auth";
import { ShieldCheck, ShieldAlert, Bell, Phone, Image as ImageIcon } from "lucide-react";

const defaultProfileState = {
  name: "",
  address: "",
  profileImageUrl: "",
  wantsNotifications: true,
  grade: "",
};

const defaultPasswordState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { token, user: sessionUser } = useAuthSession();

  const [profileForm, setProfileForm] = useState(defaultProfileState);
  const [phoneInput, setPhoneInput] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpExpiresAt, setOtpExpiresAt] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState(defaultPasswordState);

  useEffect(() => {
    if (token === null) {
      navigate("/auth", { replace: true });
    }
  }, [token, navigate]);

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: Boolean(token),
  });

  const profile = profileQuery.data ?? sessionUser ?? null;
  const isTeacher = profile?.role === "teacher";

  useEffect(() => {
    if (!profileQuery.data) return;
    const current = profileQuery.data;
    setProfileForm({
      name: current.name ?? "",
      address: current.address ?? "",
      profileImageUrl: current.profileImageUrl ?? "",
      wantsNotifications: current.wantsNotifications ?? true,
      grade: current.role === "student" ? current.grade ?? "" : "",
    });
    setPhoneInput(current.phoneNumber ?? "");
  }, [profileQuery.data]);

  const avatarInitial = useMemo(() => {
    if (!profile) return "?";
    return profile.name?.charAt(0)?.toUpperCase() ?? profile.email?.charAt(0)?.toUpperCase() ?? "?";
  }, [profile]);

  const avatarUrl = profile?.profileImageUrl ? profile.profileImageUrl : undefined;
  const phoneVerified = profile?.phoneVerified ?? false;

  const handleProfileChange = (key: keyof typeof defaultProfileState, value: string | boolean) => {
    setProfileForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: UpdateProfilePayload = {
      name: profileForm.name.trim(),
      profileImageUrl: profileForm.profileImageUrl.trim() ? profileForm.profileImageUrl.trim() : null,
      wantsNotifications: profileForm.wantsNotifications,
      address: profileForm.address.trim() ? profileForm.address.trim() : null,
    };

    if (!isTeacher) {
      payload.grade = profileForm.grade.trim() ? profileForm.grade.trim() : null;
    }

    updateProfileMutation.mutate(payload);
  };

  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfileRequest(payload),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["profile"], updatedUser);
      toast({
        title: "Profile updated",
        description: "Your details were saved successfully.",
      });
    },
    onError: (error: unknown) => {
      const description = error instanceof ApiError ? error.data?.message ?? error.message : "Failed to update profile.";
      toast({ title: "Could not save changes", description, variant: "destructive" });
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: (phoneNumber: string) => requestPhoneOtp({ phoneNumber }),
    onSuccess: (response) => {
      if (response.expiresAt) {
        setOtpExpiresAt(response.expiresAt);
      }
      toast({
        title: "OTP sent",
        description: response.channel === "email"
          ? "A verification code was sent to your email."
          : "A verification code was sent to your phone.",
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: unknown) => {
      const description = error instanceof ApiError ? error.data?.message ?? error.message : "Failed to send verification code.";
      toast({ title: "Could not send OTP", description, variant: "destructive" });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (code: string) => verifyPhoneOtpRequest({ code }),
    onSuccess: (response) => {
      queryClient.setQueryData(["profile"], response.user);
      setOtpValue("");
      setOtpExpiresAt(null);
      toast({ title: "Phone verified", description: response.message });
    },
    onError: (error: unknown) => {
      const description = error instanceof ApiError ? error.data?.message ?? error.message : "Failed to verify OTP.";
      toast({ title: "Verification failed", description, variant: "destructive" });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) => updatePasswordRequest(payload),
    onSuccess: (response) => {
      toast({ title: "Password updated", description: response.message });
      setPasswordForm(defaultPasswordState);
    },
    onError: (error: unknown) => {
      const description = error instanceof ApiError ? error.data?.message ?? error.message : "Failed to update password.";
      toast({ title: "Password update failed", description, variant: "destructive" });
    },
  });

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({ title: "Missing information", description: "Please fill in all password fields.", variant: "destructive" });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "Passwords do not match", description: "New password and confirmation should match.", variant: "destructive" });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({ title: "Password too short", description: "Please choose a password with at least 8 characters.", variant: "destructive" });
      return;
    }

    updatePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  if (!token) {
    return null;
  }

  if (profileQuery.isLoading && !profile) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Loading your profile...
      </div>
    );
  }

  if (profileQuery.isError && !profile) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground mb-4">We couldn't load your profile right now.</p>
        <Button onClick={() => profileQuery.refetch()}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <Card>
        <CardContent className="flex flex-col sm:flex-row sm:items-center gap-6 py-6">
          <Avatar className="h-20 w-20 border-2 border-primary/60 bg-primary/10 text-primary">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={profile?.name} /> : null}
            <AvatarFallback className="text-2xl font-semibold text-primary">
              {avatarInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{profile?.name}</h1>
              <Badge variant="secondary" className="uppercase">{profile?.role}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                {profile?.phoneNumber || "No phone number on file"}
              </div>
              <Badge variant={phoneVerified ? "default" : "destructive"} className="inline-flex items-center gap-1">
                {phoneVerified ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                {phoneVerified ? "Verified" : "Not verified"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleProfileSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Profile details</CardTitle>
            <CardDescription>Update the basics that appear across EcoQuest.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Full name</Label>
                <Input
                  id="profile-name"
                  value={profileForm.name}
                  onChange={(event) => handleProfileChange("name", event.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input id="profile-email" value={profile?.email ?? ""} readOnly disabled />
              </div>
            </div>

            {!isTeacher && (
              <div className="space-y-2">
                <Label htmlFor="profile-grade">Grade</Label>
                <Input
                  id="profile-grade"
                  value={profileForm.grade}
                  onChange={(event) => handleProfileChange("grade", event.target.value)}
                  placeholder="e.g. Grade 6"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="profile-address">Address</Label>
              <Textarea
                id="profile-address"
                value={profileForm.address}
                onChange={(event) => handleProfileChange("address", event.target.value)}
                placeholder="Add your school or personal address"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-image">Profile picture</Label>
              <div className="grid gap-3 sm:grid-cols-[3fr,2fr]">
                <Input
                  id="profile-image"
                  value={profileForm.profileImageUrl}
                  onChange={(event) => handleProfileChange("profileImageUrl", event.target.value)}
                  placeholder="Paste your ImageKit URL"
                />
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed">
                    {profileForm.profileImageUrl ? (
                      <img
                        src={profileForm.profileImageUrl}
                        alt="Profile preview"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload to ImageKit (or another CDN) and store the link here.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-dashed border-primary/30 bg-primary/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">EcoQuest updates</p>
                  <p className="text-xs text-muted-foreground">
                    Receive notifications about new lessons, leaderboards and challenges.
                  </p>
                </div>
              </div>
              <Switch
                checked={profileForm.wantsNotifications}
                onCheckedChange={(checked) => handleProfileChange("wantsNotifications", checked)}
                aria-label="Toggle notifications"
              />
            </div>

            <Button type="submit" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </CardContent>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Phone verification</CardTitle>
          <CardDescription>Verify your phone number to receive SMS updates and secure your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone number</Label>
              <Input
                id="phone-number"
                value={phoneInput}
                onChange={(event) => setPhoneInput(event.target.value)}
                placeholder="Include country code, e.g. +91XXXXXXXXXX"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                className="w-full"
                disabled={!phoneInput.trim() || sendOtpMutation.isPending}
                onClick={() => sendOtpMutation.mutate(phoneInput.trim())}
                variant={phoneVerified ? "secondary" : "default"}
              >
                {sendOtpMutation.isPending ? "Sending..." : phoneVerified ? "Resend OTP" : "Send OTP"}
              </Button>
            </div>
          </div>

          {(phoneVerified || otpExpiresAt) && (
            <p className="text-xs text-muted-foreground">
              {phoneVerified
                ? "Your phone number is verified. You can resend the OTP if you update your number."
                : otpExpiresAt
                  ? `Code expires at ${new Date(otpExpiresAt).toLocaleTimeString()}.`
                  : "Enter the 6-digit code you received via SMS."}
            </p>
          )}

          {!phoneVerified && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <InputOTP value={otpValue} onChange={setOtpValue} maxLength={6} containerClassName="flex-1">
                <InputOTPGroup className="flex-1 justify-between">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} className="flex-1" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <Button
                type="button"
                onClick={() => verifyOtpMutation.mutate(otpValue)}
                disabled={otpValue.length !== 6 || verifyOtpMutation.isPending}
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          )}

        </CardContent>
      </Card>

      <form onSubmit={handlePasswordSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Reset password</CardTitle>
            <CardDescription>Set a strong password to keep your EcoQuest progress secure.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
                placeholder="Enter your current password"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                  placeholder="Create a new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                  placeholder="Repeat your new password"
                />
              </div>
            </div>
            <Button type="submit" disabled={updatePasswordMutation.isPending}>
              {updatePasswordMutation.isPending ? "Updating..." : "Update password"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ProfileSettings;
