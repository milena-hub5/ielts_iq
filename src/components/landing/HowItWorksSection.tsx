import { BookOpen, Bot, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: BookOpen,
    step: "01",
    title: "Learn words",
    description: "Browse vocabulary organized by topics, levels, and IELTS sections.",
  },
  {
    icon: Bot,
    step: "02",
    title: "Practice with AI",
    description: "Use the AI assistant to practice speaking, get word explanations, and improve writing.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Improve your band score",
    description: "Track your progress and watch your vocabulary grow alongside your confidence.",
  },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="section-padding bg-card">
    <div className="container-wide">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          How it works
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Three simple steps to a better IELTS vocabulary.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((s) => (
          <div key={s.step} className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <s.icon className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs font-bold text-primary tracking-widest uppercase">Step {s.step}</span>
            <h3 className="text-lg font-bold text-foreground mt-2 mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
