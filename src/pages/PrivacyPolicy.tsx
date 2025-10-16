import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Mail, Phone, MapPin } from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Information We Collect",
      content: [
        "Personal Information: Name, email address, phone number, and address when you create an account or book a service.",
        "Service Information: Details about your air conditioning units, service history, and preferences.",
        "Payment Information: Credit card details and billing information (processed securely through our payment partners).",
        "Usage Data: Information about how you use our website and services, including IP address, browser type, and device information.",
        "Communication Records: Records of your interactions with our customer support team."
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        "Service Delivery: To provide air conditioning services, schedule appointments, and communicate with technicians.",
        "Account Management: To create and manage your account, process bookings, and maintain service history.",
        "Payment Processing: To process payments and send receipts for services rendered.",
        "Customer Support: To respond to your inquiries, resolve issues, and provide technical support.",
        "Service Improvement: To analyze usage patterns and improve our services and user experience.",
        "Marketing: To send you promotional materials and updates about our services (with your consent)."
      ]
    },
    {
      title: "Information Sharing",
      content: [
        "Technicians: We share necessary information with our certified technicians to enable service delivery.",
        "Service Partners: We may share information with trusted third-party service providers who assist in our operations.",
        "Legal Requirements: We may disclose information when required by law or to protect our rights and safety.",
        "Business Transfers: In the event of a merger or acquisition, your information may be transferred to the new entity.",
        "Consent: We may share information with your explicit consent for specific purposes."
      ]
    },
    {
      title: "Data Security",
      content: [
        "Encryption: All sensitive data is encrypted using industry-standard encryption protocols.",
        "Secure Storage: Your information is stored on secure servers with restricted access.",
        "Payment Security: Payment information is processed through PCI-compliant payment processors.",
        "Regular Audits: We conduct regular security audits to ensure the protection of your data.",
        "Access Controls: Only authorized personnel have access to your personal information."
      ]
    },
    {
      title: "Your Rights",
      content: [
        "Access: You have the right to access and review your personal information.",
        "Correction: You can request corrections to inaccurate or incomplete information.",
        "Deletion: You can request the deletion of your personal information (subject to legal requirements).",
        "Portability: You can request a copy of your data in a portable format.",
        "Opt-out: You can opt out of marketing communications at any time.",
        "Complaints: You have the right to file complaints with relevant data protection authorities."
      ]
    },
    {
      title: "Cookies and Tracking",
      content: [
        "Essential Cookies: We use cookies necessary for the basic functionality of our website.",
        "Analytics Cookies: We use cookies to analyze website usage and improve user experience.",
        "Marketing Cookies: We may use cookies for targeted advertising (with your consent).",
        "Cookie Management: You can manage cookie preferences through your browser settings.",
        "Third-party Services: We may use third-party analytics and advertising services that use cookies."
      ]
    },
    {
      title: "Data Retention",
      content: [
        "Account Information: Retained for the duration of your account plus 3 years for legal compliance.",
        "Service Records: Retained for 7 years for warranty and legal purposes.",
        "Payment Records: Retained for 7 years as required by financial regulations.",
        "Communication Records: Retained for 3 years for customer support purposes.",
        "Marketing Data: Retained until you opt out or for 2 years of inactivity."
      ]
    },
    {
      title: "International Transfers",
      content: [
        "Data Processing: Your data may be processed in countries outside your residence.",
        "Adequate Protection: We ensure adequate protection through appropriate safeguards.",
        "Standard Contractual Clauses: We use standard contractual clauses for international transfers.",
        "Consent: We obtain your consent for international data transfers when required.",
        "Local Laws: We comply with local data protection laws in all jurisdictions."
      ]
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
                <Shield className="h-4 w-4" />
                Privacy Policy
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold">
              Privacy Policy
              <span className="block bg-gradient-hero bg-clip-text text-transparent mt-2">
                Your Privacy Matters
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              At ProQual, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This policy explains how we collect, use, and safeguard your data.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: January 2025
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <Card key={index} className="p-8 hover:shadow-large transition-all duration-300">
                <h2 className="text-2xl font-bold mb-6 text-foreground">{section.title}</h2>
                <ul className="space-y-4">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-muted-foreground leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold">Questions About Your Privacy?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              If you have any questions about this Privacy Policy or how we handle your data, please contact us.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 text-center hover:shadow-large transition-all duration-300">
              <Mail className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email Us</h3>
              <p className="text-muted-foreground mb-2">privacy@proqual.com</p>
              <p className="text-sm text-muted-foreground">Privacy Inquiries</p>
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

export default PrivacyPolicy;
