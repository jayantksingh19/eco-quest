import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { useToast } from "../hooks/use-toast";
import { 
  MapPin, 
  Camera, 
  AlertTriangle, 
  Upload, 
  CheckCircle,
  ArrowLeft,
  Navigation,
  Trash2,
  Droplet,
  Wind,
  AlertCircle
} from "lucide-react";
import { Footer } from "../components/Navigation";
import { resourceRoute } from "../lib/resourceRoutes";
import { apiFetch, ApiError } from "../lib/apiClient";
import useAuthSession from "../hooks/useAuthSession";

const hazardFooterSections = [
  {
    title: "Take Action",
    links: [
      { label: "Submit Another Report", to: "/report-hazard" },
      { label: "Outdoor Tasks", to: "/outdoor-task/1/1" },
      { label: "Dashboard", to: "/dashboard" },
      { label: "Classes", to: "/classes" },
    ],
  },
  {
    title: "Safety & Support",
    links: [
      { label: "Emergency Services", href: "tel:112" },
      { label: "Teacher Handbook", to: resourceRoute("teachers-guide") },
      { label: "Learn More", to: resourceRoute("learn-more") },
      { label: "Contact Team", to: resourceRoute("contact") },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", to: resourceRoute("help-centre") },
      { label: "Impact Report", to: resourceRoute("impact-report") },
      { label: "Privacy Policy", to: resourceRoute("privacy-policy") },
      { label: "Terms of Service", to: resourceRoute("terms-of-service") },
    ],
  },
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const defaultFormState = {
  title: "",
  category: "",
  customCategory: "",
  description: "",
  location: "",
  coordinates: { lat: 0, lng: 0 },
  urgent: false,
  permission: false,
  reporterName: "",
  reporterEmail: "",
};

const ReportHazard = () => {
  const [formData, setFormData] = useState(defaultFormState);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [showCustomCategoryDialog, setShowCustomCategoryDialog] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const { toast } = useToast();
  const { user } = useAuthSession();

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      reporterName: prev.reporterName || user.name || "",
      reporterEmail: prev.reporterEmail || user.email || "",
    }));
  }, [user]);

  const categories = [
    { id: "garbage", label: "Garbage Dump", icon: Trash2, color: "text-orange-600" },
    { id: "water", label: "Water Pollution", icon: Droplet, color: "text-blue-600" },
    { id: "air", label: "Air Pollution", icon: Wind, color: "text-gray-600" },
    { id: "illegal", label: "Illegal Dumping", icon: AlertTriangle, color: "text-red-600" },
    { id: "other", label: "Other", icon: AlertCircle, color: "text-purple-600" }
  ];

  const handleCustomCategorySubmit = () => {
    const trimmed = customCategoryInput.trim();
    if (!trimmed) {
      toast({
        title: "Category required",
        description: "Please provide a category name.",
        variant: "destructive",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      category: "custom",
      customCategory: trimmed,
    }));
    setShowCustomCategoryDialog(false);
    setCustomCategoryInput("");
  };

  const titleSuggestions = [
    "Garbage dump near school",
    "Dirty sea/river water", 
    "Blocked drainage system",
    "Illegal waste disposal",
    "Plastic pollution in water",
    "Overflowing trash bins",
    "Industrial waste discharge"
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + selectedFiles.length > 5) {
      toast({
        title: "Too many files",
        description: "You can upload maximum 5 files",
        variant: "destructive"
      });
      return;
    }
    
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
    event.target.value = "";
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const clone = [...prev];
      clone.splice(index, 1);
      return clone;
    });
    setPreviewUrls((prev) => {
      const clone = [...prev];
      const [removed] = clone.splice(index, 1);
      if (removed) {
        URL.revokeObjectURL(removed);
      }
      return clone;
    });
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const getCurrentLocation = () => {
    setUseCurrentLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            location: "Current Location"
          }));
          setUseCurrentLocation(false);
          toast({
            title: "Location captured",
            description: "Your current location has been set"
          });
        },
        (error) => {
          setUseCurrentLocation(false);

          let description = "Please enter the location manually.";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              description = "Location access was denied. Enable permissions or enter the location manually.";
              break;
            case error.POSITION_UNAVAILABLE:
              description = "We couldn't determine your location. Please enter it manually.";
              break;
            case error.TIMEOUT:
              description = "Location request timed out. Try again or enter the location manually.";
              break;
            default:
              description = error.message || description;
              break;
          }

          toast({
            title: "Unable to capture location",
            description,
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.permission) {
      toast({
        title: "Permission required",
        description: "Please confirm you have permission to photograph this location",
        variant: "destructive",
      });
      return;
    }

    const trimmedEmail = formData.reporterEmail.trim();
    if (!trimmedEmail || !emailPattern.test(trimmedEmail)) {
      toast({
        title: "Email required",
        description: "Please provide a valid email address so we can share updates.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const formPayload = new FormData();
      formPayload.append("title", formData.title.trim());
      formPayload.append("category", formData.category);
      if (formData.customCategory) {
        formPayload.append("customCategory", formData.customCategory);
      }
      formPayload.append("description", formData.description.trim());
      formPayload.append("location", formData.location.trim());
      formPayload.append("coordinates", JSON.stringify(formData.coordinates));
      formPayload.append("urgent", String(formData.urgent));
      formPayload.append("permission", String(formData.permission));
      formPayload.append("reporterName", formData.reporterName.trim());
      formPayload.append("reporterEmail", trimmedEmail);

      if (user?.id) {
        formPayload.append("reporterId", user.id);
      }
      if (user?.role) {
        formPayload.append(
          "reporterRole",
          user.role === "teacher" ? "Teacher" : user.role === "student" ? "Student" : ""
        );
      }

      selectedFiles.forEach((file) => {
        formPayload.append("attachments", file);
      });

      const response = await apiFetch<{ message: string; reference: string }>("/hazards", {
        method: "POST",
        body: formPayload,
      });

      toast({
        title: "Report submitted successfully! 🌱",
        description: `Reference: ${response.reference}. Check your email for confirmation.`,
      });

      setFormData({
        ...defaultFormState,
        reporterName: user?.name ?? "",
        reporterEmail: user?.email ?? "",
      });
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      const description = error instanceof ApiError
        ? error.data?.message ?? error.message
        : "Failed to submit report. Please try again.";

      toast({
        title: "Submission failed",
        description,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerDescription = "Report environmental issues, notify authorities, and earn EcoPoints for protecting your community.";

  const customCategoryDialog = (
    <Dialog
      open={showCustomCategoryDialog}
      onOpenChange={(open) => {
        setShowCustomCategoryDialog(open);
        if (!open) {
          setCustomCategoryInput("");
        }
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Custom Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <Input
            placeholder="Describe the hazard category"
            value={customCategoryInput}
            onChange={(event) => setCustomCategoryInput(event.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setShowCustomCategoryDialog(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCustomCategorySubmit}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      {customCategoryDialog}
      <div className="min-h-screen bg-gradient-nature">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-eco mb-8">
          <div className="text-center mb-6">
            <div className="p-4 bg-gradient-eco rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Report a Local Hazard</h1>
            <p className="text-muted-foreground">
              Help clean your community by reporting environmental issues. 
              Your report will be sent to teachers, NGOs, and local authorities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Reporter Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name</label>
                    <Input
                      placeholder="Enter your name"
                      value={formData.reporterName}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, reporterName: event.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Email *</label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.reporterEmail}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, reporterEmail: event.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">Report Title</label>
                  <Input
                    placeholder="Describe the hazard briefly"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-2">Quick suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {titleSuggestions.slice(0, 4).map((suggestion) => (
                        <Button
                          key={suggestion}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData(prev => ({ ...prev, title: suggestion }))}
                          className="text-xs"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-3">Category</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => {
                      const isSelected =
                        category.id === "other"
                          ? formData.category === "custom"
                          : formData.category === category.id;

                      return (
                        <Button
                          key={category.id}
                          type="button"
                          variant={isSelected ? "eco" : "outline"}
                          onClick={() => {
                            if (category.id === "other") {
                              setCustomCategoryInput(formData.customCategory);
                              setShowCustomCategoryDialog(true);
                              return;
                            }

                            setFormData((prev) => ({
                              ...prev,
                              category: category.id,
                              customCategory: "",
                            }));
                          }}
                          className="h-auto p-3 flex flex-col items-center space-y-2"
                        >
                          <category.icon
                            className={`h-5 w-5 ${isSelected ? "text-white" : category.color}`}
                          />
                          <span className="text-xs">{category.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                  {formData.category === "custom" && formData.customCategory && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Selected: <span className="font-medium text-foreground">{formData.customCategory}</span>
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter location or address"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="flex-1"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={getCurrentLocation}
                        disabled={useCurrentLocation}
                        className="flex items-center space-x-2"
                      >
                        {useCurrentLocation ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                            <span>Getting...</span>
                          </>
                        ) : (
                          <>
                            <Navigation className="h-4 w-4" />
                            <span>Use My Location</span>
                          </>
                        )}
                      </Button>
                    </div>
                    {formData.coordinates.lat !== 0 && (
                      <div className="text-sm text-success flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>Location captured: {formData.coordinates.lat.toFixed(6)}, {formData.coordinates.lng.toFixed(6)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Photo/Video Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Photo/Video Evidence</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      id="media-upload"
                    />
                    <label
                      htmlFor="media-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      {previewUrls.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 w-full">
                          {previewUrls.map((url, index) => (
                            <div key={url} className="relative">
                              {selectedFiles[index]?.type.startsWith("video") ? (
                                <video
                                  src={url}
                                  className="h-24 w-full rounded-lg object-cover"
                                  controls
                                />
                              ) : (
                                <img
                                  src={url}
                                  alt={`Hazard evidence ${index + 1}`}
                                  className="h-24 w-full rounded-lg object-cover"
                                />
                              )}
                              <button
                                type="button"
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full h-6 w-6 text-xs"
                                onClick={(event) => {
                                  event.preventDefault();
                                  removeFile(index);
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">Click to upload photos or videos</p>
                          <p className="text-sm text-muted-foreground mt-1">Up to 5 files, max 10MB each</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                  <Textarea
                    placeholder="Provide additional details about the hazard, its impact, or suggested solutions..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-[100px]"
                  />
                </div>

                {/* Urgent Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="urgent"
                    checked={formData.urgent}
                    onChange={(e) => setFormData(prev => ({ ...prev, urgent: e.target.checked }))}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="urgent" className="text-sm text-foreground">
                    Mark as <strong>Urgent</strong> (immediate attention required)
                  </label>
                </div>

                {/* Permission Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="permission"
                    checked={formData.permission}
                    onChange={(e) => setFormData(prev => ({ ...prev, permission: e.target.checked }))}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    required
                  />
                  <label htmlFor="permission" className="text-sm text-foreground">
                    I confirm this is safe to photograph and I have permission to report this location
                  </label>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  variant="eco" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submitting Report...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      Submit Report & Earn 25 Points
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Report Process */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                Report Process
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-xs font-semibold text-primary">1</span>
                  </div>
                  <span className="text-muted-foreground">Your report goes to your teacher for verification</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-xs font-semibold text-primary">2</span>
                  </div>
                  <span className="text-muted-foreground">Verified reports are sent to local NGOs and authorities</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-xs font-semibold text-primary">3</span>
                  </div>
                  <span className="text-muted-foreground">You'll receive updates on the action taken</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-xs font-semibold text-success">4</span>
                  </div>
                  <span className="text-muted-foreground">Earn bonus points when action is completed!</span>
                </div>
              </div>
            </Card>

            {/* Rewards */}
            <Card className="p-6 bg-gradient-eco text-white">
              <h3 className="text-lg font-semibold mb-3">
                Reporting Rewards
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Submit Report</span>
                  <span className="font-semibold">+25 Points</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Verified by Teacher</span>
                  <span className="font-semibold">+10 Bonus</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Action Completed</span>
                  <span className="font-semibold">+50 Bonus</span>
                </div>
                <div className="border-t border-white/20 pt-2 mt-3">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Potential Total</span>
                    <span>Up to 85 Points!</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-warning">
                📷 Photo Tips
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Take clear, well-lit photos</li>
                <li>• Show the full scope of the problem</li>
                <li>• Include landmarks for location reference</li>
                <li>• Ensure your safety when photographing</li>
                <li>• Multiple angles help authorities understand better</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
    <Footer description={footerDescription} sections={hazardFooterSections} />
    </>
  );
};

export default ReportHazard;
