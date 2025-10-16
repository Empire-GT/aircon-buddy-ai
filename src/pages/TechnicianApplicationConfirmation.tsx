import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Clock, Phone, Mail, Users, ArrowLeft, Calendar, FileText, Star } from "lucide-react";

const TechnicianApplicationConfirmation = () => {
  const nextSteps = [
    {
      icon: Clock,
      title: "Application Review",
      description: "Our recruitment team will review your application within 48 hours",
      timeframe: "1-2 business days"
    },
    {
      icon: Phone,
      title: "Initial Contact",
      description: "If selected, we'll contact you to schedule a technical assessment",
      timeframe: "2-3 business days"
    },
    {
      icon: Users,
      title: "Technical Assessment",
      description: "Complete a practical test to demonstrate your technical skills",
      timeframe: "1 week"
    },
    {
      icon: Calendar,
      title: "Interview",
      description: "Meet with our team for a comprehensive interview",
      timeframe: "1-2 weeks"
    },
    {
      icon: FileText,
      title: "Background Check",
      description: "Complete background verification and reference checks",
      timeframe: "2-3 weeks"
    },
    {
      icon: Star,
      title: "Welcome to the Team",
      description: "Complete orientation and start your first jobs",
      timeframe: "3-4 weeks"
    }
  ];

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      contact: "+63 123 456 7890",
      description: "Mon-Fri 8AM-6PM"
    },
    {
      icon: Mail,
      title: "Email Us",
      contact: "careers@proqual.com",
      description: "Response within 24 hours"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header Section */}
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <div className="inline-block">
              <Link to="/join-our-team">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Join Our Team
                </Button>
              </Link>
            </div>
            
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold">
              Application
              <span className="block bg-gradient-hero bg-clip-text text-transparent mt-2">
                Submitted Successfully!
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Thank you for your interest in joining the ProQual team! Your application has been received and is now under review.
            </p>
          </div>
        </div>
      </section>

      {/* Confirmation Details */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Application Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Application Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Application ID</p>
                    <p className="font-semibold">#TECH-2025-001</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted On</p>
                    <p className="font-semibold">{new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>What's next?</strong> We'll review your application and contact you within 48 hours. 
                    Please keep an eye on your email and phone for updates.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {nextSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                            <Icon className="h-5 w-5 text-accent" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold">{step.title}</h3>
                            <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                              {step.timeframe}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Questions About Your Application?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {contactInfo.map((contact, index) => {
                    const Icon = contact.icon;
                    return (
                      <div key={index} className="text-center p-4 border rounded-lg">
                        <Icon className="h-8 w-8 text-accent mx-auto mb-3" />
                        <h3 className="font-semibold mb-1">{contact.title}</h3>
                        <p className="text-primary font-semibold mb-1">{contact.contact}</p>
                        <p className="text-sm text-muted-foreground">{contact.description}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/">
                <Button variant="outline" size="lg">
                  Return to Home
                </Button>
              </Link>
              <Link to="/join-our-team">
                <Button variant="accent" size="lg">
                  Learn More About ProQual
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TechnicianApplicationConfirmation;



