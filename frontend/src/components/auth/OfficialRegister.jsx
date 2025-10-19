import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Mail, Lock, User, Phone, AlertCircle, Building2, FileText, MapPin, Upload, X, CheckCircle } from 'lucide-react';

export default function OfficialRegister() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    department: '',
    employeeId: '',
    designation: '',
    zone: '',
  });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [idFile, setIdFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);

  const departments = [
    'Public Works Department',
    'Municipal Corporation',
    'Roads and Transport',
    'Urban Development',
    'Infrastructure',
  ];

  const zones = [
    'North District',
    'South District',
    'East District',
    'West District',
    'Central District',
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2 || formData.fullName.length > 255) {
      newErrors.fullName = 'Name must be between 2-255 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (formData.email.length > 255) {
      newErrors.email = 'Email must not exceed 255 characters';
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNumber.replace(/[\s-]/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    } else if (formData.employeeId.length < 4) {
      newErrors.employeeId = 'Employee ID must be at least 4 characters';
    }

    if (!formData.department) {
      newErrors.department = 'Please select your department';
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    if (!formData.zone) {
      newErrors.zone = 'Please select your assigned zone';
    }

    // ID Upload validation
    if (!idFile) {
      newErrors.idUpload = 'Government ID is required for verification';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Must include uppercase, lowercase, number & special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!consent) {
      newErrors.consent = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, idUpload: 'Only image files (JPG, PNG, WEBP) are allowed' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, idUpload: 'File size must be less than 5MB' }));
        return;
      }

      setIdFile(file);
      setErrors(prev => ({ ...prev, idUpload: '' }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setIdFile(null);
    setIdPreview(null);
    // Reset file input
    const fileInput = document.getElementById('idUpload');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSubmit.append(key, formData[key]);
      });
      formDataToSubmit.append('governmentId', idFile);
      formDataToSubmit.append('role', 'official');
      
      console.log('Official Registration:', formData, 'ID File:', idFile);
      // Add API call here
    }
  };

  const handleClearForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      department: '',
      employeeId: '',
      designation: '',
      zone: '',
    });
    setConsent(false);
    setErrors({});
    removeFile();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 py-12">
      {/* Back to Home - Floating Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Button>
        </Link>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">
            Official Registration
          </h1>
          <p className="text-muted-foreground text-sm">
            Register as a government official to manage road infrastructure
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          variants={itemVariants}
          className="bg-card border rounded-2xl p-8 shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Grid Layout */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    className={`pl-10 h-11 ${errors.fullName ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-destructive flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Employee ID */}
              <div className="space-y-2">
                <Label htmlFor="employeeId" className="text-sm font-medium">
                  Employee ID
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="employeeId"
                    type="text"
                    placeholder="EMP123456"
                    className={`pl-10 h-11 ${errors.employeeId ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  />
                </div>
                {errors.employeeId && (
                  <p className="text-xs text-destructive flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" />
                    {errors.employeeId}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Official Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="official@gov.in"
                    className={`pl-10 h-11 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="10-digit number"
                    className={`pl-10 h-11 ${errors.phoneNumber ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    maxLength={10}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-xs text-destructive flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" />
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium">
                  Department
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleInputChange('department', value)}
                >
                  <SelectTrigger className={`h-11 ${errors.department ? 'border-destructive' : ''}`}>
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Select department" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-xs text-destructive flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" />
                    {errors.department}
                  </p>
                )}
              </div>

              {/* Designation */}
              <div className="space-y-2">
                <Label htmlFor="designation" className="text-sm font-medium">
                  Designation
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="designation"
                    type="text"
                    placeholder="e.g., Engineer"
                    className={`pl-10 h-11 ${errors.designation ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    value={formData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                  />
                </div>
                {errors.designation && (
                  <p className="text-xs text-destructive flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" />
                    {errors.designation}
                  </p>
                )}
              </div>
            </div>

            {/* Zone - Full Width */}
            <div className="space-y-2">
              <Label htmlFor="zone" className="text-sm font-medium">
                Assigned Zone
              </Label>
              <Select
                value={formData.zone}
                onValueChange={(value) => handleInputChange('zone', value)}
              >
                <SelectTrigger className={`h-11 ${errors.zone ? 'border-destructive' : ''}`}>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Select your assigned zone" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone} value={zone}>
                      {zone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.zone && (
                <p className="text-xs text-destructive flex items-center gap-1.5">
                  <AlertCircle className="h-3 w-3" />
                  {errors.zone}
                </p>
              )}
            </div>

            {/* Government ID Upload */}
            <div className="space-y-2">
              <Label htmlFor="idUpload" className="text-sm font-medium">
                Government ID
              </Label>
              
              {!idFile ? (
                <div className="relative">
                  <input
                    id="idUpload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="idUpload"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      errors.idUpload 
                        ? 'border-destructive bg-destructive/5 hover:bg-destructive/10' 
                        : 'border-muted-foreground/25 bg-muted/30 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-primary">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG or WEBP (Max 5MB)
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative w-full border-2 border-primary/20 rounded-lg p-4 bg-primary/5">
                  <div className="flex items-center gap-4">
                    {idPreview && (
                      <img 
                        src={idPreview} 
                        alt="ID Preview" 
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <p className="text-sm font-medium truncate">{idFile.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {(idFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={removeFile}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {errors.idUpload && (
                <p className="text-xs text-destructive flex items-center gap-1.5">
                  <AlertCircle className="h-3 w-3" />
                  {errors.idUpload}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Upload your government-issued ID card for verification purposes
              </p>
            </div>

            {/* Password Fields - Grid */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className={`pl-10 h-11 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className={`pl-10 h-11 ${errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="space-y-2 pt-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={setConsent}
                  className={`mt-0.5 ${errors.consent ? 'border-destructive' : ''}`}
                />
                <Label
                  htmlFor="consent"
                  className="text-sm leading-relaxed cursor-pointer font-normal"
                >
                  I certify that I am a government official and agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline font-medium">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary hover:underline font-medium">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.consent && (
                <p className="text-xs text-destructive flex items-center gap-1.5 ml-7">
                  <AlertCircle className="h-3 w-3" />
                  {errors.consent}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1 h-11 font-medium">
                Register as Official
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClearForm}
                className="h-11 font-medium"
              >
                Clear
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Footer Links */}
        <motion.div variants={itemVariants} className="mt-6 space-y-3">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Are you a citizen?{' '}
              <Link
                to="/register/citizen"
                className="text-primary hover:underline font-medium"
              >
                Register here
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
