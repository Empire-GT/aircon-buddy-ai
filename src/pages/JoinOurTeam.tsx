import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Wrench, Star, Clock, DollarSign, Shield, CheckCircle, Mail, Phone, MapPin, Award, TrendingUp, Heart } from "lucide-react";

const JoinOurTeam = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Pay",
      description: "Earn ₱800-₱2,500 per service with performance bonuses and tips"
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Choose your own working hours and days that fit your lifestyle"
    },
    {
      icon: Shield,
      title: "Insurance Coverage",
      description: "Comprehensive health and accident insurance for all technicians"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Opportunities for advancement and skill development programs"
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Monthly awards and recognition for top-performing technicians"
    },
    {
      icon: Heart,
      title: "Supportive Community",
      description: "Join a team of professionals who support and help each other"
    }
  ];

  const requirements = [
    "Minimum 2 years of experience in air conditioning installation, repair, and maintenance",
    "Valid TESDA certification in Refrigeration and Air Conditioning (RAC) or equivalent",
    "Own set of basic tools and equipment",
    "Valid driver's license and reliable transportation",
    "Good communication skills and customer service orientation",
    "Physical fitness to handle heavy equipment and work in various conditions",
    "Clean criminal record and professional references",
    "Willingness to undergo background checks and drug testing"
  ];

  const applicationSteps = [
    {
      step: "1",
      title: "Submit Application",
      description: "Fill out our online application form with your details and experience"
    },
    {
      step: "2",
      title: "Initial Screening",
      description: "Our team will review your application and contact you within 48 hours"
    },
    {
      step: "3",
      title: "Technical Assessment",
      description: "Complete a practical test to demonstrate your technical skills"
    },
    {
      step: "4",
      title: "Interview",
      description: "Meet with our team for a comprehensive interview and culture fit assessment"
    },
    {
      step: "5",
      title: "Background Check",
      description: "Complete background verification and reference checks"
    },
    {
      step: "6",
      title: "Onboarding",
      description: "Welcome to the team! Complete orientation and start your first jobs"
    }
  ];

  const testimonials = [
    {
      name: "Juan Dela Cruz",
      role: "Senior Technician",
      experience: "3 years with ProQual",
      quote: "Working with ProQual has been amazing. The flexible schedule allows me to spend time with my family while earning good money. The support from the team is incredible.",
      rating: 5
    },
    {
      name: "Maria Santos",
      role: "Lead Technician",
      experience: "2 years with ProQual",
      quote: "The training programs and career development opportunities here are excellent. I've grown so much as a technician and as a person.",
      rating: 5
    },
    {
      name: "Roberto Garcia",
      role: "Master Technician",
      experience: "4 years with ProQual",
      quote: "The best part about working here is the respect and recognition we get. Our hard work is always appreciated and rewarded.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold">
                Join Our Growing Team
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Become a ProQual
              <span className="block bg-gradient-hero bg-clip-text text-transparent mt-2">
                Technician
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join the leading air conditioning service platform in Metro Manila. 
              Work with cutting-edge technology, earn competitive rates, and be part of a supportive community of professionals.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/technician-application">
                <Button variant="hero" size="lg" className="group">
                  Apply Now
                  <Users className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  const benefitsSection = document.getElementById('benefits');
                  benefitsSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                200+
              </div>
              <div className="text-muted-foreground font-medium">Active Technicians</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                ₱1,200
              </div>
              <div className="text-muted-foreground font-medium">Average Daily Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                98%
              </div>
              <div className="text-muted-foreground font-medium">Job Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-muted-foreground font-medium">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Why Join ProQual?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the benefits of being part of the ProQual technician network
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-large transition-all duration-300 border-2 hover:border-accent/50 group">
                  <div className="mb-4 p-3 bg-gradient-accent rounded-lg w-fit group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-4">Requirements</h2>
                <p className="text-xl text-muted-foreground">
                  What you need to become a ProQual technician
                </p>
              </div>
              <div className="space-y-4">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-accent opacity-20 blur-3xl rounded-full"></div>
              <Card className="relative p-8 text-center">
                <Wrench className="h-16 w-16 text-accent mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Ready to Apply?</h3>
                <p className="text-muted-foreground mb-6">
                  If you meet our requirements, we'd love to hear from you!
                </p>
                <Link to="/technician-application">
                  <Button variant="accent" size="lg" className="w-full">
                    Start Application
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Application Process</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our simple 6-step process to join the ProQual team
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applicationSteps.map((step, index) => (
              <Card key={index} className="p-6 hover:shadow-large transition-all duration-300 border-2 hover:border-accent/50 group">
                <div className="mb-4 p-3 bg-gradient-accent rounded-lg w-fit group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-accent-foreground">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">What Our Technicians Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from our current technicians about their experience with ProQual
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-large transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  <div className="text-sm text-accent font-medium">{testimonial.experience}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden border-2 border-accent/20">
            <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
            <div className="relative p-12 text-center space-y-6">
              <h2 className="text-4xl font-bold">Ready to Start Your Journey?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join hundreds of satisfied technicians who have found success with ProQual. 
                Apply today and take the first step towards a rewarding career.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button variant="hero" size="lg">
                  Apply Now
                </Button>
                <Button variant="outline" size="lg">
                  Download Application Form
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold">Questions About Joining?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our recruitment team is here to help you with any questions about joining ProQual.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 text-center hover:shadow-large transition-all duration-300">
              <Mail className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email Us</h3>
              <p className="text-muted-foreground mb-2">careers@proqual.com</p>
              <p className="text-sm text-muted-foreground">Recruitment Team</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-large transition-all duration-300">
              <Phone className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Call Us</h3>
              <p className="text-muted-foreground mb-2">+63 123 456 7890</p>
              <p className="text-sm text-muted-foreground">Mon-Fri 8AM-6PM</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-large transition-all duration-300">
              <MapPin className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
              <p className="text-muted-foreground mb-2">Metro Manila</p>
              <p className="text-sm text-muted-foreground">Philippines</p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JoinOurTeam;
