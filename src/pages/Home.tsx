import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";
import { Calendar, Shield, Clock, Star, CheckCircle, Users, Wind, Wrench, Settings, Droplets, Search, MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-aircon.jpg";
import technicianImage from "@/assets/technician-service.jpg";

const Home = () => {
  const features = [
    {
      icon: Calendar,
      title: "Easy Booking",
      description: "Schedule your aircon service in just a few clicks with our streamlined booking system",
    },
    {
      icon: Users,
      title: "Expert Technicians",
      description: "All technicians are verified, trained, and rated by customers for quality assurance",
    },
    {
      icon: Clock,
      title: "Real-Time Tracking",
      description: "Track your technician's location in real-time and get accurate arrival estimates",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Multiple payment options with secure, encrypted transactions and instant receipts",
    },
  ];

  const services = [
    { name: "General Cleaning", price: "From ₱500" },
    { name: "Deep Cleaning", price: "From ₱800" },
    { name: "Repair & Maintenance", price: "From ₱1,200" },
    { name: "Installation", price: "From ₱2,500" },
  ];

  const detailedServices = [
    {
      icon: Wrench,
      title: "Installation",
      description: "Professional installation of window, split, and cassette type air conditioners",
      price: "From ₱2,500",
      features: ["Expert installation", "Warranty included", "Free consultation"]
    },
    {
      icon: Settings,
      title: "Repair & Maintenance",
      description: "Comprehensive repair services and regular maintenance to keep your AC running efficiently",
      price: "From ₱800",
      features: ["Diagnostic service", "Parts replacement", "Performance optimization"]
    },
    {
      icon: Droplets,
      title: "Deep Cleaning",
      description: "Thorough cleaning service to remove dirt, bacteria, and improve air quality",
      price: "From ₱800",
      features: ["Complete disassembly", "Antibacterial treatment", "Filter replacement"]
    },
    {
      icon: Search,
      title: "Inspection & Quotation",
      description: "Professional inspection and detailed quotation for your aircon needs",
      price: "From ₱500",
      features: ["Detailed assessment", "Written report", "Transparent pricing"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Makati City",
      rating: 5,
      comment: "Excellent service! The technician was professional, punctual, and did a thorough job. My AC is working like new again.",
      service: "Deep Cleaning"
    },
    {
      name: "Michael Chen",
      location: "Quezon City",
      rating: 5,
      comment: "Fast and reliable service. The booking process was so easy and the technician arrived exactly on time. Highly recommended!",
      service: "Repair Service"
    },
    {
      name: "Maria Santos",
      location: "Taguig City",
      rating: 5,
      comment: "Great value for money. The technician explained everything clearly and the service was completed quickly. Will definitely use again.",
      service: "Installation"
    }
  ];


  const stats = [
    { value: "5,000+", label: "Happy Customers" },
    { value: "200+", label: "Expert Technicians" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Support Available" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-block">
                <span className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold">
                  #1 Aircon Service Platform
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Professional Aircon Service
                <span className="block bg-gradient-hero bg-clip-text text-transparent mt-2">
                  At Your Doorstep
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Book verified technicians, track them in real-time, and enjoy transparent pricing with secure online payments.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/booking">
                  <Button variant="hero" className="group">
                    Book Now
                    <Calendar className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    const servicesSection = document.getElementById('services');
                    servicesSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Learn More
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="absolute -inset-4 bg-gradient-accent opacity-20 blur-3xl rounded-full"></div>
              <img
                src={heroImage}
                alt="Modern air conditioning unit in a comfortable living room"
                className="relative rounded-2xl shadow-large w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Why Choose ProQual?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of aircon servicing with our technology-driven platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-large transition-all duration-300 border-2 hover:border-accent/50 group">
                  <div className="mb-4 p-3 bg-gradient-accent rounded-lg w-fit group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src={technicianImage}
                alt="Professional technician servicing an air conditioner"
                className="rounded-2xl shadow-large"
              />
              <div className="absolute -bottom-6 -right-6 bg-background p-6 rounded-xl shadow-large border-2 border-accent/20">
                <div className="flex items-center gap-2 text-accent mb-1">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="text-2xl font-bold">4.9/5</span>
                </div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-4">Our Services</h2>
                <p className="text-xl text-muted-foreground">
                  Comprehensive aircon solutions tailored to your needs
                </p>
              </div>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-background rounded-lg shadow-soft hover:shadow-medium transition-all">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span className="font-semibold">{service.name}</span>
                    </div>
                    <span className="text-primary font-bold">{service.price}</span>
                  </div>
                ))}
              </div>
              <Link to="/booking">
                <Button variant="accent" size="lg" className="w-full md:w-auto">
                  Book a Service Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Services Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive aircon solutions tailored to your needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {detailedServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-large transition-all duration-300 border-2 hover:border-accent/50 group">
                  <div className="mb-4 p-3 bg-gradient-accent rounded-lg w-fit group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <div className="text-2xl font-bold text-accent mb-4">{service.price}</div>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real feedback from satisfied customers across Metro Manila
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
                <p className="text-muted-foreground mb-4 italic">"{testimonial.comment}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                  <div className="text-sm text-accent font-medium">{testimonial.service}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Get in Touch</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions? We're here to help you with all your aircon needs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 text-center hover:shadow-large transition-all duration-300">
              <Phone className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Call Us</h3>
              <p className="text-muted-foreground mb-2">+63 123 456 7890</p>
              <p className="text-sm text-muted-foreground">Mon-Fri 8AM-6PM</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-large transition-all duration-300">
              <Mail className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email Us</h3>
              <p className="text-muted-foreground mb-2">support@proqual.com</p>
              <p className="text-sm text-muted-foreground">24/7 Support</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-large transition-all duration-300">
              <MapPin className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Service Areas</h3>
              <p className="text-muted-foreground mb-2">Metro Manila</p>
              <p className="text-sm text-muted-foreground">And surrounding areas</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden border-2 border-accent/20">
            <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
            <div className="relative p-12 text-center space-y-6">
              <h2 className="text-4xl font-bold">Ready to Experience the Difference?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust ProQual for their aircon needs
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link to="/booking">
                  <Button variant="hero">
                    Book Your Service
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />

      {/* AI Chat */}
      <AIChat />
    </div>
  );
};

export default Home;
