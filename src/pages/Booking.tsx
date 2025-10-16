import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StepBooking from "@/components/StepBooking";

const Booking = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <StepBooking />
      <Footer />
    </div>
  );
};

export default Booking;
