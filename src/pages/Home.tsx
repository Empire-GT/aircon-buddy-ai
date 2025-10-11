import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Calendar, Shield, Clock, Star, CheckCircle, Users, Wind } from "lucide-react";
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
                <Button variant="outline" size="lg">
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
            <h2 className="text-4xl font-bold">Why Choose CoolAir Pro?</h2>
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

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden border-2 border-accent/20">
            <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
            <div className="relative p-12 text-center space-y-6">
              <h2 className="text-4xl font-bold">Ready to Experience the Difference?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust CoolAir Pro for their aircon needs
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link to="/booking">
                  <Button variant="hero">
                    Book Your Service
                  </Button>
                </Link>
                <Link to="/admin">
                  <Button variant="outline" size="lg">
                    Admin Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Wind className="h-6 w-6" />
              <span className="text-xl font-bold">CoolAir Pro</span>
            </div>
            <p className="text-primary-foreground/80">
              Professional aircon services at your fingertips
            </p>
            <p className="text-sm text-primary-foreground/60">
              © 2025 CoolAir Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
