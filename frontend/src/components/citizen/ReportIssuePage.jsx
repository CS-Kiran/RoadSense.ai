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
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [mapPosition, setMapPosition] = useState(null);
  const mapRef = useRef(null);

  // Form Data - Matches API/Database schema exactly
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    issue_type: "", // Must match IssueType enum values
    location: {
      latitude: null,
      longitude: null,
      address: "",
    },
    images: [],
    is_anonymous: false,
  });

  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState([]);

  // Categories - MUST match IssueType enum in models.py exactly
  const categories = [
    {
      id: "pothole", // matches IssueType.POTHOLE
      name: "Pothole",
      icon: "🕳️",
      color: "bg-red-100 text-red-700 border-red-200",
    },
    {
      id: "crack", // matches IssueType.CRACK
      name: "Road Crack",
      icon: "🔀",
      color: "bg-orange-100 text-orange-700 border-orange-200",
    },
    {
      id: "debris", // matches IssueType.DEBRIS
      name: "Debris",
      icon: "🗑️",
      color: "bg-amber-100 text-amber-700 border-amber-200",
    },
    {
      id: "faded_marking", // matches IssueType.FADED_MARKING
      name: "Faded Marking",
      icon: "〰️",
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    {
      id: "street_light", // matches IssueType.STREET_LIGHT
      name: "Street Light",
      icon: "💡",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
    {
      id: "traffic_sign", // matches IssueType.TRAFFIC_SIGN
      name: "Traffic Sign",
      icon: "🚦",
      color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    },
    {
      id: "drainage", // matches IssueType.DRAINAGE
      name: "Drainage Issue",
      icon: "🌊",
      color: "bg-cyan-100 text-cyan-700 border-cyan-200",
    },
    {
      id: "other", // matches IssueType.OTHER
      name: "Other",
      icon: "📋",
      color: "bg-zinc-100 text-zinc-700 border-zinc-200",
    },
  ];

  // Get User Location on Mount
  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setMapPosition([latitude, longitude]);

          // Reverse geocode to get address
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();

            setFormData((prev) => ({
              ...prev,
              location: {
                latitude,
                longitude,
                address:
                  data.display_name ||
                  `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              },
            }));
          } catch (error) {
            setFormData((prev) => ({
              ...prev,
              location: {
                latitude,
                longitude,
                address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              },
            }));
          }
          setLocationLoading(false);
        },
        (error) => {
          console.error("Location error:", error);
          setLocationLoading(false);
          // Set default location (Pune)
          const defaultLat = 18.5204;
          const defaultLng = 73.8567;
          setMapPosition([defaultLat, defaultLng]);
          setFormData((prev) => ({
            ...prev,
            location: {
              latitude: defaultLat,
              longitude: defaultLng,
              address: "Pune, Maharashtra, India",
            },
          }));
        }
      );
    } else {
      setLocationLoading(false);
      // Set default location if geolocation not available
      const defaultLat = 18.5204;
      const defaultLng = 73.8567;
      setMapPosition([defaultLat, defaultLng]);
      setFormData((prev) => ({
        ...prev,
        location: {
          latitude: defaultLat,
          longitude: defaultLng,
          address: "Pune, Maharashtra, India",
        },
      }));
    }
  };

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);

    if (formData.images.length + files.length > 5) {
      setErrors({ ...errors, images: "Maximum 5 photos allowed" });
      return;
    }

    // Validate file types and sizes (matches API validation)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setErrors({ ...errors, images: "Only JPG, PNG, and WEBP images are allowed" });
        return;
      }
      if (file.size > maxSize) {
        setErrors({ ...errors, images: "Each image must be less than 10MB" });
        return;
      }
    }

    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPhotoPreview([...photoPreview, ...newPreviews]);
    setFormData({ ...formData, images: [...formData.images, ...files] });
    setErrors({ ...errors, images: null });
  };

  // Remove Photo
  const removePhoto = (index) => {
    const newPhotos = formData.images.filter((_, i) => i !== index);
    const newPreviews = photoPreview.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newPhotos });
    setPhotoPreview(newPreviews);
  };

  // Validate Current Step
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.location.latitude || !formData.location.longitude) {
        newErrors.location = "Location is required";
      }
    } else if (step === 2) {
      if (!formData.issue_type) {
        newErrors.issue_type = "Please select a category";
      }
    } else if (step === 3) {
      if (!formData.title.trim()) {
        newErrors.title = "Title is required";
      }
      if (!formData.description.trim()) {
        newErrors.description = "Description is required";
      }
      if (formData.description.length < 20) {
        newErrors.description = "Description must be at least 20 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Next Step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Previous Step
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  // Submit Form
  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      
      // Append fields exactly as API expects
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("issue_type", formData.issue_type); // lowercase value
      submitData.append("latitude", formData.location.latitude);
      submitData.append("longitude", formData.location.longitude);
      submitData.append("address", formData.location.address);
      submitData.append("is_anonymous", formData.is_anonymous);

      // Append images (API expects field name "images")
      formData.images.forEach((image) => {
        submitData.append("images", image);
      });

      const response = await axios.post("/api/reports", submitData, {
        headers: { 
          "Content-Type": "multipart/form-data" 
        },
      });

      console.log("Report created successfully:", response.data);

      // Success - navigate to reports
      navigate("/citizen/reports", {
        state: { message: "Report submitted successfully!" },
      });
    } catch (error) {
      console.error("Submit error:", error);
      let errorMessage = "Failed to submit report. Please try again.";
      
      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail.map(e => e.msg).join(', ');
        }
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Step Content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-blue-600" size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Location</h2>
              <p className="text-gray-600">Where is the issue located?</p>
            </div>

            {locationLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Detecting your location...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Map Preview */}
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
                  <div style={{ height: "300px", width: "100%" }}>
                    {mapPosition && (
                      <MapContainer
                        center={mapPosition}
                        zoom={15}
                        style={{ height: "100%", width: "100%" }}
                        ref={mapRef}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker
                          position={mapPosition}
                          setPosition={setMapPosition}
                          setFormData={setFormData}
                        />
                      </MapContainer>
                    )}
                  </div>

                  {/* Map Instructions */}
                  <div className="bg-blue-50 border-t-2 border-blue-200 p-4 flex items-start gap-3">
                    <Crosshair
                      className="text-blue-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Click on the map to adjust location
                      </p>
                      <p className="text-xs text-gray-600">
                        The marker shows where the issue will be reported
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location Info Card */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Navigation className="text-blue-600 mt-1" size={20} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Current Location
                      </h3>
                      <p className="text-sm text-gray-700">
                        {formData.location.address}
                      </p>
                    </div>
                    <CheckCircle className="text-green-600" size={20} />
                  </div>

                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>Lat: {formData.location.latitude?.toFixed(6)}</span>
                    <span>Lng: {formData.location.longitude?.toFixed(6)}</span>
                  </div>
                </div>

                {/* Editable Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Edit Address (Optional)
                  </label>
                  <Input
                    value={formData.location.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          address: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter specific address or landmark"
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <Button
                  variant="outline"
                  onClick={getUserLocation}
                  className="w-full"
                  disabled={locationLoading}
                >
                  <Navigation size={16} className="mr-2" />
                  Refresh Location
                </Button>

                {errors.location && (
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.location}
                  </p>
                )}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-purple-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Category
              </h2>
              <p className="text-gray-600">What type of issue is it?</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setFormData({ ...formData, issue_type: cat.id });
                    setErrors({ ...errors, issue_type: null });
                  }}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    formData.issue_type === cat.id
                      ? cat.color + " shadow-lg scale-105"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <p className="font-semibold text-gray-900">{cat.name}</p>
                </button>
              ))}
            </div>

            {errors.issue_type && (
              <p className="text-red-600 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {errors.issue_type}
              </p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="text-green-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Details & Photos
              </h2>
              <p className="text-gray-600">Describe the issue and add photos</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Large pothole on Main Street"
                className={`border-gray-300 focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? "border-red-500" : ""
                }`}
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description * (min 20 characters)
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the issue in detail - location, size, impact on traffic, etc."
                rows={5}
                className={`border-gray-300 focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? "border-red-500" : ""
                }`}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length} / 20 characters minimum
              </p>
              {errors.description && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Photos (Optional, max 5)
              </label>

              {photoPreview.length < 5 && (
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload photos
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG, WEBP up to 10MB each
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}

              {/* Photo Previews */}
              {photoPreview.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {photoPreview.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {errors.images && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.images}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <AlertCircle size={32} />
            <h1 className="text-3xl font-bold">Report an Issue</h1>
          </div>
          <p className="text-orange-100 text-lg">
            Help us improve road infrastructure in your area
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between px-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold transition-all ${
                currentStep >= step
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-gray-300 text-gray-400"
              }`}
            >
              {currentStep > step ? <CheckCircle size={20} /> : step}
            </div>
            {step < 3 && (
              <div
                className={`flex-1 h-1 mx-2 transition-all ${
                  currentStep > step ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="p-8 border-0 shadow-lg">
        {renderStepContent()}

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3 mt-6">
            <AlertCircle className="text-red-600" size={20} />
            <p className="text-red-700 font-medium">{errors.submit}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex-1"
            >
              Previous
            </Button>
          )}

          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700"
              disabled={locationLoading}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2" size={18} />
                  Submit Report
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ReportIssuePage;