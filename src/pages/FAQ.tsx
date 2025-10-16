import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I book a service?",
      answer: "Simply click 'Book Now' and fill out our easy booking form. Select your service type, preferred date and time, and we'll match you with a qualified technician."
    },
    {
      question: "Are your technicians certified?",
      answer: "Yes, all our technicians are certified professionals with extensive experience in air conditioning installation, repair, and maintenance."
    },
    {
      question: "What areas do you serve?",
      answer: "We currently serve Metro Manila and surrounding areas. Check our service areas page for the complete list of covered locations."
    },
    {
      question: "Do you provide warranties?",
      answer: "Yes, we provide warranties on all our services. Installation services come with a 1-year warranty, while repairs and maintenance have a 90-day warranty."
    },
    {
      question: "How much do your services cost?",
      answer: "Our pricing is transparent and competitive. Basic cleaning starts at ₱800, repairs from ₱1,200, and installations from ₱2,500. Get a free quote for your specific needs."
    },
    {
      question: "Can I reschedule my appointment?",
      answer: "Yes, you can reschedule your appointment up to 24 hours before your scheduled time through your dashboard or by contacting our support team."
    },
    {
      question: "What types of air conditioners do you service?",
      answer: "We service all types of air conditioners including window type, split type, cassette type, and central air conditioning systems."
    },
    {
      question: "How long does a typical service take?",
      answer: "Service duration varies by type: General cleaning takes 1-2 hours, deep cleaning takes 2-3 hours, repairs take 1-4 hours depending on complexity, and installation takes 2-6 hours."
    },
    {
      question: "Do you provide emergency services?",
      answer: "Yes, we offer emergency repair services for urgent air conditioning issues. Emergency services are available 24/7 with additional charges for after-hours calls."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash, credit cards, debit cards, and digital payments including GCash, PayMaya, and bank transfers. All payments are processed securely."
    },
    {
      question: "Do I need to be present during the service?",
      answer: "While it's recommended to be present during the initial assessment, you don't need to be there for the entire service. Our technicians are trustworthy and will provide detailed reports of work completed."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "We guarantee your satisfaction. If you're not happy with our service, contact us within 48 hours and we'll make it right or provide a full refund."
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
              <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold">
                <HelpCircle className="h-4 w-4" />
                Frequently Asked Questions
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold">
              Got Questions?
              <span className="block bg-gradient-hero bg-clip-text text-transparent mt-2">
                We've Got Answers
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers to the most common questions about our aircon services, booking process, and policies.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6 hover:shadow-large transition-all duration-300 border-2 hover:border-accent/50">
                <h3 className="text-lg font-semibold mb-3 text-foreground">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden border-2 border-accent/20 max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
            <div className="relative p-12 text-center space-y-6">
              <h2 className="text-3xl font-bold">Still Have Questions?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help you with any questions or concerns.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <a href="tel:+631234567890">
                  <button className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors">
                    Call Us Now
                  </button>
                </a>
                <a href="mailto:support@proqual.com">
                  <button className="px-6 py-3 border-2 border-accent text-accent rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors">
                    Email Support
                  </button>
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
