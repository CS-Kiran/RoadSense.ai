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
} from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

// API URL from environment or default
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
  const { token, user } = useAuth(); // Get token and user from AuthContext
  const mapRef = useRef(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [formData, setFormData] = useState({
    location: {
      latitude: null,
      longitude: null,
      address: "",
    },
    issueType: "",
    title: "",
    description: "",
    priority: "medium",
    isAnonymous: false,
  });

  const [errors, setErrors] = useState({});

  // Issue types from backend
  const issueTypes = [
    { value: "pothole", label: "Pothole", icon: "🕳️" },
    { value: "damaged_road", label: "Damaged Road", icon: "🛣️" },
    { value: "street_light", label: "Street Light Issue", icon: "💡" },
    { value: "drainage", label: "Drainage Problem", icon: "🚰" },
    { value: "debris", label: "Road Debris", icon: "🗑️" },
    { value: "traffic_sign", label: "Traffic Sign Issue", icon: "🚦" },
    { value: "other", label: "Other", icon: "📝" },
  ];

  // Get user's current location on component mount
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
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
          setLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to a central location if geolocation fails
          setPosition([20.5937, 78.9629]); // Center of India
          setFormData((prev) => ({
            ...prev,
            location: {
              latitude: 20.5937,
              longitude: 78.9629,
              address: "Click on map to set location",
            },
          }));
          setLocationLoading(false);
        }
      );
    } else {
      setPosition([20.5937, 78.9629]);
      setFormData((prev) => ({
        ...prev,
        location: {
          latitude: 20.5937,
          longitude: 78.9629,
          address: "Click on map to set location",
        },
      }));
      setLocationLoading(false);
    }
  }, [token, navigate]);

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 5 images
    if (files.length + selectedFiles.length > 5) {
      setErrors({ ...errors, images: "Maximum 5 images allowed" });
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, images: "Only image files are allowed" });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, images: "Each image must be less than 5MB" });
        return false;
      }
      return true;
    });

    setSelectedFiles([...selectedFiles, ...validFiles]);

    // Create preview URLs
    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    setErrors({ ...errors, images: "" });
  };

  // Remove selected file
  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.location.latitude || !formData.location.longitude) {
        newErrors.location = "Please select a location on the map";
      }
    }

    if (step === 2) {
      if (!formData.issueType) {
        newErrors.issueType = "Please select an issue type";
      }
    }

    if (step === 3) {
      if (!formData.title.trim()) {
        newErrors.title = "Title is required";
      }
      if (!formData.description.trim()) {
        newErrors.description = "Description is required";
      }
      if (formData.description.trim().length < 20) {
        newErrors.description = "Description must be at least 20 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(3)) {
      return;
    }

    // Check if user is authenticated
    if (!token) {
      setErrors({ submit: "Please login to submit a report" });
      navigate("/login");
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Create FormData object
      const formDataToSend = new FormData();
      
      // Append text fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("issue_type", formData.issueType);
      formDataToSend.append("latitude", formData.location.latitude);
      formDataToSend.append("longitude", formData.location.longitude);
      formDataToSend.append("address", formData.location.address);
      formDataToSend.append("priority", formData.priority);
      formDataToSend.append("is_anonymous", formData.isAnonymous);

      // Append images
      selectedFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      // Make API request with token in Authorization header
      const response = await axios.post(
        `${API_URL}/api/reports`,
        formDataToSend,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            // Don't set Content-Type - let browser set it with boundary
          },
        }
      );

      console.log("Report submitted successfully:", response.data);
      setSuccessMessage("Report submitted successfully!");

      // Redirect to reports page after 2 seconds
      setTimeout(() => {
        navigate("/citizen/my-reports");
      }, 2000);
    } catch (error) {
      console.error("Error submitting report:", error);
      
      if (error.response?.status === 401) {
        setErrors({ submit: "Session expired. Please login again." });
        setTimeout(() => navigate("/login"), 2000);
      } else if (error.response?.status === 400) {
        setErrors({ submit: error.response.data?.detail || "Invalid data submitted" });
      } else {
        setErrors({
          submit: error.response?.data?.detail || "Failed to submit report. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Render success message
  if (successMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Success!
          </h2>
          <p className="text-gray-600">{successMessage}</p>
          <p className="text-sm text-gray-500 mt-4">
            Redirecting to your reports...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step < currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={currentStep >= 1 ? "text-blue-600 font-medium" : "text-gray-500"}>
              Location
            </span>
            <span className={currentStep >= 2 ? "text-blue-600 font-medium" : "text-gray-500"}>
              Issue Type
            </span>
            <span className={currentStep >= 3 ? "text-blue-600 font-medium" : "text-gray-500"}>
              Details
            </span>
          </div>
        </div>

        {/* Step 1: Location Selection */}
        {currentStep === 1 && (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Where is the issue located?
                </h2>
                <p className="text-gray-600 text-sm">
                  {locationLoading
                    ? "Detecting your location..."
                    : "Click on the map to adjust location"}
                </p>
              </div>
            </div>

            {errors.location && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-600 text-sm">{errors.location}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="h-96 rounded-lg overflow-hidden border-2 border-gray-200">
                {position && (
                  <MapContainer
                    center={position}
                    zoom={15}
                    className="h-full w-full"
                    ref={mapRef}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <LocationMarker
                      position={position}
                      setPosition={setPosition}
                      setFormData={setFormData}
                    />
                  </MapContainer>
                )}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900 font-medium mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Selected Location:
                </p>
                <p className="text-sm text-blue-700">
                  {formData.location.address || "Click on map to select"}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Crosshair className="w-4 h-4" />
                <span>The marker shows where the issue will be reported</span>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next: Select Issue Type
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Issue Type Selection */}
        {currentStep === 2 && (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                What type of issue is it?
              </h2>
            </div>

            {errors.issueType && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-600 text-sm">{errors.issueType}</span>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {issueTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, issueType: type.value })
                  }
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.issueType === type.value
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="text-sm font-medium text-gray-900">
                    {type.label}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <Button
                onClick={handlePrevious}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next: Add Details
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Details and Photos */}
        {currentStep === 3 && (
          <form onSubmit={handleSubmit}>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Camera className="w-6 h-6 text-blue-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Describe the issue and add photos
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Help us improve road infrastructure in your area
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Brief summary of the issue"
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Provide detailed information about the issue..."
                    rows={5}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    {formData.description.length} characters (minimum 20)
                  </p>
                </div>

                {/* Priority Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low - Minor inconvenience</option>
                    <option value="medium">Medium - Moderate issue</option>
                    <option value="high">High - Significant problem</option>
                    <option value="critical">Critical - Safety hazard</option>
                  </select>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Photos (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload images
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Maximum 5 images, 5MB each
                      </span>
                    </label>
                  </div>
                  {errors.images && (
                    <p className="text-red-600 text-sm mt-1">{errors.images}</p>
                  )}

                  {/* Image Previews */}
                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Anonymous Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={formData.isAnonymous}
                    onChange={(e) =>
                      setFormData({ ...formData, isAnonymous: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="anonymous" className="text-sm text-gray-700">
                    Submit anonymously
                  </label>
                </div>

                {/* Error Message */}
                {errors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="text-red-600 text-sm">{errors.submit}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-8">
                <Button onClick={handlePrevious} variant="outline" type="button">
                  Previous
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
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
            </Card>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportIssuePage;
