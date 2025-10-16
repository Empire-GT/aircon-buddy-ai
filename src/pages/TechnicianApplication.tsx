import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TechnicianApplicationForm from "@/components/TechnicianApplicationForm";
import { Users, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TechnicianApplication = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header Section */}
      <section className="pt-24 pb-8">
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
            
            <div className="inline-block">
              <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold">
                <Users className="h-4 w-4" />
                Technician Application
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold">
              Apply to Become a
              <span className="block bg-gradient-hero bg-clip-text text-transparent mt-2">
                ProQual Technician
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join our team of professional air conditioning technicians. Fill out the application form below and take the first step towards a rewarding career with ProQual.
            </p>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="pb-20">
        <TechnicianApplicationForm />
      </section>

      <Footer />
    </div>
  );
};

export default TechnicianApplication;



