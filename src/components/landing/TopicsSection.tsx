import { Link } from "react-router-dom";
import { GraduationCap, Cpu, Leaf, Heart, Shield, Briefcase } from "lucide-react";

const topics = [
  { name: "Education", icon: GraduationCap, words: 120, color: "bg-blue-50 text-blue-600" },
  { name: "Technology", icon: Cpu, words: 95, color: "bg-violet-50 text-violet-600" },
  { name: "Environment", icon: Leaf, words: 88, color: "bg-emerald-50 text-emerald-600" },
  { name: "Health", icon: Heart, words: 102, color: "bg-rose-50 text-rose-600" },
  { name: "Crime", icon: Shield, words: 74, color: "bg-amber-50 text-amber-600" },
  { name: "Work", icon: Briefcase, words: 91, color: "bg-cyan-50 text-cyan-600" },
];

const TopicsSection = () => (
  <section id="topics" className="section-padding">
    <div className="container-wide">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Popular IELTS Topics
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Explore vocabulary organized by the most common IELTS exam themes.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {topics.map((topic) => (
          <Link
            key={topic.name}
            to="/topics"
            className="card-interactive p-5 flex flex-col items-center text-center gap-3"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${topic.color}`}>
              <topic.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">{topic.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{topic.words} words</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default TopicsSection;
