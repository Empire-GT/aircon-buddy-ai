import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { CheckCircle, Star, Wrench, Settings, Droplets, Search, Calendar } from "lucide-react";

const Pricing = () => {
  const services = [
    {
      icon: Droplets,
      title: "General Cleaning",
      description: "Basic cleaning service for your air conditioner",
      price: "₱500",
      originalPrice: "₱800",
      features: [
        "Filter cleaning",
        "Basic dust removal",
        "Visual inspection",
        "Performance check",
        "30-day service warranty"
      ],
      popular: false,
      duration: "30-45 mins"
    },
    {
      icon: Droplets,
      title: "Deep Cleaning",
      description: "Comprehensive cleaning with disassembly",
      price: "₱800",
      originalPrice: "₱1,200",
      features: [
        "Complete disassembly",
        "Antibacterial treatment",
        "Filter replacement",
        "Coil cleaning",
        "Drainage system cleaning",
        "90-day service warranty"
      ],
      popular: true,
      duration: "60-90 mins"
    },
    {
      icon: Settings,
      title: "Repair & Maintenance",
      description: "Diagnostic and repair services",
      price: "₱1,200",
      originalPrice: "₱1,800",
      features: [
        "Comprehensive diagnostic",
        "Parts replacement",
        "Performance optimization",
        "Electrical system check",
        "Refrigerant level check",
        "6-month service warranty"
      ],
      popular: false,
      duration: "90-120 mins"
    },
    {
      icon: Wrench,
      title: "Installation",
      description: "Professional AC installation service",
      price: "₱2,500",
      originalPrice: "₱3,500",
      features: [
        "Expert installation",
        "Electrical connection",
        "Drainage setup",
        "Performance testing",
        "User training",
        "1-year installation warranty"
      ],
      popular: false,
      duration: "2-4 hours"
    }
  ];

  const packages = [
    {
      name: "Basic Package",
      price: "₱1,500",
      originalPrice: "₱2,200",
      description: "Perfect for regular maintenance",
      features: [
        "General Cleaning",
        "Basic Inspection",
        "Filter Replacement",
        "Performance Report"
      ],
      popular: false
    },
    {
      name: "Premium Package",
      price: "₱2,800",
      originalPrice: "₱4,000",
      description: "Most popular choice for comprehensive care",
      features: [
        "Deep Cleaning",
        "Comprehensive Inspection",
        "Filter & Parts Replacement",
        "Performance Optimization",
        "Priority Support",
        "6-month Service Warranty"
      ],
      popular: true
    },
    {
      name: "Complete Package",
      price: "₱4,500",
      originalPrice: "₱6,500",
      description: "Full service solution for new installations",
      features: [
        "Professional Installation",
        "Deep Cleaning",
        "Comprehensive Inspection",
        "All Parts & Filters",
        "Performance Optimization",
        "User Training",
        "1-year Full Warranty",
        "Priority Support"
      ],
      popular: false
    }
  ];

  const addOns = [
    {
      name: "Extended Warranty",
      price: "₱500",
      description: "Extend your service warranty by 6 months"
    },
    {
      name: "Priority Booking",
      price: "₱200",
      description: "Get priority scheduling for your service"
    },
    {
      name: "Same Day Service",
      price: "₱300",
      description: "Emergency same-day service availability"
    },
    {
      name: "Annual Maintenance Plan",
      price: "₱2,000",
      description: "4 scheduled cleanings per year with 20% discount"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h1 className="text-5xl font-bold">Transparent Pricing</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                No hidden fees, no surprises. Get professional aircon services at competitive prices with complete transparency.
              </p>
              <div className="flex items-center justify-center gap-2 text-accent">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-semibold">4.9/5 Average Rating</span>
                <span className="text-muted-foreground">•</span>
                <span>5,000+ Happy Customers</span>
              </div>
            </div>
          </div>
        </section>

        {/* Individual Services */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-bold">Individual Services</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose the specific service you need with transparent pricing
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Card key={index} className={`p-6 hover:shadow-large transition-all duration-300 border-2 ${service.popular ? 'border-accent/50 bg-accent/5' : 'hover:border-accent/50'}`}>
                    {service.popular && (
                      <Badge className="mb-4 bg-accent text-accent-foreground">Most Popular</Badge>
                    )}
                    <div className="mb-4 p-3 bg-gradient-accent rounded-lg w-fit">
                      <Icon className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-accent">{service.price}</span>
                        <span className="text-lg text-muted-foreground line-through">{service.originalPrice}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{service.duration}</p>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link to="/booking" className="w-full">
                      <Button variant={service.popular ? "accent" : "outline"} className="w-full">
                        Book This Service
                      </Button>
                    </Link>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Service Packages */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-bold">Service Packages</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Save more with our bundled service packages
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {packages.map((pkg, index) => (
                <Card key={index} className={`p-8 hover:shadow-large transition-all duration-300 border-2 ${pkg.popular ? 'border-accent/50 bg-accent/5 scale-105' : 'hover:border-accent/50'}`}>
                  {pkg.popular && (
                    <Badge className="mb-4 bg-accent text-accent-foreground">Most Popular</Badge>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-muted-foreground mb-6">{pkg.description}</p>
                  <div className="mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-4xl font-bold text-accent">{pkg.price}</span>
                      <span className="text-lg text-muted-foreground line-through">{pkg.originalPrice}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/booking" className="w-full">
                    <Button variant={pkg.popular ? "accent" : "outline"} size="lg" className="w-full">
                      Choose Package
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Add-ons */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-bold">Add-on Services</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Enhance your service with these optional add-ons
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {addOns.map((addon, index) => (
                <Card key={index} className="p-6 hover:shadow-large transition-all duration-300 border-2 hover:border-accent/50">
                  <h3 className="text-lg font-bold mb-2">{addon.name}</h3>
                  <div className="text-2xl font-bold text-accent mb-2">{addon.price}</div>
                  <p className="text-muted-foreground text-sm">{addon.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-bold">Pricing FAQ</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Common questions about our pricing and services
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Are there any hidden fees?</h3>
                <p className="text-muted-foreground">No, our pricing is completely transparent. The price you see is the price you pay. We'll provide a detailed quote before starting any work.</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Do you offer discounts for multiple services?</h3>
                <p className="text-muted-foreground">Yes! Our service packages offer significant savings when you book multiple services together. Check out our package deals above.</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">We accept cash, GCash, PayMaya, bank transfers, and credit cards. Payment is due upon completion of service.</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Can I get a free quote?</h3>
                <p className="text-muted-foreground">Absolutely! We offer free inspection and quotation services. Book an inspection to get a detailed quote for your specific needs.</p>
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
                <h2 className="text-4xl font-bold">Ready to Book Your Service?</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Get started today with our easy booking process and transparent pricing
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Link to="/booking">
                    <Button variant="hero" size="lg" className="group">
                      <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                      Book Now
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg">
                    Get Free Quote
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Pricing;
