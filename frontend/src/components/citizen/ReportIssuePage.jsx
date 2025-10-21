// src/components/citizen/ReportIssuePage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Camera,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle,
  X,
  Navigation,
  Upload,
  Crosshair,
  Info,
} from "lucide-react";
import axios from "@/api/axios";

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Component to handle map clicks and update marker position
function LocationMarker({ position, setPosition, setFormData }) {
  const map = useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

      // Reverse geocode to get address
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          location: {
            latitude: lat,
            longitude: lng,
            address:
              data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          },
        }));
      } catch (error) {
        setFormData((prev) => ({
          ...prev,
          location: {
            latitude: lat,
            longitude: lng,
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          },
        }));
      }
    },
  });

  return position ? <Marker position={position} /> : null;
}

const ReportIssuePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [mapPosition, setMapPosition] = useState([20.5937, 78.9629]); // India center
  const [markerPosition, setMarkerPosition] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    location: {
      latitude: null,
      longitude: null,
      address: "",
    },
    issueType: "",
    title: "",
    description: "",
    images: [],
    isAnonymous: false,
  });

  const [errors, setErrors] = useState({});

  const issueTypes = [
    { value: "pothole", label: "Pothole", icon: "🕳️" },
    { value: "crack", label: "Road Crack", icon: "⚡" },
    { value: "debris", label: "Debris/Obstacle", icon: "🚧" },
    { value: "faded_marking", label: "Faded Road Marking", icon: "🎨" },
    { value: "street_light", label: "Street Light Issue", icon: "💡" },
    { value: "traffic_sign", label: "Traffic Sign Issue", icon: "🚦" },
    { value: "drainage", label: "Drainage Problem", icon: "🌊" },
    { value: "other", label: "Other Issue", icon: "📝" },
  ];

  // Get user's current location on mount
  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMapPosition([lat, lng]);
          setMarkerPosition([lat, lng]);

          // Get address
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            setFormData((prev) => ({
              ...prev,
              location: {
                latitude: lat,
                longitude: lng,
                address:
                  data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
              },
            }));
          } catch (error) {
            setFormData((prev) => ({
              ...prev,
              location: {
                latitude: lat,
                longitude: lng,
                address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
              },
            }));
          }
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoadingLocation(false);
        }
      );
    } else {
      setLoadingLocation(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 5;
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    // Validate number of images
    if (formData.images.length + files.length > maxImages) {
      setErrors((prev) => ({
        ...prev,
        images: `Maximum ${maxImages} images allowed`,
      }));
      return;
    }

    // Validate each file
    const validFiles = [];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          images: "Only JPG, JPEG, PNG, and WEBP images are allowed",
        }));
        continue;
      }
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          images: "Each image must be less than 10MB",
        }));
        continue;
      }
      validFiles.push(file);
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));
    setErrors((prev) => ({ ...prev, images: null }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.location.latitude || !formData.location.longitude) {
        newErrors.location = "Please select a location on the map";
      }
    } else if (step === 2) {
      if (!formData.issueType) {
        newErrors.issueType = "Please select an issue type";
      }
    } else if (step === 3) {
      if (!formData.title || formData.title.trim().length < 5) {
        newErrors.title = "Title must be at least 5 characters";
      }
      if (!formData.description || formData.description.trim().length < 10) {
        newErrors.description = "Description must be at least 10 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setSubmitting(true);
    setErrors({});

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Create FormData object
      const submitData = new FormData();
      submitData.append("latitude", formData.location.latitude);
      submitData.append("longitude", formData.location.longitude);
      submitData.append("address", formData.location.address);
      submitData.append("issue_type", formData.issueType);
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("is_anonymous", formData.isAnonymous);

      // Append images
      formData.images.forEach((image) => {
        submitData.append("images", image);
      });

      // Submit to API
      const response = await axios.post("/api/reports", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Success - navigate to dashboard or show success message
      navigate("/citizen/dashboard", {
        state: {
          message: "Report submitted successfully!",
          reportId: response.data.id,
        },
      });
    } catch (error) {
      console.error("Error submitting report:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      } else if (error.response?.data?.detail) {
        setErrors({
          submit:
            typeof error.response.data.detail === "string"
              ? error.response.data.detail
              : "Failed to submit report. Please try again.",
        });
      } else {
        setErrors({
          submit: "Failed to submit report. Please check your connection.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Report an Issue
          </h1>
          <p className="text-slate-600">
            Help us keep our roads safe and well-maintained
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            {[
              { num: 1, label: "Location", icon: MapPin },
              { num: 2, label: "Issue Type", icon: FileText },
              { num: 3, label: "Details", icon: Camera },
            ].map((step, index) => (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      currentStep >= step.num
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-400 border-2 border-slate-300"
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      currentStep >= step.num
                        ? "text-blue-600"
                        : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded transition-all ${
                      currentStep > step.num ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-8 shadow-xl border-0">
          {/* Step 1: Location */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Where is the issue located?
                </h2>
                <p className="text-slate-600">
                  {loadingLocation
                    ? "Detecting your location..."
                    : "Click on the map to adjust location"}
                </p>
              </div>

              {/* Location Detection Button */}
              <div className="flex justify-center mb-4">
                <Button
                  onClick={getUserLocation}
                  disabled={loadingLocation}
                  variant="outline"
                  className="gap-2"
                >
                  {loadingLocation ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4" />
                  )}
                  Use My Current Location
                </Button>
              </div>

              {/* Map */}
              <div className="relative rounded-xl overflow-hidden border-4 border-slate-200 shadow-lg">
                <MapContainer
                  center={mapPosition}
                  zoom={13}
                  className="h-[500px] w-full"
                  zoomControl={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker
                    position={markerPosition}
                    setPosition={setMarkerPosition}
                    setFormData={setFormData}
                  />
                </MapContainer>

                {/* Map Info Banner */}
                <div className="absolute top-4 left-4 right-4 z-[1000] pointer-events-none">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700">
                      <strong>Tip:</strong> The marker shows where the issue
                      will be reported
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Display */}
              {formData.location.address && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        Selected Location:
                      </p>
                      <p className="text-sm text-slate-600">
                        {formData.location.address}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {errors.location && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.location}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleNext}
                  disabled={!markerPosition}
                  className="px-8"
                >
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Issue Type */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  What type of issue is it?
                </h2>
                <p className="text-slate-600">
                  Select the category that best describes the problem
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {issueTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, issueType: type.value }));
                      setErrors((prev) => ({ ...prev, issueType: null }));
                    }}
                    className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                      formData.issueType === type.value
                        ? "border-blue-600 bg-blue-50 shadow-lg"
                        : "border-slate-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <div className="text-4xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium text-slate-700">
                      {type.label}
                    </div>
                  </button>
                ))}
              </div>

              {errors.issueType && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.issueType}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button onClick={handleBack} variant="outline">
                  Back
                </Button>
                <Button onClick={handleNext} disabled={!formData.issueType}>
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Details and Photos */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Describe the issue and add photos
                </h2>
                <p className="text-slate-600">
                  Help us improve road infrastructure in your area
                </p>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Issue Title *
                </label>
                <Input
                  placeholder="e.g., Large pothole on Main Street"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* Description Textarea */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Detailed Description *
                </label>
                <Textarea
                  placeholder="Provide details about the issue, its severity, and any safety concerns..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={5}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Photos (Optional, max 5)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium mb-1">
                    Click to upload images
                  </p>
                  <p className="text-sm text-slate-500">
                    JPG, PNG, or WEBP (max 10MB each)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {errors.images && (
                  <p className="text-red-600 text-sm mt-1">{errors.images}</p>
                )}
              </div>

              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Anonymous Toggle */}
              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-lg">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isAnonymous: e.target.checked,
                    }))
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="anonymous" className="text-sm text-slate-700">
                  Submit anonymously (your identity will not be shown)
                </label>
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{errors.submit}</p>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button onClick={handleBack} variant="outline">
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Report
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ReportIssuePage;