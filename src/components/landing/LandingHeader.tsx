import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const LandingHeader = () => (
  <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b">
    <div className="container-wide flex items-center justify-between h-16">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight text-foreground">VocabIELTS</span>
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
        <a href="#topics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Topics</a>
        <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
      </nav>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard">Sign in</Link>
        </Button>
        <Button size="sm" asChild>
          <Link to="/dashboard">Get started</Link>
        </Button>
      </div>
    </div>
  </header>
);

export default LandingHeader;
