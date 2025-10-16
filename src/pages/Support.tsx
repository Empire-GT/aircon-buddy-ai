import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Headphones, MessageCircle, Phone, Mail, Clock, MapPin, HelpCircle, FileText, Users, Star, CheckCircle } from "lucide-react";

const Support = () => {
  const supportOptions = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our support team",
      contact: "+63 123 456 7890",
      availability: "Mon-Fri 8AM-6PM, Sat 9AM-4PM",
      action: "Call Now"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help through our chat system",
      contact: "Available 24/7",
      availability: "Average response: 2 minutes",
      action: "Start Chat"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      contact: "support@proqual.com",
      availability: "Response within 24 hours",
      action: "Send Email"
    }
  ];

  const faqCategories = [
    {
      title: "Booking & Scheduling",
      questions: [
        {
          question: "How do I book a service?",
          answer: "You can book a service by clicking 'Book Now' on our website, selecting your service type, choosing your preferred date and time, and filling out the booking form."
        },
        {
          question: "Can I reschedule my appointment?",
          answer: "Yes, you can reschedule your appointment up to 24 hours before your scheduled time through your dashboard or by contacting our support team."
        },
        {
          question: "What if I need to cancel my booking?",
          answer: "You can cancel your booking up to 24 hours before the scheduled time without any charges. Cancellations within 24 hours may incur a cancellation fee."
        }
      ]
    },
    {
      title: "Services & Pricing",
      questions: [
        {
          question: "What services do you offer?",
          answer: "We offer aircon installation, repair, maintenance, deep cleaning, and inspection services. All services are performed by certified technicians."
        },
        {
          question: "How much do your services cost?",
          answer: "Our pricing varies by service type: General cleaning starts at ₱800, deep cleaning from ₱800, repairs from ₱1,200, and installations from ₱2,500."
        },
        {
          question: "Do you provide warranties?",
          answer: "Yes, we provide warranties on all our services. Installation services come with a 1-year warranty, while repairs and maintenance have a 90-day warranty."
        }
      ]
    },
    {
      title: "Technical Support",
      questions: [
        {
          question: "What types of air conditioners do you service?",
          answer: "We service all types of air conditioners including window type, split type, cassette type, and central air conditioning systems."
        },
        {
          question: "How long does a typical service take?",
          answer: "Service duration varies: General cleaning takes 1-2 hours, deep cleaning takes 2-3 hours, repairs take 1-4 hours, and installation takes 2-6 hours."
        },
        {
          question: "Do you provide emergency services?",
          answer: "Yes, we offer emergency repair services for urgent air conditioning issues. Emergency services are available 24/7 with additional charges for after-hours calls."
        }
      ]
    }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with our support team",
      contact: "+63 123 456 7890",
      hours: "Mon-Fri: 8AM-6PM\nSat: 9AM-4PM\nSun: Closed"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      contact: "support@proqual.com",
      hours: "Response within 24 hours"
    },
    {
      icon: MapPin,
      title: "Visit Our Office",
      description: "Come see us in person",
      contact: "Metro Manila, Philippines",
      hours: "Mon-Fri: 9AM-5PM"
    }
  ];

  const supportStats = [
    { value: "24/7", label: "Support Available" },
    { value: "< 2 min", label: "Average Response" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "5,000+", label: "Issues Resolved" }
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
                Customer Support
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              How Can We
              <span className="block bg-gradient-hero bg-clip-text text-transparent mt-2">
                Help You?
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our dedicated support team is here to assist you with any questions, concerns, or issues you may have. 
              We're committed to providing excellent customer service and ensuring your complete satisfaction.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {supportStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Options Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Get in Touch</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the most convenient way to reach our support team
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {supportOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-large transition-all duration-300 border-2 hover:border-accent/50 group text-center">
                  <div className="mb-4 p-3 bg-gradient-accent rounded-lg w-fit mx-auto group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                  <p className="text-muted-foreground mb-4">{option.description}</p>
                  <p className="text-primary font-semibold mb-2">{option.contact}</p>
                  <p className="text-sm text-muted-foreground mb-4">{option.availability}</p>
                  <Button variant="accent" className="w-full">
                    {option.action}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find quick answers to common questions
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="p-6">
                <h3 className="text-2xl font-bold mb-6 text-foreground">{category.title}</h3>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <div key={faqIndex} className="border-l-4 border-accent/20 pl-4">
                      <h4 className="text-lg font-semibold mb-2 text-foreground">{faq.question}</h4>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Contact Information</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Multiple ways to reach our support team
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-large transition-all duration-300">
                  <Icon className="h-8 w-8 text-accent mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                  <p className="text-muted-foreground mb-4">{method.description}</p>
                  <p className="text-primary font-semibold mb-2">{method.contact}</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{method.hours}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emergency Support Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden border-2 border-accent/20 max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
            <div className="relative p-12 text-center space-y-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="h-8 w-8 text-accent" />
                <h2 className="text-3xl font-bold">Emergency Support</h2>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Need urgent air conditioning repair? Our emergency support team is available 24/7 to help you with critical issues.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <a href="tel:+631234567890">
                  <Button variant="hero" size="lg">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Emergency Line
                  </Button>
                </a>
                <Button variant="outline" size="lg">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Emergency Chat
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Support;
