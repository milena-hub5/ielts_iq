import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => (
  <section className="section-padding">
    <div className="container-narrow">
      <div className="rounded-2xl p-10 md:p-16 text-center" style={{ background: "var(--hero-gradient)" }}>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground mb-4">
          Boost your IELTS score with smarter vocabulary learning
        </h2>
        <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
          Join thousands of students preparing for IELTS with structured, AI-powered vocabulary practice.
        </p>
        <Button size="xl" variant="hero-outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-0" asChild>
          <Link to="/dashboard">
            Start Learning Free
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  </section>
);

export default CTASection;
