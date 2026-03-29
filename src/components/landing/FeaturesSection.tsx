import { BookOpen, Bot, Target, Layers } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Vocabulary by Topics",
    description: "Learn words organized by IELTS-relevant topics like Education, Technology, and Environment.",
  },
  {
    icon: Bot,
    title: "AI Practice Assistant",
    description: "Get instant explanations, practice speaking, and improve your writing with AI support.",
  },
  {
    icon: Target,
    title: "IELTS-Focused Learning",
    description: "Every word and phrase is chosen for its relevance to real IELTS exams across all four sections.",
  },
  {
    icon: Layers,
    title: "Leveled Progression",
    description: "Start from A2 basics and work up to B2 advanced vocabulary at your own pace.",
  },
];

const FeaturesSection = () => (
  <section id="features" className="section-padding bg-card">
    <div className="container-wide">
      <div className="text-center mb-14 animate-reveal">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Everything you need to master IELTS vocabulary
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          A smart platform designed specifically for IELTS preparation, not just another word list.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, i) => (
          <div
            key={feature.title}
            className="card-base p-6 group"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
              <feature.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
