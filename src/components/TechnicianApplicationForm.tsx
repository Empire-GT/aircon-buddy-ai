import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { FileText, CheckCircle, AlertCircle, User, Briefcase, Award } from "lucide-react";

const TechnicianApplicationForm = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    
    // Professional Information
    experience: "",
    certifications: "",
    specialties: [] as string[],
    currentEmployer: "",
    expectedSalary: "",
    availability: "",
    
    // Additional Information
    hasOwnTools: false,
    hasVehicle: false,
    hasDriverLicense: false,
    emergencyContact: "",
    emergencyPhone: "",
    additionalInfo: "",
    
    // Documents
    resume: null as File | null,
    certificationsFile: null as File | null,
    idFile: null as File | null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const specialties = [
    "Window Type AC",
    "Split Type AC", 
    "Cassette Type AC",
    "Central Air Conditioning",
    "Commercial AC Systems",
    "AC Installation",
    "AC Repair",
    "AC Maintenance",
    "Refrigerant Handling",
    "Electrical Work"
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      specialties: checked 
        ? [...prev.specialties, specialty]
        : prev.specialties.filter(s => s !== specialty)
    }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone && formData.address;
      case 2:
        return formData.experience && formData.certifications && formData.specialties.length > 0;
      case 3:
        return formData.emergencyContact && formData.emergencyPhone;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast({
        title: "Please fill in all required fields",
        description: "All fields marked with * are required.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to confirmation page
      navigate('/technician-application/confirmation');
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Juan"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Dela Cruz"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="juan@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="09XX XXX XXXX"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="123 Main Street, Barangay Name"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="Quezon City"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              placeholder="1100"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Professional Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="experience">Years of Experience *</Label>
          <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-1">0-1 years</SelectItem>
              <SelectItem value="2-3">2-3 years</SelectItem>
              <SelectItem value="4-5">4-5 years</SelectItem>
              <SelectItem value="6-10">6-10 years</SelectItem>
              <SelectItem value="10+">10+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="certifications">Certifications *</Label>
          <Textarea
            id="certifications"
            value={formData.certifications}
            onChange={(e) => handleInputChange("certifications", e.target.value)}
            placeholder="TESDA RAC, EPA Certification, etc."
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Specialties * (Select all that apply)</Label>
          <div className="grid grid-cols-2 gap-3">
            {specialties.map((specialty) => (
              <div key={specialty} className="flex items-center space-x-2">
                <Checkbox
                  id={specialty}
                  checked={formData.specialties.includes(specialty)}
                  onCheckedChange={(checked) => handleSpecialtyChange(specialty, checked as boolean)}
                />
                <Label htmlFor={specialty} className="text-sm">{specialty}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentEmployer">Current Employer</Label>
            <Input
              id="currentEmployer"
              value={formData.currentEmployer}
              onChange={(e) => handleInputChange("currentEmployer", e.target.value)}
              placeholder="Company Name (if applicable)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expectedSalary">Expected Daily Rate</Label>
            <Input
              id="expectedSalary"
              value={formData.expectedSalary}
              onChange={(e) => handleInputChange("expectedSalary", e.target.value)}
              placeholder="₱1,500 - ₱2,500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="availability">Availability</Label>
          <Select value={formData.availability} onValueChange={(value) => handleInputChange("availability", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="weekends">Weekends only</SelectItem>
              <SelectItem value="flexible">Flexible schedule</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Requirements</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasOwnTools"
                checked={formData.hasOwnTools}
                onCheckedChange={(checked) => handleInputChange("hasOwnTools", checked)}
              />
              <Label htmlFor="hasOwnTools">I have my own tools and equipment</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasVehicle"
                checked={formData.hasVehicle}
                onCheckedChange={(checked) => handleInputChange("hasVehicle", checked)}
              />
              <Label htmlFor="hasVehicle">I have reliable transportation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasDriverLicense"
                checked={formData.hasDriverLicense}
                onCheckedChange={(checked) => handleInputChange("hasDriverLicense", checked)}
              />
              <Label htmlFor="hasDriverLicense">I have a valid driver's license</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Additional Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
            <Input
              id="emergencyContact"
              value={formData.emergencyContact}
              onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
              placeholder="Maria Santos"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
            <Input
              id="emergencyPhone"
              type="tel"
              value={formData.emergencyPhone}
              onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
              placeholder="09XX XXX XXXX"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalInfo">Additional Information</Label>
          <Textarea
            id="additionalInfo"
            value={formData.additionalInfo}
            onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
            placeholder="Tell us anything else you'd like us to know..."
            rows={4}
          />
        </div>

        <div className="space-y-4">
          <Label>Required Documents</Label>
          
          <div className="space-y-2">
            <Label htmlFor="resume" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Resume/CV
            </Label>
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileUpload("resume", e.target.files?.[0] || null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificationsFile" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Certifications (PDF/Image)
            </Label>
            <Input
              id="certificationsFile"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload("certificationsFile", e.target.files?.[0] || null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idFile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Valid ID (PDF/Image)
            </Label>
            <Input
              id="idFile"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload("idFile", e.target.files?.[0] || null)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Review & Submit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Phone:</strong> {formData.phone}</p>
            <p><strong>Address:</strong> {formData.address}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Professional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Experience:</strong> {formData.experience} years</p>
            <p><strong>Specialties:</strong> {formData.specialties.join(", ")}</p>
            <p><strong>Certifications:</strong> {formData.certifications}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              {formData.hasOwnTools && <CheckCircle className="h-4 w-4 text-green-500" />}
              <span>Own Tools</span>
            </div>
            <div className="flex items-center gap-2">
              {formData.hasVehicle && <CheckCircle className="h-4 w-4 text-green-500" />}
              <span>Reliable Transportation</span>
            </div>
            <div className="flex items-center gap-2">
              {formData.hasDriverLicense && <CheckCircle className="h-4 w-4 text-green-500" />}
              <span>Driver's License</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">What happens next?</h4>
                <ul className="text-sm text-blue-800 mt-1 space-y-1">
                  <li>• We'll review your application within 48 hours</li>
                  <li>• If selected, we'll contact you for a technical assessment</li>
                  <li>• Successful candidates will be invited for an interview</li>
                  <li>• Background checks and reference verification will follow</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 max-h-screen overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle>Technician Application Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Step {currentStep} of 4</span>
              <span className="text-sm text-muted-foreground">{Math.round((currentStep / 4) * 100)}% Complete</span>
            </div>
            <Progress value={(currentStep / 4) * 100} className="w-full" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="max-h-[60vh] overflow-y-auto">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianApplicationForm;