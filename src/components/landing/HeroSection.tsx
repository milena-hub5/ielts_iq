import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => (
  <section className="section-padding overflow-hidden">
    <div className="container-wide text-center">
      <div className="max-w-3xl mx-auto">
        <div className="animate-reveal">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-primary text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered IELTS Preparation
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6 animate-reveal-delay-1">
          Learn IELTS Vocabulary{" "}
          <span className="text-gradient">Smarter</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-reveal-delay-2">
          Master words by topic, level, and exam sections with AI support.
          Build the vocabulary you need for band 5.0–7.0 and beyond.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-reveal-delay-3">
          <Button variant="hero" size="xl" asChild>
            <Link to="/dashboard">
              Start Learning
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
          <Button variant="hero-outline" size="xl" asChild>
            <Link to="/ai-assistant">
              Try AI Assistant
            </Link>
          </Button>
        </div>
      </div>

      {/* Floating word cards */}
      <div className="relative mt-16 max-w-4xl mx-auto animate-reveal-delay-3">
        <div className="grid grid-cols-3 gap-4">
          {[
            { word: "Substantial", level: "B2", meaning: "Large in amount or value" },
            { word: "Fluctuate", level: "B2", meaning: "Rise and fall irregularly" },
            { word: "Implement", level: "B1", meaning: "Put into effect or action" },
          ].map((item, i) => (
            <div
              key={item.word}
              className="card-base p-5 text-left"
              style={{ animation: `float 3s ease-in-out ${i * 0.5}s infinite` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-foreground">{item.word}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{item.level}</span>
              </div>
              <p className="text-xs text-muted-foreground">{item.meaning}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
